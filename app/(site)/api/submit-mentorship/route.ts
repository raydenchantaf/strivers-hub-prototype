import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const sql = getDb();
    const body = await req.json();
    const { firstName, lastName, email, phone } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ success: false, error: "MISSING_FIELDS" }, { status: 400 });
    }

    await sql`
      INSERT INTO mentorship_signups (first_name, last_name, email, phone)
      VALUES (
        ${firstName.trim()},
        ${lastName.trim()},
        ${email.toLowerCase().trim()},
        ${phone?.trim() ?? null}
      )
    `;

    console.log("[submit-mentorship] signup:", firstName.trim(), lastName.trim(), email);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[submit-mentorship] error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 200 });
  }
}
