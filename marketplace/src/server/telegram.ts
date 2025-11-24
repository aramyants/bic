import { formatCurrency } from "@/lib/utils";
import type { VehicleWithRelations } from "@/server/vehicle-service";

type LeadPayload = {
  name: string;
  email: string;
  phone?: string;
  telegram?: string | null;
  message?: string | null;
  pageUrl?: string | null;
  vehicleTitle?: string | null;
  vehicleSlug?: string | null;
  vehicleId?: string | null;
  priceEur?: string | number | null;
  priceRub?: string | number | null;
  source?: string | null;
};

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const MANAGER_CHAT_ID = process.env.TELEGRAM_MANAGER_CHAT_ID;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
const APP_URL = process.env.PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const escapeMarkdown = (text: string) =>
  text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1").trim();

async function sendTelegramMessage(payload: Record<string, unknown>) {
  if (!BOT_TOKEN) {
    return;
  }
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function sendLeadToTelegram(lead: LeadPayload) {
  if (!BOT_TOKEN || !MANAGER_CHAT_ID) {
    return;
  }

  const parts = [
    "*Новая заявка на сайте B.I.C.*",
    `Имя: ${escapeMarkdown(lead.name)}`,
    `Email: ${escapeMarkdown(lead.email)}`,
  ];

  if (lead.phone) parts.push(`Телефон: ${escapeMarkdown(lead.phone)}`);
  if (lead.telegram) parts.push(`Telegram: ${escapeMarkdown(lead.telegram)}`);
  if (lead.vehicleTitle) parts.push(`Авто: ${escapeMarkdown(lead.vehicleTitle)}`);
  if (lead.priceEur) parts.push(`Цена (EUR): ${escapeMarkdown(String(lead.priceEur))}`);
  if (lead.priceRub) parts.push(`Цена (RUB): ${escapeMarkdown(String(lead.priceRub))}`);
  if (lead.message) parts.push(`Комментарий: ${escapeMarkdown(lead.message)}`);
  if (lead.pageUrl) parts.push(`[Страница](${escapeMarkdown(lead.pageUrl)})`);
  if (lead.source) parts.push(`Источник: ${escapeMarkdown(lead.source)}`);

  const buttons: Array<Array<{ text: string; url: string }>> = [];
  if (lead.pageUrl) {
    buttons.push([{ text: "Открыть страницу", url: lead.pageUrl }]);
  } else if (lead.vehicleSlug) {
    const link = `${APP_URL.replace(/\/$/, "")}/catalog/${lead.vehicleSlug}`;
    buttons.push([{ text: "Открыть страницу", url: link }]);
  }

  await sendTelegramMessage({
    chat_id: MANAGER_CHAT_ID,
    text: parts.join("\n"),
    parse_mode: "Markdown",
    disable_web_page_preview: false,
    reply_markup: buttons.length ? { inline_keyboard: buttons } : undefined,
  });
}

async function generateVehicleCopy(vehicle: VehicleWithRelations) {
  if (!OPENAI_API_KEY) {
    return null;
  }

  const payload = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Ты пишешь короткие продающие описания автомобилей для российского рынка. Тон — уверенный, лаконичный, без воды. До 4 предложений. Обязательно добавь призыв написать менеджеру.",
      },
      {
        role: "user",
        content: `Марка: ${vehicle.brand}\nМодель: ${vehicle.model}\nГод: ${vehicle.year}\nСтрана: ${vehicle.country}\nЦена EUR: ${vehicle.basePriceEur}\nЦена RUB: ${vehicle.basePriceRub ?? ""}\nКраткое описание: ${vehicle.shortDescription ?? ""}`,
      },
    ],
    temperature: 0.7,
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    const text: string | undefined = data?.choices?.[0]?.message?.content;
    return text?.trim() || null;
  } catch (error) {
    console.error("[telegram] failed to generate copy", error);
    return null;
  }
}

export async function postVehicleToChannel(vehicle: VehicleWithRelations) {
  if (!BOT_TOKEN || !CHANNEL_ID) return;

  const pageLink = `${APP_URL.replace(/\/$/, "")}/catalog/${vehicle.slug}`;
  const fallbackText = [
    `🔥 ${vehicle.title}`,
    `Цена: ${formatCurrency(vehicle.basePriceEur, "EUR")}`,
    vehicle.basePriceRub ? `≈ ${formatCurrency(vehicle.basePriceRub, "RUB")}` : null,
    vehicle.country ? `Страна: ${vehicle.country}` : null,
    "",
    `Подробнее: ${pageLink}`,
  ]
    .filter(Boolean)
    .join("\n");

  const marketingText = (await generateVehicleCopy(vehicle)) ?? fallbackText;

  const imageUrl = vehicle.primaryImage?.url ?? vehicle.gallery?.[0]?.url;
  const buttons = [[{ text: "Открыть в каталоге", url: pageLink }]];

  if (imageUrl) {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      body: new URLSearchParams({
        chat_id: CHANNEL_ID,
        photo: imageUrl,
        caption: marketingText,
        parse_mode: "Markdown",
        reply_markup: JSON.stringify({ inline_keyboard: buttons }),
      }),
    });
    return;
  }

  await sendTelegramMessage({
    chat_id: CHANNEL_ID,
    text: marketingText,
    parse_mode: "Markdown",
    disable_web_page_preview: false,
    reply_markup: { inline_keyboard: buttons },
  });
}
