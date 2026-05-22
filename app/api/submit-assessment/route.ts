import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export interface AssessmentSubmission {
  language:        "en" | "bm";
  score:           number;
  category:        string;
  answers:         Record<string, string | string[]>;
  answersReadable?: Record<string, string>;
  otherTexts?:     Record<string, string>;
}

/** Extract user ID from the sh_session cookie if present */
function getUserIdFromCookie(req: NextRequest): number | null {
  try {
    const raw = req.cookies.get("sh_session")?.value;
    if (!raw) return null;
    const session = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
    const id = Number(session.id);
    return Number.isFinite(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: AssessmentSubmission = await req.json();
    const { language, score, category, answers, answersReadable, otherTexts } = body;

    const userId = getUserIdFromCookie(req);

    await sql`
      INSERT INTO assessment_submissions (user_id, language, score, category, answers, answers_readable, other_texts)
      VALUES (
        ${userId},
        ${language},
        ${score},
        ${category},
        ${JSON.stringify(answers)},
        ${answersReadable ? JSON.stringify(answersReadable) : null},
        ${otherTexts ? JSON.stringify(otherTexts) : null}
      )
    `;

    console.log("[submit-assessment] saved — score:", score, "user:", userId ?? "anonymous");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[submit-assessment] error:", err);
    // Return 200 always — a DB failure must never block the user's results screen
    return NextResponse.json({ success: false, error: String(err) }, { status: 200 });
  }
}
