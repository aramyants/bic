"use server";

import { revalidatePath } from "next/cache";
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

const emptyToUndefined = <T, Def extends z.ZodTypeDef, Input>(
  schema: z.ZodType<T, Def, Input>,
) =>
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
    return { title: (title?.trim() ?? "") || "Document", url: url?.trim() ?? "" };
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
      message: "Проверьте заполненные поля и повторите попытку.",
    };
  }

  const parsed = parsedResult.data;
  const vehicleId = crypto.randomUUID();
  const slugBase = slugify(`${parsed.brand}-${parsed.model}-${parsed.year}`);

  try {
    const slug = await ensureUniqueSlug(slugBase);
    const priceCents = Math.round(parsed.priceEur * 100);

    db.transaction((tx) => {
      tx
        .insert(vehicles)
        .values({
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
          shortDescription: parsed.shortDescription ?? null,
          originalListingUrl: parsed.originalListingUrl ?? null,
          thumbnailUrl: parsed.thumbnailUrl ?? null,
        })
        .run();

      const images = parseList(parsed.gallery);
      for (const [index, url] of images.entries()) {
        tx
          .insert(vehicleImages)
          .values({
            vehicleId,
            url,
            isPrimary: index === 0 ? 1 : 0,
            sortOrder: index,
          })
          .run();
      }

      const features = parseList(parsed.features);
      for (const [index, label] of features.entries()) {
        tx
          .insert(vehicleFeatures)
          .values({
            vehicleId,
            label,
            sortOrder: index,
          })
          .run();
      }

      const specs = parseKeyValueList(parsed.specs);
      for (const [index, spec] of specs.entries()) {
        tx
          .insert(vehicleSpecifications)
          .values({
            vehicleId,
            group: "general",
            label: spec.label,
            value: spec.value,
            sortOrder: index,
          })
          .run();
      }

      const markets = parseMarkets(parsed.markets);
      for (const country of markets) {
        tx
          .insert(vehicleMarkets)
          .values({ vehicleId, countryCode: country })
          .run();
      }

      const steps = parseLogistics(parsed.logistics);
      for (const [index, step] of steps.entries()) {
        tx
          .insert(logisticsMilestones)
          .values({
            vehicleId,
            label: step.label,
            description: step.description || null,
            etaDays: step.etaDays ?? undefined,
            sortOrder: index,
          })
          .run();
      }

      const documents = parseDocuments(parsed.documents);
      for (const doc of documents) {
        tx
          .insert(complianceDocuments)
          .values({
            vehicleId,
            title: doc.title,
            url: doc.url,
          })
          .run();
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

  return {
    status: "success",
    message: "Автомобиль успешно создан.",
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
      message: "Проверьте заполненные поля и повторите попытку.",
    };
  }

  const existing = await db.query.vehicles.findFirst({ where: eq(vehicles.id, id) });
  if (!existing) {
    return {
      status: "error",
      message: "Автомобиль не найден — возможно, он уже удалён.",
    };
  }

  const parsed = parsedResult.data;

  try {
    const priceCents = Math.round(parsed.priceEur * 100);

    db.transaction((tx) => {
      tx
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
          shortDescription: parsed.shortDescription ?? null,
          originalListingUrl: parsed.originalListingUrl ?? null,
          thumbnailUrl: parsed.thumbnailUrl ?? null,
        })
        .where(eq(vehicles.id, id))
        .run();

      tx.delete(vehicleImages).where(eq(vehicleImages.vehicleId, id)).run();
      tx.delete(vehicleFeatures).where(eq(vehicleFeatures.vehicleId, id)).run();
      tx.delete(vehicleSpecifications).where(eq(vehicleSpecifications.vehicleId, id)).run();
      tx.delete(vehicleMarkets).where(eq(vehicleMarkets.vehicleId, id)).run();
      tx.delete(logisticsMilestones).where(eq(logisticsMilestones.vehicleId, id)).run();
      tx.delete(complianceDocuments).where(eq(complianceDocuments.vehicleId, id)).run();

      const images = parseList(parsed.gallery);
      for (const [index, url] of images.entries()) {
        tx
          .insert(vehicleImages)
          .values({
            vehicleId: id,
            url,
            isPrimary: index === 0 ? 1 : 0,
            sortOrder: index,
          })
          .run();
      }

      const features = parseList(parsed.features);
      for (const [index, label] of features.entries()) {
        tx
          .insert(vehicleFeatures)
          .values({ vehicleId: id, label, sortOrder: index })
          .run();
      }

      const specs = parseKeyValueList(parsed.specs);
      for (const [index, spec] of specs.entries()) {
        tx
          .insert(vehicleSpecifications)
          .values({
            vehicleId: id,
            group: "general",
            label: spec.label,
            value: spec.value,
            sortOrder: index,
          })
          .run();
      }

      const markets = parseMarkets(parsed.markets);
      for (const country of markets) {
        tx
          .insert(vehicleMarkets)
          .values({ vehicleId: id, countryCode: country })
          .run();
      }

      const steps = parseLogistics(parsed.logistics);
      for (const [index, step] of steps.entries()) {
        tx
          .insert(logisticsMilestones)
          .values({
            vehicleId: id,
            label: step.label,
            description: step.description || null,
            etaDays: step.etaDays ?? undefined,
            sortOrder: index,
          })
          .run();
      }

      const documents = parseDocuments(parsed.documents);
      for (const doc of documents) {
        tx
          .insert(complianceDocuments)
          .values({
            vehicleId: id,
            title: doc.title,
            url: doc.url,
          })
          .run();
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
    message: "Автомобиль успешно обновлён.",
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
}
