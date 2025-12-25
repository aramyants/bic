'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CountryCode } from "libphonenumber-js";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import {
  contactFormSchema,
  formatPhoneInput,
  getPhoneDigitRange,
  getPhoneMaxLength,
  getPhonePlaceholder,
  MAX_PHONE_DIGITS,
  MIN_PHONE_DIGITS,
  normalizePhone,
  normalizeTelegram,
  PHONE_COUNTRY_OPTIONS,
} from "@/lib/forms";
import { cn, formatLocaleNumber } from "@/lib/utils";

const DEFAULT_COUNTRY: CountryCode = "RU";

const TIMEZONE_TO_COUNTRY: Record<string, CountryCode> = {
  "Europe/Moscow": "RU",
  "Europe/Kaliningrad": "RU",
  "Europe/Minsk": "BY",
  "Europe/Kiev": "UA",
  "Europe/Kyiv": "UA",
  "Europe/Berlin": "DE",
  "Europe/Paris": "FR",
  "Europe/Madrid": "ES",
  "Europe/Rome": "IT",
  "Europe/London": "GB",
  "Asia/Almaty": "KZ",
  "Asia/Aqtau": "KZ",
  "Asia/Dubai": "AE",
  "Asia/Shanghai": "CN",
  "Asia/Tokyo": "JP",
  "Asia/Seoul": "KR",
  "America/Los_Angeles": "US",
  "America/New_York": "US",
};

export type ContactFormContext = {
  source?: string;
  pageUrl?: string;
  vehicleId?: string;
  vehicleSlug?: string;
  vehicleTitle?: string;
  priceEur?: number;
  priceRub?: number;
};

type ContactFormProps = {
  context?: ContactFormContext;
  defaultMessage?: string;
  className?: string;
  onSubmitted?: () => void;
};

type FormValues = z.input<typeof contactFormSchema>;

export function ContactForm({ context, defaultMessage, className, onSubmitted }: ContactFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showCountries, setShowCountries] = useState(false);
  const hasAutoDetected = useRef(false);
  const countryListRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      phoneE164: undefined,
      phoneCountry: undefined,
      telegram: "",
      message: defaultMessage ?? "",
    },
  });

  const phoneCountry = (useWatch({ control: form.control, name: "phoneCountry" }) as CountryCode | null) || null;
  const selectedCountry = useMemo(
    () => (phoneCountry ? PHONE_COUNTRY_OPTIONS.find((country) => country.code === phoneCountry) ?? null : null),
    [phoneCountry],
  );
  const phoneDigitRange = useMemo(
    () => (selectedCountry ? getPhoneDigitRange(selectedCountry.code) : { min: MIN_PHONE_DIGITS, max: MAX_PHONE_DIGITS }),
    [selectedCountry],
  );

  const toggleCountries = () => setShowCountries((prev) => !prev);
  const closeCountries = () => setShowCountries(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!countryListRef.current) return;
      if (!countryListRef.current.contains(event.target as Node)) {
        closeCountries();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (hasAutoDetected.current) return;
    const locale =
      typeof navigator !== "undefined" ? navigator.languages?.[0] || navigator.language || undefined : undefined;
    const localeRegion = locale?.split("-")[1]?.toUpperCase() as CountryCode | undefined;

    let detectedCountry: CountryCode | undefined;

    // 1) Persisted choice in localStorage / cookie
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("contactCountry");
      if (stored && PHONE_COUNTRY_OPTIONS.some((c) => c.code === stored)) {
        detectedCountry = stored as CountryCode;
      } else {
        const cookieMatch = document.cookie
          .split(";")
          .map((c) => c.trim())
          .find((c) => c.startsWith("contactCountry="));
        const cookieVal = cookieMatch?.split("=")[1];
        if (cookieVal && PHONE_COUNTRY_OPTIONS.some((c) => c.code === cookieVal)) {
          detectedCountry = cookieVal as CountryCode;
        }
      }
    }

    // 2) Language region
    if (!detectedCountry && localeRegion && PHONE_COUNTRY_OPTIONS.some((country) => country.code === localeRegion)) {
      detectedCountry = localeRegion;
    }

    // 3) Timezone map
    if (!detectedCountry) {
      const timeZone =
        typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone?.toString() : undefined;
      const timeZoneCountry = timeZone ? TIMEZONE_TO_COUNTRY[timeZone] : undefined;
      if (timeZoneCountry) {
        detectedCountry = timeZoneCountry;
      }
    }

    const countryToSet = detectedCountry ?? DEFAULT_COUNTRY;
    form.setValue("phoneCountry", countryToSet, { shouldValidate: false });
    const dial = PHONE_COUNTRY_OPTIONS.find((c) => c.code === countryToSet)?.dialCode ?? "+";
    if (!form.getValues("phone")) {
      form.setValue("phone", `${dial} `, { shouldValidate: false });
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem("contactCountry", countryToSet);
      document.cookie = `contactCountry=${countryToSet}; path=/; max-age=${60 * 60 * 24 * 30}`;
    }

    hasAutoDetected.current = true;
  }, [form]);

  useEffect(() => {
    if (defaultMessage) {
      form.setValue("message", defaultMessage, { shouldDirty: false, shouldValidate: false });
    }
  }, [defaultMessage, form]);

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    const country = (values.phoneCountry || DEFAULT_COUNTRY).toUpperCase() as CountryCode;
    const phoneNumber = normalizePhone(values.phone, country);
    const normalizedTelegram = normalizeTelegram(values.telegram, country);
    const pageUrl =
      context?.pageUrl ?? (typeof window !== "undefined" ? window.location.href : undefined) ?? undefined;

    const formData = new FormData();
    formData.set("name", values.name.trim());
    formData.set("email", values.email.trim());
    formData.set("phone", phoneNumber?.international ?? values.phone);
    formData.set("phoneCountry", country);
    if (phoneNumber?.e164) {
      formData.set("phoneE164", phoneNumber.e164);
    }
    if (normalizedTelegram) {
      formData.set("telegram", normalizedTelegram);
    }
    if (values.message) {
      formData.set("message", values.message);
    }
    formData.set("customerType", "INDIVIDUAL");
    if (context?.source) formData.set("source", context.source);
    if (pageUrl) formData.set("pageUrl", pageUrl);
    if (context?.vehicleId) formData.set("vehicleId", context.vehicleId);
    if (context?.vehicleSlug) formData.set("vehicleSlug", context.vehicleSlug);
    if (context?.vehicleTitle) formData.set("vehicleTitle", context.vehicleTitle);
    if (context?.priceEur) formData.set("priceEur", String(context.priceEur));
    if (context?.priceRub) formData.set("priceRub", String(context.priceRub));

    try {
      const response = await fetch("/api/request", {
        method: "POST",
        body: formData,
      });

      if (response.redirected && !onSubmitted) {
        router.replace(response.url);
        return;
      }

      if (!response.ok) {
        setSubmitError("Не удалось отправить заявку. Проверьте данные и попробуйте снова.");
        return;
      }

      if (onSubmitted) {
        onSubmitted();
        form.reset({ ...form.getValues(), message: defaultMessage ?? "" });
      } else {
        router.replace("/?submitted=1");
      }
    } catch {
      setSubmitError("Не удалось отправить заявку. Проверьте данные и попробуйте снова.");
    }
  };

  const { errors, isSubmitting } = form.formState;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      id="request"
      className={cn(
        "flex flex-col gap-4 rounded-[36px] border border-white/12 bg-black/45 p-5 backdrop-blur sm:p-8",
        className,
      )}
    >
      <div className="space-y-1.5">
        <Input
          aria-invalid={Boolean(errors.name)}
          autoComplete="name"
          placeholder="Имя"
          required
          {...form.register("name")}
        />
        {errors.name?.message ? <p className="text-xs text-red-300">{errors.name.message}</p> : null}
      </div>
      <div className="space-y-1.5">
        <Input
          type="email"
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
          placeholder="Электронная почта"
          required
          {...form.register("email")}
        />
        {errors.email?.message ? <p className="text-xs text-red-300">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-1.5">
        <Controller
          name="phone"
          control={form.control}
          render={({ field }) => (
            <div className="space-y-2">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative" ref={countryListRef}>
                  <button
                    type="button"
                    onClick={toggleCountries}
                    className="flex h-12 min-w-[104px] items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 pr-2 text-sm text-white shadow-inner transition hover:border-white/40"
                  >
                    {selectedCountry ? (
                      <>
                        <img
                          src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
                          srcSet={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png 2x`}
                          width="20"
                          height="15"
                          alt={selectedCountry.name}
                          className="rounded-sm"
                        />
                        <span className="text-white/80 leading-none">{selectedCountry.dialCode}</span>
                      </>
                    ) : (
                      <span className="text-white/70 leading-none">+</span>
                    )}
                    <span className="ml-auto text-white/60 text-xs leading-none">▼</span>
                  </button>
                  {showCountries ? (
                    <div
                      className="custom-scroll absolute z-20 mt-2 w-64 overflow-y-auto rounded-2xl border border-white/15 bg-black/90 p-2 shadow-xl backdrop-blur"
                      style={{ maxHeight: "320px", scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                      <div className="grid grid-cols-2 gap-1 pr-1">
                        {PHONE_COUNTRY_OPTIONS.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              const currentFormatted = formatPhoneInput(field.value, country.code);
                              form.setValue("phoneCountry", country.code, { shouldValidate: false, shouldDirty: true });
                              form.setValue("phone", currentFormatted.formatted || `${country.dialCode} `, {
                                shouldValidate: false,
                                shouldDirty: true,
                              });
                              closeCountries();
                            }}
                            className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm text-white transition hover:bg-white/10"
                          >
                            <img
                              src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                              srcSet={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png 2x`}
                              width="18"
                              height="14"
                              alt={country.name}
                              className="rounded-sm"
                            />
                            <span className="font-medium">{country.dialCode}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
                <Input
                  aria-invalid={Boolean(errors.phone)}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder={selectedCountry ? getPhonePlaceholder(selectedCountry.code) : "+000 000 0000"}
                  maxLength={selectedCountry ? getPhoneMaxLength(selectedCountry.code) : 24}
                  required
                  {...field}
                  value={field.value}
                  onChange={(event) => {
                    const { formatted, country } = formatPhoneInput(event.target.value, selectedCountry?.code ?? null);
                    form.setValue("phoneCountry", country ?? undefined, { shouldValidate: false, shouldDirty: true });
                    field.onChange(formatted);
                  }}
                  onBlur={(event) => {
                    const { formatted, country } = formatPhoneInput(event.target.value, selectedCountry?.code ?? null);
                    form.setValue("phoneCountry", country ?? undefined, { shouldValidate: true, shouldDirty: true });
                    form.setValue("phone", formatted, { shouldValidate: true, shouldDirty: true });
                    field.onBlur();
                  }}
                />
              </div>
              <style jsx>{`
                .custom-scroll::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <div className="flex flex-col gap-1 text-xs">
                {errors.phone ? (
                  <p className="text-amber-200">
                    Проверьте номер: укажите код страны и {phoneDigitRange.min === phoneDigitRange.max
                      ? phoneDigitRange.max
                      : `${phoneDigitRange.min}–${phoneDigitRange.max}`}{" "}
                    цифр.
                  </p>
                ) : null}
              </div>
            </div>
          )}
        />
        {errors.phone?.message ? <p className="text-xs text-red-300">{errors.phone.message}</p> : null}
      </div>

      <div className="space-y-1.5">
        <Input
          aria-invalid={Boolean(errors.telegram)}
          placeholder="Telegram: @username или номер"
          autoComplete="off"
          {...form.register("telegram")}
        />
        {errors.telegram?.message ? <p className="text-xs text-red-300">{errors.telegram.message}</p> : null}
      </div>

      <div className="space-y-1.5">
        <Textarea
          aria-invalid={Boolean(errors.message)}
          placeholder="Опишите задачу или желаемую комплектацию"
          {...form.register("message")}
        />
        {errors.message?.message ? <p className="text-xs text-red-300">{errors.message.message}</p> : null}
      </div>

      <div className="flex flex-col items-start justify-between gap-2 text-xs text-white/55 sm:flex-row sm:items-center">
        <span>Ответим в течение 10–15 минут</span>
        <span>{formatLocaleNumber(1800)}+ реализованных проектов</span>
      </div>

      {submitError ? (
        <div className="rounded-[18px] border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs text-red-100">
          {submitError}
        </div>
      ) : null}

      <Button type="submit" size="lg" disabled={isSubmitting || !form.formState.isValid}>
        {isSubmitting ? "Отправляем..." : "Отправить заявку"}
      </Button>
    </form>
  );
}
