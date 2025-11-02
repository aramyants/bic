import "dotenv/config";
import path from "node:path";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

const resolveDatabasePath = () => {
  const envPath = process.env.DATABASE_PATH;
  if (!envPath) {
    return path.join(process.cwd(), "sqlite", "bic.db");
  }
  return path.isAbsolute(envPath)
    ? envPath
    : path.join(process.cwd(), envPath);
};

const databasePath = resolveDatabasePath();
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_DEFAULT_PASSWORD;

if (!email || !password) {
  console.error("ADMIN_EMAIL and ADMIN_DEFAULT_PASSWORD must be set in .env");
  process.exit(1);
}

const db = new Database(databasePath);
db.pragma("foreign_keys = ON");

const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
const hashed = await bcrypt.hash(password, 12);

if (!existing) {
  db.prepare(
    `INSERT INTO users (email, name, password_hash, role)
     VALUES (?, ?, ?, 'admin')`
  ).run(email, "BIC Admin", hashed);
  console.log(`Created admin user ${email}`);
} else {
  db.prepare(`UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE email = ?`).run(hashed, email);
  console.log(`Updated admin password for ${email}`);
}

db.close();
