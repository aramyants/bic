import { addHours, isBefore } from "date-fns";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { exchangeRates } from "@/db/schema";

const TTL_HOURS = 4;

export async function getEurRubRate(): Promise<number> {
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
    return Number(current.rate);
  }

  const url = process.env.CBR_API_URL ?? "https://www.cbr-xml-daily.ru/daily_json.js";
  const response = await fetch(url, { next: { revalidate: TTL_HOURS * 3600 } });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить курс ЦБ РФ: ${response.status}`);
  }

  const data = (await response.json()) as {
    Valute: { EUR?: { Value: number } };
  };

  const rate = Number(data.Valute?.EUR?.Value);
  if (!Number.isFinite(rate)) {
    throw new Error("Ответ ЦБ РФ не содержит курса EUR");
  }

  const fetchedAt = new Date();
  const rateValue = rate.toString();

  await db
    .insert(exchangeRates)
    .values({
      baseCurrency: "EUR",
      targetCurrency: "RUB",
      rate: rateValue,
      fetchedAt,
    })
    .onConflictDoUpdate({
      target: [exchangeRates.baseCurrency, exchangeRates.targetCurrency],
      set: { rate: rateValue, fetchedAt },
    });

  return rate;
}
