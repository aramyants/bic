import Link from "next/link";

import { getAdminVehicles } from "@/server/vehicle-service";
import { formatCurrency } from "@/lib/utils";

export default async function VehiclesPage() {
  const vehicles = await getAdminVehicles();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Автомобили</h1>
          <p className="text-sm text-white/60">Все добавленные вручную позиции каталога.</p>
        </div>
        <Link
          href="/admin/vehicles/new"
          className="inline-flex h-12 items-center justify-center rounded-full bg-brand-primary px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-brand-primary-strong"
        >
          Добавить авто
        </Link>
      </div>
      <div className="overflow-hidden rounded-[36px] border border-white/10 bg-white/6">
        <table className="w-full table-fixed text-left text-sm text-white/70">
          <thead className="border-b border-white/10 text-xs text-white/45">
            <tr>
              <th className="px-6 py-4">Модель</th>
              <th className="px-6 py-4">Страна</th>
              <th className="px-6 py-4">Цена (EUR)</th>
              <th className="px-6 py-4">Действия</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b border-white/5 last:border-none">
                <td className="truncate px-6 py-4 text-white">
                  <div className="font-semibold">{vehicle.title}</div>
                  <div className="text-xs text-white/45">
                    {vehicle.brand} • {vehicle.year}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/65">{vehicle.country}</span>
                </td>
                <td className="px-6 py-4 text-white">{formatCurrency(vehicle.basePriceEur, "EUR")}</td>
                <td className="px-6 py-4">
                  <Link href={`/admin/vehicles/${vehicle.id}/edit`} className="text-xs text-white/65 hover:text-white">
                    Редактировать
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
