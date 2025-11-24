import { Check, Plus } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { getAllCalculatorConfigs } from '@/server/calculator-service';

export default async function CalculatorPage() {
  const configs = await getAllCalculatorConfigs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Конфигуратор калькулятора</h1>
          <p className="mt-1 text-sm text-white/60">
            Настройте пошлины, НДС, логистику и комиссии — расчёты на сайте будут соответствовать вашим условиям.
          </p>
        </div>
        <Link
          href="/admin/calculator/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Новая конфигурация
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {configs.map((config) => (
          <Link
            key={config.id}
            href={`/admin/calculator/${config.id}/edit`}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-orange-500/50 hover:bg-white/10"
          >
            {config.isActive && (
              <div className="absolute right-4 top-4">
                <Badge tone="success" className="flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Активна
                </Badge>
              </div>
            )}

            <h3 className="text-lg font-semibold text-white group-hover:text-orange-400">
              {config.name}
            </h3>

            {config.description && (
              <p className="mt-2 text-sm text-white/60">{config.description}</p>
            )}

            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-white/40">Пошлина</div>
                <div className="font-medium text-white">{config.dutyPercent}%</div>
              </div>
              <div>
                <div className="text-white/40">НДС</div>
                <div className="font-medium text-white">{config.vatPercent}%</div>
              </div>
              <div>
                <div className="text-white/40">Комиссия B.I.C.</div>
                <div className="font-medium text-white">{config.commissionPercent}%</div>
              </div>
              <div>
                <div className="text-white/40">Логистика (база)</div>
                <div className="font-medium text-white">
                  {(config.logisticsBaseCost / 1000).toFixed(0)}k ₽
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
              <span>
                Обновлено:{' '}
                {new Date(config.updatedAt).toLocaleDateString('ru-RU')}
              </span>
              {config.applyToVehicles ? (
                <Badge tone="outline" className="border-white/20 text-white/70">
                  Для карточек авто
                </Badge>
              ) : (
                <Badge tone="outline" className="border-white/20 text-white/70">
                  Только калькулятор
                </Badge>
              )}
            </div>
          </Link>
        ))}
      </div>

      {configs.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-sm">
          <p className="text-white/60">
            Конфигураций пока нет.
          </p>
          <Link
            href="/admin/calculator/new"
            className="mt-4 inline-block text-sm text-orange-400 hover:text-orange-300"
          >
            Создать первую
          </Link>
        </div>
      )}
    </div>
  );
}
