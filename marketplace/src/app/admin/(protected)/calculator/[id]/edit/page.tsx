import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { CalculatorConfigForm } from '@/components/admin/calculator-config-form';
import { Button } from '@/components/ui/button';
import {
  deleteCalculatorConfig,
  getCalculatorConfigById,
  setActiveCalculatorConfig,
  updateCalculatorConfig,
} from '@/server/calculator-service';

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

  async function handleUpdate(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const isActive = formData.get('isActive') === 'on';
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

    await updateCalculatorConfig(id, {
      name,
      description: description || null,
      isActive,
      logisticsBaseCost,
      logisticsCostPerKm,
      dutyPercent,
      exciseBaseCost,
      recyclingBaseCost,
      vatPercent,
      brokerBaseCost,
      commissionPercent,
    });

    redirect('/admin/calculator');
  }

  async function handleDelete() {
    'use server';

    await deleteCalculatorConfig(id);
    redirect('/admin/calculator');
  }

  async function handleSetActive() {
    'use server';

    await setActiveCalculatorConfig(id);
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
              Поддерживайте актуальные ставки пошлин, НДС и логистики.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {!config.isActive && (
            <form action={handleSetActive}>
              <Button type="submit" size="sm">
                Set active
              </Button>
            </form>
          )}
          <form action={handleDelete}>
            <button
              type="submit"
              className="rounded-lg border border-red-500/50 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      <CalculatorConfigForm action={handleUpdate} initialData={config} />
    </div>
  );
}
