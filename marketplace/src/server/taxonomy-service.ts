import { asc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import {
  vehicleTaxonomies,
  type VehicleTaxonomy,
  type NewVehicleTaxonomy,
} from "@/db/schema";

export type TaxonomyType =
  | "brand"
  | "model"
  | "bodyType"
  | "fuelType"
  | "transmission"
  | "driveType"
  | "color";

export const TAXONOMY_TYPES: { type: TaxonomyType; label: string }[] = [
  { type: "brand", label: "Бренды" },
  { type: "model", label: "Модели" },
  { type: "bodyType", label: "Типы кузова" },
  { type: "fuelType", label: "Типы топлива" },
  { type: "transmission", label: "Коробки передач" },
  { type: "driveType", label: "Приводы" },
  { type: "color", label: "Цвета" },
];

export async function getTaxonomyByType(type: TaxonomyType): Promise<VehicleTaxonomy[]> {
  try {
    return await db
      .select()
      .from(vehicleTaxonomies)
      .where(eq(vehicleTaxonomies.type, type))
      .orderBy(asc(vehicleTaxonomies.sortOrder), asc(vehicleTaxonomies.label));
  } catch (error) {
    // if table is missing (migration not applied), fail softly so UI still renders
    const code = (error as { code?: string })?.code;
    if (code === "42P01") {
      return [];
    }
    throw error;
  }
}

export async function getTaxonomyMap() {
  let all: VehicleTaxonomy[] = [];
  try {
    all = await db
      .select()
      .from(vehicleTaxonomies)
      .orderBy(asc(vehicleTaxonomies.type), asc(vehicleTaxonomies.sortOrder), asc(vehicleTaxonomies.label));
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (code !== "42P01") {
      throw error;
    }
    // Table missing — return empty map so admin UI still works while migration is pending.
  }

  const map: Record<TaxonomyType, VehicleTaxonomy[]> = {
    brand: [],
    model: [],
    bodyType: [],
    fuelType: [],
    transmission: [],
    driveType: [],
    color: [],
  };

  for (const entry of all) {
    if (entry.type in map) {
      map[entry.type as TaxonomyType].push(entry);
    }
  }
  return map;
}

export async function upsertTaxonomy(entry: Omit<NewVehicleTaxonomy, "id" | "createdAt" | "updatedAt"> & { id?: string }) {
  const payload = {
    type: entry.type,
    value: entry.value,
    label: entry.label,
    parentValue: entry.parentValue ?? null,
    sortOrder: entry.sortOrder ?? 0,
    updatedAt: new Date(),
  };

  if (entry.id) {
    const [updated] = await db
      .update(vehicleTaxonomies)
      .set(payload)
      .where(eq(vehicleTaxonomies.id, entry.id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(vehicleTaxonomies)
    .values({
      ...payload,
      id: entry.id,
    })
    .returning();
  return created;
}

export async function deleteTaxonomy(id: string) {
  await db.delete(vehicleTaxonomies).where(eq(vehicleTaxonomies.id, id));
}
