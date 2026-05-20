"use client";

import { useState } from "react";
import { useCart } from "@/lib/context/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Dumbbell, Moon, Plus, Sparkles, Timer, Wind, XIcon, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useUser } from "@/lib/context/user-context";
import { useRouter } from "next/navigation";
import { MAX_CART_ITEMS } from "@/lib/program-commerce-policy";
import { allPrograms, formatProgramPrice, toCartItem } from "@/lib/public-programs";
import { cn } from "@/lib/utils";

// Stable icon map — defined outside the component so it's never re-created on render
const PROGRAM_ICON_MAP: Record<string, LucideIcon> = {
    "6-day-compass-reset":         Timer,
    "90-day-smoke-free-journey":   Wind,
    "21-day-deep-sleep-reset":     Moon,
    "14-day-energy-restore":       Zap,
    "mens-vitality-reset-program": Dumbbell,
    "radiance-journey":            Sparkles,
};

export function MyPlanDrawer() {
    const { items, isCartOpen, setIsCartOpen, removeItem, addItem, isItemInCart, cartTotal } = useCart();
    const { user, openAuthModal, ownedPrograms } = useUser();
    const router = useRouter();
    const [checkoutPlanExpanded, setCheckoutPlanExpanded] = useState(false);

    const ownedProgramDetails = ownedPrograms
        .map((programId) => allPrograms.find((p) => p.id === programId))
        .filter((p): p is NonNullable<typeof p> => Boolean(p));

    // Programs that are neither in the cart nor already owned
    const quickAddPrograms = allPrograms.filter(
        (p) => !isItemInCart(p.id) && !ownedPrograms.includes(p.id)
    );

    // Don't show quick-add at all if cart is already at max capacity
    const cartIsFull = items.length >= MAX_CART_ITEMS;
    const hasVisibleQuickAddPrograms = quickAddPrograms.length > 0 && !cartIsFull;
    const shouldCollapseCheckoutPlan = items.length > 0 && hasVisibleQuickAddPrograms;
    const showCheckoutItems = items.length > 0 && (!shouldCollapseCheckoutPlan || checkoutPlanExpanded);
    const checkoutSummaryLabel = `${items.length} selected · ₹${cartTotal.toLocaleString()}`;

    const handleFinalize = () => {
        setIsCartOpen(false);
        if (!user) {
            openAuthModal("signup", () => {
                router.push("/checkout");
            });
        } else {
            router.push("/checkout");
        }
    };

    const handleQuickAdd = (program: (typeof allPrograms)[number]) => {
        addItem(toCartItem(program));
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetContent side="right" className="w-full sm:max-w-md bg-white text-[oklch(0.2475_0.0661_146.79)] border-l border-[oklch(0.2475_0.0661_146.79)]/[0.06] p-0 flex flex-col h-full max-h-screen overflow-hidden shadow-2xl">
                {/* ── Header ── */}
                <SheetHeader className="px-6 pt-7 pb-5">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="font-erode text-[22px] font-medium text-[oklch(0.2475_0.0661_146.79)] tracking-tight">
                            My Plan
                        </SheetTitle>
                        {items.length > 0 && (
                            <span className="inline-flex items-center justify-center size-7 rounded-full bg-[oklch(0.2475_0.0661_146.79)] text-white text-[11px] font-bold tabular-nums">
                                {items.length}
                            </span>
                        )}
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 pb-44 overscroll-contain" data-lenis-prevent="true">

                    {/* ── Owned / Unlocked Library ── */}
                    {ownedProgramDetails.length > 0 && (
                        <section className="mb-8">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[oklch(0.2475_0.0661_146.79)]/35 mb-3">
                                Unlocked
                            </p>
                            <div className="space-y-2">
                                {ownedProgramDetails.map((program) => {
                                    const Icon = PROGRAM_ICON_MAP[program.id];
                                    return (
                                        <div
                                            key={program.id}
                                            className="flex items-center gap-3 py-2.5"
                                        >
                                            <div className="shrink-0 size-8 rounded-xl bg-[oklch(0.2475_0.0661_146.79)]/[0.04] flex items-center justify-center">
                                                {Icon && <Icon className="size-4 text-[oklch(0.2475_0.0661_146.79)]/40" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-[13px] text-[oklch(0.2475_0.0661_146.79)] truncate leading-tight">{program.title}</p>
                                            </div>
                                            <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold text-[oklch(0.2475_0.0661_146.79)]/35 uppercase tracking-widest">
                                                <Check className="size-3" />
                                                Owned
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* ── Checkout Items ── */}
                    <section className="mb-8">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[oklch(0.2475_0.0661_146.79)]/35 mb-3">
                            {items.length > 0 ? "Your Selection" : "Your Plan"}
                        </p>

                        {items.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-[oklch(0.2475_0.0661_146.79)]/10 py-10 px-6 text-center">
                                <p className="font-erode text-[17px] font-medium text-[oklch(0.2475_0.0661_146.79)]/70">
                                    No programs selected yet
                                </p>
                                <p className="mt-1.5 text-[12px] font-medium text-[oklch(0.2475_0.0661_146.79)]/40 max-w-[200px] mx-auto leading-relaxed">
                                    Browse below and tap + to add a program to your plan.
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-2xl bg-[oklch(0.9484_0.0251_149.08)]/40 border border-[oklch(0.2475_0.0661_146.79)]/[0.04]">
                                {/* Collapsed summary toggle */}
                                {shouldCollapseCheckoutPlan && (
                                    <button
                                        type="button"
                                        onClick={() => setCheckoutPlanExpanded((v) => !v)}
                                        className="flex w-full items-center justify-between px-4 py-3.5 transition-colors hover:bg-[oklch(0.2475_0.0661_146.79)]/[0.02]"
                                        aria-expanded={checkoutPlanExpanded}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-1.5">
                                                {items.slice(0, 3).map((item) => {
                                                    const Icon = PROGRAM_ICON_MAP[item.id];
                                                    return (
                                                        <div key={item.id} className="size-6 rounded-lg bg-[oklch(0.2475_0.0661_146.79)] text-white flex items-center justify-center ring-2 ring-white">
                                                            {Icon && <Icon className="size-3" />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <span className="text-[13px] font-bold text-[oklch(0.2475_0.0661_146.79)]/70">
                                                {checkoutSummaryLabel}
                                            </span>
                                        </div>
                                        <ChevronDown
                                            className={cn(
                                                "size-4 shrink-0 text-[oklch(0.2475_0.0661_146.79)]/35 transition-transform duration-200",
                                                checkoutPlanExpanded && "rotate-180"
                                            )}
                                        />
                                    </button>
                                )}

                                {/* Expanded item list */}
                                {showCheckoutItems && (
                                    <div className={cn(
                                        "px-4 pb-3",
                                        shouldCollapseCheckoutPlan && "pt-1 border-t border-[oklch(0.2475_0.0661_146.79)]/[0.04]"
                                    )}>
                                        {items.map((item, i) => {
                                            const Icon = PROGRAM_ICON_MAP[item.id];
                                            return (
                                                <div
                                                    key={item.id}
                                                    className={cn(
                                                        "group flex items-center gap-3 py-3.5",
                                                        i < items.length - 1 && "border-b border-[oklch(0.2475_0.0661_146.79)]/[0.05]"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "shrink-0 size-9 rounded-xl flex items-center justify-center",
                                                        "bg-[oklch(0.2475_0.0661_146.79)] text-white"
                                                    )}>
                                                        {Icon && <Icon className="size-4" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-[14px] text-[oklch(0.2475_0.0661_146.79)] truncate leading-tight">
                                                            {item.title}
                                                        </p>
                                                        <p className="text-[12px] font-bold text-[oklch(0.2475_0.0661_146.79)]/45 mt-0.5 tabular-nums">
                                                            {item.price ? `₹${item.price.toLocaleString()}` : "TBD"}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="shrink-0 size-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all hover:bg-red-50 text-[oklch(0.2475_0.0661_146.79)]/30 hover:text-red-500"
                                                        aria-label={`Remove ${item.title}`}
                                                    >
                                                        <XIcon className="size-3.5" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* ── Quick Add ── */}
                    {hasVisibleQuickAddPrograms && (
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-px flex-1 bg-[oklch(0.2475_0.0661_146.79)]/[0.06]" />
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[oklch(0.2475_0.0661_146.79)]/30 whitespace-nowrap">
                                    Also Add
                                </p>
                                <div className="h-px flex-1 bg-[oklch(0.2475_0.0661_146.79)]/[0.06]" />
                            </div>

                            <div className="space-y-1.5">
                                {quickAddPrograms.map((program) => {
                                    const Icon = PROGRAM_ICON_MAP[program.id];
                                    return (
                                        <div
                                            key={program.id}
                                            className="group flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-[oklch(0.9484_0.0251_149.08)]/60"
                                        >
                                            <div
                                                className={cn(
                                                    "shrink-0 size-9 rounded-xl flex items-center justify-center",
                                                    program.accent === "dark"
                                                        ? "bg-[oklch(0.2475_0.0661_146.79)] text-white"
                                                        : "bg-[oklch(0.2475_0.0661_146.79)]/[0.06] text-[oklch(0.2475_0.0661_146.79)]"
                                                )}
                                            >
                                                {Icon && <Icon className="size-4" />}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-[13px] text-[oklch(0.2475_0.0661_146.79)] truncate leading-tight">
                                                    {program.title}
                                                </p>
                                                <p className="text-[11px] font-bold text-[oklch(0.2475_0.0661_146.79)]/40 mt-0.5 tabular-nums">
                                                    {formatProgramPrice(program)}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleQuickAdd(program)}
                                                aria-label={`Add ${program.title} to plan`}
                                                className="shrink-0 size-8 rounded-full bg-[oklch(0.2475_0.0661_146.79)]/[0.05] text-[oklch(0.2475_0.0661_146.79)] flex items-center justify-center group-hover:bg-[oklch(0.2475_0.0661_146.79)] group-hover:text-white active:scale-90 transition-all duration-150"
                                            >
                                                <Plus className="size-4" strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                </div>

                {/* ── Sticky Footer ── */}
                {items.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[oklch(0.2475_0.0661_146.79)]/[0.06] p-6 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
                        <div className="flex justify-between items-baseline mb-5 px-0.5">
                            <span className="text-[13px] font-bold text-[oklch(0.2475_0.0661_146.79)]/50 uppercase tracking-widest">Total</span>
                            <span className="font-erode font-semibold text-2xl tabular-nums text-[oklch(0.2475_0.0661_146.79)] tracking-tight">₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <Button
                            className="w-full bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90 h-[52px] rounded-2xl font-bold text-[15px] shadow-lg shadow-[oklch(0.2475_0.0661_146.79)]/10 active:scale-[0.98] transition-all"
                            onClick={handleFinalize}
                        >
                            Continue to Checkout
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
