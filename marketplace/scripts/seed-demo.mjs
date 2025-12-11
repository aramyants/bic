import "dotenv/config";
import crypto from "node:crypto";
import { Client } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL must be set in .env");
  process.exit(1);
}

const placeholderImages = [
  "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
  "https://images.pexels.com/photos/169789/pexels-photo-169789.jpeg",
  "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
];

const placeholderLogistics = [
  { label: "Инспекция", description: "Технический осмотр перед выкупом", etaDays: 3 },
  { label: "Доставка до порта", description: "Перевозка до хаба и оформление", etaDays: 7 },
  { label: "Таможня и отгрузка", description: "Растаможка и выдача клиенту", etaDays: 12 },
];

const demoVehicles = [
  {
    id: crypto.randomUUID(),
    slug: "porsche-cayenne-coupe-30-2023",
    title: "Porsche Cayenne Coupe 3.0 Tiptronic S",
    brand: "Porsche",
    model: "Cayenne Coupe",
    generation: "III (PO536) facelift",
    bodyType: "Coupe",
    year: 2023,
    mileage: 12000,
    mileageUnit: "km",
    basePriceEurCents: 9450000,
    country: "DE",
    city: "Stuttgart",
    originalListingUrl: "https://suchen.mobile.de/fahrzeuge/details.html?id=PorscheDemo",
    thumbnailUrl: "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg",
    status: "published",
    shortDescription: "3.0 V6, adaptive air suspension, Sport Chrono package",
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "AWD",
    engineVolumeCc: 2995,
    powerHp: 353,
    doors: 5,
    seats: 5,
    color: "Crayon Grey",
    vatRateBps: 1900,
    customsDutyBps: 1500,
    features: [
      "Adaptive air suspension PASM",
      "Matrix LED headlights",
      "Sport Chrono package",
      "Four-zone climate control",
    ],
    specs: [
      { group: "Core", label: "Engine", value: "3.0 V6" },
      { group: "Core", label: "Power", value: "353 hp" },
      { group: "Transmission", label: "Gearbox", value: "Tiptronic S" },
      { group: "Interior", label: "Trim", value: "Club Leather" },
    ],
    markets: ["DE", "NL", "PL", "LT", "RU"],
    logistics: [
      { label: "Inspection", description: "Porsche Zentrum technical check", etaDays: 3 },
      { label: "Export prep", description: "Paperwork and insurance", etaDays: 4 },
      { label: "Delivery to port", description: "Truck Stuttgart -> Hamburg", etaDays: 6 },
      { label: "Sea freight", description: "Shipping and customs clearance", etaDays: 12 },
    ],
    documents: [
      { title: "Carfax report", url: "https://example.com/carfax.pdf" },
      { title: "Certificate of conformity", url: "https://example.com/coc.pdf" },
    ],
    images: [
      "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
      "https://images.pexels.com/photos/169789/pexels-photo-169789.jpeg",
      "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
    ],
  },
  {
    id: crypto.randomUUID(),
    slug: "bmw-x7-xdrive40d-2022",
    title: "BMW X7 xDrive40d M Sport",
    brand: "BMW",
    model: "X7",
    generation: "G07 LCI",
    bodyType: "SUV",
    year: 2022,
    mileage: 22000,
    mileageUnit: "km",
    basePriceEurCents: 7650000,
    country: "DE",
    city: "Munich",
    originalListingUrl: "https://suchen.mobile.de/fahrzeuge/details.html?id=BMWDemo",
    thumbnailUrl: "https://images.pexels.com/photos/5002489/pexels-photo-5002489.jpeg",
    status: "published",
    shortDescription: "Seven seats, Executive Lounge, Bowers & Wilkins sound",
    fuelType: "Diesel",
    transmission: "Automatic",
    driveType: "AWD",
    engineVolumeCc: 2993,
    powerHp: 352,
    doors: 5,
    seats: 7,
    color: "Mineral White",
    vatRateBps: 1900,
    customsDutyBps: 1500,
    features: [
      "M Sport Pro package",
      "Sky Lounge panoramic roof",
      "Heated seats on all rows",
      "Parking Assistant Plus",
    ],
    specs: [
      { group: "Core", label: "Engine", value: "3.0 diesel" },
      { group: "Core", label: "Power", value: "352 hp" },
      { group: "Interior", label: "Trim", value: "Merino Tartufo" },
      { group: "Infotainment", label: "iDrive", value: "8.0 Live Cockpit" },
    ],
    markets: ["DE", "PL", "LT", "LV", "RU"],
    logistics: [
      { label: "BMW inspection", description: "Factory service diagnostic", etaDays: 2 },
      { label: "Documentation", description: "Invoice, contract, insurance", etaDays: 3 },
      { label: "Delivery to port", description: "Munich -> Bremerhaven", etaDays: 5 },
      { label: "Rail to Moscow", description: "Train platform and customs", etaDays: 10 },
    ],
    documents: [
      { title: "Digital Service Report", url: "https://example.com/dsr.pdf" },
      { title: "Plug-in hybrid certificate", url: "https://example.com/phv.pdf" },
    ],
    images: [
      "https://images.pexels.com/photos/5002487/pexels-photo-5002487.jpeg",
      "https://images.pexels.com/photos/5002490/pexels-photo-5002490.jpeg",
      "https://images.pexels.com/photos/1397604/pexels-photo-1397604.jpeg",
    ],
  },
  {
    id: crypto.randomUUID(),
    slug: "mercedes-benz-s580e-2024",
    title: "Mercedes-Benz S 580 e 4MATIC Long",
    brand: "Mercedes-Benz",
    model: "S-Class",
    generation: "W223",
    bodyType: "Sedan",
    year: 2024,
    mileage: 8000,
    mileageUnit: "km",
    basePriceEurCents: 11850000,
    country: "DE",
    city: "Berlin",
    originalListingUrl: "https://suchen.mobile.de/fahrzeuge/details.html?id=MBSDemo",
    thumbnailUrl: "https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg",
    status: "published",
    shortDescription: "S 580 e plug-in hybrid, Burmester 4D, Chauffeur package",
    fuelType: "Hybrid",
    transmission: "Automatic",
    driveType: "AWD",
    engineVolumeCc: 2999,
    powerHp: 510,
    doors: 4,
    seats: 4,
    color: "Obsidian Black",
    vatRateBps: 1900,
    customsDutyBps: 1500,
    features: [
      "Chauffeur package with executive seats",
      "Burmester 4D surround sound",
      "MBUX High-End rear entertainment",
      "AIRMATIC with ADS+",
    ],
    specs: [
      { group: "Core", label: "Engine", value: "3.0 V6 plug-in hybrid" },
      { group: "Core", label: "Power", value: "510 hp" },
      { group: "Battery", label: "Capacity", value: "28 kWh" },
      { group: "Interior", label: "Leather", value: "Nappa Exclusive" },
    ],
    markets: ["DE", "FR", "AE", "KZ", "RU"],
    logistics: [
      { label: "Mercedes inspection", description: "Multi-point condition report", etaDays: 2 },
      { label: "Export documentation", description: "EUR1, contract, insurance", etaDays: 4 },
      { label: "Delivery to port", description: "Berlin -> Hamburg", etaDays: 3 },
      { label: "Sea freight", description: "Hamburg -> Jebel Ali", etaDays: 18 },
    ],
    documents: [
      { title: "Digital Service Report", url: "https://example.com/dsr.pdf" },
      { title: "Plug-in hybrid certificate", url: "https://example.com/phv.pdf" },
    ],
    images: [
      "https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg",
      "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
      "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg",
    ],
  },
];

const extraVehicles = [
  {
    id: crypto.randomUUID(),
    slug: "brp-ski-doo-expedition-900-ace-2024",
    title: "BRP Ski-Doo Expedition 900 ACE",
    brand: "BRP",
    model: "Ski-Doo Expedition",
    generation: null,
    bodyType: "Snowmobile",
    year: 2024,
    mileage: 50,
    mileageUnit: "km",
    basePriceEurCents: 1950000,
    country: "RU",
    city: "Москва",
    originalListingUrl: "https://auto.ru/snowmobile/used/sale/brp/ski_doo_expedition_900/1130650422-e89b340f/",
    thumbnailUrl: placeholderImages[0],
    status: "published",
    shortDescription: "Импорт с auto.ru, параметры уточняются.",
    fuelType: "Petrol",
    transmission: "CVT",
    driveType: "AWD",
    engineVolumeCc: 900,
    powerHp: 90,
    doors: 0,
    seats: 2,
    color: "Серый",
    vatRateBps: 2000,
    customsDutyBps: 1500,
    features: ["Предпродажная проверка", "Свежая поставка", "Полный комплект документов"],
    specs: [
      { group: "Двигатель", label: "Объем", value: "900 см³" },
      { group: "Мощность", label: "ЛС", value: "90 hp" },
      { group: "Привод", label: "Тип", value: "AWD" },
    ],
    markets: ["RU"],
    logistics: placeholderLogistics,
    documents: [{ title: "Отчет о проверке", url: "https://example.com/report.pdf" }],
    images: placeholderImages,
  },
  {
    id: crypto.randomUUID(),
    slug: "jeep-wrangler-rubicon-392-2024",
    title: "Jeep Wrangler Rubicon 392",
    brand: "Jeep",
    model: "Wrangler",
    generation: null,
    bodyType: "SUV",
    year: 2024,
    mileage: 15,
    mileageUnit: "km",
    basePriceEurCents: 6800000,
    country: "RU",
    city: "Москва",
    originalListingUrl: "https://auto.ru/cars/used/sale/jeep/wrangler/1130566515-a17dc85c/",
    thumbnailUrl: placeholderImages[0],
    status: "published",
    shortDescription: "Rubicon 392, импорт с auto.ru.",
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "4WD",
    engineVolumeCc: 6400,
    powerHp: 470,
    doors: 4,
    seats: 5,
    color: "Черный",
    vatRateBps: 2000,
    customsDutyBps: 1500,
    features: ["V8 6.4", "Полнопривод", "Блокировки"],
    specs: [
      { group: "Двигатель", label: "Объем", value: "6.4 л" },
      { group: "Мощность", label: "ЛС", value: "470 hp" },
      { group: "Привод", label: "Тип", value: "4WD" },
    ],
    markets: ["RU"],
    logistics: placeholderLogistics,
    documents: [{ title: "Отчет о проверке", url: "https://example.com/report.pdf" }],
    images: placeholderImages,
  },
  {
    id: crypto.randomUUID(),
    slug: "can-am-commander-max-xt-2025",
    title: "Can-Am Commander MAX XT 1000R",
    brand: "BRP",
    model: "Can-Am Commander",
    generation: null,
    bodyType: "ATV",
    year: 2025,
    mileage: 30,
    mileageUnit: "km",
    basePriceEurCents: 3200000,
    country: "RU",
    city: "Москва",
    originalListingUrl: "https://auto.ru/atv/used/sale/brp/can_am_commander_max_xt/1130185903-7c26fcee/",
    thumbnailUrl: placeholderImages[0],
    status: "published",
    shortDescription: "UTV из листинга auto.ru, данные уточняются.",
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "AWD",
    engineVolumeCc: 1000,
    powerHp: 100,
    doors: 0,
    seats: 4,
    color: "Оранжевый",
    vatRateBps: 2000,
    customsDutyBps: 1500,
    features: ["Выносливое шасси", "Лебедка", "Двухрядное сиденье"],
    specs: [
      { group: "Двигатель", label: "Объем", value: "1000 см³" },
      { group: "Мощность", label: "ЛС", value: "100 hp" },
      { group: "Привод", label: "Тип", value: "AWD" },
    ],
    markets: ["RU"],
    logistics: placeholderLogistics,
    documents: [{ title: "Отчет о проверке", url: "https://example.com/report.pdf" }],
    images: placeholderImages,
  },
  {
    id: crypto.randomUUID(),
    slug: "ram-1500-laramie-2025",
    title: "RAM 1500 Laramie 5.7",
    brand: "RAM",
    model: "1500",
    generation: null,
    bodyType: "Pickup",
    year: 2025,
    mileage: 56,
    mileageUnit: "km",
    basePriceEurCents: 7200000,
    country: "RU",
    city: "Москва",
    originalListingUrl: "https://www.avito.ru/moskva/avtomobili/ram_1500_3.0_at_2025_56_km_7566636399",
    thumbnailUrl: placeholderImages[0],
    status: "published",
    shortDescription: "Поставка RAM 1500, данные с Avito.",
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "4WD",
    engineVolumeCc: 5654,
    powerHp: 395,
    doors: 4,
    seats: 5,
    color: "Серый",
    vatRateBps: 2000,
    customsDutyBps: 1500,
    features: ["Crew Cab", "4x4", "Большой экран"],
    specs: [
      { group: "Двигатель", label: "Объем", value: "5.7 л" },
      { group: "Мощность", label: "ЛС", value: "395 hp" },
      { group: "Привод", label: "Тип", value: "4WD" },
    ],
    markets: ["RU"],
    logistics: placeholderLogistics,
    documents: [{ title: "Отчет о проверке", url: "https://example.com/report.pdf" }],
    images: placeholderImages,
  },
  {
    id: crypto.randomUUID(),
    slug: "ford-expedition-king-ranch-2025",
    title: "Ford Expedition King Ranch 3.5 EcoBoost",
    brand: "Ford",
    model: "Expedition",
    generation: null,
    bodyType: "SUV",
    year: 2025,
    mileage: 15,
    mileageUnit: "km",
    basePriceEurCents: 7800000,
    country: "RU",
    city: "Москва",
    originalListingUrl: "https://www.avito.ru/moskva/avtomobili/ford_expedition_3.5_at_2025_15_km_7790918246",
    thumbnailUrl: placeholderImages[0],
    status: "published",
    shortDescription: "Expedition King Ranch из свежей поставки.",
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "4WD",
    engineVolumeCc: 3497,
    powerHp: 400,
    doors: 5,
    seats: 7,
    color: "Черный",
    vatRateBps: 2000,
    customsDutyBps: 1500,
    features: ["3 ряда сидений", "Пневмоподвеска", "Пакет King Ranch"],
    specs: [
      { group: "Двигатель", label: "Объем", value: "3.5 л" },
      { group: "Мощность", label: "ЛС", value: "400 hp" },
      { group: "Привод", label: "Тип", value: "4WD" },
    ],
    markets: ["RU"],
    logistics: placeholderLogistics,
    documents: [{ title: "Отчет о проверке", url: "https://example.com/report.pdf" }],
    images: placeholderImages,
  },
  {
    id: crypto.randomUUID(),
    slug: "porsche-cayenne-s-2023-59km",
    title: "Porsche Cayenne S 3.0",
    brand: "Porsche",
    model: "Cayenne",
    generation: null,
    bodyType: "SUV",
    year: 2023,
    mileage: 59,
    mileageUnit: "km",
    basePriceEurCents: 9900000,
    country: "RU",
    city: "Москва",
    originalListingUrl: "https://www.avito.ru/moskva/avtomobili/porsche_cayenne_s_3.0_at_2023_59_km_4463122023",
    thumbnailUrl: placeholderImages[0],
    status: "published",
    shortDescription: "Cayenne S из листинга Avito, демо пробег.",
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "AWD",
    engineVolumeCc: 2995,
    powerHp: 353,
    doors: 5,
    seats: 5,
    color: "Синий",
    vatRateBps: 2000,
    customsDutyBps: 1500,
    features: ["Пневмоподвеска", "Матрикс-фары", "Спортпакет"],
    specs: [
      { group: "Двигатель", label: "Объем", value: "3.0 л" },
      { group: "Мощность", label: "ЛС", value: "353 hp" },
      { group: "Привод", label: "Тип", value: "AWD" },
    ],
    markets: ["RU"],
    logistics: placeholderLogistics,
    documents: [{ title: "Отчет о проверке", url: "https://example.com/report.pdf" }],
    images: placeholderImages,
  },
  {
    id: crypto.randomUUID(),
    slug: "mercedes-v-class-2024",
    title: "Mercedes-Benz V-Class 2.0d",
    brand: "Mercedes-Benz",
    model: "V-Класс",
    generation: null,
    bodyType: "Van",
    year: 2024,
    mileage: 15,
    mileageUnit: "km",
    basePriceEurCents: 6500000,
    country: "RU",
    city: "Москва",
    originalListingUrl: "https://www.avito.ru/moskva/avtomobili/mercedes-benz_v-klass_2.0_at_2024_15_km_4494731898",
    thumbnailUrl: placeholderImages[0],
    status: "published",
    shortDescription: "Минивэн V-Class, свежий пробег.",
    fuelType: "Diesel",
    transmission: "Automatic",
    driveType: "RWD",
    engineVolumeCc: 1950,
    powerHp: 190,
    doors: 5,
    seats: 7,
    color: "Белый",
    vatRateBps: 2000,
    customsDutyBps: 1500,
    features: ["7 мест", "Капитанские кресла", "Панорамная крыша"],
    specs: [
      { group: "Двигатель", label: "Объем", value: "2.0 л" },
      { group: "Мощность", label: "ЛС", value: "190 hp" },
      { group: "Привод", label: "Тип", value: "RWD" },
    ],
    markets: ["RU"],
    logistics: placeholderLogistics,
    documents: [{ title: "Отчет о проверке", url: "https://example.com/report.pdf" }],
    images: placeholderImages,
  },
  {
    id: crypto.randomUUID(),
    slug: "ski-doo-skandic-le-900-2025",
    title: "BRP Ski-Doo Skandic LE 900 ACE",
    brand: "BRP",
    model: "Ski-Doo Skandic",
    generation: null,
    bodyType: "Snowmobile",
    year: 2025,
    mileage: 40,
    mileageUnit: "km",
    basePriceEurCents: 2050000,
    country: "RU",
    city: "Москва",
    originalListingUrl: "https://www.avito.ru/moskva/mototsikly_i_mototehnika/vrp_ski-doo_skandic_le_20_900_2025_7694768606",
    thumbnailUrl: placeholderImages[0],
    status: "published",
    shortDescription: "Skandic LE 900 ACE, свежая поставка.",
    fuelType: "Petrol",
    transmission: "CVT",
    driveType: "AWD",
    engineVolumeCc: 900,
    powerHp: 95,
    doors: 0,
    seats: 2,
    color: "Синий",
    vatRateBps: 2000,
    customsDutyBps: 1500,
    features: ["Гусеница 20\"", "Багажные места", "Подогрев ручек"],
    specs: [
      { group: "Двигатель", label: "Объем", value: "900 см³" },
      { group: "Мощность", label: "ЛС", value: "95 hp" },
      { group: "Привод", label: "Тип", value: "AWD" },
    ],
    markets: ["RU"],
    logistics: placeholderLogistics,
    documents: [{ title: "Отчет о проверке", url: "https://example.com/report.pdf" }],
    images: placeholderImages,
  },
  {
    id: crypto.randomUUID(),
    slug: "porsche-cayenne-auto-ru-2023",
    title: "Porsche Cayenne 3.0 (auto.ru)",
    brand: "Porsche",
    model: "Cayenne",
    generation: null,
    bodyType: "SUV",
    year: 2023,
    mileage: 12000,
    mileageUnit: "km",
    basePriceEurCents: 9400000,
    country: "RU",
    city: "Москва",
    originalListingUrl: "https://auto.ru/cars/used/sale/porsche/cayenne/1126224276-10983cfc/",
    thumbnailUrl: placeholderImages[0],
    status: "published",
    shortDescription: "Импортирован из auto.ru, данные уточняются.",
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "AWD",
    engineVolumeCc: 2995,
    powerHp: 353,
    doors: 5,
    seats: 5,
    color: "Серебристый",
    vatRateBps: 2000,
    customsDutyBps: 1500,
    features: ["Пневмоподвеска", "LED Matrix", "Камеры 360"],
    specs: [
      { group: "Двигатель", label: "Объем", value: "3.0 л" },
      { group: "Мощность", label: "ЛС", value: "353 hp" },
      { group: "Привод", label: "Тип", value: "AWD" },
    ],
    markets: ["RU"],
    logistics: placeholderLogistics,
    documents: [{ title: "Отчет о проверке", url: "https://example.com/report.pdf" }],
    images: placeholderImages,
  },
];

const seedVehicles = [...demoVehicles, ...extraVehicles];

async function main() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query("SELECT COUNT(*)::int AS total FROM vehicles");
    const rawTotal = result.rows[0]?.total ?? 0;
    const vehicleCount = typeof rawTotal === "number" ? rawTotal : Number.parseInt(rawTotal, 10) || 0;

    if (vehicleCount > 0) {
      console.log("Vehicles already exist, skipping demo seed");
      return;
    }

    await client.query("BEGIN");

    try {
      for (const vehicle of seedVehicles) {
        await client.query(
          `
            INSERT INTO vehicles (
              id, slug, title, brand, model, generation, body_type, year, mileage, mileage_unit,
              base_price_eur_cents, country, city, original_listing_url, thumbnail_url, status,
              short_description, fuel_type, transmission, drive_type, engine_volume_cc, power_hp,
              doors, seats, color, vat_rate_bps, customs_duty_bps
            )
            VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
              $11, $12, $13, $14, $15, $16,
              $17, $18, $19, $20, $21, $22,
              $23, $24, $25, $26, $27
            )
          `,
          [
            vehicle.id,
            vehicle.slug,
            vehicle.title,
            vehicle.brand,
            vehicle.model,
            vehicle.generation,
            vehicle.bodyType,
            vehicle.year,
            vehicle.mileage,
            vehicle.mileageUnit,
            vehicle.basePriceEurCents,
            vehicle.country,
            vehicle.city,
            vehicle.originalListingUrl,
            vehicle.thumbnailUrl,
            vehicle.status,
            vehicle.shortDescription,
            vehicle.fuelType,
            vehicle.transmission,
            vehicle.driveType,
            vehicle.engineVolumeCc,
            vehicle.powerHp,
            vehicle.doors,
            vehicle.seats,
            vehicle.color,
            vehicle.vatRateBps,
            vehicle.customsDutyBps,
          ],
        );

        for (const [index, url] of vehicle.images.entries()) {
          await client.query(
            `
              INSERT INTO vehicle_images (vehicle_id, url, is_primary, sort_order)
              VALUES ($1, $2, $3, $4)
            `,
            [vehicle.id, url, index === 0, index],
          );
        }

        for (const [index, label] of vehicle.features.entries()) {
          await client.query(
            `
              INSERT INTO vehicle_features (vehicle_id, label, sort_order)
              VALUES ($1, $2, $3)
            `,
            [vehicle.id, label, index],
          );
        }

        for (const [index, spec] of vehicle.specs.entries()) {
          await client.query(
            `
              INSERT INTO vehicle_specifications (vehicle_id, "group", label, value, sort_order)
              VALUES ($1, $2, $3, $4, $5)
            `,
            [vehicle.id, spec.group, spec.label, spec.value, index],
          );
        }

        for (const countryCode of vehicle.markets) {
          await client.query(
            `
              INSERT INTO vehicle_markets (vehicle_id, country_code)
              VALUES ($1, $2)
              ON CONFLICT DO NOTHING
            `,
            [vehicle.id, countryCode],
          );
        }

        for (const [index, milestone] of vehicle.logistics.entries()) {
          await client.query(
            `
              INSERT INTO logistics_milestones (vehicle_id, label, description, eta_days, sort_order)
              VALUES ($1, $2, $3, $4, $5)
            `,
            [vehicle.id, milestone.label, milestone.description, milestone.etaDays, index],
          );
        }

        for (const doc of vehicle.documents) {
          await client.query(
            `
              INSERT INTO compliance_documents (vehicle_id, title, url)
              VALUES ($1, $2, $3)
            `,
            [vehicle.id, doc.title, doc.url],
          );
        }
      }

      await client.query("COMMIT");
      console.log("Demo vehicles seeded");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("Failed to seed demo data", error);
  process.exitCode = 1;
});
