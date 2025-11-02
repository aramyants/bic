import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    name: text("name"),
    passwordHash: text("password_hash").notNull(),
    role: text("role").notNull().default("admin"),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const adminSessions = pgTable(
  "admin_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: false }).notNull(),
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
  },
  (table) => ({
    tokenIdx: uniqueIndex("admin_sessions_token_idx").on(table.tokenHash),
  }),
);

export const vehicles = pgTable(
  "vehicles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    brand: text("brand").notNull(),
    model: text("model").notNull(),
    generation: text("generation"),
    bodyType: text("body_type"),
    year: integer("year").notNull(),
    mileage: integer("mileage"),
    mileageUnit: text("mileage_unit").notNull().default("km"),
    basePriceEurCents: integer("base_price_eur_cents").notNull(),
    basePriceRubCents: integer("base_price_rub_cents"),
    vatRateBps: integer("vat_rate_bps"),
    customsDutyBps: integer("customs_duty_bps"),
    country: text("country").notNull(),
    city: text("city"),
    deliveryPorts: text("delivery_ports"),
    originalListingUrl: text("original_listing_url"),
    thumbnailUrl: text("thumbnail_url"),
    status: text("status").notNull().default("published"),
    shortDescription: text("short_description"),
    longDescription: text("long_description"),
    fuelType: text("fuel_type"),
    transmission: text("transmission"),
    driveType: text("drive_type"),
    engineVolumeCc: integer("engine_volume_cc"),
    powerHp: integer("power_hp"),
    torqueNm: integer("torque_nm"),
    doors: integer("doors"),
    seats: integer("seats"),
    color: text("color"),
    vin: text("vin"),
    co2Emission: numeric("co2_emission"),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
    meta: text("meta"),
  },
  (table) => ({
    slugIdx: uniqueIndex("vehicles_slug_idx").on(table.slug),
    brandIdx: index("vehicles_brand_model_year_idx").on(table.brand, table.model, table.year),
  }),
);

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;

export const vehicleImages = pgTable("vehicle_images", {
  id: serial("id").primaryKey(),
  vehicleId: uuid("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  altText: text("alt_text"),
  isPrimary: boolean("is_primary").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
});

export const vehicleFeatures = pgTable("vehicle_features", {
  id: serial("id").primaryKey(),
  vehicleId: uuid("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  icon: text("icon"),
  category: text("category"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const vehicleSpecifications = pgTable("vehicle_specifications", {
  id: serial("id").primaryKey(),
  vehicleId: uuid("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  group: text("group"),
  label: text("label").notNull(),
  value: text("value").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const vehicleMarkets = pgTable(
  "vehicle_markets",
  {
    vehicleId: uuid("vehicle_id")
      .notNull()
      .references(() => vehicles.id, { onDelete: "cascade" }),
    countryCode: text("country_code").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.vehicleId, table.countryCode], name: "vehicle_markets_pk" }),
  }),
);

export const logisticsMilestones = pgTable("logistics_milestones", {
  id: serial("id").primaryKey(),
  vehicleId: uuid("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  description: text("description"),
  etaDays: integer("eta_days"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const complianceDocuments = pgTable("compliance_documents", {
  id: serial("id").primaryKey(),
  vehicleId: uuid("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  issuedAt: timestamp("issued_at", { withTimezone: false }),
  expiresAt: timestamp("expires_at", { withTimezone: false }),
});

export const inquiries = pgTable(
  "inquiries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    vehicleId: uuid("vehicle_id").references(() => vehicles.id, { onDelete: "set null" }),
    customerType: text("customer_type").notNull().default("individual"),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    message: text("message"),
    status: text("status").notNull().default("new"),
    estimatedCostCents: integer("estimated_cost_cents"),
    payload: text("payload"),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => ({
    statusIdx: index("inquiries_status_idx").on(table.status, table.createdAt),
  }),
);

export const exchangeRates = pgTable(
  "exchange_rates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    baseCurrency: text("base_currency").notNull(),
    targetCurrency: text("target_currency").notNull(),
    rate: numeric("rate").notNull(),
    fetchedAt: timestamp("fetched_at", { withTimezone: false }).defaultNow().notNull(),
    source: text("source").notNull().default("cbr-xml-daily"),
  },
  (table) => ({
    currencyIdx: uniqueIndex("exchange_rates_currency_idx").on(table.baseCurrency, table.targetCurrency),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(adminSessions),
}));

export const vehiclesRelations = relations(vehicles, ({ many }) => ({
  images: many(vehicleImages),
  features: many(vehicleFeatures),
  specifications: many(vehicleSpecifications),
  markets: many(vehicleMarkets),
  logistics: many(logisticsMilestones),
  documents: many(complianceDocuments),
  inquiries: many(inquiries),
}));

export const vehicleImagesRelations = relations(vehicleImages, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [vehicleImages.vehicleId],
    references: [vehicles.id],
  }),
}));

export const vehicleFeaturesRelations = relations(vehicleFeatures, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [vehicleFeatures.vehicleId],
    references: [vehicles.id],
  }),
}));

export const vehicleSpecificationsRelations = relations(vehicleSpecifications, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [vehicleSpecifications.vehicleId],
    references: [vehicles.id],
  }),
}));

export const vehicleMarketsRelations = relations(vehicleMarkets, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [vehicleMarkets.vehicleId],
    references: [vehicles.id],
  }),
}));

export const logisticsMilestonesRelations = relations(logisticsMilestones, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [logisticsMilestones.vehicleId],
    references: [vehicles.id],
  }),
}));

export const complianceDocumentsRelations = relations(complianceDocuments, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [complianceDocuments.vehicleId],
    references: [vehicles.id],
  }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [inquiries.vehicleId],
    references: [vehicles.id],
  }),
}));

export const adminSessionsRelations = relations(adminSessions, ({ one }) => ({
  user: one(users, {
    fields: [adminSessions.userId],
    references: [users.id],
  }),
}));
