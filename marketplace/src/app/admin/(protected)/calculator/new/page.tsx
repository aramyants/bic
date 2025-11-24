import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { CalculatorConfigForm } from '@/components/admin/calculator-config-form';
import { createCalculatorConfig } from '@/server/calculator-service';

export default function NewCalculatorConfigPage() {
  async function handleCreate(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const mode = (formData.get('mode') as string) || 'standard';
    const isActive = formData.get('isActive') === 'on';
    const applyToVehicles = formData.get('applyToVehicles') !== 'off';
    const logisticsBaseCost = Number.parseInt(
      formData.get('logisticsBaseCost') as string
    );
    const logisticsCostPerKm = formData.get('logisticsCostPerKm') as string;
    const dutyPercent = formData.get('dutyPercent') as string;
    const exciseBaseCost = Number.parseInt(
      formData.get('exciseBaseCost') as string
    );
    const recyclingBaseCost = Number.parseInt(
      formData.get('recyclingBaseCost') as string
    );
    const vatPercent = formData.get('vatPercent') as string;
    const brokerBaseCost = Number.parseInt(
      formData.get('brokerBaseCost') as string
    );
    const commissionPercent = formData.get('commissionPercent') as string;
    const insurancePercent = formData.get('insurancePercent') as string;
    const serviceFeeIndividualPercent = formData.get(
      'serviceFeeIndividualPercent'
    ) as string;
    const serviceFeeCompanyPercent = formData.get(
      'serviceFeeCompanyPercent'
    ) as string;
    const documentPackageCost = Number.parseInt(
      formData.get('documentPackageCost') as string
    );

    await createCalculatorConfig({
      name,
      description: description || null,
      mode,
      isActive,
      applyToVehicles,
      logisticsBaseCost,
      logisticsCostPerKm,
      dutyPercent,
      exciseBaseCost,
      recyclingBaseCost,
      vatPercent,
      brokerBaseCost,
      commissionPercent,
      insurancePercent,
      serviceFeeIndividualPercent,
      serviceFeeCompanyPercent,
      documentPackageCost,
    });

    redirect('/admin/calculator');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/calculator"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">
            Новая конфигурация калькулятора
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Настройте формулы, чтобы расчёты на сайте совпадали с вашими
            условиями. Активная конфигурация применяется к калькуляторам и
            карточкам автомобилей.
          </p>
        </div>
      </div>

      <CalculatorConfigForm action={handleCreate} />
    </div>
  );
}
