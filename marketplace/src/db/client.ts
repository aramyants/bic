import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "node:path";

import * as schema from "./schema";

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

export const sqlite = new Database(databasePath, {
  fileMustExist: false,
  verbose: undefined,
});

export const db = drizzle(sqlite, { schema });

export const runMigrations = () => {
  try {
    migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  } catch (error) {
    console.error("[drizzle] migration failed", error);
    throw error;
  }
};
