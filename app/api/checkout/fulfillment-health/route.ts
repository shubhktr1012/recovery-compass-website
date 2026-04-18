import { NextRequest, NextResponse } from "next/server";
import { getFulfillmentHealthSnapshot } from "@/lib/commerce";

function isAuthorizedRequest(req: NextRequest) {
  const expectedSecret = process.env.COMMERCE_RECONCILE_SECRET;
  if (!expectedSecret) {
    return false;
  }

  const bearer = req.headers.get("authorization");
  if (bearer && bearer.startsWith("Bearer ")) {
    const token = bearer.slice("Bearer ".length).trim();
    if (token === expectedSecret) {
      return true;
    }
  }

  const headerSecret = req.headers.get("x-reconcile-secret");
  return headerSecret === expectedSecret;
}

export async function GET(req: NextRequest) {
  if (!process.env.COMMERCE_RECONCILE_SECRET) {
    return NextResponse.json(
      { message: "COMMERCE_RECONCILE_SECRET is not configured" },
      { status: 500 }
    );
  }

  if (!isAuthorizedRequest(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await getFulfillmentHealthSnapshot();
    return NextResponse.json({ status: "ok", snapshot });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch fulfillment health";
    return NextResponse.json({ message }, { status: 500 });
  }
}
