import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Globe, LinkIcon } from "lucide-react";

import { CostCalculator } from "@/components/cost-breakdown";
import { FavoriteToggle } from "@/components/favorite-toggle";
import { InfoTooltip } from "@/components/info-tooltip";
import { Badge } from "@/components/ui/badge";
import { VehicleGallery } from "@/components/vehicle-gallery";
import { COUNTRIES } from "@/lib/constants";
import { formatCurrency, formatLocaleNumber } from "@/lib/utils";
import { computeCostBreakdown, getVehicleBySlug } from "@/server/vehicle-service";
import { getEurRubRate } from "@/server/exchange-service";

const copy = {
  fallbackDescription: "B.I.C. сопровождает сделку от проверки автомобиля до доставки и постановки на учёт.",
  basePriceLabel: "Базовая стоимость в Европе",
  basePriceTooltip:
    "Цена в евро у дилера или владельца. Для пересчёта в рубли используем актуальный курс EUR/RUB на дату просмотра.",
  specsTitle: "Особенности комплектации",
  marketsTitle: "Рынки присутствия",
  documentsTitle: "Документы, доступные к скачиванию",
  specsGroupedTitle: "Технические характеристики по разделам",
  logisticsTitle: "Логистика",
  openOriginal: "Открыть оригинальное объявление",
} as const;

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) {
    notFound();
  }

  const eurRubRate = await getEurRubRate().catch(() => 100);
  const individual = computeCostBreakdown(vehicle, eurRubRate, "INDIVIDUAL");
  const company = computeCostBreakdown(vehicle, eurRubRate, "COMPANY");

  const countryNames = vehicle.markets
    .map((market) => COUNTRIES.find((country) => country.code === market.countryCode)?.name ?? market.countryCode)
    .slice(0, 6);

  const specsGrouped = vehicle.specifications.reduce<Record<string, { label: string; value: string }[]>>(
    (acc, spec) => {
      const key = spec.group ?? "Основное";
      if (!acc[key]) acc[key] = [];
      acc[key].push({ label: spec.label, value: spec.value });
      return acc;
    },
    {},
  );

  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-16 py-12 text-white">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <VehicleGallery images={vehicle.gallery} title={vehicle.title} />
        <div className="space-y-6 rounded-[42px] border border-white/10 bg-white/6 p-8">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.1em] text-white/60">
            <Badge tone="outline">{vehicle.brand}</Badge>
            <Badge tone="default">{vehicle.bodyType ?? "-"}</Badge>
            <span>{vehicle.year}</span>
            <span>{vehicle.country}</span>
            <FavoriteToggle vehicleId={vehicle.id} />
          </div>

          <h1 className="text-3xl font-semibold md:text-4xl">{vehicle.title}</h1>
          <p className="text-sm text-white/65">{vehicle.shortDescription ?? copy.fallbackDescription}</p>

          <div className="space-y-3">
            <div className="text-xs uppercase tracking-[0.1em] text-white/40">{copy.basePriceLabel}</div>
            <div className="flex items-center gap-3 text-3xl font-semibold">
              {formatCurrency(vehicle.basePriceEur, "EUR")}
              <InfoTooltip label={copy.basePriceTooltip} />
            </div>
            <div className="text-xs text-white/50">
              ≈ {formatCurrency(vehicle.basePriceEur * eurRubRate, "RUB")} по курсу EUR/RUB
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-[32px] border border-white/10 bg-black/30 p-6 text-sm text-white/70">
            <SpecItem
              label="Пробег"
              value={`${formatLocaleNumber(vehicle.mileage ?? 0)} ${vehicle.mileageUnit?.toUpperCase() ?? "KM"}`}
            />
            <SpecItem label="Топливо" value={vehicle.fuelType ?? "-"} />
            <SpecItem label="Коробка" value={vehicle.transmission ?? "-"} />
            <SpecItem label="Привод" value={vehicle.driveType ?? "-"} />
            <SpecItem
              label="Объём двигателя"
              value={vehicle.engineVolumeCc ? `${formatLocaleNumber(vehicle.engineVolumeCc / 1000, 1)} л` : "-"}
            />
            <SpecItem label="Мощность" value={vehicle.powerHp ? `${vehicle.powerHp} л.с.` : "-"} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={vehicle.originalListingUrl ?? "#"}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-primary px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-brand-primary-strong"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkIcon className="h-4 w-4" />
              {copy.openOriginal}
            </Link>
            <span className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.1em] text-white/50">
              <Globe className="h-4 w-4" />
              {vehicle.country}
            </span>
          </div>

          <CostCalculator individual={individual} company={company} />
        </div>
      </div>

      <section className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">{copy.specsTitle}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {vehicle.features.map((feature) => (
              <div key={feature.id} className="rounded-[28px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                {feature.label}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">{copy.marketsTitle}</h2>
          <div className="flex flex-wrap gap-2">
            {countryNames.map((country) => (
              <Badge key={country} tone="outline">
                {country}
              </Badge>
            ))}
          </div>
          <h3 className="text-xl font-semibold">{copy.documentsTitle}</h3>
          <ul className="space-y-3 text-sm text-white/70">
            {vehicle.documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between rounded-full border border-white/10 px-4 py-3">
                <span>{doc.title}</span>
                <Link href={doc.url} target="_blank" className="flex items-center gap-2 text-white/60 hover:text-white">
                  <Download className="h-4 w-4" />
                  Скачать
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">{copy.specsGroupedTitle}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(specsGrouped).map(([group, specs]) => (
            <div key={group} className="space-y-3 rounded-[32px] border border-white/10 bg-white/5 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-white/50">{group}</h3>
              <dl className="space-y-2 text-sm text-white/70">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between rounded-full border border-white/10 bg-black/30 px-4 py-2"
                  >
                    <dt>{spec.label}</dt>
                    <dd className="font-semibold text-white/80">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">{copy.logisticsTitle}</h2>
        <div className="space-y-4">
          {vehicle.logistics.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center gap-4 rounded-[32px] border border-white/10 bg-white/5 px-6 py-4 text-sm text-white/70"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-xs font-semibold uppercase tracking-[0.1em] text-white/60">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="text-white">{step.label}</div>
                <div className="text-white/60">{step.description}</div>
              </div>
              <div className="text-xs uppercase tracking-[0.1em] text-white/50">{step.etaDays ? `${step.etaDays} дней` : ""}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const SpecItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-xs uppercase tracking-[0.1em] text-white/40">{label}</div>
    <div className="text-sm font-semibold text-white">{value}</div>
  </div>
);
