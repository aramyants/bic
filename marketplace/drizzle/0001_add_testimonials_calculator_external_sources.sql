-- Create testimonials table
CREATE TABLE IF NOT EXISTS "testimonials" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "location" text,
  "avatar" text,
  "content" text NOT NULL,
  "rating" integer DEFAULT 5 NOT NULL,
  "is_published" boolean DEFAULT true NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
-- Create calculator_config table
CREATE TABLE IF NOT EXISTS "calculator_config" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "is_active" boolean DEFAULT false NOT NULL,
  "logistics_base_cost" integer DEFAULT 180000 NOT NULL,
  "logistics_cost_per_km" numeric DEFAULT '0',
  "duty_percent" numeric DEFAULT '12' NOT NULL,
  "excise_base_cost" integer DEFAULT 0 NOT NULL,
  "recycling_base_cost" integer DEFAULT 34000 NOT NULL,
  "vat_percent" numeric DEFAULT '20' NOT NULL,
  "broker_base_cost" integer DEFAULT 45000 NOT NULL,
  "commission_percent" numeric DEFAULT '5' NOT NULL,
  "description" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
-- Create external_vehicle_sources table
CREATE TABLE IF NOT EXISTS "external_vehicle_sources" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "api_url" text NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "priority" integer DEFAULT 100 NOT NULL,
  "last_sync_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
-- Add source field to vehicles table to track origin
ALTER TABLE "vehicles"
ADD COLUMN IF NOT EXISTS "source" text DEFAULT 'manual';
ALTER TABLE "vehicles"
ADD COLUMN IF NOT EXISTS "external_id" text;
ALTER TABLE "vehicles"
ADD COLUMN IF NOT EXISTS "source_priority" integer DEFAULT 0;
-- Insert default calculator config
INSERT INTO "calculator_config" ("name", "is_active", "description")
VALUES (
    'Стандартная конфигурация',
    true,
    'Конфигурация калькулятора по умолчанию'
  ) ON CONFLICT DO NOTHING;
-- Insert external sources
INSERT INTO "external_vehicle_sources" ("name", "api_url", "priority")
VALUES (
    'Plutos Auto',
    'https://mobile-plutosauto.ru/api/cars',
    200
  ),
  (
    'Encar Tewris',
    'https://encar.tewris.com/api/cars',
    300
  ) ON CONFLICT DO NOTHING;
