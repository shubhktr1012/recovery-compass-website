import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(
    {
      message:
        "This unaudited grant endpoint has been disabled. Use the admin dashboard grant workflow.",
    },
    { status: 410 }
  );
}
