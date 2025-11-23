"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, ChevronDown, RotateCcw, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BODY_TYPE_LABELS, FUEL_TYPE_LABELS, TRANSMISSION_LABELS } from "@/lib/constants";
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
  const searchSuggestions = React.useMemo(() => {
    const set = new Set<string>();
    facets.brands.forEach((brand) => set.add(brand));
    Object.entries(facets.modelsByBrand).forEach(([brand, models]) => {
      models.forEach((model) => set.add(`${brand} ${model}`.trim()));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ru"));
  }, [facets.brands, facets.modelsByBrand]);

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
    [eurRubRate, pathname, router],
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
                onClick={() => {
                  const convert = (value?: number) => {
                    if (value === undefined) return undefined;
                    if (currency === state.priceCurrency) return value;
                    return currency === "RUB"
                      ? Math.round(value * eurRubRate)
                      : Math.max(0, Math.round(value / eurRubRate));
                  };
                  const next = {
                    ...state,
                    priceCurrency: currency,
                    priceMin: convert(state.priceMin),
                    priceMax: convert(state.priceMax),
                  };
                  setState(next);
                  updateParamUrl(next);
                }}
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
              suggestions={searchSuggestions}
              onSelectSuggestion={(value) => setState((prev) => ({ ...prev, search: value }))}
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
              value={state.colors}
              onChange={(vals) => setState((prev) => ({ ...prev, colors: vals }))}
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

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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
  black: "#000000",
  "carbon black": "#0b0b0b",
  white: "#ffffff",
  "mineral white": "#f5f5f5",
  gray: "#6b7280",
  grey: "#6b7280",
  "crayon gray": "#4b5563",
  "crayon grey": "#4b5563",
  silver: "#d1d5db",
  "metallic silver": "#d1d5db",
  red: "#ef4444",
  blue: "#2563eb",
  green: "#16a34a",
  orange: "#f97316",
  yellow: "#eab308",
  brown: "#92400e",
  beige: "#d6c29c",
  gold: "#d4af37",
  "obsidian black": "#0c0c0c",
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
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  React.useEffect(() => {
    setOpen(false);
  }, [value]);

  const handleSelect = (code: string) => {
    onChange(code);
    setOpen(false);
  };

  return (
    <label className="space-y-2 text-sm text-white/70">
      <span>{label}</span>
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          onBlur={(e) => {
            if (!containerRef.current?.contains(e.relatedTarget as Node)) {
              setOpen(false);
            }
          }}
          className={cn(
            "flex h-11 w-full items-center justify-between gap-3 rounded-full border border-white/15 bg-black/40 px-4 text-sm text-white transition focus:border-brand-primary focus:outline-none",
            open && "border-brand-primary shadow-glow",
          )}
        >
          <div className={cn("flex items-center", flagUrl ? "gap-2" : "gap-0")}>
            {flagUrl ? (
              <img
                src={flagUrl}
                alt={selected?.name ?? value}
                className="h-4 w-6 rounded-sm border border-white/20 object-cover"
              />
            ) : null}
            <span className="text-left text-sm text-white/80">
              {value ? `${value} ${selected?.name ?? ""}` : "Все страны"}
            </span>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-white/60 transition", open && "rotate-180")} />
        </button>

        {open ? (
          <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-soft backdrop-blur">
            <div className="max-h-64 overflow-y-auto">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect("");
                }}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-white/80 hover:bg-white/5"
              >
                <span className="text-white">Все страны</span>
              </button>
              {countries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(country.code);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-white/80 hover:bg-white/5",
                    value === country.code && "bg-white/10 text-white",
                  )}
                >
                  <img
                    src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                    alt={country.name}
                    className="h-4 w-6 rounded-sm border border-white/20 object-cover"
                  />
                  <span className="font-semibold text-white">{country.code}</span>
                  <span className="text-xs text-white/50">{country.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </label>
  );
}

function ColorPicker({
  label,
  colors,
  value,
  onChange,
}: {
  label: string;
  colors: string[];
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const toggle = (color: string) => {
    const exists = value.includes(color);
    const next = exists ? value.filter((c) => c !== color) : [...value, color];
    onChange(next);
  };

  const isAll = value.length === 0;

  return (
    <label className="space-y-2 text-sm text-white/70">
      <span>{label}</span>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange([])}
          className={cn(
            "flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition",
            isAll
              ? "border-brand-primary bg-brand-primary/80 text-white shadow-glow"
              : "border-white/20 bg-white/5 text-white/80 hover:border-brand-primary hover:text-white",
          )}
        >
          <span>Все</span>
        </button>
        {colors.map((color) => {
          const active = value.includes(color);
          return (
            <button
              key={color}
              type="button"
              onClick={() => toggle(color)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition",
                active
                  ? "border-brand-primary bg-brand-primary text-white shadow-glow"
                  : "border-white/20 bg-white/5 text-white/80 hover:border-brand-primary hover:text-white",
              )}
            >
              <span
                className="h-4 w-4 rounded-full border border-white/30"
                style={{ backgroundColor: colorToHex(color) }}
              />
              <span>{color}</span>
            </button>
          );
        })}
      </div>
    </label>
  );
}

function LabeledInput({
  label,
  icon,
  placeholder,
  value,
  onChange,
  suggestions,
  onSelectSuggestion,
}: {
  label: string;
  icon?: React.ReactNode;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
  onSelectSuggestion?: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredSuggestions = React.useMemo(() => {
    if (!suggestions || suggestions.length === 0) return [];
    if (!value.trim()) return suggestions.slice(0, 8);
    const term = value.trim().toLowerCase();
    return suggestions.filter((s) => s.toLowerCase().includes(term)).slice(0, 8);
  }, [suggestions, value]);

  const selectSuggestion = (next: string) => {
    onSelectSuggestion?.(next);
    setOpen(false);
  };

  return (
    <label className="space-y-2 text-sm text-white/70">
      <span>{label}</span>
      <div className="relative" ref={containerRef}>
        {icon ? <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">{icon}</div> : null}
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (suggestions && suggestions.length) setOpen(true);
          }}
          onFocus={() => suggestions && suggestions.length && setOpen(true)}
          className={cn(
            "h-11 w-full rounded-full border border-white/15 bg-black/40 pr-4 text-sm text-white placeholder:text-white/40 focus:border-brand-primary focus:outline-none",
            icon ? "pl-10" : "pl-4",
          )}
        />
        {open && filteredSuggestions.length > 0 ? (
          <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-soft backdrop-blur">
            <div className="max-h-64 overflow-y-auto">
              {filteredSuggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectSuggestion(item);
                  }}
                  className="flex w-full items-center px-4 py-2 text-left text-sm text-white/80 hover:bg-white/5"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </label>
  );
}

function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  labels,
  renderOption,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: T[];
  labels?: Record<string, string>;
  renderOption?: (option: T) => string;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const placeholder = "Все";
  const displayLabel = value
    ? renderOption
      ? renderOption(value as T)
      : labels?.[value] ?? value
    : placeholder;

  React.useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  React.useEffect(() => {
    setOpen(false);
  }, [value]);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <label className="space-y-2 text-sm text-white/70">
      <span>{label}</span>
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          onBlur={(e) => {
            if (!containerRef.current?.contains(e.relatedTarget as Node)) {
              setOpen(false);
            }
          }}
          className={cn(
            "flex h-11 w-full items-center justify-between gap-3 rounded-full border border-white/15 bg-black/40 px-4 text-sm text-white transition focus:border-brand-primary focus:outline-none",
            open && !disabled && "border-brand-primary shadow-glow",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <span className="text-left text-sm text-white/80">{displayLabel}</span>
          <ChevronDown className={cn("h-4 w-4 text-white/60 transition", open && "rotate-180")} />
        </button>
        {open && !disabled ? (
          <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-soft backdrop-blur">
            <div className="max-h-64 overflow-y-auto">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect("");
                }}
                className={cn(
                  "flex w-full items-center px-4 py-2 text-left text-sm text-white/80 hover:bg-white/5",
                  value === "" && "bg-white/10 text-white",
                )}
              >
                Все
              </button>
              {options.map((option) => {
                const optionLabel = renderOption ? renderOption(option) : labels?.[option] ?? option;
                return (
                  <button
                    key={option}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(option);
                    }}
                    className={cn(
                      "flex w-full items-center px-4 py-2 text-left text-sm text-white/80 hover:bg-white/5",
                      value === option && "bg-white/10 text-white",
                    )}
                  >
                    {optionLabel}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </label>
  );
}

function RangeField({
  label,
  min,
  max,
  step,
  from,
  to,
  onChange,
  formatValue,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  from?: number;
  to?: number;
  onChange: (range: { from?: number; to?: number }) => void;
  formatValue?: (value: number) => string;
}) {
  const displayFrom = from ?? min;
  const displayTo = to ?? max;
  const format = formatValue ?? ((v) => v.toString());
  const span = Math.max(max - min, step);
  const toPercent = (value: number) => Math.min(100, Math.max(0, ((value - min) / span) * 100));
  const clamp = (val: number) => Math.min(max, Math.max(min, val));
  const digits = (val: number) => String(Math.abs(val)).length;
  const minDigits = digits(min);
  const maxDigits = digits(max);

  const normalizeInput = (val: number, peer: number | undefined, isFrom: boolean) => {
    const len = digits(val);
    const belowMin = val < min;
    const aboveMax = val > max;

    // Let the user type partial numbers (e.g., starting with "2" for 2024) until length is comparable.
    if (belowMin && len < minDigits) return val;
    if (aboveMax && len < maxDigits) return val;

    let next = clamp(val);
    if (peer !== undefined) {
      next = isFrom ? Math.min(next, peer) : Math.max(next, peer);
    }
    return next;
  };

  const clampFinal = (val: number | undefined, peer: number | undefined, isFrom: boolean) => {
    if (val === undefined || Number.isNaN(val)) return undefined;
    let next = clamp(val);
    if (peer !== undefined) {
      next = isFrom ? Math.min(next, peer) : Math.max(next, peer);
    }
    return next;
  };

  return (
    <div className="space-y-3 text-sm text-white/70">
      <span>{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          value={from ?? ""}
          placeholder={String(min)}
          onChange={(e) => {
            const val = e.target.value ? Number(e.target.value) : undefined;
            if (val === undefined) {
              onChange({ from: undefined, to });
              return;
            }
            const next = normalizeInput(val, to, true);
            onChange({ from: next, to });
          }}
          onBlur={() => {
            const next = clampFinal(from, to, true);
            if (next !== from) onChange({ from: next, to });
          }}
          className="number-input h-11 w-full rounded-full border border-white/15 bg-black/40 px-4 text-sm text-white placeholder:text-white/40 focus:border-brand-primary focus:outline-none"
        />
        <span className="text-white/40">-</span>
        <input
          type="number"
          min={min}
          max={max}
          value={to ?? ""}
          placeholder={String(max)}
          onChange={(e) => {
            const val = e.target.value ? Number(e.target.value) : undefined;
            if (val === undefined) {
              onChange({ from, to: undefined });
              return;
            }
            const next = normalizeInput(val, from, false);
            onChange({ from, to: next });
          }}
          onBlur={() => {
            const next = clampFinal(to, from, false);
            if (next !== to) onChange({ from, to: next });
          }}
          className="number-input h-11 w-full rounded-full border border-white/15 bg-black/40 px-4 text-sm text-white placeholder:text-white/40 focus:border-brand-primary focus:outline-none"
        />
      </div>
      <div className="space-y-2">
        <div className="relative h-4 px-3 pt-1">
          <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-white/10" />
          <div
            className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-brand-primary"
            style={{ left: `${toPercent(displayFrom)}%`, right: `${100 - toPercent(displayTo)}%` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={displayFrom}
            onChange={(e) => {
              const next = Math.min(Math.max(Number(e.target.value), min), Math.max(displayTo - step, min));
              onChange({ from: next, to });
            }}
            className="range-input z-20"
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={displayTo}
            onChange={(e) => {
              const next = Math.max(Math.min(Number(e.target.value), max), Math.min(displayFrom + step, max));
              onChange({ from, to: next });
            }}
            className="range-input z-30"
          />
        </div>
        <div className="flex justify-between text-[11px] text-white/50">
          <span>{format(displayFrom)}</span>
          <span>{format(displayTo)}</span>
        </div>
      </div>
    </div>
  );
}
