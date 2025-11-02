import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const pool = new Pool({ connectionString });

try {
  const db = drizzle(pool);
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Migrations applied");
} catch (error) {
  console.error("Migration failed", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
