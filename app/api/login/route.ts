import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const scriptUrl = process.env.REGISTER_SCRIPT_URL;
    if (!scriptUrl) {
      console.warn("REGISTER_SCRIPT_URL not set");
      return NextResponse.json({ success: false, error: "Service unavailable" });
    }

    // Step 1: fetch the stored hash for this email from Apps Script
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "login", email }),
      redirect: "follow",
    });

    const result = await response.json().catch(() => ({}));

    if (!result.success || !result.passwordHash) {
      return NextResponse.json({ success: false, error: "INVALID_CREDENTIALS" });
    }

    // Step 2: compare submitted password against stored bcrypt hash
    const match = await bcrypt.compare(password, result.passwordHash);
    if (!match) {
      return NextResponse.json({ success: false, error: "INVALID_CREDENTIALS" });
    }

    // Build session payload
    const session = {
      firstName: result.firstName,
      lastName:  result.lastName,
      email:     result.email,
    };

    const sessionValue = Buffer.from(JSON.stringify(session)).toString("base64");
    const userValue    = JSON.stringify(session);

    const res = NextResponse.json({ success: true, firstName: result.firstName });

    const cookieOpts = { sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 7 };
    res.cookies.set("sh_session", sessionValue, { ...cookieOpts, httpOnly: true });
    res.cookies.set("sh_user",    userValue,    { ...cookieOpts, httpOnly: false });

    return res;
  } catch (err) {
    console.error("[login] error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 200 });
  }
}
