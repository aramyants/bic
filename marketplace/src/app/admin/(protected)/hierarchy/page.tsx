import { groupBy } from "@/lib/utils";
import { getVehicles } from "@/server/vehicle-service";

export default async function HierarchyPage() {
  const vehicles = await getVehicles();
  const grouped = groupBy(vehicles, (v) => v.brand);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Иерархия брендов и моделей</h1>
        <p className="text-sm text-white/60">
          Данные формируются из текущего каталога. Чтобы добавить или скрыть модели, отредактируйте карточки машин в
          разделе «Автомобили».
        </p>
      </div>

      <div className="overflow-x-auto rounded-[32px] border border-white/10 bg-white/5">
        <table className="min-w-[640px] w-full table-auto text-left text-sm text-white/70">
          <thead className="border-b border-white/10 text-xs text-white/45">
            <tr>
              <th className="whitespace-nowrap px-6 py-4">Бренд</th>
              <th className="whitespace-nowrap px-6 py-4">Модели</th>
              <th className="whitespace-nowrap px-6 py-4 w-24">Кол-во</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(grouped)
              .sort(([a], [b]) => a.localeCompare(b, "ru"))
              .map(([brand, list]) => {
                const models = Array.from(new Set(list.map((v) => v.model))).filter(Boolean).sort();
                return (
                  <tr key={brand} className="border-b border-white/5 last:border-none">
                    <td className="px-6 py-4 text-white font-semibold">{brand}</td>
                    <td className="px-6 py-4 text-white/80">
                      {models.length ? models.join(", ") : "—"}
                    </td>
                    <td className="px-6 py-4 text-white/70">{list.length}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
