import { NextRequest, NextResponse } from "next/server";

export interface MentorshipSignup {
  name: string;
  email: string;
  phone: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: MentorshipSignup = await req.json();

    const headers = ["Timestamp", "Full Name", "Email Address", "Contact Number"];
    const values = [
      new Date().toISOString().replace("T", " ").slice(0, 19),
      body.name,
      body.email,
      body.phone,
    ];

    console.log("[submit-mentorship] signup:", JSON.stringify(values));

    const scriptUrl = process.env.MENTORSHIP_SCRIPT_URL;
    if (!scriptUrl) {
      console.warn("MENTORSHIP_SCRIPT_URL not set — skipping Sheets submission");
      return NextResponse.json({ success: true, skipped: true });
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ headers, values }),
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`Apps Script returned ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[submit-mentorship] error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 200 });
  }
}
