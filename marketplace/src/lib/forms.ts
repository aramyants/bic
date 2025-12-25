import { AsYouType, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import { z } from "zod";

export const MIN_PHONE_DIGITS = 7;
export const MAX_PHONE_DIGITS = 15;

export const PHONE_COUNTRY_OPTIONS: { code: CountryCode; dialCode: string; name: string }[] = [
  { code: "RU", dialCode: "+7", name: "Россия" },
  { code: "KZ", dialCode: "+7", name: "Казахстан" },
  { code: "AM", dialCode: "+374", name: "Армения" },
  { code: "GE", dialCode: "+995", name: "Грузия" },
  { code: "UA", dialCode: "+380", name: "Украина" },
  { code: "BY", dialCode: "+375", name: "Беларусь" },
  { code: "AZ", dialCode: "+994", name: "Азербайджан" },
  { code: "KG", dialCode: "+996", name: "Кыргызстан" },
  { code: "UZ", dialCode: "+998", name: "Узбекистан" },
  { code: "TJ", dialCode: "+992", name: "Таджикистан" },
  { code: "TM", dialCode: "+993", name: "Туркменистан" },
  { code: "TR", dialCode: "+90", name: "Турция" },
  { code: "AE", dialCode: "+971", name: "ОАЭ" },
  { code: "SA", dialCode: "+966", name: "Саудовская Аравия" },
  { code: "QA", dialCode: "+974", name: "Катар" },
  { code: "KW", dialCode: "+965", name: "Кувейт" },
  { code: "OM", dialCode: "+968", name: "Оман" },
  { code: "IL", dialCode: "+972", name: "Израиль" },
  { code: "IN", dialCode: "+91", name: "Индия" },
  { code: "CN", dialCode: "+86", name: "Китай" },
  { code: "JP", dialCode: "+81", name: "Япония" },
  { code: "KR", dialCode: "+82", name: "Южная Корея" },
  { code: "SG", dialCode: "+65", name: "Сингапур" },
  { code: "VN", dialCode: "+84", name: "Вьетнам" },
  { code: "TH", dialCode: "+66", name: "Таиланд" },
  { code: "ID", dialCode: "+62", name: "Индонезия" },
  { code: "PH", dialCode: "+63", name: "Филиппины" },
  { code: "MY", dialCode: "+60", name: "Малайзия" },
  { code: "AU", dialCode: "+61", name: "Австралия" },
  { code: "NZ", dialCode: "+64", name: "Новая Зеландия" },
  { code: "US", dialCode: "+1", name: "США" },
  { code: "CA", dialCode: "+1", name: "Канада" },
  { code: "MX", dialCode: "+52", name: "Мексика" },
  { code: "BR", dialCode: "+55", name: "Бразилия" },
  { code: "AR", dialCode: "+54", name: "Аргентина" },
  { code: "CL", dialCode: "+56", name: "Чили" },
  { code: "ZA", dialCode: "+27", name: "Южная Африка" },
  { code: "EG", dialCode: "+20", name: "Египет" },
  { code: "NG", dialCode: "+234", name: "Нигерия" },
  { code: "GB", dialCode: "+44", name: "Великобритания" },
  { code: "IE", dialCode: "+353", name: "Ирландия" },
  { code: "DE", dialCode: "+49", name: "Германия" },
  { code: "FR", dialCode: "+33", name: "Франция" },
  { code: "ES", dialCode: "+34", name: "Испания" },
  { code: "IT", dialCode: "+39", name: "Италия" },
  { code: "PT", dialCode: "+351", name: "Португалия" },
  { code: "NL", dialCode: "+31", name: "Нидерланды" },
  { code: "BE", dialCode: "+32", name: "Бельгия" },
  { code: "CH", dialCode: "+41", name: "Швейцария" },
  { code: "AT", dialCode: "+43", name: "Австрия" },
  { code: "PL", dialCode: "+48", name: "Польша" },
  { code: "CZ", dialCode: "+420", name: "Чехия" },
  { code: "SK", dialCode: "+421", name: "Словакия" },
  { code: "RO", dialCode: "+40", name: "Румыния" },
  { code: "HU", dialCode: "+36", name: "Венгрия" },
  { code: "BG", dialCode: "+359", name: "Болгария" },
  { code: "GR", dialCode: "+30", name: "Греция" },
  { code: "FI", dialCode: "+358", name: "Финляндия" },
  { code: "SE", dialCode: "+46", name: "Швеция" },
  { code: "NO", dialCode: "+47", name: "Норвегия" },
  { code: "DK", dialCode: "+45", name: "Дания" },
];

const COUNTRY_PHONE_MASKS: Partial<Record<CountryCode, string>> = {
  RU: "### ### ## ##",
  KZ: "### ### ## ##",
  AM: "## ### ###",
  GE: "### ### ###",
  UA: "## ### ####",
  BY: "## ### ## ##",
  AZ: "## ### ## ##",
  KG: "### ### ###",
  UZ: "## ### ## ##",
  TJ: "## ### ## ##",
  TM: "## ### ####",
  TR: "### ### ## ##",
  AE: "## ### ####",
  SA: "## ### ####",
  QA: "## ### ####",
  KW: "### ### ##",
  OM: "## ### ###",
  IL: "## ### ####",
  IN: "#### ### ###",
  CN: "## #### ####",
  JP: "## #### ####",
  KR: "## #### ####",
  SG: "#### ####",
  VN: "## #### ###",
  TH: "## ### ####",
  ID: "## ### ####",
  PH: "### #### ###",
  MY: "## #### ####",
  AU: "#### ### ###",
  NZ: "## ### ####",
  US: "### ### ####",
  CA: "### ### ####",
  MX: "## ## ## ##",
  BR: "## ##### ####",
  AR: "## #### ####",
  CL: "# #### ####",
  ZA: "## ### ####",
  EG: "### #### ####",
  NG: "## #### ####",
  GB: "#### ### ####",
  IE: "## ### ####",
  DE: "#### ########",
  FR: "# ## ## ## ##",
  ES: "### ### ###",
  IT: "### ### ####",
  PT: "### ### ###",
  NL: "## ### ####",
  BE: "### ## ## ##",
  CH: "## ### ## ##",
  AT: "### ### ####",
  PL: "## ### ## ##",
  CZ: "### ### ###",
  SK: "### ### ###",
  RO: "## ### ####",
  HU: "## ### ####",
  BG: "### ### ###",
  GR: "### ### ####",
  FI: "## ### ####",
  SE: "## ### ####",
  NO: "### ## ###",
  DK: "## ## ## ##",
};

const TELEGRAM_USERNAME = /^@?[a-zA-Z0-9_]{5,32}$/;
const NAME_ALLOWED = /^[\p{L}\p{M}\s.'-]+$/u;

const countMaskDigits = (mask?: string) => (mask?.match(/#/g) ?? []).length;

const getDialDigits = (country: CountryCode) =>
  PHONE_COUNTRY_OPTIONS.find((c) => c.code === country)?.dialCode.replace(/\D/g, "") ?? "";

const getPhoneDigitLimits = (country: CountryCode) => {
  const dialDigits = getDialDigits(country);
  const mask = COUNTRY_PHONE_MASKS[country];
  const nationalCount = countMaskDigits(mask);
  const total = dialDigits.length + nationalCount;
  if (nationalCount > 0) {
    return { min: total, max: total };
  }
  return { min: dialDigits.length + MIN_PHONE_DIGITS, max: dialDigits.length + MAX_PHONE_DIGITS };
};

export const contactFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Имя слишком короткое")
      .max(80, "Имя слишком длинное")
      .regex(NAME_ALLOWED, "Используйте буквы, пробелы и дефисы"),
    email: z.string().trim().email("Укажите корректный email"),
    phone: z.string().trim().min(1, "Телефон обязателен"),
    phoneE164: z
      .string()
      .trim()
      .optional()
      .transform((value) => (value?.length ? value : undefined)),
    phoneCountry: z
      .string()
      .trim()
      .optional()
      .transform((value) => (value?.length ? value.toUpperCase() : undefined)),
    telegram: z
      .string()
      .trim()
      .optional()
      .transform((value) => (value?.length ? value : undefined)),
    message: z
      .string()
      .trim()
      .optional()
      .transform((value) => (value?.length ? value : undefined)),
    customerType: z.enum(["INDIVIDUAL", "COMPANY"]).default("INDIVIDUAL"),
  })
  .superRefine((values, ctx) => {
    const parsed = parsePhoneNumberFromString(values.phone);
    const country = (values.phoneCountry as CountryCode | undefined) ?? (parsed?.country as CountryCode | undefined) ?? "RU";
    const { min, max } = getPhoneDigitLimits(country);
    const digitsOnly = values.phone.replace(/\D/g, "");

    if (digitsOnly.length < min || digitsOnly.length > max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: `Укажите код страны и ${min === max ? min : `${min}–${max}`} цифр`,
      });
    }

    const phoneNumber = parsed ?? parsePhoneNumberFromString(values.phone, country);
    if (!phoneNumber || !phoneNumber.isValid()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Проверьте формат номера",
      });
    }

    if (values.telegram) {
      const isUsername = TELEGRAM_USERNAME.test(values.telegram);
      const telegramNumber = parsePhoneNumberFromString(values.telegram, country);

      if (!isUsername && !(telegramNumber && telegramNumber.isValid())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["telegram"],
          message: "Введите username через @ или номер в международном формате",
        });
      }
    }
  });

export const normalizePhone = (value: string, country: CountryCode) => {
  const parsed = parsePhoneNumberFromString(value, country);
  if (!parsed || !parsed.isValid()) return null;
  return {
    international: parsed.formatInternational(),
    e164: parsed.format("E.164"),
  };
};

export const normalizeTelegram = (value: string | undefined, country: CountryCode) => {
  if (!value?.trim()) return undefined;
  const trimmed = value.trim();
  if (TELEGRAM_USERNAME.test(trimmed)) {
    return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
  }

  const parsed = parsePhoneNumberFromString(trimmed, country);
  if (parsed && parsed.isValid()) {
    return parsed.formatInternational();
  }

  return undefined;
};
export const formatPhoneInput = (
  rawValue: string,
  currentCountry: CountryCode | null,
): { formatted: string; country: CountryCode | null; nationalDigits: string } => {
  const cleaned = rawValue.replace(/[^\d]/g, "");
  if (!cleaned) {
    return { formatted: "", country: null, nationalDigits: "" };
  }

  const typer = new AsYouType();
  const formattedFull = typer.input(`+${cleaned}`);
  let detectedCountry = (typer.getCountry() as CountryCode | undefined) ?? currentCountry;
  const nationalDigits = typer.getNationalNumber();

  // Special handling for +7 to distinguish RU/KZ early
  if (!detectedCountry && cleaned.startsWith("7")) {
    const firstNat = nationalDigits?.[0];
    if (firstNat === "6" || firstNat === "7") {
      detectedCountry = "KZ";
    } else if (nationalDigits?.length) {
      detectedCountry = "RU";
    }
  }

  return { formatted: formattedFull, country: detectedCountry ?? null, nationalDigits };
};

export const buildFullNumber = (country: CountryCode, nationalValue: string) => {
  const dialDigits = getDialDigits(country);
  const nationalDigits = nationalValue.replace(/\D/g, "");
  return `+${dialDigits}${nationalDigits}`;
};

export const getPhonePlaceholder = (country: CountryCode) => {
  const dial = `+${getDialDigits(country)}`;
  const mask = COUNTRY_PHONE_MASKS[country];
  if (!mask) return `${dial} 000 000 0000`;
  return `${dial} ${mask.replace(/#/g, "0")}`;
};

export const getNationalPlaceholder = (country: CountryCode) => {
  const mask = COUNTRY_PHONE_MASKS[country];
  if (!mask) return "000 000 0000";
  return mask.replace(/#/g, "0");
};

export const getPhoneMaxLength = (country: CountryCode) => {
  const mask = COUNTRY_PHONE_MASKS[country];
  const dial = `+${getDialDigits(country)}`;
  if (!mask) return 24;
  return dial.length + 1 + mask.length;
};

export const getPhoneDigitRange = (country: CountryCode) => {
  const { min, max } = getPhoneDigitLimits(country);
  const dialLen = getDialDigits(country).length;
  return { min: min - dialLen, max: max - dialLen, total: { min, max } };
};
