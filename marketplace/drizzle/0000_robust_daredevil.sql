CREATE EXTENSION IF NOT EXISTS "pgcrypto";
--> statement-breakpoint
CREATE TABLE "admin_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"user_agent" text,
	"ip_address" text
);
--> statement-breakpoint
CREATE TABLE "compliance_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"issued_at" timestamp,
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "exchange_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"base_currency" text NOT NULL,
	"target_currency" text NOT NULL,
	"rate" numeric NOT NULL,
	"fetched_at" timestamp DEFAULT now() NOT NULL,
	"source" text DEFAULT 'cbr-xml-daily' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" uuid,
	"customer_type" text DEFAULT 'individual' NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"message" text,
	"status" text DEFAULT 'new' NOT NULL,
	"estimated_cost_cents" integer,
	"payload" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "logistics_milestones" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"eta_days" integer,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_features" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"label" text NOT NULL,
	"icon" text,
	"category" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"url" text NOT NULL,
	"alt_text" text,
	"is_primary" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_markets" (
	"vehicle_id" uuid NOT NULL,
	"country_code" text NOT NULL,
	CONSTRAINT "vehicle_markets_pk" PRIMARY KEY("vehicle_id","country_code")
);
--> statement-breakpoint
CREATE TABLE "vehicle_specifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"group" text,
	"label" text NOT NULL,
	"value" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"brand" text NOT NULL,
	"model" text NOT NULL,
	"generation" text,
	"body_type" text,
	"year" integer NOT NULL,
	"mileage" integer,
	"mileage_unit" text DEFAULT 'km' NOT NULL,
	"base_price_eur_cents" integer NOT NULL,
	"base_price_rub_cents" integer,
	"vat_rate_bps" integer,
	"customs_duty_bps" integer,
	"country" text NOT NULL,
	"city" text,
	"delivery_ports" text,
	"original_listing_url" text,
	"thumbnail_url" text,
	"status" text DEFAULT 'published' NOT NULL,
	"short_description" text,
	"long_description" text,
	"fuel_type" text,
	"transmission" text,
	"drive_type" text,
	"engine_volume_cc" integer,
	"power_hp" integer,
	"torque_nm" integer,
	"doors" integer,
	"seats" integer,
	"color" text,
	"vin" text,
	"co2_emission" numeric,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"meta" text
);
--> statement-breakpoint
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_documents" ADD CONSTRAINT "compliance_documents_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logistics_milestones" ADD CONSTRAINT "logistics_milestones_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_features" ADD CONSTRAINT "vehicle_features_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_images" ADD CONSTRAINT "vehicle_images_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_markets" ADD CONSTRAINT "vehicle_markets_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_specifications" ADD CONSTRAINT "vehicle_specifications_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "admin_sessions_token_idx" ON "admin_sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "exchange_rates_currency_idx" ON "exchange_rates" USING btree ("base_currency","target_currency");--> statement-breakpoint
CREATE INDEX "inquiries_status_idx" ON "inquiries" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "vehicles_slug_idx" ON "vehicles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "vehicles_brand_model_year_idx" ON "vehicles" USING btree ("brand","model","year");
