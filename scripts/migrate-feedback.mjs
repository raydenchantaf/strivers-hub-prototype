/**
 * Creates the feedback table in Neon.
 * Usage: node scripts/migrate-feedback.mjs
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
  console.log("Running feedback migration...\n");

  await sql`
    CREATE TABLE IF NOT EXISTS feedback (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      article_slug  TEXT NOT NULL,
      article_title TEXT NOT NULL,
      rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      notes         TEXT,
      user_id       UUID,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log("✓ feedback table");

  await sql`
    CREATE INDEX IF NOT EXISTS feedback_article_slug_idx ON feedback (article_slug)
  `;
  console.log("✓ feedback_article_slug_idx");

  await sql`
    CREATE INDEX IF NOT EXISTS feedback_created_at_idx ON feedback (created_at DESC)
  `;
  console.log("✓ feedback_created_at_idx");

  console.log("\nMigration complete.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
