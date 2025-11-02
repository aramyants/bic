import { addHours, isBefore } from "date-fns";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { exchangeRates } from "@/db/schema";

const TTL_HOURS = 6;

export async function getEurRubRate() {
  const existing = await db
    .select()
    .from(exchangeRates)
    .where(and(eq(exchangeRates.baseCurrency, "EUR"), eq(exchangeRates.targetCurrency, "RUB")))
    .orderBy(desc(exchangeRates.fetchedAt))
    .limit(1);

  const current = existing[0];
  const isFresh =
    current &&
    current.fetchedAt &&
    isBefore(new Date(), addHours(new Date(current.fetchedAt), TTL_HOURS));

  if (current && isFresh) {
    return current.rate;
  }

  const url = process.env.CBR_API_URL ?? "https://www.cbr-xml-daily.ru/daily_json.js";
  const response = await fetch(url, { next: { revalidate: TTL_HOURS * 3600 } });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить курс ЦБ РФ: ${response.status}`);
  }

  const data = (await response.json()) as {
    Valute: { EUR?: { Value: number } };
  };

  const rate = data.Valute?.EUR?.Value;
  if (!rate) {
    throw new Error("Ответ ЦБ РФ не содержит курса EUR");
  }

  const nowIso = new Date().toISOString();

  await db
    .insert(exchangeRates)
    .values({
      baseCurrency: "EUR",
      targetCurrency: "RUB",
      rate,
      fetchedAt: nowIso,
    })
    .onConflictDoUpdate({
      target: [exchangeRates.baseCurrency, exchangeRates.targetCurrency],
      set: { rate, fetchedAt: nowIso },
    });

  return rate;
}
