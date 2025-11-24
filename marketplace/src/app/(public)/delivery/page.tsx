import type { Metadata } from "next";
import { Anchor, FileCheck2, Globe2, MapPin, Plane, ShieldCheck, Ship, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatLocaleNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Доставка и растаможка | B.I.C.",
  description:
    "Как мы перевозим, страхуем и оформляем автомобили: маршруты, таможня, сертификация и выдача в центре B.I.C.",
};

const deliveryHighlights = [
  {
    title: "Срок поставки",
    value: "6–12 недель",
    description: "Европа, Азия, США — выбираем маршрут под сроки и бюджет.",
    icon: Globe2,
  },
  {
    title: "Страхование",
    value: "100% груза",
    description: "Страхуем на всём плече: автовоз, контейнер, авиа.",
    icon: ShieldCheck,
  },
  {
    title: "Контроль",
    value: "Статусы 24/7",
    description: "Отчёт об инспекции, трекинг логистики, таможня и выдача.",
    icon: MapPin,
  },
];

const corridors = [
  {
    title: "Европа → Россия",
    icon: Truck,
    bullets: [
      "Автовоз, ж/д или контейнерная линия.",
      "Фиксируем стоимость доставки в договоре.",
      "Кросс-докинг в ЕС, фото/видео перед отправкой.",
    ],
  },
  {
    title: "Азия и США → Россия",
    icon: Ship,
    bullets: [
      "Судно до порта Кавказ / Санкт‑Петербург, дальше автовоз до техцентра.",
      "Контроль погрузки, страховка груза, проверка пломб.",
      "Подбираем оптимальный маршрут под срок и бюджет.",
    ],
  },
  {
    title: "VIP / срочная доставка",
    icon: Plane,
    bullets: [
      "Авиаперевозка и индивидуальное страхование по запросу.",
      "Персональный куратор и круглосуточный мониторинг.",
      "Выдача без очередей с готовыми документами.",
    ],
  },
];

const customs = [
  {
    title: "Таможенное оформление",
    bullets: [
      "Расчёт пошлин и акцизов по ставкам ЕАЭС с учётом объёма двигателя и возраста.",
      "Полный пакет: инвойс, договор, экспортные декларации, инспекционный отчёт.",
      `Оплата: пошлина + НДС + утилизационный сбор (от ${formatLocaleNumber(34_000)} ₽) + логистика.`,
    ],
    icon: Anchor,
  },
  {
    title: "Сертификация и учёт",
    bullets: [
      "Организация СБКТС, выдача ЭПТС, постановка на учёт и получение госномеров.",
      "Предпродажная подготовка: мойка, детейлинг, диагностика, дооснащение по запросу.",
      "Выдача в центре B.I.C. в Москве или «последняя миля» до двери клиента.",
    ],
    icon: FileCheck2,
  },
];

export default function DeliveryPage() {
  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-12 px-4 py-12 text-white sm:space-y-14 sm:px-6 lg:space-y-16 lg:py-20">
      <section className="relative overflow-hidden rounded-[44px] border border-white/12 bg-gradient-to-br from-black/85 via-brand-secondary/70 to-brand-primary/35 p-6 shadow-strong sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.09),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(236,12,12,0.18),transparent_45%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
          <div className="space-y-5 sm:space-y-6">
            <Badge tone="outline">Доставка и растаможка</Badge>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Логистика, таможня и выдача «под ключ»
            </h1>
            <p className="max-w-3xl text-sm text-white/75">
              Планируем маршрут, страхуем на всём плече, проходим таможню и передаём авто с готовыми документами. Все
              статусы доступны в личном чате.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {deliveryHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-[28px] border border-white/12 bg-white/6 px-5 py-4 backdrop-blur">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-white/60">
                      <Icon className="h-4 w-4 text-brand-primary" />
                      {item.title}
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-white">{item.value}</div>
                    <p className="mt-1 text-xs text-white/65">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative space-y-4 rounded-[36px] border border-white/12 bg-white/6 p-5 shadow-soft backdrop-blur sm:p-6">
            <div className="flex items-center justify-between gap-3 text-sm text-white/70">
              <span>Маршруты</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.1em] text-white/60">
                Контроль B.I.C.
              </span>
            </div>
            <div className="space-y-3">
              {corridors.map((lane, index) => {
                const Icon = lane.icon;
                return (
                  <div key={lane.title} className="flex gap-3 rounded-[26px] border border-white/10 bg-black/40 px-4 py-3 sm:py-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-brand-primary ring-1 ring-white/10">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.12em] text-white/60">0{index + 1}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-base font-semibold text-white">{lane.title}</div>
                      <ul className="space-y-1 text-sm text-white/70">
                        {lane.bullets.map((point) => (
                          <li key={point} className="flex gap-2">
                            <span className="mt-[6px] inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        {customs.map((block) => {
          const Icon = block.icon;
          return (
            <div
              key={block.title}
              className="group relative overflow-hidden rounded-[32px] border border-white/12 bg-white/6 p-5 shadow-soft backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-brand-primary/50 sm:p-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-white/8 opacity-0 transition duration-300 group-hover:opacity-100" />
              <div className="relative mb-3 flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-black/40 text-brand-primary ring-1 ring-white/10">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="text-lg font-semibold text-white">{block.title}</h2>
              </div>
              <ul className="relative space-y-2 text-sm text-white/75">
                {block.bullets.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-2 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section className="rounded-[38px] border border-brand-primary/35 bg-gradient-to-r from-brand-primary/80 via-brand-primary/55 to-brand-secondary px-6 py-8 shadow-strong sm:px-8 sm:py-10 lg:px-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h3 className="text-3xl font-semibold text-white md:text-4xl">Нужно подтвердить сроки и стоимость?</h3>
            <p className="max-w-2xl text-sm text-white/80">
              Запустите калькулятор или оставьте заявку — соберём маршрут, покажем стоимость доставки и растаможки по действующим ставкам.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/calculator"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:border-white/45"
            >
              Калькулятор
            </a>
            <a
              href="/contacts"
              className="inline-flex h-12 items-center justify-center rounded-[38px] bg-white px-6 text-xs font-semibold uppercase tracking-[0.14em] text-black shadow-soft transition hover:-translate-y-0.5"
            >
              Связаться с нами
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
