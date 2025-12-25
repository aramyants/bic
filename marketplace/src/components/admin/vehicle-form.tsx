"use client";

import { forwardRef, useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

import {
  BODY_TYPES,
  BODY_TYPE_LABELS,
  COUNTRIES,
  COLORS,
  COLOR_LABELS,
  FUEL_TYPES,
  FUEL_TYPE_LABELS,
  DRIVE_TYPES,
  DRIVE_TYPE_LABELS,
  TRANSMISSIONS,
  TRANSMISSION_LABELS,
} from "@/lib/constants";
import type { VehicleActionState } from "@/server/vehicles-admin";
import { ImageUploadField } from "./image-upload-field";

type VehicleFormAction = (
  state: VehicleActionState | undefined,
  formData: FormData,
) => Promise<VehicleActionState>;

interface VehicleFormProps {
  action: VehicleFormAction;
  defaultValues?: Partial<Record<string, string | number | undefined>>;
  submitLabel?: string;
  taxonomies?: {
    brand?: string[];
    model?: string[];
    bodyType?: string[];
    fuelType?: string[];
    transmission?: string[];
    driveType?: string[];
    color?: SelectOption[];
  };
}

type SelectOption = string | { value: string; label: string };

const INITIAL_STATE: VehicleActionState = { status: "idle" };

const DEFAULT_SUCCESS_MESSAGE = "Автомобиль сохранён.";
const DEFAULT_ERROR_MESSAGE = "Не удалось сохранить. Проверьте поля и попробуйте снова.";

export function VehicleForm({ action, defaultValues = {}, submitLabel = "Save", taxonomies }: VehicleFormProps) {
  const [state, formAction] = useActionState(action, INITIAL_STATE);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const initialMediaState = buildInitialMediaState(defaultValues.gallery, defaultValues.thumbnailUrl);
  const [galleryImages, setGalleryImages] = useState<string[]>(initialMediaState.images);
  const [coverImage, setCoverImage] = useState<string | null>(initialMediaState.cover);
  const colorOptions: SelectOption[] = taxonomies?.color?.length ? taxonomies.color : [...COLORS];

  const showSuccess = state.status === "success";
  const showError = state.status === "error";
  const successMessage = state.message ?? DEFAULT_SUCCESS_MESSAGE;
  const errorMessage = state.message ?? DEFAULT_ERROR_MESSAGE;

  useEffect(() => {
    if ((showSuccess || showError) && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showSuccess, showError]);

  return (
    <form action={formAction} className="grid gap-6 rounded-[36px] border border-white/10 bg-white/6 p-8">
      {showSuccess ? (
        <FormMessage ref={messageRef} variant="success">
          {successMessage}
        </FormMessage>
      ) : null}
      {showError ? (
        <FormMessage ref={messageRef} variant="error">
          {errorMessage}
        </FormMessage>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Название в каталоге" name="title" defaultValue={defaultValues.title} required />
        <DatalistField
          label="Бренд"
          name="brand"
          defaultValue={defaultValues.brand}
          options={taxonomies?.brand}
          required
        />
        <DatalistField
          label="Модель"
          name="model"
          defaultValue={defaultValues.model}
          options={taxonomies?.model}
          required
        />
        <SelectField
          label="Тип кузова"
          name="bodyType"
          options={(taxonomies?.bodyType?.length ? taxonomies.bodyType : BODY_TYPES).map((type) => ({
            value: type,
            label: BODY_TYPE_LABELS[type as keyof typeof BODY_TYPE_LABELS] ?? type,
          }))}
          defaultValue={defaultValues.bodyType as string}
        />
        <Field label="Год" name="year" type="number" defaultValue={defaultValues.year} required />
        <Field label="Пробег" name="mileage" type="number" defaultValue={defaultValues.mileage} />
        <Field
          label="Цена, EUR"
          name="priceEur"
          type="number"
          step="0.01"
          defaultValue={defaultValues.priceEur}
          required
        />
        <SelectField
          label="Страна"
          name="country"
          options={COUNTRIES.map((c) => ({ value: c.code, label: `${c.code} — ${c.name}` }))}
          defaultValue={defaultValues.country as string}
          required
        />
        <Field label="Город" name="city" defaultValue={defaultValues.city} />
        <SelectField
          label="Тип топлива"
          name="fuelType"
          options={(taxonomies?.fuelType?.length ? taxonomies.fuelType : FUEL_TYPES).map((fuel) => ({
            value: fuel,
            label: FUEL_TYPE_LABELS[fuel as keyof typeof FUEL_TYPE_LABELS] ?? fuel,
          }))}
          defaultValue={defaultValues.fuelType as string}
        />
        <SelectField
          label="Коробка передач"
          name="transmission"
          options={(taxonomies?.transmission?.length ? taxonomies.transmission : TRANSMISSIONS).map((transmission) => ({
            value: transmission,
            label: TRANSMISSION_LABELS[transmission as keyof typeof TRANSMISSION_LABELS] ?? transmission,
          }))}
          defaultValue={defaultValues.transmission as string}
        />
        <SelectField
          label="Привод"
          name="driveType"
          options={(taxonomies?.driveType?.length ? taxonomies.driveType : DRIVE_TYPES).map((drive) => ({
            value: drive,
            label: DRIVE_TYPE_LABELS[drive as keyof typeof DRIVE_TYPE_LABELS] ?? drive,
          }))}
          defaultValue={defaultValues.driveType as string}
        />
        <Field
          label="Объём двигателя (см³)"
          name="engineVolumeCc"
          type="number"
          defaultValue={defaultValues.engineVolumeCc}
        />
        <Field label="Мощность, л.с." name="powerHp" type="number" defaultValue={defaultValues.powerHp} />
        <SelectField
          label="Цвет"
          name="color"
          options={colorOptions.map((color) => {
            if (typeof color === "string") {
              return {
                value: color,
                label: COLOR_LABELS[color as keyof typeof COLOR_LABELS] ?? color,
              };
            }
            return color;
          })}
          defaultValue={defaultValues.color as string}
        />
      </div>

      <TextareaField
        label="Краткое описание"
        name="shortDescription"
        rows={3}
        defaultValue={defaultValues.shortDescription}
      />
      <Field
        label="Ссылка на оригинал"
        name="originalListingUrl"
        type="url"
        defaultValue={defaultValues.originalListingUrl}
      />

      <ImageUploadField
        label="Галерея"
        description="Загрузите фото или добавьте прямые ссылки; первое станет обложкой."
        value={galleryImages}
        onChange={setGalleryImages}
        primaryValue={coverImage}
        onPrimaryChange={setCoverImage}
      />

      <TextareaField
        label="Опции (каждая с новой строки)"
        name="features"
        rows={4}
        defaultValue={defaultValues.features}
      />
      <TextareaField
        label="Характеристики (формат: Метка: значение)"
        name="specs"
        rows={4}
        defaultValue={defaultValues.specs}
      />
      <TextareaField
        label="Рынки (ISO-коды, например DE,PL,LT)"
        name="markets"
        rows={2}
        defaultValue={defaultValues.markets}
      />
      <TextareaField
        label="Логистика (Шаг|Описание|ETA)"
        name="logistics"
        rows={4}
        defaultValue={defaultValues.logistics}
      />
      <TextareaField
        label="Документы (Название|URL)"
        name="documents"
        rows={3}
        defaultValue={defaultValues.documents}
      />

      {defaultValues.id ? <input type="hidden" name="id" value={String(defaultValues.id)} /> : null}
      <input type="hidden" name="thumbnailUrl" value={coverImage ?? ""} />
      <input type="hidden" name="gallery" value={galleryImages.join("\n")} />
      <SubmitButton label={submitLabel} />
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center rounded-full bg-brand-primary px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-brand-primary-strong disabled:cursor-not-allowed disabled:bg-brand-primary/50 disabled:text-white/70"
    >
      {pending ? "Сохраняем..." : label}
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  step,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  step?: string;
  defaultValue?: string | number;
}) {
  return (
    <label className="space-y-2 text-sm text-white/70">
      <span className="block text-xs text-white/50">{label}</span>
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        defaultValue={defaultValue}
        className="h-11 w-full rounded-full border border-white/15 bg-black/30 px-4 text-sm text-white placeholder:text-white/40 focus:border-brand-primary focus:outline-none"
      />
    </label>
  );
}

function TextareaField({
  label,
  name,
  rows,
  defaultValue,
}: {
  label: string;
  name: string;
  rows?: number;
  defaultValue?: string | number;
}) {
  return (
    <label className="space-y-2 text-sm text-white/70">
      <span className="block text-xs text-white/50">{label}</span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue as string | undefined}
        className="w-full rounded-[28px] border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand-primary focus:outline-none"
      />
    </label>
  );
}


function SelectField({
  label,
  name,
  options,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  options: SelectOption[];
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="space-y-2 text-sm text-white/70">
      <span className="block text-xs uppercase tracking-[0.16em] text-white/50">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="h-11 w-full rounded-full border border-white/15 bg-black/30 px-4 text-sm text-white focus:border-brand-primary focus:outline-none"
      >
        <option value="" className="bg-black">
          Select
        </option>
        {options.map((option) => {
          const normalized = typeof option === "string" ? { value: option, label: option } : option;
          return (
            <option key={normalized.value} value={normalized.value} className="bg-black">
              {normalized.label}
            </option>
          );
        })}
      </select>
    </label>
  );
}

function DatalistField({
  label,
  name,
  required,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string | number;
  options?: string[];
}) {
  const listId = `${name}-list`;
  return (
    <label className="space-y-2 text-sm text-white/70">
      <span className="block text-xs uppercase tracking-[0.16em] text-white/50">{label}</span>
      <input
        name={name}
        list={options && options.length ? listId : undefined}
        required={required}
        defaultValue={defaultValue}
        className="h-11 w-full rounded-full border border-white/15 bg-black/30 px-4 text-sm text-white placeholder:text-white/35 focus:border-brand-primary focus:outline-none"
      />
      {options && options.length ? (
        <datalist id={listId}>
          {options.map((opt) => (
            <option key={opt} value={opt} />
          ))}
        </datalist>
      ) : null}
    </label>
  );
}

const FormMessage = forwardRef<HTMLDivElement, { variant: "success" | "error"; children: ReactNode }>(
  ({ variant, children }, ref) => {
    const baseStyles = "rounded-2xl border px-4 py-3 text-sm";
    const variantStyles =
      variant === "success"
        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
        : "border-red-500/40 bg-red-500/10 text-red-100";
    const role = variant === "error" ? "alert" : "status";

    return (
      <div ref={ref} role={role} className={`${baseStyles} ${variantStyles}`}>
        {children}
      </div>
    );
  },
);

FormMessage.displayName = "FormMessage";

function normalizeString(value: unknown) {
  if (value === null || value === undefined) {
    return null;
  }

  const raw = typeof value === "number" ? String(value) : value;
  if (typeof raw !== "string") {
    return null;
  }

  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseGalleryList(value: unknown) {
  const raw = normalizeString(value);
  if (!raw) {
    return [];
  }

  const normalized = raw.replace(/`n/g, "\n");
  return normalized
    .split(/\r?\n/)
    .map((line) => normalizeString(line))
    .filter((line): line is string => Boolean(line));
}

function resolveCoverImage(thumbnailValue: string | null, gallery: string[]) {
  if (thumbnailValue && (gallery.includes(thumbnailValue) || gallery.length === 0)) {
    return thumbnailValue;
  }

  return gallery[0] ?? thumbnailValue ?? null;
}

function buildInitialMediaState(galleryValue: unknown, thumbnailValue: unknown) {
  const parsedGallery = parseGalleryList(galleryValue);
  const normalizedThumbnail = normalizeString(thumbnailValue);

  if (parsedGallery.length === 0 && normalizedThumbnail) {
    return {
      images: [normalizedThumbnail],
      cover: normalizedThumbnail,
    };
  }

  return {
    images: parsedGallery,
    cover: resolveCoverImage(normalizedThumbnail, parsedGallery),
  };
}
