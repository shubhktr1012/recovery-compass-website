import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type PendingDietPlanOrder = {
    id: string;
    created_at: string | null;
    claimed_at: string | null;
};

function getPositiveIntegerEnv(name: string, fallback: number) {
    const value = Number.parseInt(process.env[name] ?? "", 10);
    return Number.isFinite(value) && value > 0 ? value : fallback;
}

function getBaseUrl(req: NextRequest) {
    return (
        process.env.NEXT_PUBLIC_SITE_URL ||
        new URL(req.url).origin
    ).replace(/\/$/, "");
}

function getReadyAt(order: PendingDietPlanOrder, delayMinutes: number) {
    const anchor = order.claimed_at || order.created_at;
    if (!anchor) {
        return null;
    }

    const anchorMs = new Date(anchor).getTime();
    if (!Number.isFinite(anchorMs)) {
        return null;
    }

    return new Date(anchorMs + delayMinutes * 60 * 1000);
}

export async function GET(req: NextRequest) {
    const expectedSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.get("authorization");

    if (!expectedSecret) {
        return NextResponse.json(
            { message: "CRON_SECRET is not configured" },
            { status: 500 }
        );
    }

    if (authHeader !== `Bearer ${expectedSecret}`) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const internalSecret = process.env.DIET_PLAN_INTERNAL_SECRET;

    if (!internalSecret) {
        return NextResponse.json(
            { message: "DIET_PLAN_INTERNAL_SECRET is not configured" },
            { status: 500 }
        );
    }

    const delayMinutes = getPositiveIntegerEnv("DIET_PLAN_DELIVERY_DELAY_MINUTES", 35);
    const batchSize = getPositiveIntegerEnv("DIET_PLAN_DELIVERY_BATCH_SIZE", 1);
    const scanLimit = Math.max(batchSize * 5, 10);
    const now = new Date();
    const baseUrl = getBaseUrl(req);
    const supabase = getSupabaseAdmin();

    const { data: orders, error } = await supabase
        .from("diet_plan_orders")
        .select("id, created_at, claimed_at")
        .eq("status", "pending")
        .order("created_at", { ascending: true })
        .limit(scanLimit);

    if (error) {
        return NextResponse.json(
            { message: `Failed to load pending diet plan orders: ${error.message}` },
            { status: 500 }
        );
    }

    const readyOrders = (orders ?? [])
        .map((order) => ({
            ...order,
            readyAt: getReadyAt(order, delayMinutes),
        }))
        .filter((order) => order.readyAt && order.readyAt <= now)
        .slice(0, batchSize);

    const results = [];

    for (const order of readyOrders) {
        try {
            const response = await fetch(`${baseUrl}/api/diet-plan/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-internal-secret": internalSecret,
                },
                body: JSON.stringify({ orderId: order.id }),
            });

            const body = await response.json().catch(() => null);

            results.push({
                orderId: order.id,
                ok: response.ok,
                status: response.status,
                body,
            });
        } catch (error) {
            results.push({
                orderId: order.id,
                ok: false,
                error: error instanceof Error ? error.message : "Unknown trigger error",
            });
        }
    }

    return NextResponse.json({
        scanned: orders?.length ?? 0,
        processed: results.length,
        delayMinutes,
        results,
    });
}
