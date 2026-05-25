/**
 * One-time migration: adds answers_readable column to existing assessment_submissions table.
 * Run once: node scripts/migrate-add-readable.mjs
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

async function run() {
  await sql`
    ALTER TABLE assessment_submissions
    ADD COLUMN IF NOT EXISTS answers_readable JSONB
  `;
  console.log("✓ answers_readable column added to assessment_submissions");
}

run().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
