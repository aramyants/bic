"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

const defaultValues = {
  baseEur: 45000,
  logistics: 180000,
  dutyPercent: 12,
  excise: 0,
  recycling: 34000,
  vatPercent: 20,
  broker: 45000,
  commissionPercent: 5,
};

export interface LandedCostCalculatorProps {
  baseRate: number;
}

export const LandedCostCalculator: React.FC<LandedCostCalculatorProps> = ({ baseRate }) => {
  const [form, setForm] = React.useState({
    ...defaultValues,
    rate: baseRate,
  });

  const handleNumberChange = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(",", ".");
    const next = Number.parseFloat(value);
    setForm((prev) => ({
      ...prev,
      [key]: Number.isFinite(next) ? next : 0,
    }));
  };

  const result = React.useMemo(() => {
    const baseRub = form.baseEur * form.rate;
    const duty = (baseRub * form.dutyPercent) / 100;
    const vatBase = baseRub + duty + form.excise + form.recycling + form.logistics;
    const vat = (vatBase * form.vatPercent) / 100;
    const commission = (baseRub * form.commissionPercent) / 100;
    const total =
      baseRub +
      form.logistics +
      duty +
      form.excise +
      form.recycling +
      vat +
      form.broker +
      commission;

    return {
      baseRub,
      duty,
      vat,
      commission,
      total,
    };
  }, [form]);

  return (
    <div className="grid gap-6 rounded-[36px] border border-white/12 bg-black/45 p-6 text-white lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <NumericField
          id="baseEur"
          label="Стоимость автомобиля, €"
          value={form.baseEur}
          required
          step="100"
          onChange={handleNumberChange("baseEur")}
        />
        <NumericField
          id="rate"
          label="Курс ЦБ, ₽ за €"
          value={form.rate}
          required
          step="0.1"
          onChange={handleNumberChange("rate")}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <NumericField
            id="logistics"
            label="Логистика, ₽"
            value={form.logistics}
            onChange={handleNumberChange("logistics")}
          />
          <NumericField
            id="dutyPercent"
            label="Пошлина, %"
            value={form.dutyPercent}
            step="0.1"
            onChange={handleNumberChange("dutyPercent")}
          />
          <NumericField
            id="excise"
            label="Акциз, ₽"
            value={form.excise}
            onChange={handleNumberChange("excise")}
          />
          <NumericField
            id="recycling"
            label="Утильсбор, ₽"
            value={form.recycling}
            onChange={handleNumberChange("recycling")}
          />
          <NumericField
            id="vatPercent"
            label="НДС, %"
            value={form.vatPercent}
            step="0.1"
            onChange={handleNumberChange("vatPercent")}
          />
          <NumericField
            id="broker"
            label="Брокер, ₽"
            value={form.broker}
            onChange={handleNumberChange("broker")}
          />
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
        <h3 className="text-lg font-semibold text-white">Разбивка расходов</h3>
        <div className="space-y-3 text-sm text-white/75">
          <ResultRow label="База в рублях" value={result.baseRub} />
          <ResultRow label="Логистика" value={form.logistics} />
          <ResultRow label="Таможенная пошлина" value={result.duty} />
          <ResultRow label="Акциз" value={form.excise} />
          <ResultRow label="Утильсбор" value={form.recycling} />
          <ResultRow label="НДС" value={result.vat} />
          <ResultRow label="Брокер" value={form.broker} />
          <ResultRow label="Комиссия B.I.C." value={result.commission} />
        </div>
        <div className="rounded-3xl border border-brand-primary/35 bg-brand-primary/15 px-4 py-4 text-white">
          <div className="text-xs text-white/70">Итого к оплате</div>
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

const NumericField: React.FC<NumericFieldProps> = ({ id, label, value, required, step = "1", onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={id} required={required}>
      {label}
    </Label>
    <Input id={id} name={id} type="number" step={step} defaultValue={value} onChange={onChange} />
  </div>
);

const ResultRow: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-2">
    <span>{label}</span>
    <span className="font-semibold text-white">{formatCurrency(value, "RUB")}</span>
  </div>
);
