import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, password } = body;
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ success: false, error: "MISSING_FIELDS" }, { status: 400 });
    }
    const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1`;
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: "EMAIL_EXISTS" });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await sql`
      INSERT INTO users (first_name, last_name, email, phone, password_hash)
      VALUES (${firstName.trim()}, ${lastName.trim()}, ${email.toLowerCase().trim()}, ${phone?.trim() ?? null}, ${passwordHash})
    `;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[submit-register] error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
