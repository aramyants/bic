"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BODY_TYPE_LABELS, FUEL_TYPE_LABELS, TRANSMISSION_LABELS } from "@/lib/constants";

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
                "flex items-center justify-between rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.1em] text-white/50 transition",
                selectedCountries.has(country.code) && "border-brand-primary bg-brand-primary/20 text-white",
              )}
            >
              <span>{country.name}</span>
              <span>{country.code}</span>
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
