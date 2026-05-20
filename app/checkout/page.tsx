"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/context/cart-context";
import { useUser } from "@/lib/context/user-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    ShieldCheck,
    Smartphone,
    Timer,
    Lock,
    Zap,
    Headphones,
    ChevronDown,
    ChevronUp,
    Tag,
    X,
    Plus,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { FooterVariantTwo } from "@/components/sections";
import { NavbarSticky } from "@/components/navbar-sticky";
import { formatPaymentDescription, formatProgramCountLabel } from "@/lib/program-commerce-policy";
import { APP_STORE_BADGE_URL, APP_STORE_URL, PLAY_STORE_BADGE_URL, PLAY_STORE_URL } from "@/lib/constants";
import { programHasAudio, programIsNinetyDay } from "@/lib/public-programs";
import {
    DIET_PLAN_ADDON_CART_ITEM,
    DIET_PLAN_ADDON_PRICE_INR,
    DIET_PLAN_CART_ID,
    isDietPlanCartId,
} from "@/lib/diet-plan-product";
import type { LucideIcon } from "lucide-react";

type CreateOrderResponse = {
    id: string;
    amount: number;
    currency: string;
    keyId?: string;
    message?: string;
};

type RazorpaySuccessResponse = {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
};

type RazorpayFailureResponse = {
    error: {
        code?: string;
        description?: string;
        source?: string;
        step?: string;
        reason?: string;
        metadata?: Record<string, unknown>;
    };
};

type VerifyPaymentResponse = {
    message?: string;
    transactionId?: string | null;
    dietPlan?: {
        orderId: string;
        claimToken: string;
    };
};

type RazorpayModalOptions = {
    backdropclose: boolean;
    escape: boolean;
    confirm_close: boolean;
    ondismiss: () => void;
};

type RazorpayOptions = {
    key: string | undefined;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image: string;
    order_id: string;
    handler: (response: RazorpaySuccessResponse) => Promise<void>;
    prefill: {
        email: string | null | undefined;
        contact: string;
    };
    theme: {
        color: string;
    };
    modal: RazorpayModalOptions;
};

type RazorpayInstance = {
    on: (event: "payment.failed", handler: (response: RazorpayFailureResponse) => void) => void;
    open: () => void;
};

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
    interface Window {
        Razorpay?: RazorpayConstructor;
    }
}

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong";
}

function serializeRazorpayFailure(error: RazorpayFailureResponse["error"] | undefined) {
    return {
        code: error?.code ?? null,
        description: error?.description ?? null,
        source: error?.source ?? null,
        step: error?.step ?? null,
        reason: error?.reason ?? null,
        metadata: error?.metadata ?? {},
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function ValueFeature({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
    return (
        <div className="flex gap-4 items-start group">
            <div className="mt-0.5 size-10 rounded-2xl bg-[oklch(0.2475_0.0661_146.79)]/[0.04] flex items-center justify-center text-[oklch(0.2475_0.0661_146.79)] group-hover:bg-[oklch(0.2475_0.0661_146.79)] group-hover:text-white transition-all duration-300 shrink-0">
                <Icon className="size-[18px]" />
            </div>
            <div>
                <h4 className="font-bold text-[14px] text-[oklch(0.2475_0.0661_146.79)] mb-0.5">{title}</h4>
                <p className="text-[13px] text-[oklch(0.2475_0.0661_146.79)]/50 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

// Payment Logos (monochrome)
function PaymentLogos() {
    return (
        <div className="flex items-center justify-center gap-5 opacity-30 hover:opacity-60 transition-opacity duration-300">
            {/* Visa */}
            <svg className="h-5" viewBox="0 0 780 500" fill="currentColor">
                <path d="M293.2 348.73l33.36-195.76h53.34l-33.38 195.76zm246.11-191.23c-10.57-3.98-27.24-8.25-47.98-8.25-52.83 0-90.06 26.69-90.32 64.89-.26 28.27 26.57 44.04 46.86 53.45 20.81 9.61 27.8 15.76 27.72 24.37-.15 13.16-16.62 19.17-31.99 19.17-21.39 0-32.73-2.98-50.28-10.3l-6.89-3.13-7.51 44.1c12.49 5.49 35.58 10.25 59.56 10.49 56.18 0 92.64-26.39 93.03-67.17.19-22.38-14.03-39.39-44.85-53.42-18.67-9.1-30.11-15.17-29.99-24.39 0-8.17 9.69-16.91 30.6-16.91 17.47-.28 30.13 3.55 39.98 7.53l4.79 2.27 7.27-42.71zM619.81 153h-41.35c-12.81 0-22.39 3.51-28.02 16.33l-79.48 180.43h56.16l11.23-29.55h68.63l6.51 29.55h49.56l-43.24-196.76zm-66.08 126.63l28.17-71.63 4.71-13.68 7.71 35.03 16.36 50.28h-56.95zm-387.19-126.63l-52.38 133.5-5.59-27.24c-9.72-31.38-39.99-65.38-73.85-82.38l47.89 172.13h56.58l84.17-196.01h-56.82z"/>
                <path d="M146.92 152.96H60.88l-.68 4.07c67.06 16.3 111.43 55.63 129.82 102.89l-18.71-90.26c-3.23-12.39-12.59-16.17-24.39-16.7z" fill="currentColor" opacity="0.7"/>
            </svg>
            {/* Mastercard */}
            <svg className="h-6" viewBox="0 0 152.407 108" fill="currentColor">
                <circle cx="60.412" cy="54" r="40" opacity="0.5"/>
                <circle cx="91.995" cy="54" r="40" opacity="0.35"/>
            </svg>
            {/* RuPay */}
            <span className="text-[11px] font-black tracking-wider">RuPay</span>
            {/* UPI */}
            <span className="text-[13px] font-black tracking-wider">UPI</span>
        </div>
    );
}

function getValueFeatures(items: { id: string }[]) {
    const hasAudioProgram = items.some((item) => programHasAudio(item.id));
    const hasNinetyDayProgram = items.some((item) => programIsNinetyDay(item.id));

    return [
        {
            icon: Smartphone,
            title: "App Access",
            desc: "Use your purchased programs on iOS and Android",
        },
        {
            icon: Timer,
            title: "Daily Guided Cards",
            desc: "Follow the routines, steps, and reflections included in your selected program",
        },
        hasAudioProgram
            ? {
                icon: Headphones,
                title: "Guided Audio",
                desc: "Included for selected audio-led programs",
            }
            : {
                icon: Zap,
                title: "Practice Routines",
                desc: "Movement, breathing, or reflection steps based on the program you selected",
            },
        hasNinetyDayProgram
            ? {
                icon: Zap,
                title: "Long-Form Timeline",
                desc: "Your selected 90-day program is structured for sustained change",
            }
            : {
                icon: Timer,
                title: "Program Timeline",
                desc: "Each selected program follows its own day-by-day path",
            },
    ];
}

function CartItem({
    item,
    onRemove,
}: {
    item: { id: string; title: string; price: number | null; tag: string };
    onRemove: (id: string) => void;
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20, height: 0 }}
            className="group flex items-start sm:items-center justify-between py-4 border-b border-[oklch(0.2475_0.0661_146.79)]/[0.06] last:border-0"
        >
            <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-[oklch(0.2475_0.0661_146.79)]/5 text-[oklch(0.2475_0.0661_146.79)]/60">
                        {item.tag}
                    </span>
                </div>
                <h4 className="font-bold text-[15px] text-[oklch(0.2475_0.0661_146.79)] leading-snug truncate">
                    {item.title}
                </h4>
            </div>
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 shrink-0 mt-1 sm:mt-0">
                <span className="font-bold text-[15px] text-[oklch(0.2475_0.0661_146.79)] tabular-nums">
                    ₹{item.price?.toLocaleString("en-IN")}
                </span>
                <button
                    onClick={() => onRemove(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-red-50 text-[oklch(0.2475_0.0661_146.79)]/30 hover:text-red-500"
                    aria-label={`Remove ${item.title}`}
                >
                    <X className="size-4" />
                </button>
            </div>
        </motion.div>
    );
}

function ProgramPriorityEditor({
    programs,
    order,
    onMove,
}: {
    programs: Array<{ id: string; title: string; tag: string }>;
    order: string[];
    onMove: (id: string, direction: "up" | "down") => void;
}) {
    const programById = new Map(programs.map((program) => [program.id, program]));
    const orderedPrograms = order
        .map((id) => programById.get(id))
        .filter((program): program is { id: string; title: string; tag: string } => Boolean(program));

    if (orderedPrograms.length < 2) {
        return null;
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-3xl border border-[oklch(0.2475_0.0661_146.79)]/[0.08] bg-[oklch(0.9484_0.0251_149.08)]/55 p-4"
        >
            <div className="mb-3">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[oklch(0.2475_0.0661_146.79)]/35">
                    Program order
                </p>
                <p className="mt-1 text-[12px] font-medium leading-relaxed text-[oklch(0.2475_0.0661_146.79)]/48">
                    Your first program starts first. The rest wait in this order.
                </p>
            </div>
            <div className="space-y-2">
                {orderedPrograms.map((program, index) => (
                    <div
                        key={program.id}
                        className="flex items-center gap-3 rounded-2xl bg-white/80 px-3 py-3 shadow-sm shadow-[oklch(0.2475_0.0661_146.79)]/[0.03]"
                    >
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[oklch(0.2475_0.0661_146.79)]/[0.06] text-[11px] font-black tabular-nums text-[oklch(0.2475_0.0661_146.79)]/60">
                            {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-bold text-[oklch(0.2475_0.0661_146.79)]">
                                {program.title}
                            </p>
                            <p className="truncate text-[10px] font-black uppercase tracking-[0.14em] text-[oklch(0.2475_0.0661_146.79)]/30">
                                {program.tag}
                            </p>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => onMove(program.id, "up")}
                                disabled={index === 0}
                                className="flex size-8 items-center justify-center rounded-full text-[oklch(0.2475_0.0661_146.79)]/45 transition-colors hover:bg-[oklch(0.2475_0.0661_146.79)]/[0.06] hover:text-[oklch(0.2475_0.0661_146.79)] disabled:cursor-not-allowed disabled:opacity-20"
                                aria-label={`Move ${program.title} earlier`}
                            >
                                <ArrowUp className="size-4" strokeWidth={2.5} />
                            </button>
                            <button
                                type="button"
                                onClick={() => onMove(program.id, "down")}
                                disabled={index === orderedPrograms.length - 1}
                                className="flex size-8 items-center justify-center rounded-full text-[oklch(0.2475_0.0661_146.79)]/45 transition-colors hover:bg-[oklch(0.2475_0.0661_146.79)]/[0.06] hover:text-[oklch(0.2475_0.0661_146.79)] disabled:cursor-not-allowed disabled:opacity-20"
                                aria-label={`Move ${program.title} later`}
                            >
                                <ArrowDown className="size-4" strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
    const { items, cartLoaded, cartTotal, addItem, removeItem } = useCart();
    const { user, isLoading: isAuthLoading } = useUser();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [promoCode, setPromoCode] = useState("");
    const [promoError, setPromoError] = useState("");
    const [showPromo, setShowPromo] = useState(false);
    const [programOrder, setProgramOrder] = useState<string[]>([]);
    const valueFeatures = getValueFeatures(items);
    const programItems = items.filter((item) => !isDietPlanCartId(item.id));
    const hasDietPlanAddon = items.some((item) => isDietPlanCartId(item.id));
    const orderCountLabel = hasDietPlanAddon
        ? `${formatProgramCountLabel(programItems.length)} + diet plan add-on`
        : formatProgramCountLabel(programItems.length);
    const paymentDescription = hasDietPlanAddon
        ? `${formatPaymentDescription(programItems.length)} + diet plan add-on`
        : formatPaymentDescription(programItems.length);

    // Redirect if not logged in or cart is empty (only after loading completes)
    useEffect(() => {
        if (!isAuthLoading) {
            if (!user) {
                router.push("/");
                return;
            }
        }
        if (cartLoaded && items.length === 0) {
            router.push("/");
        }
    }, [user, items, isAuthLoading, cartLoaded, router]);

    useEffect(() => {
        if (cartLoaded && hasDietPlanAddon && programItems.length === 0) {
            removeItem(DIET_PLAN_CART_ID);
        }
    }, [cartLoaded, hasDietPlanAddon, programItems.length, removeItem]);

    useEffect(() => {
        const programIds = programItems.map((item) => item.id);
        setProgramOrder((previousOrder) => {
            const preservedOrder = previousOrder.filter((id) => programIds.includes(id));
            const missingPrograms = programIds.filter((id) => !preservedOrder.includes(id));
            const nextOrder = [...preservedOrder, ...missingPrograms];
            return nextOrder.join("|") === previousOrder.join("|") ? previousOrder : nextOrder;
        });
    }, [programItems]);

    const moveProgramPriority = (programId: string, direction: "up" | "down") => {
        setProgramOrder((currentOrder) => {
            const currentIndex = currentOrder.indexOf(programId);
            if (currentIndex < 0) {
                return currentOrder;
            }

            const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
            if (targetIndex < 0 || targetIndex >= currentOrder.length) {
                return currentOrder;
            }

            const nextOrder = [...currentOrder];
            const [item] = nextOrder.splice(currentIndex, 1);
            nextOrder.splice(targetIndex, 0, item);
            return nextOrder;
        });
    };

    const handlePromoApply = () => {
        setPromoError("");
        // Placeholder: validate promo/referral code against backend
        if (promoCode.trim().length === 0) return;
        // For now, show a friendly "coming soon" message
        setPromoError("Referral codes will be available at launch. Stay tuned!");
        setTimeout(() => setPromoError(""), 3000);
    };

    // Helper to dynamically load the Razorpay script if it's not yet present
    const loadRazorpayScript = () => {
        return new Promise<boolean>((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            // Ensure Razorpay SDK is fully loaded
            const loaded = await loadRazorpayScript();
            if (!loaded) {
                throw new Error("Razorpay SDK failed to load. Please check your connection.");
            }
            // Build normalized checkout items (immutable receipt snapshot)
            const normalizedItems = items.map((i) => ({
                program_slug: i.id,
                title: i.title,
                price_inr: i.price || 0,
                quantity: 1,
            }));

            // Step 1: Create Order + Transaction on Server
            const res = await fetch("/api/checkout/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: cartTotal,
                    items: normalizedItems,
                    programOrder,
                    userId: user?.id,
                }),
            });
            const orderData = (await res.json()) as CreateOrderResponse;

            if (!res.ok) throw new Error(orderData.message || "Failed to create order");
            if (!orderData.id || !orderData.keyId) {
                throw new Error("Payment order is missing Razorpay configuration. Please refresh and try again.");
            }

            // Step 2: Open Razorpay Modal
            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Recovery Compass",
                description: paymentDescription,
                image: "/rc-logo-primary.svg",
                order_id: orderData.id,
                handler: async function (response: RazorpaySuccessResponse) {
                    // Step 3: Verify Payment on Server
                    const verifyRes = await fetch("/api/checkout/verify-payment", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    });

                    if (verifyRes.ok) {
                        const verifyData = (await verifyRes.json()) as VerifyPaymentResponse;
                        const successParams = new URLSearchParams();

                        if (verifyData.dietPlan) {
                            successParams.set("diet_order_id", verifyData.dietPlan.orderId);
                            successParams.set("token", verifyData.dietPlan.claimToken);
                        }

                        const successQuery = successParams.toString();
                        router.push(`/checkout/success${successQuery ? `?${successQuery}` : ""}`);
                    } else {
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    email: user?.email,
                    contact: "",
                },
                theme: {
                    color: "#1a3a2a",
                },
                modal: {
                    backdropclose: false,
                    escape: false,
                    confirm_close: true,
                    ondismiss: function () {
                        // User closed the Razorpay modal without completing payment
                        setIsProcessing(false);
                    },
                },
            };

            const Razorpay = window.Razorpay;
            if (!Razorpay) {
                throw new Error("Razorpay SDK unavailable after loading.");
            }

            const rzp = new Razorpay(options);
            rzp.on("payment.failed", function (response: RazorpayFailureResponse) {
                const paymentError = serializeRazorpayFailure(response.error);
                console.error("Payment failed:", paymentError);
                void fetch("/api/checkout/payment-failed", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        razorpay_order_id: orderData.id,
                        error: paymentError,
                    }),
                });
                alert(`Payment failed: ${paymentError.description || "Please try again."}`);
            });
            rzp.open();
        } catch (err: unknown) {
            console.error(err);
            alert("Error: " + getErrorMessage(err));
        } finally {
            setIsProcessing(false);
        }
    };

    if (isAuthLoading || !cartLoaded || !user || items.length === 0) {
        return (
            <div className="min-h-screen bg-[oklch(0.9484_0.0251_149.08)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 border-4 border-[oklch(0.2475_0.0661_146.79)]/20 border-t-[oklch(0.2475_0.0661_146.79)] rounded-full animate-spin" />
                    <p className="text-sm font-medium text-[oklch(0.2475_0.0661_146.79)]/50">Preparing your checkout...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[oklch(0.9484_0.0251_149.08)] text-[oklch(0.2475_0.0661_146.79)] font-satoshi flex flex-col">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            {/* Navigation */}
            <NavbarSticky simple />

            {/* ───── Main Content ───── */}
            <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 md:px-12 py-10 md:py-16 flex flex-col lg:flex-row gap-12 xl:gap-16">
                {/* ─── Left Column: Value Reinforcement ─── */}
                <div className="flex-1 min-w-0">
                    {/* Headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-10"
                    >
                        <h1 className="font-erode text-3xl md:text-4xl lg:text-[44px] font-semibold tracking-tight leading-[1.15] mb-4">
                            Your program{" "}
                            <span className="text-[oklch(0.2475_0.0661_146.79)]/30 italic">begins</span> today.
                        </h1>
                        <p className="text-base md:text-[17px] opacity-55 max-w-md font-medium leading-relaxed">
                            You&apos;re buying structured app access for the program{items.length === 1 ? "" : "s"} selected in your order.
                        </p>
                    </motion.div>

                    {/* What's Included */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.6 }}
                        className="mb-10"
                    >
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-25 mb-5">
                            What&apos;s included
                        </p>
                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                            {valueFeatures.map((feature) => (
                                <ValueFeature
                                    key={feature.title}
                                    icon={feature.icon}
                                    title={feature.title}
                                    desc={feature.desc}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* App Store Banners */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-25 mb-4">
                            Available now on mobile
                        </p>
                        <div className="flex flex-wrap gap-2 items-center">
                            {/* Official Apple App Store Badge */}
                            <a
                                href={APP_STORE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative transition-transform active:scale-95"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={APP_STORE_BADGE_URL}
                                    alt="Download on the App Store"
                                    className="h-[44px] w-auto opacity-90 hover:opacity-100 transition-opacity"
                                />
                            </a>
                            {/* Official Google Play Badge - Adjusted height to visually match Apple Badge */}
                            <a
                                href={PLAY_STORE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative transition-transform active:scale-95"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={PLAY_STORE_BADGE_URL}
                                    alt="Get it on Google Play"
                                    className="h-[68px] w-auto opacity-90 hover:opacity-100 transition-opacity translate-x-[-8px]"
                                    style={{ marginTop: "-12px", marginBottom: "-12px" }}
                                />
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* ─── Right Column: Order Summary & Payment ─── */}
                <div className="lg:w-[480px] flex-shrink-0">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="sticky top-28 bg-white rounded-[32px] shadow-xl shadow-[oklch(0.2475_0.0661_146.79)]/[0.04] border border-[oklch(0.2475_0.0661_146.79)]/[0.06] flex flex-col p-7 md:p-9"
                    >
                        {/* Header */}
                        <div className="mb-6">
                            <h3 className="font-erode text-2xl font-medium mb-1 text-[oklch(0.2475_0.0661_146.79)]">Summary</h3>
                            <p className="text-[13px] font-medium text-[oklch(0.2475_0.0661_146.79)]/40">
                                {orderCountLabel}
                            </p>
                        </div>

                        {/* Cart Items */}
                        <div className="mb-6">
                            <ProgramPriorityEditor
                                programs={programItems}
                                order={programOrder}
                                onMove={moveProgramPriority}
                            />
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <CartItem key={item.id} item={item} onRemove={removeItem} />
                                ))}
                            </AnimatePresence>
                        </div>

                        <AnimatePresence mode="popLayout">
                            {!hasDietPlanAddon && (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, scale: 1, height: "auto", marginBottom: 24 }}
                                    exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                                    className="rounded-2xl bg-white p-4 shadow-[0_2px_12px_rgba(6,41,12,0.04)] border border-[#06290C]/[0.06] transition-shadow hover:shadow-[0_4px_16px_rgba(6,41,12,0.06)] overflow-hidden"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-[14px] text-[oklch(0.2475_0.0661_146.79)]">Custom Diet Plan</h4>
                                                <span className="px-1.5 py-0.5 rounded bg-[oklch(0.2475_0.0661_146.79)]/5 text-[9px] font-bold uppercase tracking-wider text-[oklch(0.2475_0.0661_146.79)]/70">
                                                    Optional
                                                </span>
                                            </div>
                                            <p className="text-[12px] font-medium text-[oklch(0.2475_0.0661_146.79)]/50 truncate pr-4">
                                                Personalised PDF tailored to your health profile
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="font-bold text-[14px] tabular-nums text-[oklch(0.2475_0.0661_146.79)]">
                                                +₹{DIET_PLAN_ADDON_PRICE_INR.toLocaleString("en-IN")}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => addItem(DIET_PLAN_ADDON_CART_ITEM, { openCart: false })}
                                                className="flex size-8 items-center justify-center rounded-full bg-[oklch(0.2475_0.0661_146.79)]/5 text-[oklch(0.2475_0.0661_146.79)] hover:bg-[oklch(0.2475_0.0661_146.79)] hover:text-white transition-colors active:scale-95"
                                            >
                                                <Plus className="size-4" strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Promo / Referral Code */}
                        <div className="mb-7">
                            <button
                                onClick={() => setShowPromo(!showPromo)}
                                className="flex items-center gap-2 text-[13px] font-bold text-[oklch(0.2475_0.0661_146.79)]/50 hover:text-[oklch(0.2475_0.0661_146.79)] transition-colors"
                            >
                                <Tag className="size-3.5" strokeWidth={2.5} />
                                <span>Have a referral or promo code?</span>
                                {showPromo ? <ChevronUp className="size-3.5" strokeWidth={2.5} /> : <ChevronDown className="size-3.5" strokeWidth={2.5} />}
                            </button>
                            <AnimatePresence>
                                {showPromo && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex gap-2 mt-3">
                                            <input
                                                type="text"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                                placeholder="Enter code"
                                                className="flex-1 px-4 py-2.5 rounded-xl border border-[oklch(0.2475_0.0661_146.79)]/10 bg-white text-[13px] font-bold placeholder:text-[oklch(0.2475_0.0661_146.79)]/25 focus:outline-none focus:ring-2 focus:ring-[oklch(0.2475_0.0661_146.79)]/20 transition-all shadow-sm"
                                            />
                                            <Button
                                                onClick={handlePromoApply}
                                                className="rounded-xl px-5 bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90 text-[13px] font-bold h-auto py-2.5 shadow-sm"
                                            >
                                                Apply
                                            </Button>
                                        </div>
                                        <AnimatePresence>
                                            {promoError && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -4 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="text-xs text-amber-600 font-bold mt-2 pl-1"
                                                >
                                                    {promoError}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Pricing Breakdown */}
                        <div className="space-y-3.5 mb-8">
                            <div className="flex justify-between items-center text-[14px] font-medium text-[oklch(0.2475_0.0661_146.79)]/60">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between items-center text-[14px] font-medium text-[oklch(0.2475_0.0661_146.79)]/60">
                                <span>Cloud Sync & Support</span>
                                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] uppercase tracking-widest border border-emerald-600/10">Included</span>
                            </div>
                            <div className="flex justify-between items-end pt-5 mt-5 border-t border-dashed border-[oklch(0.2475_0.0661_146.79)]/15">
                                <span className="font-bold text-[15px] text-[oklch(0.2475_0.0661_146.79)]">Total Due</span>
                                <span className="font-erode font-semibold text-3xl tabular-nums text-[oklch(0.2475_0.0661_146.79)] leading-none tracking-tight">₹{cartTotal.toLocaleString("en-IN")}</span>
                            </div>
                        </div>

                        {/* Pay Button */}
                        <Button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className={cn(
                                "w-full h-[56px] rounded-2xl font-bold text-[15px] transition-all active:scale-[0.98]",
                                "bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90",
                                "shadow-xl shadow-[oklch(0.2475_0.0661_146.79)]/15",
                                "disabled:opacity-70 disabled:cursor-not-allowed"
                            )}
                        >
                            {isProcessing ? (
                                <div className="flex items-center gap-3">
                                    <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    <span>Securing Your Order...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Lock className="size-4" strokeWidth={2.5} />
                                    <span>Pay ₹{cartTotal.toLocaleString("en-IN")} Securely</span>
                                </div>
                            )}
                        </Button>

                        {/* Trust Signals & Payment Logos */}
                        <div className="mt-7 flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2 text-[oklch(0.2475_0.0661_146.79)]/40">
                                <ShieldCheck className="size-4" />
                                <span className="text-[10px] font-bold tracking-widest uppercase">256-bit SSL Secure</span>
                            </div>
                            <PaymentLogos />
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* ───── Footer ───── */}
            <FooterVariantTwo />
        </div>
    );
}
