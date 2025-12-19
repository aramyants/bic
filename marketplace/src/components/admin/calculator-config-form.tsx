'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CalculatorConfig } from '@/db/schema';

export type CalculatorConfigActionState = {
  status: 'idle' | 'error';
  message?: string;
};

type CalculatorConfigFormAction = (
  state: CalculatorConfigActionState,
  formData: FormData
) => Promise<CalculatorConfigActionState>;

interface CalculatorConfigFormProps {
  action: CalculatorConfigFormAction;
  initialData?: CalculatorConfig;
}

const DEFAULT_STATE: CalculatorConfigActionState = { status: 'idle' };

export function CalculatorConfigForm({
  action,
  initialData,
}: CalculatorConfigFormProps) {
  const [state, formAction] = React.useActionState(action, DEFAULT_STATE);
  const showError = state.status === 'error';

  return (
    <form action={formAction} className="space-y-6">
      {showError ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {state.message ?? 'Unable to save calculator configuration.'}
        </div>
      ) : null}
      <input
        type="hidden"
        name="mode"
        value={initialData?.mode ?? 'standard'}
      />

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Основные настройки
        </h3>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Название конфигурации *</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={initialData?.name}
              placeholder="Например, “Базовая ставка”"
            />
          </div>

          <div className="flex flex-col gap-3 text-sm text-white/80">
            <label className="inline-flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                defaultChecked={initialData?.isActive ?? false}
                className="h-5 w-5 rounded border-white/20 bg-white/10 text-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
              <span>Сделать активной</span>
            </label>
            <label className="inline-flex items-center gap-3">
              <input
                type="checkbox"
                id="applyToVehicles"
                name="applyToVehicles"
                defaultChecked={initialData?.applyToVehicles ?? true}
                className="h-5 w-5 rounded border-white/20 bg-white/10 text-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
              <span>Применять к карточкам авто</span>
            </label>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <Label htmlFor="description">Описание</Label>
          <textarea
            id="description"
            name="description"
            defaultValue={initialData?.description ?? ''}
            rows={3}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            placeholder="Короткий комментарий к формуле"
          />
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h3 className="mb-4 text-lg font-semibold text-white">Логистика</h3>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="logisticsBaseCost">
              Базовая логистика (₽) *
            </Label>
            <Input
              id="logisticsBaseCost"
              name="logisticsBaseCost"
              type="number"
              required
              defaultValue={initialData?.logisticsBaseCost ?? 180000}
              placeholder="180000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logisticsCostPerKm">
              Логистика за км (₽)
            </Label>
            <Input
              id="logisticsCostPerKm"
              name="logisticsCostPerKm"
              type="number"
              step="0.01"
              defaultValue={initialData?.logisticsCostPerKm ?? '0'}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Пошлины и налоги
        </h3>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <NumberField
            id="dutyPercent"
            label="Пошлина (%) *"
            defaultValue={initialData?.dutyPercent ?? '12'}
            step="0.1"
          />
          <NumberField
            id="vatPercent"
            label="НДС (%) *"
            defaultValue={initialData?.vatPercent ?? '20'}
            step="0.1"
          />
          <NumberField
            id="exciseBaseCost"
            label="Акциз (₽) *"
            defaultValue={initialData?.exciseBaseCost ?? 0}
          />
          <NumberField
            id="recyclingBaseCost"
            label="Утильсбор (₽) *"
            defaultValue={initialData?.recyclingBaseCost ?? 34000}
          />
          <NumberField
            id="brokerBaseCost"
            label="Брокер (₽) *"
            defaultValue={initialData?.brokerBaseCost ?? 45000}
          />
          <NumberField
            id="commissionPercent"
            label="Комиссия B.I.C. (%) *"
            defaultValue={initialData?.commissionPercent ?? '5'}
            step="0.1"
          />
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Дополнительные сборы
        </h3>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <NumberField
            id="insurancePercent"
            label="Страхование / логистика (%)"
            defaultValue={initialData?.insurancePercent ?? '1.2'}
            step="0.1"
          />
          <NumberField
            id="serviceFeeIndividualPercent"
            label="Комиссия B.I.C. (физ.) (%)"
            defaultValue={initialData?.serviceFeeIndividualPercent ?? '0.9'}
            step="0.1"
          />
          <NumberField
            id="serviceFeeCompanyPercent"
            label="Комиссия B.I.C. (юр.) (%)"
            defaultValue={initialData?.serviceFeeCompanyPercent ?? '1.2'}
            step="0.1"
          />
          <NumberField
            id="documentPackageCost"
            label="Документы и пакет (₽)"
            defaultValue={initialData?.documentPackageCost ?? 45000}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" size="lg">
          {initialData ? 'Сохранить' : 'Создать'} конфигурацию
        </Button>
      </div>
    </form>
  );
}

function NumberField({
  id,
  label,
  step,
  defaultValue,
}: {
  id: string;
  label: string;
  step?: string;
  defaultValue?: number | string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type="number"
        step={step}
        required
        defaultValue={defaultValue}
      />
    </div>
  );
}
