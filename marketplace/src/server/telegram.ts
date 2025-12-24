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
  includeEmail?: boolean;
};

type BotLeadPayload = {
  userId?: number;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  message?: string | null;
  pageUrl?: string | null;
};

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const MANAGER_CHAT_ID = process.env.TELEGRAM_MANAGER_CHAT_ID;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const DEFAULT_APP_URL = "https://bic-auto.ru";
const normalizeBaseUrl = (value?: string) => {
  const trimmed = value?.trim();
  if (!trimmed) return DEFAULT_APP_URL;
  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
};

const APP_URL = normalizeBaseUrl(process.env.PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL);
const CATALOG_URL = `${APP_URL}/catalog`;
const DEFAULT_LOGO_URL = `${APP_URL}/logo.png`;
const BOT_LOGO_URL = process.env.TELEGRAM_BOT_LOGO_URL || DEFAULT_LOGO_URL;

const TELEGRAM_USERNAME = /^@?[a-zA-Z0-9_]{5,32}$/;

const escapeMarkdown = (text: string) =>
  text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1").trim();

const buildTelegramUsernameLink = (value?: string | null) => {
  const trimmed = value?.trim();
  if (!trimmed || !TELEGRAM_USERNAME.test(trimmed)) return null;
  const username = trimmed.replace(/^@/, "");
  return `https://t.me/${username}`;
};

const buildPhoneLink = (value?: string | null) => {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  const sanitized = trimmed.replace(/[^\d+]/g, "");
  if (!sanitized) return null;
  return `tel:${sanitized}`;
};

const buildCatalogInlineKeyboard = () => ({
  inline_keyboard: [[{ text: "Открыть каталог", web_app: { url: CATALOG_URL } }]],
});

const buildCatalogReplyKeyboard = () => ({
  keyboard: [[{ text: "Каталог", web_app: { url: CATALOG_URL } }]],
  resize_keyboard: true,
});

const buildBotUserName = (payload: BotLeadPayload) => {
  const parts = [payload.firstName, payload.lastName].filter(Boolean);
  return parts.length ? parts.join(" ") : "Клиент";
};

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

async function sendTelegramPhoto(payload: Record<string, unknown>) {
  if (!BOT_TOKEN) {
    return;
  }
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function sendLeadToTelegram(lead: LeadPayload) {
  if (!BOT_TOKEN || !MANAGER_CHAT_ID) {
    return;
  }

  const includeEmail = lead.includeEmail ?? false;
  const pageLink =
    lead.pageUrl ?? (lead.vehicleSlug ? `${APP_URL}/catalog/${lead.vehicleSlug}` : null);

  const parts = ["*📝 Новая заявка с сайта B.I.C.*", `Имя: ${escapeMarkdown(lead.name)}`];

  if (includeEmail) parts.push(`Email: ${escapeMarkdown(lead.email)}`);
  if (lead.phone) parts.push(`Телефон: ${escapeMarkdown(lead.phone)}`);
  if (lead.telegram) parts.push(`Telegram: ${escapeMarkdown(lead.telegram)}`);
  if (lead.vehicleTitle) parts.push(`Авто: ${escapeMarkdown(lead.vehicleTitle)}`);
  if (lead.priceEur) parts.push(`Цена (EUR): ${escapeMarkdown(String(lead.priceEur))}`);
  if (lead.priceRub) parts.push(`Цена (RUB): ${escapeMarkdown(String(lead.priceRub))}`);
  if (lead.message) parts.push(`Сообщение: ${escapeMarkdown(lead.message)}`);
  if (pageLink) parts.push(`Ссылка: ${escapeMarkdown(pageLink)}`);
  if (lead.source) parts.push(`Источник: ${escapeMarkdown(lead.source)}`);

  const buttons: Array<Array<{ text: string; url: string }>> = [];
  const telegramLink = buildTelegramUsernameLink(lead.telegram);
  const phoneLink = buildPhoneLink(lead.phone);

  if (telegramLink) {
    buttons.push([{ text: "Написать в Telegram", url: telegramLink }]);
  }
  if (phoneLink) {
    buttons.push([{ text: "Позвонить", url: phoneLink }]);
  }
  if (pageLink) {
    buttons.push([{ text: "Открыть авто", url: pageLink }]);
  }

  await sendTelegramMessage({
    chat_id: MANAGER_CHAT_ID,
    text: parts.join("\n"),
    parse_mode: "Markdown",
    disable_web_page_preview: false,
    reply_markup: buttons.length ? { inline_keyboard: buttons } : undefined,
  });
}

export async function sendBotWelcome(chatId: number) {
  if (!BOT_TOKEN) {
    return;
  }

  const text = [
    "🚗 B.I.C. — Best Imported Cars",
    "Авто из 🇺🇸 США, 🇰🇷 Кореи и 🇪🇺 Европы под ключ.",
    "",
    "✅ Подбор под ваш бюджет",
    "✅ Проверка и прозрачный расчет",
    "✅ Доставка, таможня и сопровождение",
    "",
    "Откройте каталог и оставьте заявку — менеджер свяжется с вами.",
  ].join("\n");

  const logoUrl = BOT_LOGO_URL?.trim();
  if (logoUrl) {
    await sendTelegramPhoto({
      chat_id: chatId,
      photo: logoUrl,
      caption: text,
      parse_mode: "Markdown",
      reply_markup: buildCatalogInlineKeyboard(),
    });
  } else {
    await sendTelegramMessage({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: buildCatalogInlineKeyboard(),
    });
  }

  await sendTelegramMessage({
    chat_id: chatId,
    text: '👉 Нажмите "Каталог", чтобы открыть мини-приложение.',
    reply_markup: buildCatalogReplyKeyboard(),
  });
}

export async function sendBotCatalogMessage(chatId: number) {
  if (!BOT_TOKEN) {
    return;
  }

  await sendTelegramMessage({
    chat_id: chatId,
    text: "🚗 Откройте каталог B.I.C. в мини-приложении.",
    reply_markup: buildCatalogInlineKeyboard(),
  });
}

export async function sendBotThanks(chatId: number) {
  if (!BOT_TOKEN) {
    return;
  }

  await sendTelegramMessage({
    chat_id: chatId,
    text: "✅ Спасибо! Мы передали вашу заявку менеджерам. Скоро свяжемся.",
    reply_markup: buildCatalogReplyKeyboard(),
  });
}

export async function sendBotLeadToManagers(payload: BotLeadPayload) {
  if (!BOT_TOKEN || !MANAGER_CHAT_ID) {
    return;
  }

  const name = buildBotUserName(payload);
  const username = payload.username ? `@${payload.username.replace(/^@/, "")}` : null;

  const parts = ["*💬 Новый запрос из Telegram-бота*", `Клиент: ${escapeMarkdown(name)}`];

  if (username) parts.push(`Username: ${escapeMarkdown(username)}`);
  if (payload.userId) parts.push(`ID: ${escapeMarkdown(String(payload.userId))}`);
  if (payload.phone) parts.push(`Телефон: ${escapeMarkdown(payload.phone)}`);
  if (payload.message) parts.push(`Сообщение: ${escapeMarkdown(payload.message)}`);
  if (payload.pageUrl) parts.push(`Ссылка: ${escapeMarkdown(payload.pageUrl)}`);
  parts.push("Источник: Telegram бот");

  const buttons: Array<Array<{ text: string; url: string }>> = [];
  const telegramLink = username
    ? buildTelegramUsernameLink(username)
    : payload.userId
      ? `tg://user?id=${payload.userId}`
      : null;
  const phoneLink = buildPhoneLink(payload.phone);

  if (telegramLink) {
    buttons.push([{ text: "Написать в Telegram", url: telegramLink }]);
  }
  if (phoneLink) {
    buttons.push([{ text: "Позвонить", url: phoneLink }]);
  }
  if (payload.pageUrl) {
    buttons.push([{ text: "Открыть авто", url: payload.pageUrl }]);
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
          "Ты пишешь короткие продающие тексты для карточек автомобилей. Используй дружелюбный тон, 4-5 предложений, без эмодзи. Делай акцент на выгоде и статусе, избегай клише.",
      },
      {
        role: "user",
        content: `Марка: ${vehicle.brand}\nМодель: ${vehicle.model}\nГод: ${vehicle.year}\nСтрана: ${vehicle.country}\nЦена EUR: ${vehicle.basePriceEur}\nЦена RUB: ${vehicle.basePriceRub ?? ""}\nОписание: ${vehicle.shortDescription ?? ""}`,
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

  const pageLink = `${APP_URL}/catalog/${vehicle.slug}`;
  const fallbackText = [
    `Новинка: ${vehicle.title}`,
    `Цена: ${formatCurrency(vehicle.basePriceEur, "EUR")}`,
    vehicle.basePriceRub ? `В рублях: ${formatCurrency(vehicle.basePriceRub, "RUB")}` : null,
    vehicle.country ? `Страна: ${vehicle.country}` : null,
    "",
    `Подробнее: ${pageLink}`,
  ]
    .filter(Boolean)
    .join("\n");

  const marketingText = (await generateVehicleCopy(vehicle)) ?? fallbackText;

  const imageUrl = vehicle.primaryImage?.url ?? vehicle.gallery?.[0]?.url;
  const buttons = [[{ text: "Открыть объявление", url: pageLink }]];

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
