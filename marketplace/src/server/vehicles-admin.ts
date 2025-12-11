"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

import { db } from "@/db/client";
import {
  vehicles,
  vehicleImages,
  vehicleFeatures,
  vehicleSpecifications,
  vehicleMarkets,
  logisticsMilestones,
  complianceDocuments,
} from "@/db/schema";
import { slugify } from "@/lib/utils";
import { requireAdmin } from "@/server/auth";
import { getVehicleById } from "@/server/vehicle-service";
import { postVehicleToChannel } from "@/server/telegram";

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    }
    return value;
  }, schema);

const optionalText = () => emptyToUndefined(z.string().optional());
const optionalUrl = () => emptyToUndefined(z.string().url().optional());
const optionalInt = () =>
  z.preprocess((value) => {
    if (typeof value === "string" && value.trim().length === 0) {
      return undefined;
    }
    return value;
  }, z.coerce.number().int().nonnegative().optional());

const vehicleSchema = z.object({
  title: z.string().trim().min(3),
  brand: z.string().trim().min(2),
  model: z.string().trim().min(1),
  bodyType: optionalText(),
  year: z.coerce.number().int().min(1980).max(new Date().getFullYear() + 1),
  mileage: optionalInt(),
  mileageUnit: z.string().trim().default("km"),
  priceEur: z.coerce.number().positive(),
  country: z.string().trim().min(2),
  city: optionalText(),
  fuelType: optionalText(),
  transmission: optionalText(),
  driveType: optionalText(),
  engineVolumeCc: optionalInt(),
  powerHp: optionalInt(),
  color: optionalText(),
  shortDescription: optionalText(),
  originalListingUrl: optionalUrl(),
  thumbnailUrl: optionalUrl(),
  features: optionalText(),
  gallery: optionalText(),
  specs: optionalText(),
  markets: optionalText(),
  logistics: optionalText(),
  documents: optionalText(),
});

const parseList = (value?: string | null) =>
  value
    ?.split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean) ?? [];

const parseKeyValueList = (value?: string | null) =>
  parseList(value).map((line) => {
    const [key, ...rest] = line.split(":");
    return { label: key.trim(), value: rest.join(":").trim() };
  });

const parseMarkets = (value?: string | null) =>
  value
    ?.split(/[,\s]+/)
    .map((item) => item.toUpperCase())
    .filter(Boolean) ?? [];

const parseLogistics = (value?: string | null) =>
  parseList(value).map((line) => {
    const [label, description = "", eta = ""] = line.split("|");
    return {
      label: label.trim(),
      description: description.trim(),
      etaDays: Number.parseInt(eta.trim(), 10) || null,
    };
  });

const parseDocuments = (value?: string | null) =>
  parseList(value).map((line) => {
    const [title, url] = line.split("|");
    return { title: (title?.trim() ?? "") || "Документ", url: url?.trim() ?? "" };
  });

export type VehicleActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

async function ensureUniqueSlug(base: string) {
  let candidate = base;
  let counter = 1;
  while (true) {
    const existing = await db.query.vehicles.findFirst({ where: eq(vehicles.slug, candidate) });
    if (!existing) {
      return candidate;
    }
    counter += 1;
    candidate = `${base}-${counter}`;
  }
}

export async function createVehicleAction(
  _prevState: VehicleActionState | undefined,
  formData: FormData,
): Promise<VehicleActionState> {
  await requireAdmin();
  const parsedResult = vehicleSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsedResult.success) {
    return {
      status: "error",
      message: "Проверьте заполненные поля и попробуйте снова.",
    };
  }

  const parsed = parsedResult.data;
  const vehicleId = crypto.randomUUID();
  const slugBase = slugify(`${parsed.brand}-${parsed.model}-${parsed.year}`);

  try {
    const slug = await ensureUniqueSlug(slugBase);
    const priceCents = Math.round(parsed.priceEur * 100);

    const vehicleInsert: typeof vehicles.$inferInsert = {
      id: vehicleId,
      slug,
      title: parsed.title,
      brand: parsed.brand,
      model: parsed.model,
      bodyType: parsed.bodyType ?? null,
      year: parsed.year,
      mileage: parsed.mileage ?? null,
      mileageUnit: (parsed.mileageUnit || "km") as "km" | "mi",
      basePriceEurCents: priceCents,
      country: parsed.country,
      city: parsed.city ?? null,
      fuelType: parsed.fuelType ?? null,
      transmission: parsed.transmission ?? null,
      driveType: parsed.driveType ?? null,
      engineVolumeCc: parsed.engineVolumeCc ?? null,
      powerHp: parsed.powerHp ?? null,
      color: parsed.color ?? null,
      shortDescription: parsed.shortDescription ?? null,
      originalListingUrl: parsed.originalListingUrl ?? null,
      thumbnailUrl: parsed.thumbnailUrl ?? null,
      status: "published",
    };

    await db.transaction(async (tx) => {
      await tx.insert(vehicles).values(vehicleInsert);

      const images = parseList(parsed.gallery);
      for (const [index, url] of images.entries()) {
        await tx.insert(vehicleImages).values({
          vehicleId,
          url,
          isPrimary: index === 0,
          sortOrder: index,
        });
      }

      const features = parseList(parsed.features);
      for (const [index, label] of features.entries()) {
        await tx.insert(vehicleFeatures).values({
          vehicleId,
          label,
          sortOrder: index,
        });
      }

      const specs = parseKeyValueList(parsed.specs);
      for (const [index, spec] of specs.entries()) {
        await tx.insert(vehicleSpecifications).values({
          vehicleId,
          group: "general",
          label: spec.label,
          value: spec.value,
          sortOrder: index,
        });
      }

      const markets = parseMarkets(parsed.markets);
      for (const country of markets) {
        await tx.insert(vehicleMarkets).values({ vehicleId, countryCode: country });
      }

      const steps = parseLogistics(parsed.logistics);
      for (const [index, step] of steps.entries()) {
        await tx.insert(logisticsMilestones).values({
          vehicleId,
          label: step.label,
          description: step.description || null,
          etaDays: step.etaDays ?? undefined,
          sortOrder: index,
        });
      }

      const documents = parseDocuments(parsed.documents);
      for (const doc of documents) {
        await tx.insert(complianceDocuments).values({
          vehicleId,
          title: doc.title,
          url: doc.url,
        });
      }
    });
  } catch (error) {
    console.error("[vehicles-admin] failed to create vehicle", error);
    return {
      status: "error",
      message: "Не удалось сохранить автомобиль. Попробуйте ещё раз.",
    };
  }

  revalidatePath("/catalog");
  revalidatePath("/admin");

  try {
    const createdVehicle = await getVehicleById(vehicleId);
    if (createdVehicle) {
      await postVehicleToChannel(createdVehicle);
    }
  } catch (error) {
    console.error("[vehicles-admin] failed to push vehicle to Telegram", error);
  }

  return {
    status: "success",
    message: "Автомобиль создан.",
  };
}

export async function updateVehicleAction(
  _prevState: VehicleActionState | undefined,
  formData: FormData,
): Promise<VehicleActionState> {
  await requireAdmin();
  const idValue = formData.get("id");
  const id = typeof idValue === "string" ? idValue : "";
  if (!id) {
    return {
      status: "error",
      message: "Не указан идентификатор автомобиля.",
    };
  }

  const parsedResult = vehicleSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsedResult.success) {
    return {
      status: "error",
      message: "Проверьте заполненные поля и попробуйте снова.",
    };
  }

  const existing = await db.query.vehicles.findFirst({ where: eq(vehicles.id, id) });
  if (!existing) {
    return {
      status: "error",
      message: "Автомобиль не найден — возможно, он удалён.",
    };
  }

  const parsed = parsedResult.data;

  try {
    const priceCents = Math.round(parsed.priceEur * 100);

    await db.transaction(async (tx) => {
      await tx
        .update(vehicles)
        .set({
          title: parsed.title,
          brand: parsed.brand,
          model: parsed.model,
          bodyType: parsed.bodyType ?? null,
          year: parsed.year,
          mileage: parsed.mileage ?? null,
          mileageUnit: (parsed.mileageUnit || "km") as "km" | "mi",
          basePriceEurCents: priceCents,
          country: parsed.country,
          city: parsed.city ?? null,
          fuelType: parsed.fuelType ?? null,
          transmission: parsed.transmission ?? null,
          driveType: parsed.driveType ?? null,
          engineVolumeCc: parsed.engineVolumeCc ?? null,
          powerHp: parsed.powerHp ?? null,
          color: parsed.color ?? null,
          shortDescription: parsed.shortDescription ?? null,
          originalListingUrl: parsed.originalListingUrl ?? null,
          thumbnailUrl: parsed.thumbnailUrl ?? null,
          status: existing.status ?? "published",
        })
        .where(eq(vehicles.id, id));

      await tx.delete(vehicleImages).where(eq(vehicleImages.vehicleId, id));
      await tx.delete(vehicleFeatures).where(eq(vehicleFeatures.vehicleId, id));
      await tx.delete(vehicleSpecifications).where(eq(vehicleSpecifications.vehicleId, id));
      await tx.delete(vehicleMarkets).where(eq(vehicleMarkets.vehicleId, id));
      await tx.delete(logisticsMilestones).where(eq(logisticsMilestones.vehicleId, id));
      await tx.delete(complianceDocuments).where(eq(complianceDocuments.vehicleId, id));

      const images = parseList(parsed.gallery);
      for (const [index, url] of images.entries()) {
        await tx.insert(vehicleImages).values({
          vehicleId: id,
          url,
          isPrimary: index === 0,
          sortOrder: index,
        });
      }

      const features = parseList(parsed.features);
      for (const [index, label] of features.entries()) {
        await tx.insert(vehicleFeatures).values({ vehicleId: id, label, sortOrder: index });
      }

      const specs = parseKeyValueList(parsed.specs);
      for (const [index, spec] of specs.entries()) {
        await tx.insert(vehicleSpecifications).values({
          vehicleId: id,
          group: "general",
          label: spec.label,
          value: spec.value,
          sortOrder: index,
        });
      }

      const markets = parseMarkets(parsed.markets);
      for (const country of markets) {
        await tx.insert(vehicleMarkets).values({ vehicleId: id, countryCode: country });
      }

      const steps = parseLogistics(parsed.logistics);
      for (const [index, step] of steps.entries()) {
        await tx.insert(logisticsMilestones).values({
          vehicleId: id,
          label: step.label,
          description: step.description || null,
          etaDays: step.etaDays ?? undefined,
          sortOrder: index,
        });
      }

      const documents = parseDocuments(parsed.documents);
      for (const doc of documents) {
        await tx.insert(complianceDocuments).values({
          vehicleId: id,
          title: doc.title,
          url: doc.url,
        });
      }
    });
  } catch (error) {
    console.error("[vehicles-admin] failed to update vehicle", error);
    return {
      status: "error",
      message: "Не удалось сохранить изменения. Попробуйте ещё раз.",
    };
  }

  revalidatePath("/catalog");
  revalidatePath(`/catalog/${existing.slug}`);
  revalidatePath("/admin");

  return {
    status: "success",
    message: "Автомобиль обновлён.",
  };
}

export async function deleteVehicleAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const existing = await db.query.vehicles.findFirst({ where: eq(vehicles.id, id) });
  if (!existing) {
    return;
  }
  await db.delete(vehicles).where(eq(vehicles.id, id));
  revalidatePath("/catalog");
  revalidatePath("/admin");
  revalidatePath(`/catalog/${existing.slug}`);
  redirect("/admin/vehicles");
}
