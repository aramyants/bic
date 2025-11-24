-- Extend calculator_config with the fields used by the UI and calculator logic
ALTER TABLE "calculator_config"
  ADD COLUMN IF NOT EXISTS "mode" text DEFAULT 'standard' NOT NULL,
  ADD COLUMN IF NOT EXISTS "apply_to_vehicles" boolean DEFAULT true NOT NULL,
  ADD COLUMN IF NOT EXISTS "insurance_percent" numeric DEFAULT '1.2' NOT NULL,
  ADD COLUMN IF NOT EXISTS "service_fee_individual_percent" numeric DEFAULT '0.9' NOT NULL,
  ADD COLUMN IF NOT EXISTS "service_fee_company_percent" numeric DEFAULT '1.2' NOT NULL,
  ADD COLUMN IF NOT EXISTS "document_package_cost" integer DEFAULT 45000 NOT NULL;

-- Backfill defaults for existing rows
UPDATE "calculator_config"
SET
  mode = COALESCE(mode, 'standard'),
  apply_to_vehicles = COALESCE(apply_to_vehicles, true),
  insurance_percent = COALESCE(insurance_percent, '1.2'),
  service_fee_individual_percent = COALESCE(service_fee_individual_percent, '0.9'),
  service_fee_company_percent = COALESCE(service_fee_company_percent, '1.2'),
  document_package_cost = COALESCE(document_package_cost, 45000)
WHERE true;

-- Seed a default active configuration if none exists
INSERT INTO "calculator_config" (
  "name",
  "description",
  "is_active",
  "mode",
  "apply_to_vehicles",
  "logistics_base_cost",
  "logistics_cost_per_km",
  "duty_percent",
  "excise_base_cost",
  "recycling_base_cost",
  "vat_percent",
  "broker_base_cost",
  "commission_percent",
  "insurance_percent",
  "service_fee_individual_percent",
  "service_fee_company_percent",
  "document_package_cost"
)
SELECT
  'Базовая конфигурация B.I.C.',
  'Стандартные ставки для калькулятора и карточек автомобилей',
  true,
  'standard',
  true,
  180000,
  '0',
  '12',
  0,
  34000,
  '20',
  45000,
  '5',
  '1.2',
  '0.9',
  '1.2',
  45000
WHERE NOT EXISTS (SELECT 1 FROM "calculator_config");
