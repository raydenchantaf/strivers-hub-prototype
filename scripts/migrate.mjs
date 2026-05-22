/**
 * Run once to create all tables in Neon.
 * Usage: node scripts/migrate.mjs
 */

import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read DATABASE_URL from .env.local
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
  console.log("Running migrations...\n");

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      first_name    TEXT NOT NULL,
      last_name     TEXT NOT NULL,
      email         TEXT UNIQUE NOT NULL,
      phone         TEXT,
      password_hash TEXT NOT NULL,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✓ users");

  await sql`
    CREATE TABLE IF NOT EXISTS assessment_submissions (
      id               SERIAL PRIMARY KEY,
      user_id          INTEGER REFERENCES users(id) ON DELETE SET NULL,
      language         TEXT NOT NULL,
      score            INTEGER NOT NULL,
      category         TEXT NOT NULL,
      answers          JSONB NOT NULL,
      answers_readable JSONB,
      other_texts      JSONB,
      submitted_at     TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✓ assessment_submissions");

  await sql`
    CREATE TABLE IF NOT EXISTS mentorship_signups (
      id           SERIAL PRIMARY KEY,
      first_name   TEXT NOT NULL,
      last_name    TEXT NOT NULL,
      email        TEXT NOT NULL,
      phone        TEXT,
      signed_up_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✓ mentorship_signups");

  console.log("\nMigration complete.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
