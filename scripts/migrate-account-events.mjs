/**
 * Creates the account_events table in Neon.
 * Usage: node scripts/migrate-account-events.mjs
 *
 * Stores anonymised signup/deletion events only — no PII.
 * PDPA compliant: no names, emails, or identifiers are stored.
 */

import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getDbUrl() {
  try {
    const env = readFileSync(resolve(__dirname, "../.env.local"), "utf8");
    const match = env.match(/^DATABASE_URL=(.+)$/m);
    if (match) return match[1].trim();
  } catch {}
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  throw new Error("DATABASE_URL not found in .env.local or environment");
}

const sql = neon(getDbUrl());

async function migrate() {
  console.log("Running account_events migration...\n");

  await sql`
    CREATE TABLE IF NOT EXISTS account_events (
      id         SERIAL PRIMARY KEY,
      event_type TEXT        NOT NULL CHECK (event_type IN ('registered', 'deleted')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log("✓ account_events");

  // Index for fast date-range queries
  await sql`
    CREATE INDEX IF NOT EXISTS idx_account_events_type_date
    ON account_events (event_type, created_at)
  `;
  console.log("✓ index on (event_type, created_at)");

  console.log("\nMigration complete.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
