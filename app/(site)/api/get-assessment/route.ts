import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

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

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromCookie(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: "NOT_AUTHENTICATED" }, { status: 401 });
    }

    const sql = getDb();
    const rows = await sql`
      SELECT score, category, language, submitted_at
      FROM assessment_submissions
      WHERE user_id = ${userId}
      ORDER BY submitted_at DESC
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({ success: true, result: null });
    }

    const row = rows[0];
    return NextResponse.json({
      success: true,
      result: {
        score:       Number(row.score),
        category:    row.category,
        language:    row.language,
        submittedAt: row.submitted_at,
      },
    });
  } catch (err) {
    console.error("[get-assessment] error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
