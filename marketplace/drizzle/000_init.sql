PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT NOT NULL,
  name TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON users(email);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS admin_sessions_token_idx ON admin_sessions(token_hash);

CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  generation TEXT,
  body_type TEXT,
  year INTEGER NOT NULL,
  mileage INTEGER,
  mileage_unit TEXT NOT NULL DEFAULT 'km',
  base_price_eur_cents INTEGER NOT NULL,
  base_price_rub_cents INTEGER,
  vat_rate_bps INTEGER,
  customs_duty_bps INTEGER,
  country TEXT NOT NULL,
  city TEXT,
  delivery_ports TEXT,
  original_listing_url TEXT,
  thumbnail_url TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  short_description TEXT,
  long_description TEXT,
  fuel_type TEXT,
  transmission TEXT,
  drive_type TEXT,
  engine_volume_cc INTEGER,
  power_hp INTEGER,
  torque_nm INTEGER,
  doors INTEGER,
  seats INTEGER,
  color TEXT,
  vin TEXT,
  co2_emission REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  meta TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS vehicles_slug_idx ON vehicles(slug);
CREATE INDEX IF NOT EXISTS vehicles_brand_model_year_idx ON vehicles(brand, model, year);

CREATE TABLE IF NOT EXISTS vehicle_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  is_primary INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vehicle_features (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id TEXT NOT NULL,
  label TEXT NOT NULL,
  icon TEXT,
  category TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vehicle_specifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id TEXT NOT NULL,
  "group" TEXT,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vehicle_markets (
  vehicle_id TEXT NOT NULL,
  country_code TEXT NOT NULL,
  PRIMARY KEY (vehicle_id, country_code),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS logistics_milestones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  eta_days INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS compliance_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  issued_at TEXT,
  expires_at TEXT,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  vehicle_id TEXT,
  customer_type TEXT NOT NULL DEFAULT 'individual',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  estimated_cost_cents INTEGER,
  payload TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS inquiries_status_idx ON inquiries(status, created_at);

CREATE TABLE IF NOT EXISTS exchange_rates (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  base_currency TEXT NOT NULL,
  target_currency TEXT NOT NULL,
  rate REAL NOT NULL,
  fetched_at TEXT NOT NULL DEFAULT (datetime('now')),
  source TEXT NOT NULL DEFAULT 'cbr-xml-daily'
);

CREATE UNIQUE INDEX IF NOT EXISTS exchange_rates_currency_idx ON exchange_rates(base_currency, target_currency);
