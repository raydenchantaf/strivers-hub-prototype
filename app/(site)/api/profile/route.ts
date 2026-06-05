import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

// ── helpers ────────────────────────────────────────────────────────────────

function getSession(req: NextRequest) {
  const raw = req.cookies.get("sh_session")?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8")) as {
      id: number; firstName: string; lastName: string; email: string;
    };
  } catch { return null; }
}

function buildCookies(user: { id: number; first_name: string; last_name: string; email: string }, res: NextResponse) {
  const session = { id: user.id, firstName: user.first_name, lastName: user.last_name, email: user.email };
  const sessionValue = Buffer.from(JSON.stringify(session)).toString("base64");
  const userValue    = JSON.stringify({ firstName: session.firstName, lastName: session.lastName, email: session.email });
  const cookieOpts   = { sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 7 };
  res.cookies.set("sh_session", sessionValue, { ...cookieOpts, httpOnly: true });
  res.cookies.set("sh_user",    userValue,    { ...cookieOpts, httpOnly: false });
}

// ── GET /api/profile ───────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ success: false, error: "UNAUTHENTICATED" }, { status: 401 });

  try {
    const sql  = getDb();
    const rows = await sql`
      SELECT first_name, last_name, email, phone, created_at
      FROM users WHERE id = ${session.id} LIMIT 1
    `;
    if (rows.length === 0) return NextResponse.json({ success: false, error: "NOT_FOUND" }, { status: 404 });

    const u = rows[0];
    return NextResponse.json({
      success:   true,
      firstName: u.first_name,
      lastName:  u.last_name,
      email:     u.email,
      phone:     u.phone ?? "",
      createdAt: u.created_at,
    });
  } catch (err) {
    console.error("[profile GET] error:", err);
    return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}

// ── PUT /api/profile ───────────────────────────────────────────────────────

export async function PUT(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ success: false, error: "UNAUTHENTICATED" }, { status: 401 });

  try {
    const sql = getDb();
    const { firstName, lastName, email, phone } = await req.json();

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ success: false, error: "MISSING_FIELDS" }, { status: 400 });
    }

    const normalised = email.toLowerCase().trim();

    // Check email uniqueness if changed
    if (normalised !== session.email) {
      const existing = await sql`
        SELECT id FROM users WHERE email = ${normalised} AND id != ${session.id} LIMIT 1
      `;
      if (existing.length > 0) {
        return NextResponse.json({ success: false, error: "EMAIL_EXISTS" });
      }
    }

    const rows = await sql`
      UPDATE users
      SET first_name = ${firstName.trim()},
          last_name  = ${lastName.trim()},
          email      = ${normalised},
          phone      = ${phone ? phone.replace(/[^\d+]/g, "") || null : null}
      WHERE id = ${session.id}
      RETURNING id, first_name, last_name, email, phone
    `;

    const updated = rows[0] as { id: number; first_name: string; last_name: string; email: string };
    const res = NextResponse.json({ success: true });
    buildCookies(updated, res);
    return res;
  } catch (err) {
    console.error("[profile PUT] error:", err);
    return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}

// ── DELETE /api/profile ────────────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ success: false, error: "UNAUTHENTICATED" }, { status: 401 });

  try {
    const sql = getDb();

    // Nullify assessment submissions (preserve data for reporting, remove link)
    await sql`UPDATE assessment_submissions SET user_id = NULL WHERE user_id = ${session.id}`;

    // Delete password reset tokens
    await sql`DELETE FROM password_resets WHERE email = ${session.email}`;

    // Delete the user
    await sql`DELETE FROM users WHERE id = ${session.id}`;

    // Log anonymised deletion event (no PII)
    await sql`INSERT INTO account_events (event_type) VALUES ('deleted')`;

    console.log("[profile DELETE] deleted user:", session.email);

    const res = NextResponse.json({ success: true });
    const expired = { maxAge: 0, path: "/" };
    res.cookies.set("sh_session", "", expired);
    res.cookies.set("sh_user",    "", expired);
    return res;
  } catch (err) {
    console.error("[profile DELETE] error:", err);
    return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
