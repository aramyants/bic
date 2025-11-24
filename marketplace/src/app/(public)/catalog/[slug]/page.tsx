import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, Globe, LinkIcon } from "lucide-react";

import { CostCalculator } from "@/components/cost-breakdown";
import { FavoriteToggle } from "@/components/favorite-toggle";
import { InfoTooltip } from "@/components/info-tooltip";
import { Badge } from "@/components/ui/badge";
import { VehicleGallery } from "@/components/vehicle-gallery";
import { COUNTRIES, getBodyTypeLabel } from "@/lib/constants";
import { toCalculatorSettings } from "@/lib/calculator";
import { cn, formatCurrency, formatLocaleNumber } from "@/lib/utils";
import { getActiveCalculatorConfig } from "@/server/calculator-service";
import { getEurRubRate } from "@/server/exchange-service";
import { computeCostBreakdown, getVehicleBySlug } from "@/server/vehicle-service";

const copy = {
  fallbackDescription: "B.I.C. помогает купить автомобиль за рубежом и доставить его в Россию под ключ.",
  backToCatalog: "Назад в каталог",
  basePriceLabel: "Цена продавца в евро",
  basePriceTooltip:
    "Цена у продавца до доставки. Для расчёта переводим по текущему курсу EUR/RUB с учётом выбранных ставок.",
  specsTitle: "Характеристики автомобиля",
  marketsTitle: "Рынки поставки",
  documentsTitle: "Документы и сертификаты",
  specsGroupedTitle: "Дополнительные характеристики",
  logisticsTitle: "Логистика",
  openOriginal: "Открыть оригинальное объявление",
  docsEmpty: "Документы пока не добавлены",
  marketsEmpty: "Маркетов нет.",
} as const;

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [eurRubRate, calculatorConfig] = await Promise.all([
    getEurRubRate().catch(() => 100),
    getActiveCalculatorConfig().catch(() => null),
  ]);
  const calculatorSettings = toCalculatorSettings(calculatorConfig);
  const vehicle = await getVehicleBySlug(slug, eurRubRate);
  if (!vehicle) {
    notFound();
  }

  const individual = computeCostBreakdown(vehicle, eurRubRate, "INDIVIDUAL", calculatorSettings);
  const company = computeCostBreakdown(vehicle, eurRubRate, "COMPANY", calculatorSettings);

  const countryNames = vehicle.markets
    .map((market) => COUNTRIES.find((country) => country.code === market.countryCode)?.name ?? market.countryCode)
    .slice(0, 6);

  const specsGrouped = vehicle.specifications.reduce<Record<string, { label: string; value: string }[]>>(
    (acc, spec) => {
      const key = translateSpecGroup(spec.group ?? copy.specsGroupedTitle);
      if (!acc[key]) acc[key] = [];
      acc[key].push({ label: translateSpecLabel(spec.label), value: spec.value });
      return acc;
    },
    {},
  );

  const highlightSpecs = [
    {
      label: "Пробег",
      value: vehicle.mileage
        ? `${formatLocaleNumber(vehicle.mileage)} ${translateMileageUnit(vehicle.mileageUnit)}`
        : "—",
    },
    { label: "Топливо", value: translateFuel(vehicle.fuelType) },
    { label: "Коробка", value: translateTransmission(vehicle.transmission) },
    { label: "Привод", value: translateDrive(vehicle.driveType) },
    {
      label: "Объём двигателя",
      value: vehicle.engineVolumeCc ? `${formatLocaleNumber(vehicle.engineVolumeCc / 1000, 1)} л` : "—",
    },
    { label: "Мощность", value: vehicle.powerHp ? `${vehicle.powerHp} л.с.` : "—" },
  ];

  const documentPreview = vehicle.documents.slice(0, 2);
  const bodyTypeLabel = vehicle.bodyType ? getBodyTypeLabel(vehicle.bodyType) : vehicle.bodyType ?? "-";

  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-16 py-12 text-white">
      <div className="flex items-center mb-4">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {copy.backToCatalog}
        </Link>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <VehicleGallery images={vehicle.gallery} title={vehicle.title} />

          <div className="rounded-[32px] border border-white/10 bg-black/30 p-6 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">Ключевые факты</h3>
              <span className="text-xs uppercase tracking-[0.1em] text-white/45">Быстрый обзор</span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {highlightSpecs.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75"
                >
                  <div className="text-xs uppercase tracking-[0.08em] text-white/40">{item.label}</div>
                  <div className="text-base font-semibold text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-black/30 p-6 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">Рынки и документы</h3>
              <span className="text-xs text-white/50">
                {documentPreview.length ? `${documentPreview.length} файл(а)` : "Документов нет"}
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-[0.08em] text-white/45">Рынки</div>
                <div className="flex flex-wrap gap-2">
                  {countryNames.length ? (
                    countryNames.map((country) => (
                      <Badge key={country} tone="outline">
                        {country}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-white/60">{copy.marketsEmpty}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs uppercase tracking-[0.08em] text-white/45">Документы</div>
                {documentPreview.length ? (
                  <ul className="space-y-2 text-sm text-white/75">
                    {documentPreview.map((doc) => (
                      <li
                        key={doc.id}
                        className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <span className="truncate">{doc.title}</span>
                        <Link
                          href={doc.url}
                          target="_blank"
                          className="flex items-center gap-2 text-white/60 hover:text-white"
                        >
                          <Download className="h-4 w-4" />
                          Скачать
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
                    {copy.docsEmpty}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-[42px] border border-white/10 bg-white/6 p-8">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.1em] text-white/60">
            <Badge tone="outline">{vehicle.brand}</Badge>
            <Badge tone="default">{bodyTypeLabel}</Badge>
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
              ≈ {formatCurrency(vehicle.basePriceEur * eurRubRate, "RUB")} по текущему курсу EUR/RUB
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={vehicle.originalListingUrl ?? "#"}
              className={cn(
                "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-primary px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-brand-primary-strong",
                !vehicle.originalListingUrl && "pointer-events-none opacity-60",
              )}
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

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{copy.specsTitle}</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {vehicle.features.map((feature) => (
            <div key={feature.id} className="rounded-[28px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              {feature.label}
            </div>
          ))}
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
              <div className="text-xs uppercase tracking-[0.1em] text-white/50">{step.etaDays ? `${step.etaDays} дн.` : ""}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function translateFuel(fuel?: string | null) {
  const map: Record<string, string> = {
    petrol: "Бензин",
    gasoline: "Бензин",
    diesel: "Дизель",
    hybrid: "Гибрид",
    electric: "Электро",
    gas: "Газ",
    lpg: "Газ",
    cng: "Газ",
  };
  if (!fuel) return "—";
  const key = fuel.toLowerCase();
  return map[key] ?? fuel;
}

function translateTransmission(transmission?: string | null) {
  const map: Record<string, string> = {
    automatic: "Автомат",
    manual: "Механика",
    cvt: "Вариатор",
    robot: "Робот",
  };
  if (!transmission) return "—";
  const key = transmission.toLowerCase();
  return map[key] ?? transmission;
}

function translateDrive(drive?: string | null) {
  const map: Record<string, string> = {
    awd: "Полный привод",
    "4wd": "Полный привод",
    fwd: "Передний привод",
    rwd: "Задний привод",
  };
  if (!drive) return "—";
  const key = drive.toLowerCase();
  return map[key] ?? drive;
}

function translateMileageUnit(unit?: string | null) {
  if (!unit) return "км";
  const key = unit.toLowerCase();
  if (key === "mi" || key === "mile" || key === "miles") return "миль";
  return "км";
}

function translateSpecGroup(group: string) {
  const map: Record<string, string> = {
    core: "Основное",
    transmission: "Трансмиссия",
    interior: "Интерьер",
    exterior: "Экстерьер",
    safety: "Безопасность",
    comfort: "Комфорт",
    multimedia: "Мультимедиа",
  };
  const key = group.toLowerCase();
  return map[key] ?? group;
}

function translateSpecLabel(label: string) {
  const map: Record<string, string> = {
    engine: "Двигатель",
    power: "Мощность",
    gearbox: "Коробка",
    trim: "Отделка",
  };
  const key = label.toLowerCase();
  return map[key] ?? label;
}
