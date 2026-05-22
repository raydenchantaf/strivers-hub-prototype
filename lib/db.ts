import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

/**
 * Neon serverless SQL client.
 * Import `sql` in any API route and use as a tagged template:
 *   const rows = await sql`SELECT * FROM users WHERE email = ${email}`;
 */
export const sql = neon(process.env.DATABASE_URL);
