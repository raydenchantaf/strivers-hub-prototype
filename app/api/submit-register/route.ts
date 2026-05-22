import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

export interface RegisterPayload {
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  password:  string;
}

export async function POST(req: NextRequest) {
  try {
    const body: RegisterPayload = await req.json();
    const { firstName, lastName, email, phone, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ success: false, error: "MISSING_FIELDS" }, { status: 400 });
    }

    // Check for duplicate email
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1
    `;
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: "EMAIL_EXISTS" });
    }

    // bcrypt: cost factor 12 ≈ 250ms on modern hardware
    const passwordHash = await bcrypt.hash(password, 12);

    await sql`
      INSERT INTO users (first_name, last_name, email, phone, password_hash)
      VALUES (${firstName.trim()}, ${lastName.trim()}, ${email.toLowerCase().trim()}, ${phone?.trim() ?? null}, ${passwordHash})
    `;

    console.log("[submit-register] registered:", email);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[submit-register] error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
