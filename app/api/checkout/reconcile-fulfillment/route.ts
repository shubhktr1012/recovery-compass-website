import { NextRequest, NextResponse } from "next/server";
import { reconcilePendingFulfillments } from "@/lib/commerce";

type ReconcileRequestBody = {
  limit?: number;
  maxAgeMinutes?: number;
};

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

export async function POST(req: NextRequest) {
  if (!process.env.COMMERCE_RECONCILE_SECRET) {
    return NextResponse.json(
      { message: "COMMERCE_RECONCILE_SECRET is not configured" },
      { status: 500 }
    );
  }

  if (!isAuthorizedRequest(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: ReconcileRequestBody = {};
  try {
    if (req.headers.get("content-length") !== "0") {
      body = (await req.json()) as ReconcileRequestBody;
    }
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const result = await reconcilePendingFulfillments({
      limit: body.limit,
      maxAgeMinutes: body.maxAgeMinutes,
    });

    return NextResponse.json({
      status: "ok",
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Reconciliation failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
