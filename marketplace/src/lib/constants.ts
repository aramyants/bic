export const COUNTRIES: { code: string; name: string }[] = [
  { code: "RU", name: "Россия" },
  { code: "DE", name: "Германия" },
  { code: "PL", name: "Польша" },
  { code: "LT", name: "Литва" },
  { code: "LV", name: "Латвия" },
  { code: "EE", name: "Эстония" },
  { code: "FI", name: "Финляндия" },
  { code: "SE", name: "Швеция" },
  { code: "NL", name: "Нидерланды" },
  { code: "BE", name: "Бельгия" },
  { code: "FR", name: "Франция" },
  { code: "IT", name: "Италия" },
  { code: "ES", name: "Испания" },
  { code: "PT", name: "Португалия" },
  { code: "HU", name: "Венгрия" },
  { code: "CZ", name: "Чехия" },
  { code: "SK", name: "Словакия" },
  { code: "SI", name: "Словения" },
  { code: "RO", name: "Румыния" },
  { code: "BG", name: "Болгария" },
  { code: "HR", name: "Хорватия" },
  { code: "GR", name: "Греция" },
  { code: "AE", name: "ОАЭ" },
  { code: "CN", name: "Китай" },
  { code: "JP", name: "Япония" },
  { code: "KR", name: "Южная Корея" },
];

export const BODY_TYPES = [
  "Sedan",
  "Coupe",
  "SUV",
  "Wagon",
  "Liftback",
  "Hatchback",
  "Minivan",
  "Pickup",
  "Convertible",
  "Crossover Coupe",
  "Van",
] as const;

export const BODY_TYPE_LABELS: Record<(typeof BODY_TYPES)[number], string> = {
  Sedan: "Седан",
  Coupe: "Купе",
  SUV: "Внедорожник",
  Wagon: "Универсал",
  Liftback: "Лифтбек",
  Hatchback: "Хэтчбек",
  Minivan: "Минивэн",
  Pickup: "Пикап",
  Convertible: "Кабриолет",
  "Crossover Coupe": "Кроссовер купе",
  Van: "Фургон",
};

export const TRANSMISSIONS = ["Automatic", "Manual", "DCT", "CVT"] as const;
export const TRANSMISSION_LABELS: Record<(typeof TRANSMISSIONS)[number], string> = {
  Automatic: "Автомат",
  Manual: "Механика",
  DCT: "Робот (DCT)",
  CVT: "Вариатор (CVT)",
};

export const DRIVE_TYPES = ["AWD", "RWD", "FWD"] as const;
export const DRIVE_TYPE_LABELS: Record<(typeof DRIVE_TYPES)[number], string> = {
  AWD: "Полный привод",
  RWD: "Задний привод",
  FWD: "Передний привод",
};

export const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric", "LPG"] as const;
export const FUEL_TYPE_LABELS: Record<(typeof FUEL_TYPES)[number], string> = {
  Petrol: "Бензин",
  Diesel: "Дизель",
  Hybrid: "Гибрид",
  Electric: "Электро",
  LPG: "Газ",
};

export const COLORS = [
  "Black",
  "White",
  "Silver",
  "Grey",
  "Blue",
  "Red",
  "Green",
  "Orange",
  "Yellow",
  "Brown",
  "Beige",
  "Purple",
  "Pink",
] as const;

export const COLOR_LABELS: Record<(typeof COLORS)[number], string> = {
  Black: "Чёрный",
  White: "Белый",
  Silver: "Серебристый",
  Grey: "Серый",
  Blue: "Синий",
  Red: "Красный",
  Green: "Зелёный",
  Orange: "Оранжевый",
  Yellow: "Жёлтый",
  Brown: "Коричневый",
  Beige: "Бежевый",
  Purple: "Фиолетовый",
  Pink: "Розовый",
};

export const UNIT_LABELS = {
  km: "км",
  KM: "км",
  mi: "мили",
  MI: "мили",
} as const;

export function getBodyTypeLabel(value?: string | null) {
  return value && value in BODY_TYPE_LABELS ? BODY_TYPE_LABELS[value as keyof typeof BODY_TYPE_LABELS] : value ?? "-";
}

export function getFuelTypeLabel(value?: string | null) {
  return value && value in FUEL_TYPE_LABELS ? FUEL_TYPE_LABELS[value as keyof typeof FUEL_TYPE_LABELS] : value ?? "-";
}

export function getTransmissionLabel(value?: string | null) {
  return value && value in TRANSMISSION_LABELS
    ? TRANSMISSION_LABELS[value as keyof typeof TRANSMISSION_LABELS]
    : value ?? "-";
}

export function getDriveTypeLabel(value?: string | null) {
  return value && value in DRIVE_TYPE_LABELS ? DRIVE_TYPE_LABELS[value as keyof typeof DRIVE_TYPE_LABELS] : value ?? "-";
}
