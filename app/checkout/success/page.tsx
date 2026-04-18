"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/context/cart-context";
import {
    CheckCircle2,
    Mail,
    ArrowRight,
    Sparkles,
    Calendar,
    Phone,
} from "lucide-react";
import { FaApple, FaGooglePlay, FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { FooterVariantTwo } from "@/components/sections";
import { NavbarSticky } from "@/components/navbar-sticky";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Design Tokens
// ─────────────────────────────────────────────────────────────────────────────
const forest = "oklch(0.2475 0.0661 146.79)";
const cream = "oklch(0.9484 0.0251 149.08)";

// ─────────────────────────────────────────────────────────────────────────────
// Floating Particles (celebration effect)
// ─────────────────────────────────────────────────────────────────────────────
function CelebrationParticles() {
    const particleValue = (index: number, offset: number, min: number, max: number) => {
        const raw = Math.sin((index + 1) * 12.9898 + offset * 78.233) * 43758.5453;
        const fraction = raw - Math.floor(raw);
        return min + fraction * (max - min);
    };

    const particles = useMemo(
        () =>
            Array.from({ length: 24 }, (_, i) => ({
                id: i,
                x: particleValue(i, 1, 0, 100),
                delay: particleValue(i, 2, 0, 2),
                duration: particleValue(i, 3, 3, 7),
                size: particleValue(i, 4, 3, 8),
                opacity: particleValue(i, 5, 0.08, 0.2),
                drift: particleValue(i, 6, -30, 30),
            })),
        []
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${p.x}%`,
                        bottom: "-10px",
                        width: p.size,
                        height: p.size,
                        backgroundColor: `oklch(0.2475 0.0661 146.79)`,
                        opacity: p.opacity,
                    }}
                    animate={{
                        y: [0, -800],
                        x: [0, p.drift],
                        opacity: [p.opacity, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: "easeOut",
                    }}
                />
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step Number Badge
// ─────────────────────────────────────────────────────────────────────────────
function StepBadge({ number, delay }: { number: number; delay: number }) {
    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 300, delay }}
            className="absolute -left-3 -top-3 z-20 size-7 rounded-full bg-[oklch(0.2475_0.0661_146.79)] text-white flex items-center justify-center text-[11px] font-bold shadow-lg ring-3 ring-[oklch(0.9484_0.0251_149.08)]"
        >
            {number}
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// App Store Badges
// ─────────────────────────────────────────────────────────────────────────────
function AppStoreBadge({ platform }: { platform: "ios" | "android" }) {
    const isIOS = platform === "ios";
    return (
        <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={
                    isIOS
                        ? "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                        : "https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                }
                alt={isIOS ? "Download on the App Store" : "Get it on Google Play"}
                className={cn(
                    "w-auto cursor-not-allowed opacity-80 hover:opacity-100 transition-opacity",
                    isIOS ? "h-[40px]" : "h-[60px] translate-x-[-8px] -my-[10px]"
                )}
            />
            <div
                className={cn(
                    "absolute px-1.5 py-0.5 rounded-full bg-amber-400 text-[oklch(0.2475_0.0661_146.79)] text-[7px] font-bold uppercase tracking-widest shadow-md",
                    isIOS ? "-right-1.5 -top-1.5" : "right-1 top-0"
                )}
            >
                Soon
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function SuccessPage() {
    const { clearCart } = useCart();

    // Clear cart on success
    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="min-h-screen bg-[oklch(0.9484_0.0251_149.08)] text-[oklch(0.2475_0.0661_146.79)] font-satoshi flex flex-col">
            <NavbarSticky simple />

            {/* ───── Hero Celebration Section ───── */}
            <section className="relative overflow-hidden">
                {/* Subtle radial gradient backdrop */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse 70% 50% at 50% 0%, oklch(0.2475 0.0661 146.79 / 0.03) 0%, transparent 70%)",
                    }}
                />
                <CelebrationParticles />

                <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-8 md:pb-12">
                    <div className="max-w-2xl mx-auto text-center">
                        {/* ── Animated Check ── */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: "spring",
                                damping: 14,
                                stiffness: 180,
                                delay: 0.1,
                            }}
                            className="relative mb-10 inline-block"
                        >
                            {/* Outer ring pulse */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.4, 1],
                                    opacity: [0.3, 0, 0.3],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute inset-0 rounded-full border-2 border-green-400/30"
                                style={{ margin: "-12px" }}
                            />
                            <div className="size-20 md:size-[88px] rounded-full bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center border-4 border-white shadow-2xl shadow-green-500/10">
                                <motion.div
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                >
                                    <CheckCircle2 className="size-10 md:size-11 text-emerald-500" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* ── Headline ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold text-[oklch(0.2475_0.0661_146.79)]/30 mb-4">
                                Payment Successful
                            </p>
                            <h1 className="font-erode text-4xl md:text-[56px] font-semibold tracking-tight leading-[1.1] mb-5">
                                Welcome to your
                                <br />
                                <span className="italic text-[oklch(0.2475_0.0661_146.79)]/25">
                                    new beginning.
                                </span>
                            </h1>
                            <p className="text-[15px] md:text-[17px] text-[oklch(0.2475_0.0661_146.79)]/50 font-medium leading-relaxed max-w-md mx-auto">
                                You&apos;ve taken the most important step. Here&apos;s
                                everything you need to make the most of it.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ───── "What Happens Next" Journey ───── */}
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex-1 w-full max-w-[1200px] mx-auto px-6 md:px-12 pb-16 md:pb-24"
            >
                {/* Section Label */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-4 mb-10 max-w-4xl mx-auto"
                >
                    <div className="h-px flex-1 bg-[oklch(0.2475_0.0661_146.79)]/[0.06]" />
                    <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[oklch(0.2475_0.0661_146.79)]/25 whitespace-nowrap">
                        Your Next Steps
                    </p>
                    <div className="h-px flex-1 bg-[oklch(0.2475_0.0661_146.79)]/[0.06]" />
                </motion.div>

                {/* ── BENTO GRID LAYOUT ── */}
                <div className="max-w-[960px] mx-auto grid md:grid-cols-12 gap-5 md:gap-6 mb-16">
                    
                    {/* LEFT COLUMN */}
                    <div className="md:col-span-7 flex flex-col gap-5 md:gap-6">
                        
                        {/* ── WhatsApp Community ── */}
                        <motion.a
                            href="https://chat.whatsapp.com/GgW0StdlYGB4FG4EqfgGv0"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="group flex-1 rounded-[32px] p-8 md:p-10 bg-white/70 backdrop-blur-md border border-white/50 flex flex-col justify-between shadow-xl shadow-[oklch(0.2475_0.0661_146.79)]/5 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                        >
                            <div className="mb-6 size-12 rounded-full bg-[#25D366]/10 flex items-center justify-center border border-[#25D366]/20">
                                <FaWhatsapp className="size-6 text-[#25D366]" />
                            </div>
                            <div className="mb-8">
                                <h3 className="text-[28px] md:text-[32px] font-bold mb-3 text-[oklch(0.2475_0.0661_146.79)] leading-tight font-erode">
                                    Join the Inner Circle
                                </h3>
                                <p className="text-[15px] md:text-[16px] text-[oklch(0.2475_0.0661_146.79)]/70 font-medium leading-relaxed max-w-sm">
                                    Connect with guides and fellow members walking the same path, in our private WhatsApp community.
                                </p>
                            </div>
                            <div>
                                <span className="inline-flex items-center gap-2.5 text-[14px] font-bold text-[#25D366] bg-[#25D366]/5 px-5 py-2.5 rounded-full ring-1 ring-[#25D366]/20 group-hover:bg-[#25D366]/10 transition-colors">
                                    Join Now <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </motion.a>

                        {/* ── Check Inbox ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.65 }}
                            className="rounded-[32px] p-8 md:p-10 bg-[oklch(0.2475_0.0661_146.79)]/5 border border-[oklch(0.2475_0.0661_146.79)]/10"
                        >
                            <div className="mb-5 size-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <Mail className="size-5 text-[oklch(0.2475_0.0661_146.79)]" />
                            </div>
                            <h4 className="text-[18px] font-bold mb-2 text-[oklch(0.2475_0.0661_146.79)]">Check Your Inbox</h4>
                            <p className="text-[14px] md:text-[15px] text-[oklch(0.2475_0.0661_146.79)]/70 font-medium leading-relaxed">
                                Your receipt and onboarding guides are on their way to your email.
                            </p>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="md:col-span-5 flex flex-col gap-5 md:gap-6">
                        
                        {/* ── App Store Banner ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="rounded-[32px] p-8 md:p-10 bg-[oklch(0.2475_0.0661_146.79)] text-white overflow-hidden relative shadow-xl shadow-[oklch(0.2475_0.0661_146.79)]/20"
                        >
                            <div className="relative z-10">
                                <div className="mb-6 size-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                    <Sparkles className="size-5 text-[#E5D7B7]" />
                                </div>
                                <h3 className="text-[22px] font-bold mb-3 leading-tight font-erode">
                                    Download the App
                                </h3>
                                <p className="text-[14px] md:text-[15px] text-white/70 font-medium leading-relaxed mb-6">
                                    Your daily sessions, audios, and journal live natively on your phone.
                                </p>
                                <div className="flex flex-col gap-3 items-start">
                                    <AppStoreBadge platform="ios" />
                                    <AppStoreBadge platform="android" />
                                </div>
                            </div>
                        </motion.div>

                        {/* ── Calendly Booking ── */}
                        <motion.a
                            href="https://calendly.com/anjan-recoverycompass/30min"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.75 }}
                            className="group flex-1 rounded-[32px] p-8 md:p-10 bg-white/70 backdrop-blur-md border border-white/50 flex flex-col shadow-xl shadow-[oklch(0.2475_0.0661_146.79)]/5 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                        >
                            <div className="mb-6 size-12 rounded-xl bg-[#F08000]/10 flex items-center justify-center border border-[#F08000]/20">
                                <Calendar className="size-5 text-[#F08000]" />
                            </div>
                            <div className="flex-1 mb-8">
                                <h3 className="text-[20px] md:text-[22px] font-bold mb-3 text-[oklch(0.2475_0.0661_146.79)] leading-tight font-erode">
                                    Book Your Free Call
                                </h3>
                                <p className="text-[14px] md:text-[15px] text-[oklch(0.2475_0.0661_146.79)]/70 font-medium leading-relaxed">
                                    Every program includes a 1-on-1 strategy session to set your baseline.
                                </p>
                            </div>
                            <div>
                                <span className="inline-flex items-center gap-2.5 text-[13px] md:text-[14px] font-bold text-[#F08000] bg-[#F08000]/5 px-5 py-2.5 rounded-[16px] ring-1 ring-[#F08000]/20 group-hover:bg-[#F08000]/10 transition-colors">
                                    <Phone className="size-3.5" />
                                    Schedule on Calendly <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </motion.a>
                    </div>
                </div>

                {/* ── Divider ── */}
                <div className="max-w-3xl mx-auto mt-14 mb-10">
                    <div className="h-px bg-[oklch(0.2475_0.0661_146.79)]/[0.05]" />
                </div>

                {/* ── Bottom CTA ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-col items-center gap-6"
                >
                    <Button
                        asChild
                        className={cn(
                            "h-12 rounded-full px-8 font-bold text-[15px] transition-all active:scale-[0.98]",
                            "bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90",
                            "shadow-xl shadow-[oklch(0.2475_0.0661_146.79)]/15"
                        )}
                    >
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2.5"
                        >
                            Return Home
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                    <p className="text-[12px] text-[oklch(0.2475_0.0661_146.79)]/30 font-medium">
                        Thank you for trusting us with your journey.
                    </p>
                </motion.div>
            </motion.main>

            {/* ───── Footer ───── */}
            <FooterVariantTwo />
        </div>
    );
}
