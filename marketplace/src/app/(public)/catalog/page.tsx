export const dynamic = 'force-dynamic';

import Link from "next/link";

import { CatalogFilters, type CatalogFacetConfig } from "@/components/catalog-filters";
import { Badge } from "@/components/ui/badge";
import { VehicleCard } from "@/components/vehicle-card";
import type { VehicleCardModel } from "@/lib/vehicle-card-model";
import { COUNTRIES } from "@/lib/constants";
import { formatLocaleNumber } from "@/lib/utils";
import { getCatalogVehicles } from "@/server/vehicle-service";
import { getEurRubRate } from "@/server/exchange-service";

const copy = {
  badge: "Каталог",
  title: "Best Imported Cars",
  subtitle: "Свежие позиции с прозрачным расчётом и понятными условиями доставки.",
  summaryPrefix: "Всего",
  summarySuffix: "авто в каталоге",
  sort: "Сначала показываем наиболее подходящие предложения. Настройте фильтры и сортировку ниже.",
  favorites: "Избранное",
  empty: "По заданным фильтрам ничего не найдено. Попробуйте скорректировать критерии поиска.",
} as const;

type SearchParamRecord = Record<string, string | string[] | undefined>;

export default async function CatalogPage({ searchParams }: { searchParams: Promise<SearchParamRecord> }) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  const page = Number.parseInt((resolvedSearchParams.page as string) ?? "1", 10) || 1;
  const pageSize = 12;
  const priceCurrency = resolvedSearchParams.priceCurrency === "RUB" ? "RUB" : "EUR";

  const eurRubRate = await getEurRubRate().catch(() => 100);
  const [{ items: allItems }, { items, total }] = await Promise.all([
    getCatalogVehicles({}, eurRubRate),
    getCatalogVehicles(filters, eurRubRate),
  ]);
  const facets = buildFacets(allItems);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const pagedItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-8 text-white">
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
            {copy.summaryPrefix} {formatLocaleNumber(total)} {copy.summarySuffix}
          </div>
        </div>
      </header>

      <CatalogFilters facets={facets} eurRubRate={eurRubRate} />

      <section className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs uppercase tracking-[0.1em] text-white/50">
          <span>{copy.sort}</span>
          <div className="flex gap-4">
            <Link href="/favorites" className="text-white/70 hover:text-white">
              {copy.favorites}
            </Link>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {pagedItems.map((vehicle: VehicleCardModel) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} eurRubRate={eurRubRate} priceCurrency={priceCurrency} />
          ))}
        </div>

        {pagedItems.length === 0 ? (
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center text-sm text-white/70">
            {copy.empty}
          </div>
        ) : null}

        {totalPages > 1 ? (
          <div className="flex items-center justify-center gap-3 text-sm">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const target = idx + 1;
              const params = new URLSearchParams(resolvedSearchParams as Record<string, string>);
              params.set("page", String(target));
              return (
                <Link
                  key={target}
                  href={`/catalog?${params.toString()}`}
                  className={`rounded-full px-4 py-2 border border-white/10 ${
                    currentPage === target ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {target}
                </Link>
              );
            })}
          </div>
        ) : null}
      </section>
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
    const asNumber = Number.parseFloat(raw);
    return Number.isFinite(asNumber) ? asNumber : undefined;
  };

  const parseCc = (key: string) => {
    const value = parseNumber(key);
    if (value === undefined) return undefined;
    return value < 50 ? Math.round(value * 1000) : value;
  };

  return {
    search: typeof params.search === "string" ? params.search : undefined,
    brand: typeof params.brand === "string" ? params.brand : undefined,
    model: typeof params.model === "string" ? params.model : undefined,
    bodyTypes: parseSet("bodyTypes"),
    fuelTypes: parseSet("fuelTypes"),
    transmissions: parseSet("transmissions"),
    countries: parseSet("countries"),
    colors: parseSet("colors"),
    minPriceEur: parseNumber("priceMin"),
    maxPriceEur: parseNumber("priceMax"),
    minYear: parseNumber("yearFrom"),
    maxYear: parseNumber("yearTo"),
    minMileage: parseNumber("mileageFrom"),
    maxMileage: parseNumber("mileageTo"),
    minEngineVolumeCc: parseCc("engineFrom"),
    maxEngineVolumeCc: parseCc("engineTo"),
    minPowerHp: parseNumber("powerFrom"),
    maxPowerHp: parseNumber("powerTo"),
  };
}

function buildFacets(items: VehicleCardModel[]): CatalogFacetConfig {
  const brandModels = new Map<string, Set<string>>();
  const bodyTypes = new Set<string>();
  const fuelTypes = new Set<string>();
  const transmissions = new Set<string>();
  const colors = new Set<string>();
  const countries = new Set<string>();
  const years: number[] = [];
  const mileage: number[] = [];
  const prices: number[] = [];
  const engines: number[] = [];
  const powers: number[] = [];

  items.forEach((item) => {
    if (item.brand) {
      const brand = item.brand.trim();
      if (!brandModels.has(brand)) brandModels.set(brand, new Set());
      if (item.model) brandModels.get(brand)!.add(item.model.trim());
    }
    if (item.bodyType) bodyTypes.add(item.bodyType);
    if (item.fuelType) fuelTypes.add(item.fuelType);
    if (item.transmission) transmissions.add(item.transmission);
    if (item.country) countries.add(item.country);
    if (item.year) years.push(item.year);
    if (typeof item.mileage === "number") mileage.push(item.mileage);
    if (typeof item.basePriceEur === "number") prices.push(item.basePriceEur);
    if (item.engineVolumeCc) engines.push(item.engineVolumeCc / 1000);
    if (item.powerHp) powers.push(item.powerHp);
    if (item.color) colors.add(item.color);
  });

  const range = (arr: number[]) => ({
    min: arr.length ? Math.min(...arr) : 0,
    max: arr.length ? Math.max(...arr) : 0,
  });

  const modelsByBrand: Record<string, string[]> = {};
  brandModels.forEach((set, brand) => {
    modelsByBrand[brand] = Array.from(set).sort();
  });

  return {
    brands: Array.from(brandModels.keys()).sort(),
    modelsByBrand,
    bodyTypes: Array.from(bodyTypes).sort(),
    fuelTypes: Array.from(fuelTypes).sort(),
    transmissions: Array.from(transmissions).sort(),
    countries: COUNTRIES.filter((c) => countries.has(c.code) || countries.has(c.name)).sort((a, b) =>
      a.name.localeCompare(b.name, "ru"),
    ),
    colors: Array.from(colors).sort(),
    priceRange: range(prices),
    yearRange: range(years),
    mileageRange: range(mileage),
    engineRange: range(engines),
    powerRange: range(powers),
  };
}
