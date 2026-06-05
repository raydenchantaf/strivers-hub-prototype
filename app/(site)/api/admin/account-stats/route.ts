import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/**
 * GET /api/admin/account-stats
 * Protected by HTTP Basic Auth (same credential as admin dashboard).
 * Returns signup and deletion counts by date, plus running totals.
 */
export async function GET(req: NextRequest) {
  // Basic Auth
  const auth = req.headers.get("authorization") ?? "";
  const [scheme, encoded] = auth.split(" ");
  if (scheme !== "Basic" || !encoded) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }
  const [user, pass] = Buffer.from(encoded, "base64").toString().split(":");
  if (
    user !== process.env.ADMIN_USER ||
    pass !== process.env.ADMIN_PASS
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const sql = getDb();

    // Daily breakdown
    const daily = await sql`
      SELECT
        DATE(created_at AT TIME ZONE 'Asia/Kuala_Lumpur') AS date,
        event_type,
        COUNT(*)::int AS count
      FROM account_events
      GROUP BY date, event_type
      ORDER BY date DESC
    `;

    // All-time totals
    const totals = await sql`
      SELECT event_type, COUNT(*)::int AS count
      FROM account_events
      GROUP BY event_type
    `;

    // Net active accounts (registered - deleted) from the live users table
    const activeRows = await sql`SELECT COUNT(*)::int AS count FROM users`;
    const activeUsers = activeRows[0]?.count ?? 0;

    return NextResponse.json({ success: true, daily, totals, activeUsers });
  } catch (err) {
    console.error("[account-stats] error:", err);
    return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
