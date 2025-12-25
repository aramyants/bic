export const dynamic = 'force-dynamic';

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { FavoritesView } from "@/components/favorites-view";
import type { VehicleCardModel } from "@/lib/vehicle-card-model";
import { getCatalogVehicles } from "@/server/vehicle-service";
import { getEurRubRate } from "@/server/exchange-service";

export default async function FavoritesPage() {
  const eurRubRate = await getEurRubRate().catch(() => 100);
  const { items } = await getCatalogVehicles({}, eurRubRate);

  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-10 py-12 text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold">Избранное</h1>
          <p className="text-sm text-white/60">
            Здесь сохраняются машины, которые вы отметили в каталоге. Сравните варианты и вернитесь к ним позже.
          </p>
        </div>
        <div className="flex items-center">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Назад в каталог
          </Link>
        </div>
      </div>
      <FavoritesView vehicles={items as VehicleCardModel[]} eurRubRate={eurRubRate} />
    </div>
  );
}
