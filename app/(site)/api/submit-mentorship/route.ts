import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone } = body;
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ success: false, error: "MISSING_FIELDS" }, { status: 400 });
    }
    await sql`
      INSERT INTO mentorship_signups (first_name, last_name, email, phone)
      VALUES (${firstName.trim()}, ${lastName.trim()}, ${email.toLowerCase().trim()}, ${phone?.trim() ?? null})
    `;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[submit-mentorship] error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 200 });
  }
}
