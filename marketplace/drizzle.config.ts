import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./sqlite/bic.db",
  },
  verbose: true,
  strict: true,
});
