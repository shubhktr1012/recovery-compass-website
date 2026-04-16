"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useCart } from "@/lib/context/cart-context";
import { useUser } from "@/lib/context/user-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    ShieldCheck,
    Smartphone,
    Timer,
    ArrowLeft,
    Lock,
    Zap,
    Headphones,
    Heart,
    ChevronDown,
    ChevronUp,
    Trash2,
    Tag,
    CheckCircle2,
    CreditCard,
    X,
} from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import { FooterVariantTwo } from "@/components/sections";
import { NavbarSticky } from "@/components/navbar-sticky";

// ─────────────────────────────────────────────────────────────────────────────
// Design Tokens (Warm Luxury)
// ─────────────────────────────────────────────────────────────────────────────
const T = {
    forest: "oklch(0.2475 0.0661 146.79)",
    cream: "oklch(0.9484 0.0251 149.08)",
};

// ─────────────────────────────────────────────────────────────────────────────
// Testimonials Data
// ─────────────────────────────────────────────────────────────────────────────
const TESTIMONIALS = [
    {
        quote: "The 90-day program genuinely changed my perspective. It wasn't just about quitting - it was about reclaiming my energy.",
        name: "Martand S.",
        initials: "MS",
        label: "Completed 90-Day Reset",
        stars: 5,
    },
    {
        quote: "I've tried apps before, but this one understood the pace I needed. No pressure, just steady progress every single day.",
        name: "Priya K.",
        initials: "PK",
        label: "28 Days In",
        stars: 5,
    },
    {
        quote: "The guided audio sessions became my morning ritual. I genuinely look forward to them now - never thought I'd say that.",
        name: "Arjun R.",
        initials: "AR",
        label: "Completed Calm & Reset",
        stars: 5,
    },
    {
        quote: "What sets this apart is the personalization. It felt like someone actually designed a path just for me.",
        name: "Sneha M.",
        initials: "SM",
        label: "45 Days In",
        stars: 4,
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function ValueFeature({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
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

function TestimonialCarousel() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const t = TESTIMONIALS[index];

    return (
        <div className="bg-[oklch(0.2475_0.0661_146.79)] rounded-[24px] p-7 relative overflow-hidden">
            {/* Decorative large quote mark */}
            <div className="absolute top-4 right-6 font-erode text-[100px] leading-none text-white/[0.04] select-none pointer-events-none font-bold">
                “
            </div>

            {/* Stars only - no verified badge */}
            <div className="flex gap-1 mb-5">
                {[...Array(t.stars)].map((_, i) => (
                    <svg key={i} className="size-3.5 fill-amber-400" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                >
                    <p className="text-[16px] text-white/80 font-medium leading-relaxed mb-6 font-erode italic">
                        “{t.quote}”
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-white/10 flex items-center justify-center text-white text-[11px] font-bold tracking-wide">
                            {t.initials}
                        </div>
                        <div>
                            <h5 className="font-bold text-sm text-white leading-tight">{t.name}</h5>
                            <p className="text-[11px] text-white/40 font-semibold">{t.label}</p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="flex gap-1.5 mt-6">
                {TESTIMONIALS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={cn(
                            "h-0.5 rounded-full transition-all duration-500",
                            i === index
                                ? "w-6 bg-white/50"
                                : "w-2 bg-white/15 hover:bg-white/25"
                        )}
                    />
                ))}
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
            className="group flex items-center justify-between py-5 border-b border-[oklch(0.2475_0.0661_146.79)]/5 last:border-0"
        >
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[oklch(0.2475_0.0661_146.79)]/5 text-[9px] font-bold uppercase tracking-[0.15em] text-[oklch(0.2475_0.0661_146.79)]/60">
                        {item.tag}
                    </span>
                </div>
                <h4 className="font-bold text-[15px] text-[oklch(0.2475_0.0661_146.79)] leading-snug truncate pr-4">
                    {item.title}
                </h4>
            </div>
            <div className="flex items-center gap-3">
                <span className="font-bold text-base text-[oklch(0.2475_0.0661_146.79)] tabular-nums">
                    ₹{item.price?.toLocaleString("en-IN")}
                </span>
                <button
                    onClick={() => onRemove(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50 text-[oklch(0.2475_0.0661_146.79)]/30 hover:text-red-500"
                    aria-label={`Remove ${item.title}`}
                >
                    <X className="size-3.5" />
                </button>
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
    const { items, cartTotal, removeItem } = useCart();
    const { user, isLoading: isAuthLoading } = useUser();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [promoCode, setPromoCode] = useState("");
    const [promoApplied, setPromoApplied] = useState(false);
    const [promoError, setPromoError] = useState("");
    const [showPromo, setShowPromo] = useState(false);
    const [cartLoaded, setCartLoaded] = useState(false);

    // Wait for cart to hydrate from localStorage before evaluating guards
    useEffect(() => {
        // Small delay to allow CartProvider's useEffect to hydrate from localStorage
        const timer = setTimeout(() => setCartLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Redirect if not logged in or cart is empty (only after loading completes)
    useEffect(() => {
        if (!isAuthLoading && !user) {
            router.push("/");
        }
        if (cartLoaded && items.length === 0) {
            router.push("/");
        }
    }, [user, items, isAuthLoading, cartLoaded, router]);

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
        return new Promise((resolve) => {
            if ((window as any).Razorpay) {
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
                    userId: user?.id,
                }),
            });
            const orderData = await res.json();

            if (!res.ok) throw new Error(orderData.message || "Failed to create order");

            // Step 2: Open Razorpay Modal
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Recovery Compass",
                description: `Payment for ${items.length} program(s)`,
                image: "/rc-logo-primary.svg",
                order_id: orderData.id,
                handler: async function (response: any) {
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
                        router.push("/checkout/success");
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

            const rzp = new (window as any).Razorpay(options);
            rzp.on("payment.failed", function (response: any) {
                console.error("Payment failed:", response.error);
                alert(`Payment failed: ${response.error.description}`);
            });
            rzp.open();
        } catch (err: any) {
            console.error(err);
            alert("Error: " + err.message);
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
                            Your journey{" "}
                            <span className="text-[oklch(0.2475_0.0661_146.79)]/30 italic">truly begins</span> today.
                        </h1>
                        <p className="text-base md:text-[17px] opacity-55 max-w-md font-medium leading-relaxed">
                            You're committing to a new version of yourself - guided, supported, and never alone.
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
                            What's included
                        </p>
                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                            <ValueFeature icon={Smartphone} title="Mobile Sync" desc="Access everywhere on iOS and Android" />
                            <ValueFeature icon={Headphones} title="Expert Audio" desc="New guided sessions every day" />
                            <ValueFeature icon={Timer} title="90-Day Path" desc="Designed for long-term transformation" />
                            <ValueFeature icon={Zap} title="Personalized" desc="Adapts to your questionnaire answers" />
                        </div>
                    </motion.div>

                    {/* Subtle Divider */}
                    <div className="w-12 h-px bg-[oklch(0.2475_0.0661_146.79)]/10 mb-10" />

                    {/* Testimonial Carousel */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-10"
                    >
                        <TestimonialCarousel />
                    </motion.div>

                    {/* Subtle Divider */}
                    <div className="w-12 h-px bg-[oklch(0.2475_0.0661_146.79)]/10 mb-10" />

                    {/* App Store Banners */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                    >
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-25 mb-4">
                            Available soon on mobile
                        </p>
                        <div className="flex flex-wrap gap-2 items-center">
                            {/* Official Apple App Store Badge */}
                            <div className="relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                                    alt="Download on the App Store"
                                    className="h-[44px] w-auto cursor-not-allowed opacity-90 hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute -top-1.5 -right-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-[oklch(0.2475_0.0661_146.79)] text-[7px] font-bold uppercase tracking-widest shadow-md">Soon</div>
                            </div>
                            {/* Official Google Play Badge - Adjusted height to visually match Apple Badge */}
                            <div className="relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                                    alt="Get it on Google Play"
                                    className="h-[68px] w-auto cursor-not-allowed opacity-90 hover:opacity-100 transition-opacity translate-x-[-8px]"
                                    style={{ marginTop: "-12px", marginBottom: "-12px" }}
                                />
                                <div className="absolute top-0 right-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-[oklch(0.2475_0.0661_146.79)] text-[7px] font-bold uppercase tracking-widest shadow-md">Soon</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ─── Right Column: Order Summary & Payment ─── */}
                <div className="lg:w-[480px] flex-shrink-0">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="sticky top-28 space-y-6"
                    >
                        {/* Order Card */}
                        <div className="bg-white rounded-[32px] shadow-xl shadow-[oklch(0.2475_0.0661_146.79)]/[0.04] p-7 md:p-9 border border-[oklch(0.2475_0.0661_146.79)]/[0.04]">
                            {/* Header */}
                            <div className="mb-6">
                                <h3 className="font-erode text-xl font-semibold mb-1">Order Summary</h3>
                                <p className="text-[13px] opacity-40 font-medium">
                                    {items.length} program{items.length > 1 ? "s" : ""} selected
                                </p>
                            </div>

                            {/* Cart Items */}
                            <div className="mb-6">
                                <AnimatePresence mode="popLayout">
                                    {items.map((item) => (
                                        <CartItem key={item.id} item={item} onRemove={removeItem} />
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Promo / Referral Code */}
                            <div className="mb-6">
                                <button
                                    onClick={() => setShowPromo(!showPromo)}
                                    className="flex items-center gap-2 text-sm font-semibold text-[oklch(0.2475_0.0661_146.79)]/50 hover:text-[oklch(0.2475_0.0661_146.79)] transition-colors"
                                >
                                    <Tag className="size-3.5" />
                                    <span>Have a referral or promo code?</span>
                                    {showPromo ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
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
                                                    className="flex-1 px-4 py-2.5 rounded-xl border border-[oklch(0.2475_0.0661_146.79)]/10 bg-[oklch(0.9484_0.0251_149.08)] text-sm font-semibold placeholder:text-[oklch(0.2475_0.0661_146.79)]/25 focus:outline-none focus:ring-2 focus:ring-[oklch(0.2475_0.0661_146.79)]/20 transition-all"
                                                />
                                                <Button
                                                    onClick={handlePromoApply}
                                                    className="rounded-xl px-5 bg-[oklch(0.2475_0.0661_146.79)]/10 text-[oklch(0.2475_0.0661_146.79)] hover:bg-[oklch(0.2475_0.0661_146.79)]/20 text-sm font-bold h-auto py-2.5"
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
                                                        className="text-xs text-amber-600 font-medium mt-2 pl-1"
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
                            <div className="space-y-3 pt-4 border-t border-[oklch(0.2475_0.0661_146.79)]/5">
                                <div className="flex justify-between items-center text-sm font-medium opacity-50">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium opacity-50">
                                    <span>Cloud Sync & Support</span>
                                    <span className="text-green-600 font-bold opacity-100">FREE</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-dashed border-[oklch(0.2475_0.0661_146.79)]/10">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-2xl tabular-nums">₹{cartTotal.toLocaleString("en-IN")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Pay Button */}
                        <Button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className={cn(
                                "w-full h-14 rounded-full font-bold text-base transition-all active:scale-[0.98]",
                                "bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90",
                                "shadow-xl shadow-[oklch(0.2475_0.0661_146.79)]/20",
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
                                    <Lock className="size-4" />
                                    <span>Pay ₹{cartTotal.toLocaleString("en-IN")} Securely</span>
                                </div>
                            )}
                        </Button>

                        {/* Trust Signals & Payment Logos */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-2 text-[oklch(0.2475_0.0661_146.79)]/40">
                                <ShieldCheck className="size-3.5" />
                                <span className="text-[10px] font-semibold tracking-wide">256-bit SSL · Razorpay Secure</span>
                            </div>
                            <PaymentLogos />
                            <p className="text-[10px] text-center opacity-25 font-semibold px-4 leading-relaxed">
                                Your payment is processed securely through Razorpay. We never store your card details.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* ───── Footer ───── */}
            <FooterVariantTwo />
        </div>
    );
}
