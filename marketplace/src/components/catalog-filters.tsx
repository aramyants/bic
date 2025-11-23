"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BODY_TYPE_LABELS, FUEL_TYPE_LABELS, TRANSMISSION_LABELS } from "@/lib/constants";
<<<<<<< ours

interface CatalogFiltersProps {
  bodyTypes: string[];
  fuelTypes: string[];
  transmissions: string[];
  countries: { code: string; name: string }[];
}

const translations = {
  filters: "\u0424\u0438\u043b\u044c\u0442\u0440\u044b",
  reset: "\u0421\u0431\u0440\u043e\u0441\u0438\u0442\u044c",
  body: "\u0422\u0438\u043f \u043a\u0443\u0437\u043e\u0432\u0430",
  fuel: "\u0422\u0438\u043f \u0442\u043e\u043f\u043b\u0438\u0432\u0430",
  transmission: "\u0422\u0440\u0430\u043d\u0441\u043c\u0438\u0441\u0441\u0438\u044f",
  countries: "\u0421\u0442\u0440\u0430\u043d\u044b",
  price: "\u0426\u0435\u043d\u0430 (EUR)",
  priceFrom: "\u043e\u0442",
  priceTo: "\u0434\u043e",
  applying: "\u041f\u0440\u0438\u043c\u0435\u043d\u044f\u0435\u043c \u0444\u0438\u043b\u044c\u0442\u0440\u044b\u2026",
};

export const CatalogFilters: React.FC<CatalogFiltersProps> = ({ bodyTypes, fuelTypes, transmissions, countries }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  const getArray = React.useCallback(
    (key: string) => {
      const value = searchParams.getAll(key);
      return new Set(value.flatMap((entry) => entry.split(".")));
    },
    [searchParams],
  );

  const toggleValue = (key: string, value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      const current = new Set(getArray(key));
      if (current.has(value)) {
        current.delete(value);
      } else {
        current.add(value);
      }

      params.delete(key);
      current.forEach((item) => {
        if (item) {
          params.append(key, item);
        }
      });

      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const setRange = (min?: string, max?: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (min) {
        params.set("minPrice", min);
      } else {
        params.delete("minPrice");
      }
      if (max) {
        params.set("maxPrice", max);
      } else {
        params.delete("maxPrice");
      }
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const selectedBodyTypes = getArray("bodyTypes");
  const selectedFuelTypes = getArray("fuelTypes");
  const selectedTransmissions = getArray("transmission");
  const selectedCountries = getArray("countries");
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  return (
    <aside className="space-y-6 rounded-[32px] border border-white/10 bg-white/4 p-6 text-white shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="h-5 w-5 text-white/60" />
          <span className="text-sm font-semibold uppercase tracking-[0.12em] text-white/60">
            {translations.filters}
          </span>
        </div>
        <button
          type="button"
          className="text-xs uppercase tracking-[0.1em] text-white/40 hover:text-white/70"
          onClick={clearFilters}
        >
          {translations.reset}
        </button>
      </div>

      <FilterGroup title={translations.body}>
        {bodyTypes.map((item) => (
          <CheckboxRow
            key={item}
            label={BODY_TYPE_LABELS[item as keyof typeof BODY_TYPE_LABELS] ?? item}
            checked={selectedBodyTypes.has(item)}
            onChange={() => toggleValue("bodyTypes", item)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title={translations.fuel}>
        {fuelTypes.map((item) => (
          <CheckboxRow
            key={item}
            label={FUEL_TYPE_LABELS[item as keyof typeof FUEL_TYPE_LABELS] ?? item}
            checked={selectedFuelTypes.has(item)}
            onChange={() => toggleValue("fuelTypes", item)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title={translations.transmission}>
        {transmissions.map((item) => (
          <CheckboxRow
            key={item}
            label={TRANSMISSION_LABELS[item as keyof typeof TRANSMISSION_LABELS] ?? item}
            checked={selectedTransmissions.has(item)}
            onChange={() => toggleValue("transmission", item)}
=======
import { cn, formatCurrency } from "@/lib/utils";

type Range = { min: number; max: number };

export type CatalogFacetConfig = {
  brands: string[];
  modelsByBrand: Record<string, string[]>;
  bodyTypes: string[];
  fuelTypes: string[];
  transmissions: string[];
  countries: { code: string; name: string }[];
  colors: string[];
  priceRange: Range;
  yearRange: Range;
  mileageRange: Range;
  engineRange: Range;
  powerRange: Range;
};

type FilterState = {
  search: string;
  brand: string;
  model: string;
  bodyTypes: string[];
  fuelTypes: string[];
  transmissions: string[];
  countries: string[];
  colors: string[];
  yearFrom?: number;
  yearTo?: number;
  mileageFrom?: number;
  mileageTo?: number;
  priceMin?: number;
  priceMax?: number;
  priceCurrency: "EUR" | "RUB";
  engineFrom?: number;
  engineTo?: number;
  powerFrom?: number;
  powerTo?: number;
};

const emptyState: FilterState = {
  search: "",
  brand: "",
  model: "",
  bodyTypes: [],
  fuelTypes: [],
  transmissions: [],
  countries: [],
  colors: [],
  priceCurrency: "EUR",
};

const toFlag = (code: string) =>
  code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

const parseNumber = (value?: string | null) => {
  if (!value) return undefined;
  const num = Number.parseFloat(value);
  return Number.isFinite(num) ? num : undefined;
};

const parseList = (value?: string | string[] | null) => {
  if (!value) return [] as string[];
  const raw = Array.isArray(value) ? value : [value];
  return raw.flatMap((item) => item.split(".")).filter(Boolean);
};

export function CatalogFilters({ facets, eurRubRate }: { facets: CatalogFacetConfig; eurRubRate: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [collapsed, setCollapsed] = React.useState(true);

  const initialState = React.useMemo<FilterState>(() => {
    const currencyParam = searchParams.get("priceCurrency");
    const priceCurrency = currencyParam === "RUB" ? "RUB" : "EUR";
    const priceMinEur = parseNumber(searchParams.get("priceMin"));
    const priceMaxEur = parseNumber(searchParams.get("priceMax"));
    const toDisplayPrice = (value?: number) =>
      value === undefined ? undefined : priceCurrency === "RUB" ? Math.round(value * eurRubRate) : value;

    return {
      ...emptyState,
      priceCurrency,
      search: searchParams.get("search") ?? "",
      brand: searchParams.get("brand") ?? "",
      model: searchParams.get("model") ?? "",
      bodyTypes: parseList(searchParams.get("bodyTypes")),
      fuelTypes: parseList(searchParams.get("fuelTypes")),
      transmissions: parseList(searchParams.get("transmissions")),
      countries: parseList(searchParams.get("countries")),
      colors: parseList(searchParams.get("colors")),
      yearFrom: parseNumber(searchParams.get("yearFrom")),
      yearTo: parseNumber(searchParams.get("yearTo")),
      mileageFrom: parseNumber(searchParams.get("mileageFrom")),
      mileageTo: parseNumber(searchParams.get("mileageTo")),
      priceMin: toDisplayPrice(priceMinEur),
      priceMax: toDisplayPrice(priceMaxEur),
      engineFrom: parseNumber(searchParams.get("engineFrom")),
      engineTo: parseNumber(searchParams.get("engineTo")),
      powerFrom: parseNumber(searchParams.get("powerFrom")),
      powerTo: parseNumber(searchParams.get("powerTo")),
    };
  }, [eurRubRate, searchParams]);

  const [state, setState] = React.useState<FilterState>(initialState);

  React.useEffect(() => {
    setState(initialState);
  }, [initialState]);

  const updateParamUrl = React.useCallback(
    (next: FilterState) => {
      const params = new URLSearchParams();
      params.set("page", "1");

      if (next.search.trim()) params.set("search", next.search.trim());
      if (next.brand) params.set("brand", next.brand);
      if (next.model) params.set("model", next.model);
      const join = (list: string[]) => (list.length ? list.join(".") : null);
      const setList = (key: string, value: string[]) => {
        const str = join(value);
        if (str) params.set(key, str);
      };

      setList("bodyTypes", next.bodyTypes);
      setList("fuelTypes", next.fuelTypes);
      setList("transmissions", next.transmissions);
      setList("countries", next.countries);
      setList("colors", next.colors);

      if (next.yearFrom !== undefined) params.set("yearFrom", String(next.yearFrom));
      if (next.yearTo !== undefined) params.set("yearTo", String(next.yearTo));
      if (next.mileageFrom !== undefined) params.set("mileageFrom", String(next.mileageFrom));
      if (next.mileageTo !== undefined) params.set("mileageTo", String(next.mileageTo));

      const toEur = (value?: number) =>
        value === undefined
          ? undefined
          : next.priceCurrency === "RUB"
            ? Math.round(value / eurRubRate)
            : value;

      const minPriceEur = toEur(next.priceMin);
      const maxPriceEur = toEur(next.priceMax);
      if (minPriceEur !== undefined) params.set("priceMin", String(minPriceEur));
      if (maxPriceEur !== undefined) params.set("priceMax", String(maxPriceEur));
      params.set("priceCurrency", next.priceCurrency);

      if (next.engineFrom !== undefined) params.set("engineFrom", String(next.engineFrom));
      if (next.engineTo !== undefined) params.set("engineTo", String(next.engineTo));
      if (next.powerFrom !== undefined) params.set("powerFrom", String(next.powerFrom));
      if (next.powerTo !== undefined) params.set("powerTo", String(next.powerTo));

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [eurRubRate, pathname, router, startTransition],
  );

  const handleApply = () => updateParamUrl(state);

  const handleReset = () => {
    setState({ ...emptyState });
    startTransition(() => router.push(pathname));
  };

  const modelsForBrand = state.brand ? facets.modelsByBrand[state.brand] ?? [] : [];

  return (
    <section className="rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-soft backdrop-blur-lg text-white">
      <div className="flex flex-wrap items-center gap-3 pb-4">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Фильтры</span>
          <ChevronDown className={cn("h-4 w-4 transition", collapsed && "rotate-180")} />
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-sm hover:bg-white/10"
          onClick={handleReset}
          disabled={pending}
        >
          <RotateCcw className="h-4 w-4" />
          Сбросить
        </button>
        <div className="ml-auto flex items-center gap-2 text-xs text-white/60">
          <span>Валюта:</span>
          <div className="flex gap-2 rounded-full border border-white/10 bg-white/5 p-1">
            {(["EUR", "RUB"] as const).map((currency) => (
              <button
                key={currency}
                type="button"
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold transition",
                  state.priceCurrency === currency ? "bg-white text-black" : "text-white/70 hover:text-white",
                )}
                onClick={() =>
                  setState((prev) => {
                    const convert = (value?: number) => {
                      if (value === undefined) return undefined;
                      if (currency === prev.priceCurrency) return value;
                      return currency === "RUB"
                        ? Math.round(value * eurRubRate)
                        : Math.max(0, Math.round(value / eurRubRate));
                    };
                    return {
                      ...prev,
                      priceCurrency: currency,
                      priceMin: convert(prev.priceMin),
                      priceMax: convert(prev.priceMax),
                    };
                  })
                }
              >
                {currency}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!collapsed && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <LabeledInput
              label="Поиск по названию"
              icon={<Search className="h-4 w-4 text-white/50" />}
              placeholder="Mercedes GLE, Cayenne..."
              value={state.search}
              onChange={(value) => setState((prev) => ({ ...prev, search: value }))}
            />
            <SelectField
              label="Кузов"
              value={state.bodyTypes[0] ?? ""}
              onChange={(val) => setState((prev) => ({ ...prev, bodyTypes: val ? [val] : [] }))}
              options={facets.bodyTypes}
              labels={BODY_TYPE_LABELS}
            />
            <SelectField
              label="Топливо"
              value={state.fuelTypes[0] ?? ""}
              onChange={(val) => setState((prev) => ({ ...prev, fuelTypes: val ? [val] : [] }))}
              options={facets.fuelTypes}
              labels={FUEL_TYPE_LABELS}
            />
            <SelectField
              label="Коробка"
              value={state.transmissions[0] ?? ""}
              onChange={(val) => setState((prev) => ({ ...prev, transmissions: val ? [val] : [] }))}
              options={facets.transmissions}
              labels={TRANSMISSION_LABELS}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <CountrySelect
              label="Страна"
              countries={facets.countries}
              value={state.countries[0] ?? ""}
              onChange={(val) => setState((prev) => ({ ...prev, countries: val ? [val] : [] }))}
            />
            <ColorPicker
              label="Цвет"
              colors={facets.colors}
              value={state.colors[0]}
              onChange={(val) => setState((prev) => ({ ...prev, colors: val ? [val] : [] }))}
            />
            <SelectField
              label="Бренд"
              value={state.brand}
              onChange={(val) => setState((prev) => ({ ...prev, brand: val, model: "" }))}
              options={facets.brands}
              renderOption={(brand) => brand}
            />
            <SelectField
              label="Модель"
              value={state.model}
              onChange={(val) => setState((prev) => ({ ...prev, model: val }))}
              options={modelsForBrand}
              renderOption={(model) => model}
              disabled={!state.brand}
            />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {(() => {
              const minBound =
                state.priceCurrency === "RUB"
                  ? Math.round(Math.max(0, facets.priceRange.min) * eurRubRate)
                  : Math.max(0, facets.priceRange.min);
              const maxBound =
                state.priceCurrency === "RUB"
                  ? Math.round(Math.max(facets.priceRange.max, facets.priceRange.min + 1) * eurRubRate)
                  : Math.max(facets.priceRange.max, facets.priceRange.min + 1);
              const safeMax = Math.max(maxBound, minBound + (state.priceCurrency === "RUB" ? 50000 : 1000));
              return (
                <RangeField
                  label={`Цена (${state.priceCurrency})`}
                  min={minBound}
                  max={safeMax}
                  step={state.priceCurrency === "RUB" ? 50000 : 500}
                  from={state.priceMin}
                  to={state.priceMax}
                  onChange={(next) => setState((prev) => ({ ...prev, priceMin: next.from, priceMax: next.to }))}
                  formatValue={(value) =>
                    state.priceCurrency === "RUB"
                      ? formatCurrency(value, "RUB")
                      : formatCurrency(value, "EUR")
                  }
                />
              );
            })()}
            <RangeField
              label="Год"
              min={facets.yearRange.min || 1990}
              max={facets.yearRange.max || new Date().getFullYear()}
              step={1}
              from={state.yearFrom}
              to={state.yearTo}
              onChange={(next) => setState((prev) => ({ ...prev, yearFrom: next.from, yearTo: next.to }))}
            />
            <RangeField
              label="Пробег (км)"
              min={facets.mileageRange.min || 0}
              max={Math.max(facets.mileageRange.max || 0, 300000)}
              step={1000}
              from={state.mileageFrom}
              to={state.mileageTo}
              onChange={(next) => setState((prev) => ({ ...prev, mileageFrom: next.from, mileageTo: next.to }))}
              formatValue={(value) => `${value.toLocaleString("ru-RU")} км`}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <RangeField
              label="Объём (л)"
              min={facets.engineRange.min || 1}
              max={Math.max(facets.engineRange.max || 0, 6)}
              step={0.1}
              from={state.engineFrom}
              to={state.engineTo}
              onChange={(next) => setState((prev) => ({ ...prev, engineFrom: next.from, engineTo: next.to }))}
            />
            <RangeField
              label="Мощность (л.с.)"
              min={facets.powerRange.min || 80}
              max={Math.max(facets.powerRange.max || 0, 800)}
              step={10}
              from={state.powerFrom}
              to={state.powerTo}
              onChange={(next) => setState((prev) => ({ ...prev, powerFrom: next.from, powerTo: next.to }))}
            />
            <div className="flex items-end justify-end">
              <button
                type="button"
                onClick={handleApply}
                disabled={pending}
                className="w-full rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary-strong disabled:opacity-60 md:w-auto"
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const COLOR_MAP: Record<string, string> = {
  черный: "#000000",
  black: "#000000",
  белый: "#ffffff",
  white: "#ffffff",
  серый: "#6b7280",
  gray: "#6b7280",
  серебристый: "#d1d5db",
  silver: "#d1d5db",
  красный: "#ef4444",
  red: "#ef4444",
  синий: "#2563eb",
  blue: "#2563eb",
  зеленый: "#16a34a",
  green: "#16a34a",
  оранжевый: "#f97316",
  orange: "#f97316",
  желтый: "#eab308",
  yellow: "#eab308",
  коричневый: "#92400e",
  brown: "#92400e",
};

function colorToHex(color: string) {
  const key = color.toLowerCase();
  if (COLOR_MAP[key]) return COLOR_MAP[key];
  const palette = ["#0f172a", "#1f2937", "#334155", "#475569", "#f97316", "#2563eb", "#ef4444", "#16a34a"];
  const hash = key.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return palette[hash % palette.length];
}

function CountrySelect({
  label,
  countries,
  value,
  onChange,
}: {
  label: string;
  countries: { code: string; name: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  const selected = countries.find((c) => c.code === value);
  const flagUrl = value ? `https://flagcdn.com/w20/${value.toLowerCase()}.png` : null;

  return (
    <label className="space-y-2 text-sm text-white/70">
      <span>{label}</span>
      <div className="relative">
        {flagUrl ? (
          <img
            src={flagUrl}
            alt={selected?.name ?? value}
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-6 -translate-y-1/2 rounded-sm border border-white/20 object-cover"
>>>>>>> theirs
          />
        ))}
      </FilterGroup>

      <FilterGroup title={translations.countries}>
        <div className="grid grid-cols-2 gap-2">
          {countries.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => toggleValue("countries", country.code)}
              className={cn(
                "flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.1em] text-white/70 transition",
                selectedCountries.has(country.code) && "border-brand-primary bg-brand-primary/20 text-white",
              )}
              title={country.name}
            >
              <img
                src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                alt={country.name}
                className="h-4 w-6 rounded-sm border border-white/20 object-cover"
              />
              <span className="font-semibold">{country.code}</span>
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={translations.price}>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder={translations.priceFrom}
            defaultValue={minPrice}
            onBlur={(event) => setRange(event.currentTarget.value, maxPrice)}
            className="h-10 rounded-full border border-white/15 bg-black/40 px-4 text-xs text-white placeholder:text-white/40 focus:border-brand-primary focus:outline-none"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder={translations.priceTo}
            defaultValue={maxPrice}
            onBlur={(event) => setRange(minPrice, event.currentTarget.value)}
            className="h-10 rounded-full border border-white/15 bg-black/40 px-4 text-xs text-white placeholder:text-white/40 focus:border-brand-primary focus:outline-none"
          />
        </div>
      </FilterGroup>

      {isPending ? (
        <div className="text-xs uppercase tracking-[0.1em] text-white/40">{translations.applying}</div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {Array.from(selectedBodyTypes).map((item) => (
          <Badge key={`body-${item}`} tone="outline" className="cursor-pointer" onClick={() => toggleValue("bodyTypes", item)}>
            {BODY_TYPE_LABELS[item as keyof typeof BODY_TYPE_LABELS] ?? item}
          </Badge>
        ))}
        {Array.from(selectedFuelTypes).map((item) => (
          <Badge key={`fuel-${item}`} tone="outline" className="cursor-pointer" onClick={() => toggleValue("fuelTypes", item)}>
            {FUEL_TYPE_LABELS[item as keyof typeof FUEL_TYPE_LABELS] ?? item}
          </Badge>
        ))}
        {Array.from(selectedTransmissions).map((item) => (
          <Badge key={`trans-${item}`} tone="outline" className="cursor-pointer" onClick={() => toggleValue("transmission", item)}>
            {TRANSMISSION_LABELS[item as keyof typeof TRANSMISSION_LABELS] ?? item}
          </Badge>
        ))}
        {Array.from(selectedCountries).map((item) => (
          <Badge key={`country-${item}`} tone="outline" className="cursor-pointer" onClick={() => toggleValue("countries", item)}>
            {item}
          </Badge>
        ))}
      </div>
    </aside>
  );
};

const FilterGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-3">
    <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">{title}</h3>
    <div className="space-y-2 text-sm text-white/75">{children}</div>
  </div>
);

const CheckboxRow: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
  <label className="flex cursor-pointer items-center justify-between rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.1em] text-white/60 transition hover:border-white/30">
    <span>{label}</span>
    <input
      type="checkbox"
      className="h-4 w-4 rounded border-white/30 bg-transparent text-brand-primary focus:ring-brand-primary"
      checked={checked}
      onChange={onChange}
    />
  </label>
);
