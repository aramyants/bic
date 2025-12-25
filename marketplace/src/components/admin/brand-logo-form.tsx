"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { BrandLogoActionState } from "@/server/brand-logos-admin";

type BrandLogoFormAction = (
  state: BrandLogoActionState | undefined,
  formData: FormData,
) => Promise<BrandLogoActionState>;

interface BrandLogoFormProps {
  action: BrandLogoFormAction;
  defaultValues?: {
    id?: string;
    name?: string;
    href?: string | null;
    logoUrl?: string;
    sortOrder?: number;
    isActive?: boolean;
  };
  submitLabel?: string;
}

export function BrandLogoForm({ action, defaultValues = {}, submitLabel = "Сохранить" }: BrandLogoFormProps) {
  const [state, formAction] = useActionState(action, { status: "idle" } as BrandLogoActionState);
  const [logo, setLogo] = useState<string[]>(() => (defaultValues.logoUrl ? [defaultValues.logoUrl] : []));
  const messageRef = useRef<HTMLDivElement | null>(null);

  const showSuccess = state.status === "success";
  const showError = state.status === "error";

  useEffect(() => {
    if ((showSuccess || showError) && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showError, showSuccess]);

  const statusBadge = useMemo(() => {
    if (showSuccess) {
      return { tone: "bg-emerald-500/15 text-emerald-100 border-emerald-500/40", text: state.message ?? "Успешно сохранено" };
    }
    if (showError) {
      return { tone: "bg-red-500/10 text-red-100 border-red-500/50", text: state.message ?? "Операция не удалась" };
    }
    return null;
  }, [showError, showSuccess, state.message]);

  return (
    <form action={formAction} className="space-y-6 rounded-[28px] border border-white/10 bg-white/5 p-4 text-sm text-white/70 sm:p-6">
      {statusBadge ? (
        <div
          ref={messageRef}
          className={`rounded-2xl border px-4 py-3 text-sm ${statusBadge.tone}`}
        >
          {statusBadge.text}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Название бренда"
          name="name"
          defaultValue={defaultValues.name}
          placeholder="Audi"
          required
        />
        <Field
          label="Ссылка на сайт или каталог"
          name="href"
          defaultValue={defaultValues.href ?? ""}
          placeholder="https://audi.com"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Порядок в ленте"
          name="sortOrder"
          type="number"
          placeholder="0"
          defaultValue={defaultValues.sortOrder ?? 0}
        />
        <CheckboxField
          label="Отображать на главной"
          name="isActive"
          defaultChecked={defaultValues.isActive ?? true}
        />
      </div>

      <ImageUploadField
        label="Логотип"
        description="Загрузите файл или вставьте прямую ссылку на логотип."
        value={logo}
        onChange={(next) => setLogo(next.slice(0, 1))}
        maxImages={1}
        allowUrlInput
      />

      <input type="hidden" name="logoUrl" value={logo[0] ?? ""} />
      {defaultValues.id ? <input type="hidden" name="id" value={defaultValues.id} /> : null}

      <div className="flex flex-col sm:flex-row sm:justify-end">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  type = "text",
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number;
}) {
  return (
    <label className="space-y-2 text-sm text-white/70">
      <span className="block text-xs uppercase tracking-[0.16em] text-white/50">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="h-11 w-full rounded-full border border-white/15 bg-black/30 px-4 text-sm text-white placeholder:text-white/35 focus:border-brand-primary focus:outline-none"
      />
    </label>
  );
}

function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-black/20 px-4 py-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-5 w-5 rounded border-white/25 bg-white/10 text-brand-primary focus:ring-2 focus:ring-brand-primary/30"
      />
      <span className="text-sm text-white/70">{label}</span>
    </label>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-primary px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-brand-primary-strong disabled:cursor-not-allowed disabled:bg-brand-primary/50 disabled:text-white/70 sm:w-auto"
    >
      {pending ? "Сохраняем..." : label}
    </button>
  );
}
