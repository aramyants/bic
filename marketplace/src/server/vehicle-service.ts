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
import { formatCurrency } from "@/lib/utils";

export interface VehicleFilter {
  search?: string;
  countries?: string[];
  bodyTypes?: string[];
  fuelTypes?: string[];
  transmission?: string[];
  minPriceEur?: number;
  maxPriceEur?: number;
  favorites?: string[];
}

export type VehicleWithRelations = NonNullable<Awaited<ReturnType<typeof getVehicleBySlug>>>;

const BASE_LOGISTICS = {
  insuranceBps: 120,
  serviceFeeBpsIndividual: 90,
  serviceFeeBpsCompany: 120,
  documentPackage: 45000,
  customsBroker: 35000,
  certification: 28000,
};

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
    expressions.push(
      or(
        like(vehicles.brand, pattern),
        like(vehicles.model, pattern),
        like(vehicles.title, pattern),
      ),
    );
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

  if (filter.transmission?.length) {
    expressions.push(inArray(vehicles.transmission, filter.transmission));
  }

  if (filter.minPriceEur) {
    expressions.push(gte(vehicles.basePriceEurCents, toCents(filter.minPriceEur)));
  }

  if (filter.maxPriceEur) {
    expressions.push(lte(vehicles.basePriceEurCents, toCents(filter.maxPriceEur)));
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

export async function getVehicleBySlug(slug: string) {
  const row = await db.query.vehicles.findFirst({
    where: eq(vehicles.slug, slug),
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

export function computeCostBreakdown(
  vehicle: ReturnType<typeof transformVehicle>,
  rateRubPerEur: number,
  customerType: "INDIVIDUAL" | "COMPANY" = "INDIVIDUAL",
) {
  const baseRub = Math.round((vehicle.basePriceEur * rateRubPerEur) / 100) * 100;
  const vatBps = vehicle.vatRateBps ?? (customerType === "COMPANY" ? 2000 : 0);
  const customsBps = vehicle.customsDutyBps ?? 1500;
  const serviceBps =
    customerType === "COMPANY" ? BASE_LOGISTICS.serviceFeeBpsCompany : BASE_LOGISTICS.serviceFeeBpsIndividual;

  const vat = Math.round((baseRub * vatBps) / 10000);
  const customs = Math.round((baseRub * customsBps) / 10000);
  const insurance = Math.round((baseRub * BASE_LOGISTICS.insuranceBps) / 10000);
  const service = Math.round((baseRub * serviceBps) / 10000);
  const broker = BASE_LOGISTICS.customsBroker;
  const documents = BASE_LOGISTICS.documentPackage + BASE_LOGISTICS.certification;

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

  return row ? transformVehicle(row) : null;
}
