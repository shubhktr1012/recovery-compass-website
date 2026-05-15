"use client";

import { useCart } from "@/lib/context/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Check, Dumbbell, Moon, Plus, Sparkles, Timer, Wind, XIcon, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useUser } from "@/lib/context/user-context";
import { useRouter } from "next/navigation";
import { allPrograms } from "@/components/sections/explore-programs";
import { MAX_CART_ITEMS } from "@/lib/program-commerce-policy";

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

    const ownedProgramDetails = ownedPrograms
        .map((programId) => allPrograms.find((p) => p.id === programId))
        .filter((p): p is NonNullable<typeof p> => Boolean(p));

    // Programs that are neither in the cart nor already owned
    const quickAddPrograms = allPrograms.filter(
        (p) => !isItemInCart(p.id) && !ownedPrograms.includes(p.id)
    );

    // Don't show quick-add at all if cart is already at max capacity
    const cartIsFull = items.length >= MAX_CART_ITEMS;

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
        addItem({
            id: program.id,
            title: program.title,
            price: program.metaValue === "TBD" ? null : parseInt(program.metaValue.replace(/[^0-9]/g, "")),
            tag: program.tag,
        });
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetContent side="right" className="w-full sm:max-w-md bg-[oklch(0.9484_0.0251_149.08)] text-[oklch(0.2475_0.0661_146.79)] border-l border-[oklch(0.2475_0.0661_146.79)]/10 p-0 flex flex-col h-full max-h-screen overflow-hidden shadow-2xl">
                <SheetHeader className="p-6 border-b border-[oklch(0.2475_0.0661_146.79)]/10 bg-[oklch(0.9484_0.0251_149.08)] backdrop-blur-md">
                    <SheetTitle className="font-erode text-2xl text-[oklch(0.2475_0.0661_146.79)] tracking-tight">
                        My Plan
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6 pb-36 overscroll-contain" data-lenis-prevent="true">
                    <div className="space-y-8">

                        {/* ── Owned / Unlocked Library ── */}
                        {ownedProgramDetails.length > 0 && (
                            <section className="space-y-4">
                                <div>
                                    <p className="font-satoshi text-[10px] font-bold uppercase tracking-[0.2em] text-[oklch(0.2475_0.0661_146.79)]/45">
                                        Unlocked Library
                                    </p>
                                    <p className="mt-1 font-satoshi text-sm text-[oklch(0.2475_0.0661_146.79)]/60">
                                        Programs already available in your account.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    {ownedProgramDetails.map((program) => (
                                        <div
                                            key={program.id}
                                            className="rounded-2xl border border-[oklch(0.2475_0.0661_146.79)]/10 bg-white/55 p-4"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[oklch(0.2475_0.0661_146.79)]/45">
                                                        {program.tag}
                                                    </p>
                                                    <h4 className="font-erode text-lg font-medium leading-tight">
                                                        {program.title}
                                                    </h4>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-1 rounded-full bg-[oklch(0.2475_0.0661_146.79)]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[oklch(0.2475_0.0661_146.79)]/70">
                                                    <Check className="size-3" />
                                                    Owned
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ── Checkout Plan ── */}
                        <section className="space-y-4">
                            <div>
                                <p className="font-satoshi text-[10px] font-bold uppercase tracking-[0.2em] text-[oklch(0.2475_0.0661_146.79)]/45">
                                    Checkout Plan
                                </p>
                                <p className="mt-1 font-satoshi text-sm text-[oklch(0.2475_0.0661_146.79)]/60">
                                    New programs selected for purchase.
                                </p>
                            </div>

                            {items.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-[oklch(0.2475_0.0661_146.79)]/15 p-5 text-center">
                                    <p className="font-satoshi text-lg">Your checkout plan is empty.</p>
                                    <p className="mt-1 font-satoshi text-sm text-[oklch(0.2475_0.0661_146.79)]/60">
                                        Add a program below to get started.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-start border-b border-[oklch(0.2475_0.0661_146.79)]/10 pb-4">
                                            <div className="space-y-1 pr-4">
                                                <div className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60">
                                                    {item.tag}
                                                </div>
                                                <h4 className="font-erode text-lg font-medium">{item.title}</h4>
                                                <div className="font-satoshi font-bold mt-2">
                                                    {item.price ? `₹${item.price.toLocaleString()}` : "TBD"}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 opacity-50 hover:opacity-100 transition-opacity rounded-full hover:bg-[oklch(0.2475_0.0661_146.79)]/5"
                                                aria-label={`Remove ${item.title}`}
                                            >
                                                <XIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* ── Quick Add ── only shown when there are addable programs and cart isn't full */}
                        {quickAddPrograms.length > 0 && !cartIsFull && (
                            <section className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-px flex-1 bg-[oklch(0.2475_0.0661_146.79)]/10" />
                                    <p className="font-satoshi text-[10px] font-bold uppercase tracking-[0.2em] text-[oklch(0.2475_0.0661_146.79)]/40 whitespace-nowrap">
                                        Also Add
                                    </p>
                                    <div className="h-px flex-1 bg-[oklch(0.2475_0.0661_146.79)]/10" />
                                </div>

                                <div className="space-y-2.5">
                                    {quickAddPrograms.map((program) => {
                                        const Icon = PROGRAM_ICON_MAP[program.id];
                                        return (
                                            <div
                                                key={program.id}
                                                className="group flex items-center gap-3 rounded-2xl border border-[oklch(0.2475_0.0661_146.79)]/8 bg-white/40 hover:bg-white/70 transition-all duration-200 p-3"
                                            >
                                                {/* Program icon */}
                                                <div
                                                    className={`shrink-0 size-8 rounded-xl flex items-center justify-center ${
                                                        program.accent === "dark"
                                                            ? "bg-[oklch(0.2475_0.0661_146.79)] text-white"
                                                            : "bg-[oklch(0.2475_0.0661_146.79)]/10 text-[oklch(0.2475_0.0661_146.79)]"
                                                    }`}
                                                >
                                                    {Icon && <Icon className="size-4" />}
                                                </div>

                                                {/* Program info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[oklch(0.2475_0.0661_146.79)]/40 truncate">
                                                        {program.tag}
                                                    </p>
                                                    <p className="font-erode text-sm font-medium leading-tight text-[oklch(0.2475_0.0661_146.79)] truncate">
                                                        {program.title}
                                                    </p>
                                                    <p className="font-satoshi text-xs font-bold text-[oklch(0.2475_0.0661_146.79)]/60 mt-0.5">
                                                        {program.metaValue}
                                                    </p>
                                                </div>

                                                {/* Quick add button */}
                                                <button
                                                    onClick={() => handleQuickAdd(program)}
                                                    aria-label={`Add ${program.title} to plan`}
                                                    className="shrink-0 size-8 rounded-full bg-[oklch(0.2475_0.0661_146.79)] text-white flex items-center justify-center opacity-70 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-150 shadow-sm"
                                                >
                                                    <Plus className="size-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                    </div>
                </div>

                {/* ── Sticky Footer: Total + Finalize ── */}
                {items.length > 0 && (
                    <div className="absolute flex flex-col items-center justify-center bottom-0 w-full p-6 bg-gradient-to-t from-[oklch(0.9484_0.0251_149.08)] via-[oklch(0.9484_0.0251_149.08)] to-transparent pt-12 border-t border-[oklch(0.2475_0.0661_146.79)]/5">
                        <div className="flex justify-between items-center w-full mb-4 px-2">
                            <span className="font-satoshi font-semibold">Total Investment</span>
                            <span className="font-satoshi font-bold text-xl">₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <Button
                            className="w-full bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90 h-14 rounded-full font-bold text-lg shadow-xl hover:scale-[0.98] transition-transform"
                            onClick={handleFinalize}
                        >
                            Finalize Plan
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
