import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const sql = getDb();
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ success: false, error: "MISSING_FIELDS" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, error: "PASSWORD_TOO_SHORT" }, { status: 400 });
    }

    // Look up the token
    const rows = await sql`
      SELECT email, expires_at FROM password_resets WHERE token = ${token} LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "INVALID_TOKEN" });
    }

    const { email, expires_at } = rows[0];

    if (new Date(expires_at) < new Date()) {
      await sql`DELETE FROM password_resets WHERE token = ${token}`;
      return NextResponse.json({ success: false, error: "EXPIRED_TOKEN" });
    }

    // Update password
    const passwordHash = await bcrypt.hash(password, 12);
    await sql`
      UPDATE users SET password_hash = ${passwordHash} WHERE email = ${email}
    `;

    // Delete the used token
    await sql`DELETE FROM password_resets WHERE token = ${token}`;

    console.log("[reset-password] password reset for:", email);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[reset-password] error:", err);
    return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
