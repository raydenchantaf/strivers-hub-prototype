import { NextRequest, NextResponse } from "next/server";

export interface AssessmentSubmission {
  language: "en" | "bm";
  score: number;
  category: string;
  answers: Record<number, string>; // questionId -> optionId
}

export async function POST(req: NextRequest) {
  try {
    const body: AssessmentSubmission = await req.json();

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
      // In development without a script URL, just log and return success
      // so the assessment flow still works locally
      console.warn("GOOGLE_SCRIPT_URL not set — skipping Sheets submission");
      return NextResponse.json({ success: true, skipped: true });
    }

    // Forward to Google Apps Script Web App
    // Using text/plain avoids a CORS preflight that Apps Script can't handle
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`Apps Script returned ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Assessment submission error:", err);
    // Return 200 anyway — we never want a DB failure to break the user flow
    return NextResponse.json({ success: false, error: String(err) }, { status: 200 });
  }
}
