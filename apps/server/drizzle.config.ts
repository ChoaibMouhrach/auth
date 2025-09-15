import { env } from "@server/lib/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/database/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    user: env.SERVER_DATABASE_USER,
    password: env.SERVER_DATABASE_PASS,
    database: env.SERVER_DATABASE_NAME,
    port: env.SERVER_DATABASE_PORT,
    host: env.SERVER_DATABASE_HOST,
    ssl: false,
  },
});
