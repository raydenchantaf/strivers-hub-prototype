/**
 * One-time migration: split `name` into `first_name` + `last_name`
 * on the existing mentorship_signups table.
 *
 * Usage: node scripts/migrate-mentorship-rename.mjs
 *
 * Safe to re-run — each step is guarded so it won't fail if already applied.
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
  console.log("Running mentorship_signups name-split migration...\n");

  // 1. Add first_name column if it doesn't exist
  await sql`
    ALTER TABLE mentorship_signups
    ADD COLUMN IF NOT EXISTS first_name TEXT
  `;
  console.log("✓ Added first_name column");

  // 2. Add last_name column if it doesn't exist
  await sql`
    ALTER TABLE mentorship_signups
    ADD COLUMN IF NOT EXISTS last_name TEXT
  `;
  console.log("✓ Added last_name column");

  // 3. Backfill from existing name column
  //    first_name = everything before the first space
  //    last_name  = everything after (empty string if no space)
  await sql`
    UPDATE mentorship_signups
    SET
      first_name = SPLIT_PART(name, ' ', 1),
      last_name  = TRIM(SUBSTRING(name FROM POSITION(' ' IN name)))
    WHERE first_name IS NULL OR last_name IS NULL
  `;
  console.log("✓ Backfilled first_name / last_name from name");

  // 4. Set NOT NULL constraints now that data is populated
  await sql`
    ALTER TABLE mentorship_signups
    ALTER COLUMN first_name SET NOT NULL,
    ALTER COLUMN last_name  SET NOT NULL
  `;
  console.log("✓ Applied NOT NULL constraints");

  // 5. Drop the old name column
  await sql`
    ALTER TABLE mentorship_signups
    DROP COLUMN IF EXISTS name
  `;
  console.log("✓ Dropped old name column");

  console.log("\nMigration complete. mentorship_signups now has first_name + last_name.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
