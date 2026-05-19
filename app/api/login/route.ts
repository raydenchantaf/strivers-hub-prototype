import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const passwordHash = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const scriptUrl = process.env.REGISTER_SCRIPT_URL;
    if (!scriptUrl) {
      console.warn("REGISTER_SCRIPT_URL not set");
      return NextResponse.json({ success: false, error: "Service unavailable" });
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "login", email, passwordHash }),
      redirect: "follow",
    });

    const result = await response.json().catch(() => ({}));

    if (!result.success) {
      return NextResponse.json({ success: false, error: "INVALID_CREDENTIALS" });
    }

    // Session payload
    const session = {
      firstName: result.firstName,
      lastName:  result.lastName,
      email:     result.email,
    };

    // sh_session — httpOnly, used by middleware to verify auth
    const sessionValue = Buffer.from(JSON.stringify(session)).toString("base64");

    // sh_user — readable by JS, used by dashboard to display user info
    const userValue = JSON.stringify(session);

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
