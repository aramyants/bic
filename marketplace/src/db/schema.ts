import { relations } from 'drizzle-orm';
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
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull(),
    name: text('name'),
    passwordHash: text('password_hash').notNull(),
    role: text('role').notNull().default('admin'),
    createdAt: timestamp('created_at', { withTimezone: false })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: false })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex('users_email_idx').on(table.email),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const adminSessions = pgTable(
  'admin_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull(),
    createdAt: timestamp('created_at', { withTimezone: false })
      .defaultNow()
      .notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: false }).notNull(),
    userAgent: text('user_agent'),
    ipAddress: text('ip_address'),
  },
  (table) => ({
    tokenIdx: uniqueIndex('admin_sessions_token_idx').on(table.tokenHash),
  })
);

export const vehicles = pgTable(
  'vehicles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    brand: text('brand').notNull(),
    model: text('model').notNull(),
    generation: text('generation'),
    bodyType: text('body_type'),
    year: integer('year').notNull(),
    mileage: integer('mileage'),
    mileageUnit: text('mileage_unit').notNull().default('km'),
    basePriceEurCents: integer('base_price_eur_cents').notNull(),
    basePriceRubCents: integer('base_price_rub_cents'),
    vatRateBps: integer('vat_rate_bps'),
    customsDutyBps: integer('customs_duty_bps'),
    country: text('country').notNull(),
    city: text('city'),
    deliveryPorts: text('delivery_ports'),
    originalListingUrl: text('original_listing_url'),
    thumbnailUrl: text('thumbnail_url'),
    status: text('status').notNull().default('published'),
    shortDescription: text('short_description'),
    longDescription: text('long_description'),
    fuelType: text('fuel_type'),
    transmission: text('transmission'),
    driveType: text('drive_type'),
    engineVolumeCc: integer('engine_volume_cc'),
    powerHp: integer('power_hp'),
    torqueNm: integer('torque_nm'),
    doors: integer('doors'),
    seats: integer('seats'),
    color: text('color'),
    vin: text('vin'),
    co2Emission: numeric('co2_emission'),
    createdAt: timestamp('created_at', { withTimezone: false })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: false })
      .defaultNow()
      .notNull(),
    meta: text('meta'),
  },
  (table) => ({
    slugIdx: uniqueIndex('vehicles_slug_idx').on(table.slug),
    brandIdx: index('vehicles_brand_model_year_idx').on(
      table.brand,
      table.model,
      table.year
    ),
  })
);

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;

export const vehicleImages = pgTable('vehicle_images', {
  id: serial('id').primaryKey(),
  vehicleId: uuid('vehicle_id')
    .notNull()
    .references(() => vehicles.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  altText: text('alt_text'),
  isPrimary: boolean('is_primary').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export const vehicleFeatures = pgTable('vehicle_features', {
  id: serial('id').primaryKey(),
  vehicleId: uuid('vehicle_id')
    .notNull()
    .references(() => vehicles.id, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  icon: text('icon'),
  category: text('category'),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const vehicleSpecifications = pgTable('vehicle_specifications', {
  id: serial('id').primaryKey(),
  vehicleId: uuid('vehicle_id')
    .notNull()
    .references(() => vehicles.id, { onDelete: 'cascade' }),
  group: text('group'),
  label: text('label').notNull(),
  value: text('value').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const vehicleMarkets = pgTable(
  'vehicle_markets',
  {
    vehicleId: uuid('vehicle_id')
      .notNull()
      .references(() => vehicles.id, { onDelete: 'cascade' }),
    countryCode: text('country_code').notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.vehicleId, table.countryCode],
      name: 'vehicle_markets_pk',
    }),
  })
);

export const logisticsMilestones = pgTable('logistics_milestones', {
  id: serial('id').primaryKey(),
  vehicleId: uuid('vehicle_id')
    .notNull()
    .references(() => vehicles.id, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  description: text('description'),
  etaDays: integer('eta_days'),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const complianceDocuments = pgTable('compliance_documents', {
  id: serial('id').primaryKey(),
  vehicleId: uuid('vehicle_id')
    .notNull()
    .references(() => vehicles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  url: text('url').notNull(),
  issuedAt: timestamp('issued_at', { withTimezone: false }),
  expiresAt: timestamp('expires_at', { withTimezone: false }),
});

export const inquiries = pgTable(
  'inquiries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    vehicleId: uuid('vehicle_id').references(() => vehicles.id, {
      onDelete: 'set null',
    }),
    customerType: text('customer_type').notNull().default('individual'),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    message: text('message'),
    status: text('status').notNull().default('new'),
    estimatedCostCents: integer('estimated_cost_cents'),
    payload: text('payload'),
    createdAt: timestamp('created_at', { withTimezone: false })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: false })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    statusIdx: index('inquiries_status_idx').on(table.status, table.createdAt),
  })
);

export const exchangeRates = pgTable(
  'exchange_rates',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    baseCurrency: text('base_currency').notNull(),
    targetCurrency: text('target_currency').notNull(),
    rate: numeric('rate').notNull(),
    fetchedAt: timestamp('fetched_at', { withTimezone: false })
      .defaultNow()
      .notNull(),
    source: text('source').notNull().default('cbr-xml-daily'),
  },
  (table) => ({
    currencyIdx: uniqueIndex('exchange_rates_currency_idx').on(
      table.baseCurrency,
      table.targetCurrency
    ),
  })
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

export const vehicleFeaturesRelations = relations(
  vehicleFeatures,
  ({ one }) => ({
    vehicle: one(vehicles, {
      fields: [vehicleFeatures.vehicleId],
      references: [vehicles.id],
    }),
  })
);

export const vehicleSpecificationsRelations = relations(
  vehicleSpecifications,
  ({ one }) => ({
    vehicle: one(vehicles, {
      fields: [vehicleSpecifications.vehicleId],
      references: [vehicles.id],
    }),
  })
);

export const vehicleMarketsRelations = relations(vehicleMarkets, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [vehicleMarkets.vehicleId],
    references: [vehicles.id],
  }),
}));

export const logisticsMilestonesRelations = relations(
  logisticsMilestones,
  ({ one }) => ({
    vehicle: one(vehicles, {
      fields: [logisticsMilestones.vehicleId],
      references: [vehicles.id],
    }),
  })
);

export const complianceDocumentsRelations = relations(
  complianceDocuments,
  ({ one }) => ({
    vehicle: one(vehicles, {
      fields: [complianceDocuments.vehicleId],
      references: [vehicles.id],
    }),
  })
);

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

// Testimonials
export const testimonials = pgTable('testimonials', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  location: text('location'),
  avatar: text('avatar'),
  content: text('content').notNull(),
  rating: integer('rating').notNull().default(5),
  isPublished: boolean('is_published').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

// Calculator Configuration
export const calculatorConfig = pgTable('calculator_config', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  isActive: boolean('is_active').notNull().default(false),
  mode: text('mode').notNull().default('standard'),
  applyToVehicles: boolean('apply_to_vehicles').notNull().default(true),
  logisticsBaseCost: integer('logistics_base_cost').notNull().default(180000),
  logisticsCostPerKm: numeric('logistics_cost_per_km').default('0'),
  dutyPercent: numeric('duty_percent').notNull().default('12'),
  exciseBaseCost: integer('excise_base_cost').notNull().default(0),
  recyclingBaseCost: integer('recycling_base_cost').notNull().default(34000),
  vatPercent: numeric('vat_percent').notNull().default('20'),
  brokerBaseCost: integer('broker_base_cost').notNull().default(45000),
  commissionPercent: numeric('commission_percent').notNull().default('5'),
  insurancePercent: numeric('insurance_percent').notNull().default('1.2'),
  serviceFeeIndividualPercent: numeric('service_fee_individual_percent')
    .notNull()
    .default('0.9'),
  serviceFeeCompanyPercent: numeric('service_fee_company_percent')
    .notNull()
    .default('1.2'),
  documentPackageCost: integer('document_package_cost').notNull().default(28000),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export type CalculatorConfig = typeof calculatorConfig.$inferSelect;
export type NewCalculatorConfig = typeof calculatorConfig.$inferInsert;

// External Vehicle Sources
export const externalVehicleSources = pgTable('external_vehicle_sources', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  apiUrl: text('api_url').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  priority: integer('priority').notNull().default(100),
  lastSyncAt: timestamp('last_sync_at', { withTimezone: false }),
  createdAt: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export type ExternalVehicleSource = typeof externalVehicleSources.$inferSelect;
export type NewExternalVehicleSource =
  typeof externalVehicleSources.$inferInsert;
