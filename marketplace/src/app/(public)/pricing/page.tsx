import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { formatLocaleNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Комиссия и цены | B.I.C.",
  description: "Тарифы на подбор, выкуп, логистику и сопровождение сделок в B.I.C. Best Imported Cars.",
};

const costItems = [
  {
    label: "Комиссия B.I.C.",
    value: "5–7%",
    description: "Включает подбор, проверку, выкуп, сопровождение сделки и персонального менеджера.",
  },
  {
    label: "Средний бюджет сделки",
    value: `${formatLocaleNumber(4_500_000)} ₽`,
    description: "Содержит стоимость автомобиля, логистику, пошлины, акциз, НДС и наши услуги под ключ.",
  },
  {
    label: "Утилизационный сбор",
    value: "от 34 000 ₽",
    description: "Зависит от типа техники и объёма двигателя. Рассчитывается автоматически в калькуляторе.",
  },
  {
    label: "НДС",
    value: "20%",
    description: "Применяется к сумме сделки для юридических лиц. Для физ. лиц НДС включён в финальный расчёт.",
  },
];

const inclusions = [
  "Аналитика рынка и подбор 5–7 вариантов под бюджет.",
  "VIN-проверка, CarVertical/AutoDNA, инспекция, отчёты о техсостоянии.",
  "Организация выкупа, логистики, страхования и таможенного оформления.",
  "Предпродажная подготовка, сертификация, выдача ЭПТС и постановка на учёт.",
];

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-[900px] space-y-10 px-6 py-16 text-white">
      <div className="space-y-3">
        <Badge tone="outline">Комиссия и цены</Badge>
        <h1 className="text-4xl font-semibold">Сколько стоит услуга B.I.C.</h1>
        <p className="text-sm text-white/70">
          Мы фиксируем стоимость на каждом этапе и заранее согласуем все платежи. Оплата разбивается на три части —
          подбор, выкуп и финальные расходы при выдаче автомобиля.
        </p>
      </div>
      <div className="rounded-[32px] border border-white/10 bg-white/6 p-7">
        <h2 className="mb-4 text-xl font-semibold text-white">Базовые тарифы</h2>
        <div className="space-y-4 text-sm text-white/75">
          {costItems.map((item) => (
            <div key={item.label} className="flex flex-col gap-1 rounded-[28px] border border-white/10 bg-black/30 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">{item.label}</span>
                <span>{item.value}</span>
              </div>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[32px] border border-white/10 bg-white/6 p-7">
        <h2 className="mb-4 text-xl font-semibold text-white">Что входит в комиссию B.I.C.</h2>
        <ul className="space-y-2 text-sm text-white/75">
          {inclusions.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-[32px] border border-brand-primary/40 bg-brand-primary/10 px-6 py-5 text-sm text-white/80">
        Нужен точный расчёт для конкретного автомобиля? Заполните <a href="/calculator" className="text-white hover:underline">калькулятор</a> или
        свяжитесь с менеджером — мы подготовим смету и график платежей.
      </div>
    </div>
  );
}
