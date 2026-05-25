import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const sql = getDb();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "MISSING_FIELDS" }, { status: 400 });
    }

    const rows = await sql`
      SELECT id, first_name, last_name, email, password_hash
      FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "INVALID_CREDENTIALS" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return NextResponse.json({ success: false, error: "INVALID_CREDENTIALS" });
    }

    // Claim any anonymous submissions that contain this user's email
    // (submitted before they registered — matched via the demographic q5i field)
    await sql`
      UPDATE assessment_submissions
      SET user_id = ${user.id}
      WHERE user_id IS NULL
        AND answers_readable->>'q5i' = ${email.toLowerCase().trim()}
    `;

    const session = {
      id:        user.id,
      firstName: user.first_name,
      lastName:  user.last_name,
      email:     user.email,
    };

    const sessionValue = Buffer.from(JSON.stringify(session)).toString("base64");
    const userValue    = JSON.stringify({ firstName: session.firstName, lastName: session.lastName, email: session.email });

    const res = NextResponse.json({ success: true, firstName: session.firstName });
    const cookieOpts = { sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 7 };
    res.cookies.set("sh_session", sessionValue, { ...cookieOpts, httpOnly: true });
    res.cookies.set("sh_user",    userValue,    { ...cookieOpts, httpOnly: false });

    return res;
  } catch (err) {
    console.error("[login] error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
