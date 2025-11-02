"use client";

import { forwardRef, useActionState, useEffect, useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

import {
  BODY_TYPES,
  BODY_TYPE_LABELS,
  COUNTRIES,
  FUEL_TYPES,
  FUEL_TYPE_LABELS,
  TRANSMISSIONS,
  TRANSMISSION_LABELS,
} from "@/lib/constants";
import type { VehicleActionState } from "@/server/vehicles-admin";

type VehicleFormAction = (
  state: VehicleActionState | undefined,
  formData: FormData,
) => Promise<VehicleActionState>;

interface VehicleFormProps {
  action: VehicleFormAction;
  defaultValues?: Partial<Record<string, string | number | undefined>>;
  submitLabel?: string;
}

type SelectOption = string | { value: string; label: string };

const INITIAL_STATE: VehicleActionState = { status: "idle" };

const DEFAULT_SUCCESS_MESSAGE = "Изменения успешно сохранены.";
const DEFAULT_ERROR_MESSAGE = "Не удалось сохранить данные. Проверьте поля и попробуйте ещё раз.";

export function VehicleForm({ action, defaultValues = {}, submitLabel = "Сохранить" }: VehicleFormProps) {
  const [state, formAction] = useActionState(action, INITIAL_STATE);
  const messageRef = useRef<HTMLDivElement | null>(null);

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
        <Field label="Название объявления" name="title" defaultValue={defaultValues.title} required />
        <Field label="Марка" name="brand" defaultValue={defaultValues.brand} required />
        <Field label="Модель" name="model" defaultValue={defaultValues.model} required />
        <SelectField
          label="Тип кузова"
          name="bodyType"
          options={BODY_TYPES.map((type) => ({ value: type, label: BODY_TYPE_LABELS[type] }))}
          defaultValue={defaultValues.bodyType as string}
        />
        <Field label="Год выпуска" name="year" type="number" defaultValue={defaultValues.year} required />
        <Field label="Пробег" name="mileage" type="number" defaultValue={defaultValues.mileage} />
        <Field label="Стоимость (EUR)" name="priceEur" type="number" step="0.01" defaultValue={defaultValues.priceEur} required />
        <SelectField
          label="Страна расположения"
          name="country"
          options={COUNTRIES.map((c) => ({ value: c.code, label: `${c.code} — ${c.name}` }))}
          defaultValue={defaultValues.country as string}
        />
        <Field label="Город" name="city" defaultValue={defaultValues.city} />
        <SelectField
          label="Тип топлива"
          name="fuelType"
          options={FUEL_TYPES.map((fuel) => ({ value: fuel, label: FUEL_TYPE_LABELS[fuel] }))}
          defaultValue={defaultValues.fuelType as string}
        />
        <SelectField
          label="Трансмиссия"
          name="transmission"
          options={TRANSMISSIONS.map((transmission) => ({ value: transmission, label: TRANSMISSION_LABELS[transmission] }))}
          defaultValue={defaultValues.transmission as string}
        />
        <Field label="Тип привода" name="driveType" defaultValue={defaultValues.driveType} />
        <Field label="Объём двигателя (см³)" name="engineVolumeCc" type="number" defaultValue={defaultValues.engineVolumeCc} />
        <Field label="Мощность (л.с.)" name="powerHp" type="number" defaultValue={defaultValues.powerHp} />
      </div>

      <TextareaField label="Краткое описание" name="shortDescription" rows={3} defaultValue={defaultValues.shortDescription} />
      <Field
        label="Ссылка на оригинальное объявление"
        name="originalListingUrl"
        type="url"
        defaultValue={defaultValues.originalListingUrl}
      />
      <Field
        label="Основное изображение (URL)"
        name="thumbnailUrl"
        type="url"
        defaultValue={defaultValues.thumbnailUrl}
      />
      <TextareaField
        label="Галерея (по одной ссылке на строку, первая — основное фото)"
        name="gallery"
        rows={4}
        defaultValue={defaultValues.gallery}
      />
      <TextareaField
        label="Особенности комплектации (по одному пункту на строку)"
        name="features"
        rows={4}
        defaultValue={defaultValues.features}
      />
      <TextareaField
        label="Технические характеристики (формат: Название: значение)"
        name="specs"
        rows={4}
        defaultValue={defaultValues.specs}
      />
      <TextareaField
        label="Рынки присутствия (коды стран через пробел или запятую)"
        name="markets"
        rows={2}
        defaultValue={defaultValues.markets}
      />
      <TextareaField
        label="Этапы логистики (формат: Этап | описание | срок в днях)"
        name="logistics"
        rows={4}
        defaultValue={defaultValues.logistics}
      />
      <TextareaField
        label="Документы (формат: Название | URL)"
        name="documents"
        rows={3}
        defaultValue={defaultValues.documents}
      />

      {defaultValues.id ? <input type="hidden" name="id" value={String(defaultValues.id)} /> : null}
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
      className="inline-flex h-12 items-center justify-center rounded-full bg-brand-primary px-6 text-xs font-semibold text-white transition hover:bg-brand-primary-strong disabled:cursor-not-allowed disabled:bg-brand-primary/50 disabled:text-white/70"
    >
      {pending ? "Сохраняем…" : label}
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

function SelectField({ label, name, options, defaultValue }: { label: string; name: string; options: SelectOption[]; defaultValue?: string }) {
  return (
    <label className="space-y-2 text-sm text-white/70">
      <span className="block text-xs text-white/50">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        className="h-11 w-full rounded-full border border-white/15 bg-black/30 px-4 text-sm text-white focus:border-brand-primary focus:outline-none"
      >
        <option value="" className="bg-black">
          —
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
