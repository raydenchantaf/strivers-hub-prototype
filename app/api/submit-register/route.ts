import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: RegisterPayload = await req.json();

    // bcrypt: cost factor 12 = ~250ms on modern hardware (good balance of security vs speed)
    const passwordHash = await bcrypt.hash(body.password, 12);

    const scriptUrl = process.env.REGISTER_SCRIPT_URL;
    if (!scriptUrl) {
      console.warn("REGISTER_SCRIPT_URL not set — skipping Sheets submission");
      return NextResponse.json({ success: false, error: "Service unavailable" });
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "register",
        firstName: body.firstName,
        lastName:  body.lastName,
        email:     body.email,
        phone:     body.phone,
        passwordHash,
      }),
      redirect: "follow",
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success === false) {
      if (result.error === "EMAIL_EXISTS") {
        return NextResponse.json({ success: false, error: "EMAIL_EXISTS" });
      }
      throw new Error(`Apps Script error: ${result.error ?? response.status}`);
    }

    console.log("[submit-register] registered:", body.email);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[submit-register] error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 200 });
  }
}
