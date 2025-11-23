import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatCurrency = (amount: number, currency: "EUR" | "RUB" = "EUR") =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

export const formatLocaleNumber = (value: number, fractionDigits = 0) =>
  new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: fractionDigits,
  }).format(value);

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0400-\u04ff]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function groupBy<T, K extends string | number>(items: T[], getKey: (item: T) => K) {
  return items.reduce<Record<K, T[]>>((acc, item) => {
    const key = getKey(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}
