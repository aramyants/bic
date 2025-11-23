'use server';

import { db } from "@/db/client";
import { externalVehicleSources, type ExternalVehicleSource } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface ExternalVehicle {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  base_price_rub?: number | null;
  mileage?: number | null;
  fuel_type?: string | null;
  transmission?: string | null;
  body_type?: string | null;
  color?: string | null;
  engine_volume?: number | null;
  power?: number | null;
  image?: string | null;
  images?: string[];
  drive_type?: string | null;
  description?: string | null;
  location?: string | null;
  source: string;
  external_id: string;
  source_priority: number;
  detailUrl?: string | null;
  link?: string | null;
  main_photo?: string | number | null;
}

const FALLBACK_SOURCES: ExternalVehicleSource[] = [
  {
    id: "fallback-mobile",
    name: "Mobile.de",
    apiUrl: "https://mobile-plutosauto.ru/api/cars",
    isActive: true,
    priority: 1,
    lastSyncAt: null,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
  {
    id: "fallback-encar",
    name: "Encar",
    apiUrl: "https://encar.tewris.com/api/cars",
    isActive: true,
    priority: 2,
    lastSyncAt: null,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
];

const toSlug = (value: string) =>
  (value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export async function getActiveExternalSources(): Promise<ExternalVehicleSource[]> {
  try {
    const result = await db
      .select()
      .from(externalVehicleSources)
      .where(eq(externalVehicleSources.isActive, true))
      .orderBy(externalVehicleSources.priority);

    if (result.length === 0) return FALLBACK_SOURCES;

    return result;
  } catch {
    // таблицы может не быть — используем fallback
    return FALLBACK_SOURCES;
  }
}

export async function fetchExternalVehicles(page = 1, perPage = 30): Promise<ExternalVehicle[]> {
  const sources = await getActiveExternalSources();
  const all: ExternalVehicle[] = [];

  for (const source of sources) {
    try {
      const url = `${source.apiUrl}?page=${page}&per_page=${perPage}`;
      const res = await fetch(url, { headers: { "Content-Type": "application/json" }, next: { revalidate: 3600 } });
      if (!res.ok) continue;
      const data = await res.json();
      const normalized = normalizeExternalVehicles(data, source);
      all.push(...normalized);
    } catch (error) {
      console.error("[external-vehicles] list fetch failed", error);
    }
  }

  return all;
}

export async function fetchExternalVehicleDetail(slug: string): Promise<ExternalVehicle | null> {
  const match = slug.match(/^ext-([^_]+)__([\w-]+)$/);
  if (!match) return null;
  const [, sourceSlug, externalId] = match;
  const sources = await getActiveExternalSources();
  const source =
    sources.find((src) => toSlug(src.name) === sourceSlug || toSlug(src.id) === sourceSlug) ?? sources[0];
  if (!source) return null;

  try {
    const res = await fetch(`${source.apiUrl}/${externalId}`, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    const detail = await res.json();
    return normalizeExternalVehicleDetail(detail, source, externalId);
  } catch (error) {
    console.error("[external-vehicles] detail fetch failed", error);
    return null;
  }
}

function normalizeExternalVehicleDetail(
  detail: any,
  source: ExternalVehicleSource,
  externalId: string,
): ExternalVehicle {
  const parseName = (full?: string) => {
    if (!full) return { brand: "", model: "" };
    const parts = full.split(" ");
    const brand = parts.shift() ?? "";
    const model = parts.join(" ").trim();
    return { brand, model };
  };

  const parsed = parseName(detail.full_name_eng);
  const brand = detail.brand || detail.make || parsed.brand || "";
  const model = detail.model || parsed.model || "";
  const title = detail.title || detail.full_name_eng || `${brand} ${model}`.trim();
  const priceRub =
    detail?.prices?.price_base_ru ??
    detail?.prices?.price_base ??
    detail.price_final ??
    detail.price ??
    detail.base_price_rub ??
    0;

  const images = extractImageUrls(detail);

  return {
    id: `${toSlug(source.name)}-${externalId}`,
    source: source.name,
    source_priority: source.priority,
    external_id: externalId,
    title,
    brand,
    model,
    year: detail.year ? Number(detail.year) : new Date().getFullYear(),
    price: Number(priceRub),
    base_price_rub: Number(priceRub),
    mileage: detail.mileage ?? null,
    fuel_type: detail.fuel_type_en ?? detail.fuel_type ?? null,
    transmission: detail.transmission_en ?? detail.transmission ?? null,
    body_type: detail.body_type ?? null,
    color: detail.color ?? null,
    engine_volume: detail.engine ?? null,
    power: detail.power ?? null,
    drive_type: detail.drive_type ?? null,
    description: detail.description ?? null,
    location: detail.location ?? null,
    detailUrl: detail.link ?? null,
    link: detail.link ?? null,
    image: images[0] ?? null,
    images,
    main_photo: detail.main_photo ?? null,
  };
}

function normalizeExternalVehicles(data: any, source: ExternalVehicleSource): ExternalVehicle[] {
  const vehicles = Array.isArray(data) ? data : data.data || data.cars || [];
  const baseUrl = source.apiUrl.split("?")[0];
  const publicBase = baseUrl.includes("/api/") ? baseUrl.replace("/api", "").replace(/\/$/, "") : baseUrl.replace(/\/$/, "");

  const parseName = (full?: string) => {
    if (!full) return { brand: "", model: "" };
    const parts = full.split(" ");
    const brand = parts.shift() ?? "";
    const model = parts.join(" ").trim();
    return { brand, model };
  };

  const sourceSlug = toSlug(source.name);

  return vehicles.map((vehicle: any) => {
    const parsedName = parseName(vehicle.full_name_eng);
    const brand = vehicle.brand || vehicle.make || parsedName.brand || "";
    const model = vehicle.model || parsedName.model || "";
    const title = vehicle.title || vehicle.full_name_eng || `${brand} ${model}`.trim();
    const externalId = String(vehicle.id || vehicle._id);
    const detailUrl = vehicle.link || `${publicBase.replace(/\/cars$/, "")}/cars/${externalId}`;

    return {
      id: `${sourceSlug}-${externalId}`,
      title,
      brand,
      model,
      year: Number(vehicle.year || new Date().getFullYear()),
      price: Number.parseFloat(vehicle.price_final ?? vehicle.price ?? vehicle.cost ?? "0"),
      mileage: vehicle.mileage || vehicle.odometer,
      fuel_type: vehicle.fuel_type || vehicle.fuelType || vehicle.fuel,
      transmission: vehicle.transmission || vehicle.gearbox,
      body_type: vehicle.body_type || vehicle.bodyType,
      color: vehicle.color || vehicle.exterior_color,
      engine_volume: vehicle.engine_volume || vehicle.engineVolume || vehicle.displacement || vehicle.engine || null,
      power: vehicle.power || vehicle.horsepower || vehicle.hp || vehicle.horse_power || null,
      drive_type: vehicle.drive_type || vehicle.driveType || null,
      image: vehicle.image || vehicle.thumbnail || vehicle.main_image || null,
      images: vehicle.images || (vehicle.image ? [vehicle.image] : []),
      description: vehicle.description || vehicle.details,
      location: vehicle.location || vehicle.city || source.name,
      source: source.name,
      external_id: externalId,
      source_priority: source.priority,
      detailUrl,
      link: vehicle.link || null,
      main_photo: vehicle.main_photo ?? null,
    };
  });
}

function extractImageUrls(detail: any): string[] {
  const urls: string[] = [];
  const lists = [detail.images, detail.photos, detail.gallery, detail.media];
  for (const list of lists) {
    if (Array.isArray(list)) {
      for (const item of list) {
        if (typeof item === "string" && item.startsWith("http")) urls.push(item);
        if (item && typeof item.url === "string" && item.url.startsWith("http")) urls.push(item.url);
      }
    }
  }
  if (typeof detail.main_photo === "string" && detail.main_photo.startsWith("http")) {
    urls.unshift(detail.main_photo);
  }
  return Array.from(new Set(urls));
}

export async function getAllExternalSources(): Promise<ExternalVehicleSource[]> {
  const result = await db.select().from(externalVehicleSources).orderBy(externalVehicleSources.priority);
  return result;
}

export async function updateExternalSource(id: string, data: Partial<ExternalVehicleSource>): Promise<void> {
  await db
    .update(externalVehicleSources)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(externalVehicleSources.id, id));
}
