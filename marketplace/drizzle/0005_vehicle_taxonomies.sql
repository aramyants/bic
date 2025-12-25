CREATE TABLE IF NOT EXISTS "vehicle_taxonomies" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "type" text NOT NULL,
  "value" text NOT NULL,
  "label" text NOT NULL,
  "parent_value" text,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "vehicle_taxonomies_type_value_idx" ON "vehicle_taxonomies" ("type", "value");
CREATE INDEX IF NOT EXISTS "vehicle_taxonomies_type_sort_idx" ON "vehicle_taxonomies" ("type", "sort_order");
CREATE INDEX IF NOT EXISTS "vehicle_taxonomies_parent_idx" ON "vehicle_taxonomies" ("parent_value");
