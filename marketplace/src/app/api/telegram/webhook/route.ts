import { NextResponse } from "next/server";

import {
  sendBotCatalogMessage,
  sendBotChannelMessage,
  sendBotLeadToManagers,
  sendBotThanks,
  sendBotWelcome,
} from "@/server/telegram";

type TelegramUser = {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
};

type TelegramChat = {
  id: number;
  type: string;
};

type TelegramContact = {
  phone_number?: string;
};

type TelegramMessage = {
  chat: TelegramChat;
  from?: TelegramUser;
  text?: string;
  caption?: string;
  contact?: TelegramContact;
};

type TelegramUpdate = {
  message?: TelegramMessage;
};

const extractFirstUrl = (text: string) => {
  const match = text.match(/https?:\/\/\S+/i);
  return match?.[0];
};

export async function POST(request: Request) {
  let update: TelegramUpdate;

  try {
    update = (await request.json()) as TelegramUpdate;
  } catch (error) {
    console.error("[telegram:webhook] failed to parse update", error);
    return NextResponse.json({ ok: true });
  }

  const message = update.message;
  if (!message || message.chat?.type !== "private") {
    return NextResponse.json({ ok: true });
  }

  const text = (message.text ?? message.caption ?? "").trim();
  const normalizedText = text.toLowerCase();

  if (normalizedText.startsWith("/start")) {
    await sendBotWelcome(message.chat.id);
    return NextResponse.json({ ok: true });
  }

  if (normalizedText.startsWith("/catalog") || normalizedText === "каталог") {
    await sendBotCatalogMessage(message.chat.id);
    return NextResponse.json({ ok: true });
  }

  if (normalizedText.startsWith("/channel") || normalizedText === "канал") {
    await sendBotChannelMessage(message.chat.id);
    return NextResponse.json({ ok: true });
  }

  const phone = message.contact?.phone_number ?? null;
  if (!text && !phone) {
    return NextResponse.json({ ok: true });
  }

  const pageUrl = text ? extractFirstUrl(text) ?? null : null;
  await sendBotLeadToManagers({
    userId: message.from?.id,
    username: message.from?.username ?? null,
    firstName: message.from?.first_name ?? null,
    lastName: message.from?.last_name ?? null,
    phone,
    message: text || null,
    pageUrl,
  });

  await sendBotThanks(message.chat.id);

  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ ok: true });
}
