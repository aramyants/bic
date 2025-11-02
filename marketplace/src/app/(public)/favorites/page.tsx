import { getVehicles } from "@/server/vehicle-service";
import { getEurRubRate } from "@/server/exchange-service";
import { FavoritesView } from "@/components/favorites-view";

export default async function FavoritesPage() {
  const [vehicles, eurRubRate] = await Promise.all([
    getVehicles(),
    getEurRubRate().catch(() => 100),
  ]);

  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-10 py-12">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-white">Избранное</h1>
        <p className="text-sm text-white/60">Сохраняйте автомобили из каталога B.I.C. и возвращайтесь к ним позже.</p>
      </div>
      <FavoritesView vehicles={vehicles} eurRubRate={eurRubRate} />
    </div>
  );
}

