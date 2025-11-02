import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

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
const migrationsDir = path.join(process.cwd(), "drizzle");

const ensureDatabaseDirectory = () => {
  const dir = path.dirname(databasePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const applyMigrations = () => {
  ensureDatabaseDirectory();

  const db = new Database(databasePath);
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  db.pragma("foreign_keys = ON");

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf-8");
    db.exec(sql);
  }

  db.close();
};

applyMigrations();
