/**
 * Export all assessment submissions to Excel.
 *
 * Usage:
 *   node scripts/export.mjs           → English headers
 *   node scripts/export.mjs --lang=bm → Bahasa Malaysia headers
 *
 * Output: exports/submissions_YYYY-MM-DD.xlsx
 */

import { neon } from "@neondatabase/serverless";
import * as XLSX from "xlsx";
import { readFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { questionOrder, questionLabels } from "../data/questions-map.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Config ───────────────────────────────────────────────────────────────────

const lang = process.argv.includes("--lang=bm") ? "bm" : "en";

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

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log(`Fetching submissions (language: ${lang})...`);

  const rows = await sql`
    SELECT
      s.id,
      s.submitted_at,
      s.language         AS response_language,
      s.score,
      s.category,
      s.answers_readable,
      u.first_name       AS user_first_name,
      u.last_name        AS user_last_name,
      u.email            AS user_email
    FROM assessment_submissions s
    LEFT JOIN users u ON u.id = s.user_id
    ORDER BY s.submitted_at DESC
  `;

  if (rows.length === 0) {
    console.log("No submissions found.");
    return;
  }

  console.log(`Found ${rows.length} submission(s). Building Excel...`);

  // ── Build column headers ────────────────────────────────────────────────────
  const metaHeaders = [
    "Submission ID",
    "Submitted At",
    "Response Language",
    "Score",
    "Category",
    "Registered User — First Name",
    "Registered User — Last Name",
    "Registered User — Email",
  ];

  const questionHeaders = questionOrder.map(
    (id) => questionLabels[id]?.[lang] ?? id
  );

  const allHeaders = [...metaHeaders, ...questionHeaders];

  // ── Build rows ──────────────────────────────────────────────────────────────
  const dataRows = rows.map((row) => {
    const readable = row.answers_readable ?? {};

    const meta = [
      row.id,
      row.submitted_at
        ? new Date(row.submitted_at).toLocaleString("en-MY", { timeZone: "Asia/Kuala_Lumpur" })
        : "",
      row.response_language?.toUpperCase() ?? "",
      row.score,
      row.category,
      row.user_first_name ?? "",
      row.user_last_name  ?? "",
      row.user_email      ?? "",
    ];

    const answers = questionOrder.map((id) => readable[id] ?? "");

    return [...meta, ...answers];
  });

  // ── Assemble workbook ───────────────────────────────────────────────────────
  const worksheetData = [allHeaders, ...dataRows];
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  // Column widths
  ws["!cols"] = [
    { wch: 14 }, // Submission ID
    { wch: 20 }, // Submitted At
    { wch: 10 }, // Language
    { wch: 8  }, // Score
    { wch: 14 }, // Category
    { wch: 22 }, // User First Name
    { wch: 22 }, // User Last Name
    { wch: 30 }, // User Email
    ...questionOrder.map(() => ({ wch: 35 })),
  ];

  // Bold header row
  const headerRange = XLSX.utils.decode_range(ws["!ref"]);
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddr = XLSX.utils.encode_cell({ r: 0, c: col });
    if (ws[cellAddr]) {
      ws[cellAddr].s = { font: { bold: true } };
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Submissions");

  // ── Save file ───────────────────────────────────────────────────────────────
  const exportDir = resolve(__dirname, "../exports");
  mkdirSync(exportDir, { recursive: true });

  const date = new Date().toISOString().slice(0, 10);
  const filename = `submissions_${date}_${lang}.xlsx`;
  const filepath = resolve(exportDir, filename);

  XLSX.writeFile(wb, filepath);
  console.log(`\n✓ Exported ${rows.length} row(s) → exports/${filename}`);
}

run().catch((err) => {
  console.error("Export failed:", err.message);
  process.exit(1);
});
