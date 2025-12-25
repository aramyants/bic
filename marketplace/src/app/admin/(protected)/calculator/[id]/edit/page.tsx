import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import {
  CalculatorConfigForm,
  type CalculatorConfigActionState,
} from '@/components/admin/calculator-config-form';
import { Button } from '@/components/ui/button';
import {
  deleteCalculatorConfig,
  getCalculatorConfigById,
  setActiveCalculatorConfig,
  updateCalculatorConfig,
} from '@/server/calculator-service';

const DEFAULT_ERROR_MESSAGE = 'Unable to save calculator configuration.';

function getCalculatorErrorMessage(error: unknown) {
  const code = (error as { code?: string })?.code;
  if (code === '42P01' || code === '42703') {
    return 'Database schema is missing calculator tables or columns. Run npm run db:migrate.';
  }
  return DEFAULT_ERROR_MESSAGE;
}

export default async function EditCalculatorConfigPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const config = await getCalculatorConfigById(id);

  if (!config) {
    notFound();
  }

  async function handleUpdate(
    _prevState: CalculatorConfigActionState,
    formData: FormData
  ): Promise<CalculatorConfigActionState> {
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

    try {
      await updateCalculatorConfig(id, {
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
    } catch (error) {
      console.error('[calculator] update failed', error);
      return { status: 'error', message: getCalculatorErrorMessage(error) };
    }

    redirect('/admin/calculator');
  }

  async function handleDelete() {
    'use server';

    try {
      await deleteCalculatorConfig(id);
    } catch (error) {
      console.error('[calculator] delete failed', error);
      return;
    }
    redirect('/admin/calculator');
  }

  async function handleSetActive() {
    'use server';

    try {
      await setActiveCalculatorConfig(id);
    } catch (error) {
      console.error('[calculator] set-active failed', error);
      return;
    }
    redirect('/admin/calculator');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/calculator"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Редактирование конфигурации
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Измените ставки и нажмите «Сделать активной», чтобы применить
              формулу на сайте.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {!config.isActive && (
            <form action={handleSetActive}>
              <Button type="submit" size="sm">
                Сделать активной
              </Button>
            </form>
          )}
          <form action={handleDelete}>
            <button
              type="submit"
              className="rounded-lg border border-red-500/50 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
            >
              Удалить
            </button>
          </form>
        </div>
      </div>

      <CalculatorConfigForm action={handleUpdate} initialData={config} />
    </div>
  );
}
