import { and, desc, eq, gte, inArray, like, lte, or } from "drizzle-orm";
import { db } from "@/db/client";
import {
  vehicles,
  vehicleImages,
  vehicleFeatures,
  vehicleSpecifications,
  vehicleMarkets,
  logisticsMilestones,
  complianceDocuments,
  inquiries,
} from "@/db/schema";
import { CERTIFICATION_COST, DEFAULT_CALCULATOR_SETTINGS, type CalculatorSettings } from "@/lib/calculator";
import { formatCurrency } from "@/lib/utils";
import type { VehicleCardModel } from "@/lib/vehicle-card-model";

export interface VehicleFilter {
  search?: string;
  brand?: string;
  model?: string;
  countries?: string[];
  bodyTypes?: string[];
  fuelTypes?: string[];
  transmissions?: string[];
  colors?: string[];
  minPriceEur?: number;
  maxPriceEur?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  minEngineVolumeCc?: number;
  maxEngineVolumeCc?: number;
  minPowerHp?: number;
  maxPowerHp?: number;
  favorites?: string[];
}

export type VehicleWithRelations = NonNullable<Awaited<ReturnType<typeof getVehicleBySlug>>>;

const toCents = (value?: number | null) => (value ?? 0) * 100;

export function computeRubFromEur(eurCents: number, rateRubPerEur: number) {
  return Math.round((eurCents / 100) * rateRubPerEur) * 100;
}

export async function getFeaturedVehicles(limit = 6) {
  const rows = await db.query.vehicles.findMany({
    where: eq(vehicles.status, "published"),
    limit,
    orderBy: desc(vehicles.createdAt),
    with: {
      images: {
        orderBy: (fields, { asc }) => asc(fields.sortOrder),
      },
      features: true,
      specifications: true,
      markets: true,
    },
  });

  return rows.map(transformVehicle);
}

export async function getVehicles(filter: VehicleFilter = {}) {
  const expressions = [eq(vehicles.status, "published")];

  if (filter.search) {
    const pattern = `%${filter.search.toLowerCase()}%`;
    const searchExpression = or(
      like(vehicles.brand, pattern),
      like(vehicles.model, pattern),
      like(vehicles.title, pattern),
    );
    if (searchExpression) {
      expressions.push(searchExpression);
    }
  }

  if (filter.brand) {
    expressions.push(eq(vehicles.brand, filter.brand));
  }

  if (filter.model) {
    expressions.push(eq(vehicles.model, filter.model));
  }

  if (filter.countries?.length) {
    expressions.push(inArray(vehicles.country, filter.countries));
  }

  if (filter.bodyTypes?.length) {
    expressions.push(inArray(vehicles.bodyType, filter.bodyTypes));
  }

  if (filter.fuelTypes?.length) {
    expressions.push(inArray(vehicles.fuelType, filter.fuelTypes));
  }

  if (filter.transmissions?.length) {
    expressions.push(inArray(vehicles.transmission, filter.transmissions));
  }

  if (filter.colors?.length) {
    expressions.push(inArray(vehicles.color, filter.colors));
  }

  if (filter.minPriceEur) {
    expressions.push(gte(vehicles.basePriceEurCents, toCents(filter.minPriceEur)));
  }

  if (filter.maxPriceEur) {
    expressions.push(lte(vehicles.basePriceEurCents, toCents(filter.maxPriceEur)));
  }

  if (filter.minYear) {
    expressions.push(gte(vehicles.year, filter.minYear));
  }

  if (filter.maxYear) {
    expressions.push(lte(vehicles.year, filter.maxYear));
  }

  if (filter.minMileage) {
    expressions.push(gte(vehicles.mileage, filter.minMileage));
  }

  if (filter.maxMileage) {
    expressions.push(lte(vehicles.mileage, filter.maxMileage));
  }

  if (filter.minEngineVolumeCc) {
    expressions.push(gte(vehicles.engineVolumeCc, filter.minEngineVolumeCc));
  }

  if (filter.maxEngineVolumeCc) {
    expressions.push(lte(vehicles.engineVolumeCc, filter.maxEngineVolumeCc));
  }

  if (filter.minPowerHp) {
    expressions.push(gte(vehicles.powerHp, filter.minPowerHp));
  }

  if (filter.maxPowerHp) {
    expressions.push(lte(vehicles.powerHp, filter.maxPowerHp));
  }

  const rows = await db.query.vehicles.findMany({
    where: and(...expressions),
    orderBy: desc(vehicles.createdAt),
    with: {
      images: {
        orderBy: (fields, { asc }) => asc(fields.sortOrder),
      },
      features: true,
      specifications: true,
      markets: true,
    },
  });

  let mapped = rows.map(transformVehicle);

  if (filter.favorites?.length) {
    mapped = mapped.map((item) => ({
      ...item,
      isFavorite: filter.favorites!.includes(item.id),
    }));
  }

  return mapped;
}

export async function getVehicleBySlug(slug: string | string[] | null | undefined, eurRubRate = 100) {
  const normalizedSlug = Array.isArray(slug) ? slug[0] : slug;
  const trimmedSlug = normalizedSlug?.trim();
  if (!trimmedSlug) {
    return null;
  }

  const isExternal = trimmedSlug.startsWith("ext-") && trimmedSlug.includes("__");
  if (isExternal) {
    return null;
  }

  const row = await db.query.vehicles.findFirst({
    where: eq(vehicles.slug, trimmedSlug),
    with: {
      images: {
        orderBy: (fields, { asc }) => asc(fields.sortOrder),
      },
      features: true,
      specifications: {
        orderBy: (fields, { asc }) => asc(fields.sortOrder),
      },
      markets: true,
      logistics: {
        orderBy: (fields, { asc }) => asc(fields.sortOrder),
      },
      documents: true,
    },
  });

  if (!row) {
    return null;
  }

  return transformVehicle(row);
}

export async function getVehicleById(id: string) {
  const row = await db.query.vehicles.findFirst({
    where: eq(vehicles.id, id),
    with: {
      images: {
        orderBy: (fields, { asc }) => asc(fields.sortOrder),
      },
      features: true,
      specifications: {
        orderBy: (fields, { asc }) => asc(fields.sortOrder),
      },
      markets: true,
      logistics: {
        orderBy: (fields, { asc }) => asc(fields.sortOrder),
      },
      documents: true,
    },
  });

  if (!row) return null;

  return transformVehicle(row);
}

export function computeCostBreakdown(
  vehicle: ReturnType<typeof transformVehicle>,
  rateRubPerEur: number,
  customerType: "INDIVIDUAL" | "COMPANY" = "INDIVIDUAL",
  calculatorSettings: CalculatorSettings = DEFAULT_CALCULATOR_SETTINGS,
) {
  const settings =
    calculatorSettings && calculatorSettings.applyToVehicles === false
      ? DEFAULT_CALCULATOR_SETTINGS
      : calculatorSettings ?? DEFAULT_CALCULATOR_SETTINGS;

  const baseRub = Math.round((vehicle.basePriceEur * rateRubPerEur) / 100) * 100;
  const vatBps = vehicle.vatRateBps ?? Math.round(settings.vatPercent * 100);
  const customsBps = vehicle.customsDutyBps ?? Math.round(settings.dutyPercent * 100);
  const servicePercent =
    customerType === "COMPANY" ? settings.serviceFeeCompanyPercent : settings.serviceFeeIndividualPercent;

  const vat = Math.round((baseRub * vatBps) / 10000);
  const customs = Math.round((baseRub * customsBps) / 10000);
  const insurance = Math.round((baseRub * settings.insurancePercent) / 100);
  const service = Math.round((baseRub * servicePercent) / 100);
  const broker = settings.brokerBaseCost;
  const documents = settings.documentPackageCost + CERTIFICATION_COST;

  const total = baseRub + vat + customs + insurance + service + broker + documents;

  return {
    baseRub,
    vat,
    customs,
    insurance,
    service,
    broker,
    documents,
    total,
    formatted: {
      baseRub: formatCurrency(baseRub, "RUB"),
      vat: formatCurrency(vat, "RUB"),
      customs: formatCurrency(customs, "RUB"),
      insurance: formatCurrency(insurance, "RUB"),
      service: formatCurrency(service, "RUB"),
      broker: formatCurrency(broker, "RUB"),
      documents: formatCurrency(documents, "RUB"),
      total: formatCurrency(total, "RUB"),
    },
  };
}

function transformVehicle(row: typeof vehicles.$inferSelect & {
  images: typeof vehicleImages.$inferSelect[];
  features: typeof vehicleFeatures.$inferSelect[];
  specifications: typeof vehicleSpecifications.$inferSelect[];
  markets: typeof vehicleMarkets.$inferSelect[];
  logistics?: typeof logisticsMilestones.$inferSelect[];
  documents?: typeof complianceDocuments.$inferSelect[];
}) {
  const primaryImage = row.images.find((img) => Boolean(img.isPrimary)) ?? row.images[0];

  return {
    ...row,
    basePriceEur: row.basePriceEurCents / 100,
    basePriceRub: row.basePriceRubCents ? row.basePriceRubCents / 100 : null,
    primaryImage,
    gallery: row.images,
    features: row.features.sort((a, b) => a.sortOrder - b.sortOrder),
    specifications: row.specifications.sort((a, b) => a.sortOrder - b.sortOrder),
    markets: row.markets,
    logistics: row.logistics?.sort((a, b) => a.sortOrder - b.sortOrder) ?? [],
    documents: row.documents ?? [],
  };
}

export async function recordInquiry(data: {
  vehicleId?: string;
  customerType: "INDIVIDUAL" | "COMPANY";
  name: string;
  email: string;
  phone?: string;
  message?: string;
  estimatedCostRub?: number;
  payload?: string;
}) {
  const result = await db
    .insert(inquiries)
    .values({
      vehicleId: data.vehicleId,
      customerType: data.customerType.toLowerCase(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      estimatedCostCents: data.estimatedCostRub ? Math.round(data.estimatedCostRub) : null,
      payload: data.payload,
    })
    .returning({ insertedId: inquiries.id });

  return result[0]?.insertedId;
}

export async function getCatalogVehicles(
  filter: VehicleFilter = {},
  eurRubRate = 100,
): Promise<{ items: VehicleCardModel[]; total: number }> {
  const manualVehicles = await getVehicles(filter);
  const manualItems = manualVehicles.map(mapInternalVehicleToCardModel);
  return { items: manualItems, total: manualItems.length };
}

function mapInternalVehicleToCardModel(vehicle: ReturnType<typeof transformVehicle>): VehicleCardModel {
  return {
    id: vehicle.id,
    slug: vehicle.slug,
    title: vehicle.title,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    bodyType: vehicle.bodyType,
    mileage: vehicle.mileage ?? 0,
    mileageUnit: vehicle.mileageUnit,
    fuelType: vehicle.fuelType,
    transmission: vehicle.transmission,
    country: vehicle.country,
    shortDescription: vehicle.shortDescription,
    basePriceEur: vehicle.basePriceEur,
    basePriceRub: vehicle.basePriceRub,
    primaryImage: vehicle.primaryImage ?? null,
    gallery: vehicle.gallery ?? [],
    engineVolumeCc: vehicle.engineVolumeCc,
    powerHp: vehicle.powerHp,
    color: vehicle.color,
  };
}
