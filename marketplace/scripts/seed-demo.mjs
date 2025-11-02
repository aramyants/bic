import "dotenv/config";
import crypto from "node:crypto";
import { Client } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL must be set in .env");
  process.exit(1);
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
      for (const vehicle of demoVehicles) {
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
