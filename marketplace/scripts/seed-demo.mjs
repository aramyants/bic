import "dotenv/config";
import crypto from "node:crypto";
import path from "node:path";
import Database from "better-sqlite3";

const resolveDatabasePath = () => {
  const envPath = process.env.DATABASE_PATH;
  if (!envPath) {
    return path.join(process.cwd(), "sqlite", "bic.db");
  }
  return path.isAbsolute(envPath) ? envPath : path.join(process.cwd(), envPath);
};

const db = new Database(resolveDatabasePath());
db.pragma("foreign_keys = ON");

const vehicleCount = db.prepare("SELECT COUNT(*) as total FROM vehicles").get()?.total ?? 0;
if (vehicleCount > 0) {
  console.log("Vehicles already exist, skipping demo seed");
  db.close();
  process.exit(0);
}

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
      { label: "Delivery to port", description: "Truck Stuttgart → Hamburg", etaDays: 6 },
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
      { label: "Delivery to port", description: "Munich → Bremerhaven", etaDays: 5 },
      { label: "Rail to Moscow", description: "Train platform and customs", etaDays: 10 },
    ],
    documents: [
      { title: "Service history", url: "https://example.com/service.pdf" },
      { title: "Euro 6 certificate", url: "https://example.com/euro6.pdf" },
    ],
    images: [
      "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg",
      "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
      "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
    ],
  },
  {
    id: crypto.randomUUID(),
    slug: "mercedes-benz-s-580-e-4matic-2024",
    title: "Mercedes-Benz S 580 e 4Matic L AMG Line",
    brand: "Mercedes-Benz",
    model: "S-Class",
    generation: "W223",
    bodyType: "Sedan",
    year: 2024,
    mileage: 8000,
    mileageUnit: "km",
    basePriceEurCents: 11250000,
    country: "DE",
    city: "Berlin",
    originalListingUrl: "https://suchen.mobile.de/fahrzeuge/details.html?id=MercedesDemo",
    thumbnailUrl: "https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg",
    status: "published",
    shortDescription: "Plug-in hybrid, AMG Line, full assistance package",
    fuelType: "Hybrid",
    transmission: "Automatic",
    driveType: "AWD",
    engineVolumeCc: 2999,
    powerHp: 510,
    doors: 4,
    seats: 5,
    color: "Obsidian Black",
    vatRateBps: 2000,
    customsDutyBps: 1500,
    features: [
      "Driving Assistance Plus",
      "MBUX rear entertainment",
      "Burmester 4D sound system",
      "Exclusive Nappa interior",
    ],
    specs: [
      { group: "Core", label: "Engine", value: "3.0 hybrid" },
      { group: "Core", label: "Power", value: "510 hp" },
      { group: "Range", label: "EV range", value: "110 km WLTP" },
      { group: "Chassis", label: "E-Active Body Control", value: "Yes" },
    ],
    markets: ["DE", "FR", "IT", "AE", "RU"],
    logistics: [
      { label: "Dealer inspection", description: "Mercedes-Benz Berlin comprehensive check", etaDays: 3 },
      { label: "Export prep", description: "VIN check, insurance, transit plates", etaDays: 4 },
      { label: "Delivery to port", description: "Carrier Berlin → Rostock", etaDays: 5 },
      { label: "Sea freight", description: "Shipping and customs in Saint Petersburg", etaDays: 14 },
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

const insertVehicle = db.prepare(`
  INSERT INTO vehicles (
    id, slug, title, brand, model, generation, body_type, year, mileage, mileage_unit, base_price_eur_cents,
    country, city, original_listing_url, thumbnail_url, status, short_description, fuel_type, transmission,
    drive_type, engine_volume_cc, power_hp, doors, seats, color, vat_rate_bps, customs_duty_bps
  ) VALUES (
    @id, @slug, @title, @brand, @model, @generation, @bodyType, @year, @mileage, @mileageUnit, @basePriceEurCents,
    @country, @city, @originalListingUrl, @thumbnailUrl, @status, @shortDescription, @fuelType, @transmission,
    @driveType, @engineVolumeCc, @powerHp, @doors, @seats, @color, @vatRateBps, @customsDutyBps
  )
`);

const insertImage = db.prepare(`
  INSERT INTO vehicle_images (vehicle_id, url, is_primary, sort_order)
  VALUES (@vehicleId, @url, @isPrimary, @sortOrder)
`);

const insertFeature = db.prepare(`
  INSERT INTO vehicle_features (vehicle_id, label, sort_order)
  VALUES (@vehicleId, @label, @sortOrder)
`);

const insertSpec = db.prepare(`
  INSERT INTO vehicle_specifications (vehicle_id, "group", label, value, sort_order)
  VALUES (@vehicleId, @group, @label, @value, @sortOrder)
`);

const insertMarket = db.prepare(`
  INSERT INTO vehicle_markets (vehicle_id, country_code)
  VALUES (@vehicleId, @countryCode)
`);

const insertMilestone = db.prepare(`
  INSERT INTO logistics_milestones (vehicle_id, label, description, eta_days, sort_order)
  VALUES (@vehicleId, @label, @description, @etaDays, @sortOrder)
`);

const insertDocument = db.prepare(`
  INSERT INTO compliance_documents (vehicle_id, title, url)
  VALUES (@vehicleId, @title, @url)
`);

const seedVehicles = db.transaction(() => {
  for (const vehicle of demoVehicles) {
    insertVehicle.run({
      id: vehicle.id,
      slug: vehicle.slug,
      title: vehicle.title,
      brand: vehicle.brand,
      model: vehicle.model,
      generation: vehicle.generation,
      bodyType: vehicle.bodyType,
      year: vehicle.year,
      mileage: vehicle.mileage,
      mileageUnit: vehicle.mileageUnit,
      basePriceEurCents: vehicle.basePriceEurCents,
      country: vehicle.country,
      city: vehicle.city,
      originalListingUrl: vehicle.originalListingUrl,
      thumbnailUrl: vehicle.thumbnailUrl,
      status: vehicle.status,
      shortDescription: vehicle.shortDescription,
      fuelType: vehicle.fuelType,
      transmission: vehicle.transmission,
      driveType: vehicle.driveType,
      engineVolumeCc: vehicle.engineVolumeCc,
      powerHp: vehicle.powerHp,
      doors: vehicle.doors,
      seats: vehicle.seats,
      color: vehicle.color,
      vatRateBps: vehicle.vatRateBps,
      customsDutyBps: vehicle.customsDutyBps,
    });

    vehicle.images.forEach((url, index) =>
      insertImage.run({ vehicleId: vehicle.id, url, isPrimary: index === 0 ? 1 : 0, sortOrder: index }),
    );

    vehicle.features.forEach((label, index) =>
      insertFeature.run({ vehicleId: vehicle.id, label, sortOrder: index }),
    );

    vehicle.specs.forEach((spec, index) =>
      insertSpec.run({
        vehicleId: vehicle.id,
        group: spec.group,
        label: spec.label,
        value: spec.value,
        sortOrder: index,
      }),
    );

    vehicle.markets.forEach((countryCode) =>
      insertMarket.run({ vehicleId: vehicle.id, countryCode }),
    );

    vehicle.logistics.forEach((step, index) =>
      insertMilestone.run({
        vehicleId: vehicle.id,
        label: step.label,
        description: step.description,
        etaDays: step.etaDays,
        sortOrder: index,
      }),
    );

    vehicle.documents.forEach((doc) =>
      insertDocument.run({ vehicleId: vehicle.id, title: doc.title, url: doc.url }),
    );
  }
});

seedVehicles();

db.close();
console.log("Demo vehicles seeded");
