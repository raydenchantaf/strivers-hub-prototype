import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { article_slug, article_title, rating, notes } = body;

    // Validate
    if (!article_slug || typeof article_slug !== "string") {
      return NextResponse.json({ error: "Invalid article_slug" }, { status: 400 });
    }
    if (!article_title || typeof article_title !== "string") {
      return NextResponse.json({ error: "Invalid article_title" }, { status: 400 });
    }
    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const sql = getDb();

    await sql`
      INSERT INTO feedback (article_slug, article_title, rating, notes)
      VALUES (${article_slug}, ${article_title}, ${rating}, ${notes ?? null})
    `;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[feedback POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
