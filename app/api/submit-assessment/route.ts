import { NextRequest, NextResponse } from "next/server";
import { questions } from "@/data/questions";

export interface AssessmentSubmission {
  language: "en" | "bm";
  score: number;
  category: string;
  answers: Record<string, string | string[]>; // keys are strings after JSON.parse
}

export async function POST(req: NextRequest) {
  try {
    const body: AssessmentSubmission = await req.json();

    // JSON.parse always produces string keys — cast explicitly
    const answers = body.answers as Record<string, string | string[]>;

    // ── Build column headers from question texts (EN) ──────────────────────
    const questionHeaders = questions.map((q) => q.text.en);

    // ── Resolve each answer to its human-readable label ───────────────────
    const questionValues = questions.map((q) => {
      const raw = answers[String(q.id)];
      if (raw === undefined || raw === null || raw === "") return "";

      const type = q.type ?? "single";

      if (type === "likert") {
        return String(raw);
      }

      if (type === "multi") {
        const ids = Array.isArray(raw) ? raw : [raw];
        return ids
          .map((id) => q.options.find((o) => o.id === id)?.label.en ?? id)
          .join(", ");
      }

      // single
      const id = Array.isArray(raw) ? raw[0] : raw;
      return q.options.find((o) => o.id === id)?.label.en ?? String(id);
    });

    // ── Assemble the payload ───────────────────────────────────────────────
    const headers = [
      "Timestamp",
      "Language",
      "Score",
      "Category",
      ...questionHeaders,
    ];

    const values = [
      new Date().toISOString().replace("T", " ").slice(0, 19),
      body.language,
      body.score,
      body.category,
      ...questionValues,
    ];

    // Debug log — visible in Vercel function logs
    console.log("[submit-assessment] answers received:", JSON.stringify(answers));
    console.log("[submit-assessment] values to write:", JSON.stringify(values));

    const payload = { headers, values };

    // ── Forward to Apps Script ─────────────────────────────────────────────
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
      console.warn("GOOGLE_SCRIPT_URL not set — skipping Sheets submission");
      return NextResponse.json({ success: true, skipped: true });
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`Apps Script returned ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[submit-assessment] error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 200 });
  }
}
