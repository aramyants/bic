import Link from "next/link";

import { CatalogFilters } from "@/components/catalog-filters";
import { Badge } from "@/components/ui/badge";
import { VehicleCard } from "@/components/vehicle-card";
import { BODY_TYPES, COUNTRIES, FUEL_TYPES, TRANSMISSIONS } from "@/lib/constants";
import { formatLocaleNumber } from "@/lib/utils";
import { getVehicles } from "@/server/vehicle-service";
import { getEurRubRate } from "@/server/exchange-service";

const copy = {
  badge: "Каталог",
  title: "Каталог B.I.C.",
  subtitle:
    "Отбираем проверенные автомобили у надёжных партнёров, берём на себя переговоры, сопровождение сделки и доставку под ключ.",
  summaryPrefix: "Найдено",
  summarySuffix: "объявлений",
  sort: "Используйте фильтры, чтобы быстрее найти нужное авто",
  favorites: "Избранное",
  empty: "По текущим фильтрам ничего не найдено. Попробуйте изменить условия поиска или сбросьте фильтры, чтобы увидеть больше предложений.",
} as const;

type SearchParamRecord = Record<string, string | string[] | undefined>;

export default async function CatalogPage({ searchParams }: { searchParams: Promise<SearchParamRecord> }) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  const [vehicles, eurRubRate] = await Promise.all([getVehicles(filters), getEurRubRate().catch(() => 100)]);

  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-12 text-white">
      <header className="space-y-4 pt-10">
        <Badge tone="outline" className="tracking-[0.1em] text-white/70">
          {copy.badge}
        </Badge>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold">{copy.title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/70">{copy.subtitle}</p>
          </div>
          <div className="text-xs uppercase tracking-[0.1em] text-white/50">
            {copy.summaryPrefix} {formatLocaleNumber(vehicles.length)} {copy.summarySuffix}
          </div>
        </div>
      </header>
      <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
        <CatalogFilters bodyTypes={BODY_TYPES} fuelTypes={FUEL_TYPES} transmissions={TRANSMISSIONS} countries={COUNTRIES} />
        <section className="space-y-6">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.1em] text-white/50">
            <span>{copy.sort}</span>
            <Link href="/favorites" className="text-white/70 hover:text-white">
              {copy.favorites}
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} eurRubRate={eurRubRate} />
            ))}
          </div>
          {vehicles.length === 0 ? (
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center text-sm text-white/70">
              {copy.empty}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function parseFilters(params: SearchParamRecord) {
  const parseSet = (key: string) => {
    const value = params[key];
    if (!value) return [] as string[];
    const raw = Array.isArray(value) ? value : [value];
    return raw.flatMap((item) => item.split(".")).filter(Boolean);
  };

  const parseNumber = (key: string) => {
    const value = params[key];
    if (!value) return undefined;
    const raw = Array.isArray(value) ? value[0] : value;
    const asNumber = Number.parseInt(raw, 10);
    return Number.isFinite(asNumber) ? asNumber : undefined;
  };

  return {
    bodyTypes: parseSet("bodyTypes"),
    fuelTypes: parseSet("fuelTypes"),
    transmission: parseSet("transmission"),
    countries: parseSet("countries"),
    minPriceEur: parseNumber("minPrice"),
    maxPriceEur: parseNumber("maxPrice"),
    search: typeof params.search === "string" ? params.search : undefined,
  };
}
