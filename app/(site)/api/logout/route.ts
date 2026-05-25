import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("sh_session", "", { maxAge: 0, path: "/" });
  res.cookies.set("sh_user",    "", { maxAge: 0, path: "/" });
  return res;
}
