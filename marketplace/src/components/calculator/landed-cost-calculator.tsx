"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateLandedCost, type CalculatorSettings } from "@/lib/calculator";
import { formatCurrency } from "@/lib/utils";

export interface LandedCostCalculatorProps {
  baseRate: number;
  settings: CalculatorSettings;
}

export const LandedCostCalculator: React.FC<LandedCostCalculatorProps> = ({
  baseRate,
  settings,
}) => {
  const [form, setForm] = React.useState({
    baseEur: 45_000,
    rate: baseRate,
    logistics: settings.logisticsBaseCost,
    dutyPercent: settings.dutyPercent,
    excise: settings.exciseBaseCost,
    recycling: settings.recyclingBaseCost,
    vatPercent: settings.vatPercent,
    broker: settings.brokerBaseCost,
    commissionPercent: settings.commissionPercent,
  });

  React.useEffect(() => {
    setForm((prev) => ({
      ...prev,
      rate: baseRate,
      logistics: settings.logisticsBaseCost,
      dutyPercent: settings.dutyPercent,
      excise: settings.exciseBaseCost,
      recycling: settings.recyclingBaseCost,
      vatPercent: settings.vatPercent,
      broker: settings.brokerBaseCost,
      commissionPercent: settings.commissionPercent,
    }));
  }, [
    baseRate,
    settings.brokerBaseCost,
    settings.commissionPercent,
    settings.dutyPercent,
    settings.exciseBaseCost,
    settings.logisticsBaseCost,
    settings.recyclingBaseCost,
    settings.vatPercent,
  ]);

  const handleNumberChange = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(",", ".");
    const next = Number.parseFloat(value);
    setForm((prev) => ({
      ...prev,
      [key]: Number.isFinite(next) ? next : 0,
    }));
  };

  const result = React.useMemo(
    () =>
      calculateLandedCost({
        baseEur: form.baseEur,
        rate: form.rate,
        logistics: form.logistics,
        dutyPercent: form.dutyPercent,
        excise: form.excise,
        recycling: form.recycling,
        vatPercent: form.vatPercent,
        broker: form.broker,
        commissionPercent: form.commissionPercent,
      }),
    [form],
  );

  return (
    <div className="grid gap-6 rounded-[36px] border border-white/12 bg-black/45 p-6 text-white lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <NumericField
          id="baseEur"
          label="Стоимость авто, € *"
          value={form.baseEur}
          required
          step="100"
          onChange={handleNumberChange("baseEur")}
        />
        <NumericField
          id="rate"
          label="Курс EUR/RUB *"
          value={form.rate}
          required
          step="0.1"
          onChange={handleNumberChange("rate")}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <NumericField id="logistics" label="Логистика, ₽" value={form.logistics} onChange={handleNumberChange("logistics")} />
          <NumericField
            id="dutyPercent"
            label="Пошлина, %"
            value={form.dutyPercent}
            step="0.1"
            onChange={handleNumberChange("dutyPercent")}
          />
          <NumericField id="excise" label="Акциз, ₽" value={form.excise} onChange={handleNumberChange("excise")} />
          <NumericField id="recycling" label="Утильсбор, ₽" value={form.recycling} onChange={handleNumberChange("recycling")} />
          <NumericField
            id="vatPercent"
            label="НДС, %"
            value={form.vatPercent}
            step="0.1"
            onChange={handleNumberChange("vatPercent")}
          />
          <NumericField id="broker" label="Брокер, ₽" value={form.broker} onChange={handleNumberChange("broker")} />
          <NumericField
            id="commissionPercent"
            label="Комиссия B.I.C., %"
            value={form.commissionPercent}
            step="0.1"
            onChange={handleNumberChange("commissionPercent")}
          />
        </div>
      </div>
      <div className="space-y-5 rounded-[28px] border border-white/12 bg-white/6 p-5">
        <h3 className="text-lg font-semibold text-white">Расчёт полной стоимости</h3>
        <div className="space-y-3 text-sm text-white/75">
          <ResultRow label="Цена в руб." value={result.baseRub} />
          <ResultRow label="Логистика" value={form.logistics} />
          <ResultRow label="Пошлина" value={result.duty} />
          <ResultRow label="Акциз" value={form.excise} />
          <ResultRow label="Утильсбор" value={form.recycling} />
          <ResultRow label="НДС" value={result.vat} />
          <ResultRow label="Брокер" value={form.broker} />
          <ResultRow label="Комиссия B.I.C." value={result.commission} />
        </div>
        <div className="rounded-3xl border border-brand-primary/35 bg-brand-primary/15 px-4 py-4 text-white">
          <div className="text-xs text-white/70">Итоговая стоимость</div>
          <div className="text-2xl font-semibold">{formatCurrency(result.total, "RUB")}</div>
        </div>
      </div>
    </div>
  );
};

interface NumericFieldProps {
  id: string;
  label: string;
  value: number;
  required?: boolean;
  step?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const calculatorInputClassName =
  "number-input rounded-full border-white/15 bg-black/45 px-5 font-semibold text-white/90 shadow-[0_14px_32px_rgba(0,0,0,0.45)] backdrop-blur focus:border-brand-primary focus:ring-brand-primary/25";

const NumericField: React.FC<NumericFieldProps> = ({ id, label, value, required, step = "1", onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={id} required={required} className="text-[11px] font-semibold tracking-[0.14em] text-white/65">
      {label}
    </Label>
    <Input
      id={id}
      name={id}
      type="number"
      step={step}
      inputMode="decimal"
      defaultValue={value}
      onChange={onChange}
      className={calculatorInputClassName}
    />
  </div>
);

const ResultRow: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-2">
    <span>{label}</span>
    <span className="font-semibold text-white">{formatCurrency(value, "RUB")}</span>
  </div>
);
