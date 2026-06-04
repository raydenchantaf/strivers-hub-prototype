import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getDb } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const TOKEN_EXPIRY_MINUTES = 60;

export async function POST(req: NextRequest) {
  try {
    const sql = getDb();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "MISSING_EMAIL" }, { status: 400 });
    }

    const normalised = email.toLowerCase().trim();

    // Always return success to avoid email enumeration
    const users = await sql`
      SELECT id FROM users WHERE email = ${normalised} LIMIT 1
    `;

    if (users.length > 0) {
      // Delete any existing tokens for this email
      await sql`DELETE FROM password_resets WHERE email = ${normalised}`;

      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

      await sql`
        INSERT INTO password_resets (email, token, expires_at)
        VALUES (${normalised}, ${token}, ${expiresAt.toISOString()})
      `;

      const baseUrl  = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;

      await resend.emails.send({
        from:    "Strivers' Hub <no-reply@strivershub.com>",
        to:      normalised,
        subject: "Reset your Strivers' Hub password",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#fff;border-radius:12px;">
            <h2 style="color:#B12069;margin-bottom:8px;">Reset your password</h2>
            <p style="color:#444;line-height:1.6;">
              We received a request to reset the password for your Strivers' Hub account.
              Click the button below to set a new password. This link expires in ${TOKEN_EXPIRY_MINUTES} minutes.
            </p>
            <a href="${resetUrl}"
               style="display:inline-block;margin:24px 0;padding:14px 28px;background:#B12069;color:#fff;border-radius:99px;text-decoration:none;font-weight:600;font-size:15px;">
              Reset password
            </a>
            <p style="color:#888;font-size:13px;">
              If you didn't request a password reset, you can safely ignore this email.
            </p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
            <p style="color:#bbb;font-size:12px;">Strivers' Hub · Powered by The Asia Foundation</p>
          </div>
        `,
      });
    }

    // Always return success
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[forgot-password] error:", err);
    return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
