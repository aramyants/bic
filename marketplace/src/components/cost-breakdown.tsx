"use client";

import * as React from "react";

import { Switch } from "@/components/ui/switch";
import { formatCurrency } from "@/lib/utils";

export interface CostBreakdownData {
  baseRub: number;
  vat: number;
  customs: number;
  insurance: number;
  service: number;
  broker: number;
  documents: number;
  total: number;
}

interface CostCalculatorProps {
  individual: CostBreakdownData;
  company: CostBreakdownData;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({ individual, company }) => {
  const [isCompany, setIsCompany] = React.useState(false);

  const breakdown = isCompany ? company : individual;

  const rows = [
    { label: "Базовая стоимость в рублях", value: breakdown.baseRub },
    { label: "НДС / VAT", value: breakdown.vat },
    { label: "Таможенная пошлина", value: breakdown.customs },
    { label: "Страхование и логистика", value: breakdown.insurance },
    { label: "Комиссия B.I.C.", value: breakdown.service },
    { label: "Брокер и сопровождение", value: breakdown.broker },
    { label: "Документы и сертификация", value: breakdown.documents },
  ];

  return (
    <div className="space-y-6 rounded-[36px] border border-white/12 bg-white/8 p-5 sm:p-6 md:p-8">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-white">Финальный расчёт</h3>
          <p className="text-xs text-white/55">
            Ставки отличаются для физ. и юр. лиц. Выберите нужный вариант, чтобы увидеть актуальные цифры — суммы
            обновятся мгновенно.
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-3 whitespace-nowrap text-xs text-white/70">
          <span className={!isCompany ? "text-white" : undefined}>Физ. лицо</span>
          <Switch checked={isCompany} onClick={() => setIsCompany((prev) => !prev)} className="bg-white/20" />
          <span className={isCompany ? "text-white" : undefined}>Юр. лицо</span>
        </div>
      </div>
      <div className="grid gap-3 text-sm text-white/70">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-2 rounded-2xl border border-white/12 bg-black/35 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:px-5"
          >
            <span className="min-w-0">{row.label}</span>
            <span className="font-semibold text-white">{formatCurrency(row.value, "RUB")}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-[32px] border border-brand-primary/35 bg-brand-primary/15 px-4 py-4 text-white sm:px-5">
        <span className="text-xs text-white/75">Всего к оплате</span>
        <span className="text-2xl font-semibold">{formatCurrency(breakdown.total, "RUB")}</span>
      </div>
      <p className="text-xs text-white/55">
        Итоговая сумма может меняться с учётом курса EUR/RUB и выбранной логистики. Для фиксации расчёта отправьте
        заявку менеджеру — проверим автомобиль и подтвердим условия.
      </p>
    </div>
  );
};
