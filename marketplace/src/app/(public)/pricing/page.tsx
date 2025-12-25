import type { Metadata } from "next";
import { CircleDollarSign, ClipboardList, Gauge, Percent, ShieldCheck, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatLocaleNumber } from "@/lib/utils";
import {
  calculateLandedCost,
  toCalculatorSettings,
  type CalculatorSettings,
  DEFAULT_CALCULATOR_SETTINGS,
} from "@/lib/calculator";
import { getActiveCalculatorConfig } from "@/server/calculator-service";
import { getEurRubRate } from "@/server/exchange-service";

export const metadata: Metadata = {
  title: "Комиссия и цены | B.I.C.",
  description:
    "Актуальные ставки B.I.C.: комиссия, логистика, пошлины и пример полного расчёта «под ключ».",
};

type PricingData = {
  settings: CalculatorSettings;
  eurRubRate: number;
};

async function getPricingData(): Promise<PricingData> {
  const [eurRubRateRaw, config] = await Promise.all([
    getEurRubRate().catch(() => null),
    getActiveCalculatorConfig().catch(() => null),
  ]);

  const eurRubRate = eurRubRateRaw ?? 100;
  const settings = toCalculatorSettings(config ?? undefined);

  return { settings, eurRubRate };
}

const SAMPLE_BASE_EUR = 40_000;
const SAMPLE_DISTANCE_KM = 2200;

export default async function PricingPage() {
  const { settings, eurRubRate } = await getPricingData();

  const logistics =
    settings.logisticsBaseCost +
    settings.logisticsCostPerKm * SAMPLE_DISTANCE_KM;

  const sample = calculateLandedCost({
    baseEur: SAMPLE_BASE_EUR,
    rate: eurRubRate,
    logistics,
    dutyPercent: settings.dutyPercent,
    excise: settings.exciseBaseCost,
    recycling: settings.recyclingBaseCost,
    vatPercent: settings.vatPercent,
    broker: settings.brokerBaseCost,
    commissionPercent: settings.commissionPercent,
  });

  const totals = [
    { label: "База в ₽", value: formatLocaleNumber(Math.round(sample.baseRub)), tone: "outline" as const },
    { label: "Доставка", value: formatLocaleNumber(Math.round(logistics)) + " ₽" },
    { label: "Пошлина", value: formatLocaleNumber(Math.round(sample.duty)) + " ₽" },
    { label: "НДС", value: formatLocaleNumber(Math.round(sample.vat)) + " ₽" },
    { label: "Комиссия B.I.C.", value: formatLocaleNumber(Math.round(sample.commission)) + " ₽" },
    {
      label: "Итого «под ключ»",
      value: formatLocaleNumber(Math.round(sample.total + settings.documentPackageCost)),
      accent: true,
    },
  ];

  const rateCards = [
    {
      title: "Комиссия B.I.C.",
      value: `${settings.commissionPercent.toFixed(1).replace(".0", "")}%`,
      description: "Подбор, проверка, выкуп и сопровождение сделки.",
      icon: Percent,
    },
    {
      title: "Документ-пакет",
      value: `${formatLocaleNumber(settings.documentPackageCost)} ₽`,
      description: "Контракт, ЭПТС, сертификация, юридическое сопровождение.",
      icon: ClipboardList,
    },
    {
      title: "Брокер + страховка",
      value: `${formatLocaleNumber(settings.brokerBaseCost)} ₽`,
      description: "Таможенный брокер и страхование груза по ставке калькулятора.",
      icon: ShieldCheck,
    },
    {
      title: "Логистика",
      value:
        settings.logisticsCostPerKm > 0
          ? `${formatLocaleNumber(settings.logisticsBaseCost)} ₽ + ${settings.logisticsCostPerKm} ₽/км`
          : `${formatLocaleNumber(settings.logisticsBaseCost)} ₽`,
      description: "Автовоз / контейнер / ж/д. Стоимость из активной конфигурации.",
      icon: Gauge,
    },
    {
      title: "Пошлина и НДС",
      value: `${settings.dutyPercent}% · ${settings.vatPercent}%`,
      description: "По ставкам ЕАЭС. Расчёт совпадает с калькулятором в админке.",
      icon: CircleDollarSign,
    },
    {
      title: "Рисайкл и акциз",
      value: `${formatLocaleNumber(settings.recyclingBaseCost)} ₽ · ${formatLocaleNumber(settings.exciseBaseCost)} ₽`,
      description: "Утилизационный сбор и акциз (если применимо) из активных настроек.",
      icon: Wallet,
    },
  ];

  const inclusions = [
    "Аналитика рынка, 5–7 релевантных вариантов и расчёт TCO.",
    "VIN-проверка по 12 базам, CarVertical/AutoDNA, видеоотчёт и инспекция.",
    "Организация выкупа, логистики, страхования и таможенного оформления.",
    "Сертификация, ЭПТС, постановка на учёт, документ-пакет.",
    "Личный чат со статусами, менеджер 24/7, фиксированный курс и сроки в договоре.",
  ];

  const paymentSteps = [
    {
      title: "Бриф и аналитика",
      description: "NDA, договор, согласование бюджета. Оплата документ-пакета и комиссия B.I.C. по ставке из калькулятора.",
    },
    {
      title: "Выкуп и логистика",
      description: "Escrow/аккредитив, оплата автомобиля и бронирование доставки. Страховка и брокер — по действующим ставкам.",
    },
    {
      title: "Таможня и выдача",
      description: "Пошлина, НДС, утилизационный сбор и акциз по формуле калькулятора. Сертификация, учёт и передача ключей.",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-14 px-6 py-16 text-white lg:space-y-16 lg:py-20">


      <section className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <Badge tone="outline">Актуальные ставки</Badge>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Прозрачные условия
            <br />
            без скрытых платежей</h2>
          </div>
          <p className="max-w-xl text-sm text-white/70">
            Комиссия, логистика, брокер, пошлины и НДС — действующие ставки, которыми мы фиксируем договор. Цифры обновляются, когда меняется рынок и курс.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rateCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-[28px] border border-white/12 bg-white/6 p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-brand-primary/60"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-white/8 opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="relative flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-black/50 text-brand-primary ring-1 ring-white/10">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-lg font-semibold text-white">{card.title}</div>
                    <div className="text-sm text-white/70">{card.value}</div>
                  </div>
                </div>
                <p className="relative mt-3 text-sm text-white/70">{card.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="space-y-4 rounded-[36px] border border-white/12 bg-white/6 p-6 shadow-soft backdrop-blur">
          <Badge tone="outline">Пример расчёта</Badge>
          <div className="flex flex-wrap gap-3 text-xs text-white/70">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-2">
              Авто: {SAMPLE_BASE_EUR.toLocaleString("ru-RU")} €
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-2">
              Дистанция: ~{SAMPLE_DISTANCE_KM.toLocaleString("ru-RU")} км
            </span>
          </div>
          <div className="space-y-3">
            {totals.map((item) => (
              <div
                key={item.label}
                className={`flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm ${
                  item.accent ? "ring-1 ring-brand-primary/40" : ""
                }`}
              >
                <span className="text-white/75">{item.label}</span>
                <span className="text-base font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/60">
            Расчёт: базовая цена × курс ЦБ + логистика + пошлина + НДС + акциз + утилизационный сбор + брокер +
            комиссия B.I.C. + документ-пакет. Формула совпадает с онлайн-калькулятором.
          </p>
        </div>

        <div className="space-y-4 rounded-[36px] border border-white/12 bg-gradient-to-br from-brand-primary/10 via-white/8 to-black/60 p-6 shadow-soft backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Badge tone="outline">Этапы оплаты</Badge>
              <h3 className="mt-2 text-2xl font-semibold text-white">Как делим платежи</h3>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.1em] text-white/60">
              Прозрачный график
            </span>
          </div>
          <div className="space-y-3">
            {paymentSteps.map((step, index) => (
              <div key={step.title} className="flex gap-3 rounded-[24px] border border-white/10 bg-black/40 px-4 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold text-white">
                  0{index + 1}
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-white">{step.title}</div>
                  <p className="text-sm text-white/70">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[36px] border border-white/12 bg-white/5 px-8 py-10 shadow-soft backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge tone="outline">Что входит</Badge>
            <h3 className="mt-2 text-2xl font-semibold text-white md:text-3xl">Комиссия покрывает весь цикл</h3>
            <p className="text-sm text-white/70">
              Комиссия и документ-пакет закрывают подбор, проверку, юрсопровождение, логистику и выдачу. Никаких скрытых
              платежей вне калькулятора.
            </p>
          </div>
          <a
            href="/calculator"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:border-white/45"
          >
            Запустить калькулятор
          </a>
        </div>
        <ul className="mt-5 grid gap-3 text-sm text-white/75 md:grid-cols-2">
          {inclusions.map((item) => (
            <li key={item} className="flex gap-2 rounded-2xl border border-white/8 bg-black/35 px-4 py-3">
              <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
