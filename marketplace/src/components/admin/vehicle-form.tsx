"use client";

import { forwardRef, useEffect, useRef, type ReactNode } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { BODY_TYPES, COUNTRIES, FUEL_TYPES, TRANSMISSIONS } from "@/lib/constants";
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

export function VehicleForm({ action, defaultValues = {}, submitLabel = "Сохранить" }: VehicleFormProps) {
  const [state, formAction] = useFormState(action, INITIAL_STATE);
  const messageRef = useRef<HTMLDivElement | null>(null);

  const showSuccess = state.status === "success";
  const showError = state.status === "error";
  const successMessage = state.message ?? "Автомобиль успешно сохранён.";
  const errorMessage = state.message ?? "Не удалось сохранить изменения. Попробуйте ещё раз.";

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
        <Field label="Название" name="title" defaultValue={defaultValues.title} required />
        <Field label="Марка" name="brand" defaultValue={defaultValues.brand} required />
        <Field label="Модель" name="model" defaultValue={defaultValues.model} required />
        <SelectField label="Тип кузова" name="bodyType" options={BODY_TYPES} defaultValue={defaultValues.bodyType as string} />
        <Field label="Год выпуска" name="year" type="number" defaultValue={defaultValues.year} required />
        <Field label="Пробег" name="mileage" type="number" defaultValue={defaultValues.mileage} />
        <Field label="Цена (EUR)" name="priceEur" type="number" step="0.01" defaultValue={defaultValues.priceEur} required />
        <SelectField
          label="Страна"
          name="country"
          options={COUNTRIES.map((c) => ({ value: c.code, label: `${c.code} - ${c.name}` }))}
          defaultValue={defaultValues.country as string}
        />
        <Field label="Город" name="city" defaultValue={defaultValues.city} />
        <SelectField label="Тип топлива" name="fuelType" options={FUEL_TYPES} defaultValue={defaultValues.fuelType as string} />
        <SelectField
          label="Коробка передач"
          name="transmission"
          options={TRANSMISSIONS}
          defaultValue={defaultValues.transmission as string}
        />
        <Field label="Привод" name="driveType" defaultValue={defaultValues.driveType} />
        <Field label="Объём двигателя (см³)" name="engineVolumeCc" type="number" defaultValue={defaultValues.engineVolumeCc} />
        <Field label="Мощность (л.с.)" name="powerHp" type="number" defaultValue={defaultValues.powerHp} />
      </div>
      <TextareaField label="Краткое описание" name="shortDescription" rows={3} defaultValue={defaultValues.shortDescription} />
      <Field label="Ссылка на оригинальное объявление" name="originalListingUrl" type="url" defaultValue={defaultValues.originalListingUrl} />
      <Field label="Ссылка на обложку" name="thumbnailUrl" type="url" defaultValue={defaultValues.thumbnailUrl} />
      <TextareaField
        label="Галерея (по одной ссылке в строке, первая станет обложкой)"
        name="gallery"
        rows={4}
        defaultValue={defaultValues.gallery}
      />
      <TextareaField label="Преимущества (по одному пункту в строке)" name="features" rows={4} defaultValue={defaultValues.features} />
      <TextareaField label="Характеристики (формат: Название: значение)" name="specs" rows={4} defaultValue={defaultValues.specs} />
      <TextareaField
        label="Рынки (ISO-коды через запятую)"
        name="markets"
        rows={2}
        defaultValue={defaultValues.markets}
      />
      <TextareaField label="Логистика (формат: Этап|Описание|ETA)" name="logistics" rows={4} defaultValue={defaultValues.logistics} />
      <TextareaField label="Документы (формат: Название|URL)" name="documents" rows={3} defaultValue={defaultValues.documents} />
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
          --
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
