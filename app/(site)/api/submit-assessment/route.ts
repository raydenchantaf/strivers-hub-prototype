import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export interface AssessmentSubmission {
  language:         "en" | "bm";
  score:            number;
  category:         string;
  answersReadable:  Record<string, string>;
}

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
    const sql = getDb();
    const body: AssessmentSubmission = await req.json();
    const { language, score, category, answersReadable } = body;

    const userId = getUserIdFromCookie(req);

    await sql`
      INSERT INTO assessment_submissions
        (user_id, language, score, category, answers_readable)
      VALUES (
        ${userId},
        ${language},
        ${score},
        ${category},
        ${answersReadable ? JSON.stringify(answersReadable) : null}
      )
    `;

    console.log("[submit-assessment] saved — score:", score, "user:", userId ?? "anonymous");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[submit-assessment] error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 200 });
  }
}
