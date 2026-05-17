"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
    ShieldCheck,
    Zap,
    Heart,
    BookOpen,
    Users,
    Mail,
    MapPin,
    ArrowRight,
} from "lucide-react";

const PILLARS = [
    {
        icon: BookOpen,
        title: "Evidence-First",
        body: "Every program is rooted in peer-reviewed research from WHO, NIH, Mayo Clinic, NHS, and leading medical institutions, not trends.",
    },
    {
        icon: Heart,
        title: "Compassionate Design",
        body: "We built Recovery Compass because behaviour change is hard and the tools to support it were either clinical or condescending. Ours are neither.",
    },
    {
        icon: Zap,
        title: "Actionable, Not Overwhelming",
        body: "Daily cards, program-specific routines, reflection prompts, and progress tracking keep you moving forward without burning you out.",
    },
    {
        icon: ShieldCheck,
        title: "Private & Secure",
        body: "Your journal, progress, and health data belong to you. We never sell personal data and give you full control to delete your account at any time.",
    },
    {
        icon: Users,
        title: "Built for Real Life",
        body: "Designed for people with busy schedules, high stress, and real setbacks, not just the highly motivated.",
    },
];

const PROGRAMS = [
    "6-Day Control",
    "90-Day Smoking Reset",
    "21-Day Deep Sleep Reset",
    "14-Day Energy Restore",
    "30-Day Men's Vitality Reset",
    "90-Day Biohacking Reset",
];

const STATS = [
    { value: "6", label: "Programs" },
    { value: "90+", label: "Guided days" },
    { value: "2", label: "Platforms" },
];

export function AboutPageContent() {
    return (
        <main className="flex-1 w-full overflow-hidden">

            {/* ── Hero ────────────────────────────── */}
            <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden bg-white">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,oklch(0.95_0.03_150/0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,oklch(0.95_0.03_150/0.1),transparent_50%)]" />
                
                <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12">
                    <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(0.2475_0.0661_146.79)]/5 border border-[oklch(0.2475_0.0661_146.79)]/10"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[oklch(0.2475_0.0661_146.79)] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[oklch(0.2475_0.0661_146.79)]"></span>
                            </span>
                            <span className="text-[10px] md:text-xs font-bold text-[oklch(0.2475_0.0661_146.79)]/80 tracking-wide uppercase">
                                Our Mission & Vision
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-5xl md:text-7xl lg:text-8xl font-erode font-medium tracking-tighter leading-[0.95] text-black"
                        >
                            Helping people{" "}
                            <span className="italic text-[oklch(0.2475_0.0661_146.79)]">
                                reclaim their health.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.15 }}
                            className="text-lg md:text-2xl text-[oklch(0.2475_0.0661_146.79)]/70 leading-relaxed font-medium max-w-2xl mx-auto font-satoshi"
                        >
                            Recovery Compass is a science-backed behavioural wellness app that guides you through evidence-based programs for smoking cessation, sleep, energy, men&apos;s vitality, and healthy ageing: built with compassion, not hype.
                        </motion.p>

                        {/* Stats Row */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="flex justify-center gap-12 md:gap-24 pt-8"
                        >
                            {STATS.map((stat, i) => (
                                <motion.div 
                                    key={stat.label} 
                                    className="text-center"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                >
                                    <div className="text-4xl md:text-5xl font-erode font-medium text-[oklch(0.2475_0.0661_146.79)]">
                                        {stat.value}
                                    </div>
                                    <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.24em] text-[oklch(0.2475_0.0661_146.79)]/40 mt-2">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Our Story ────────────────────────────── */}
            <section className="relative bg-[#FAFAFA] py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/asfalt-dark.png")` }} />
                <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">

                        {/* Left: Header */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(0.2475_0.0661_146.79)]/5 border border-[oklch(0.2475_0.0661_146.79)]/10">
                                <span className="text-[10px] md:text-xs font-bold text-[oklch(0.2475_0.0661_146.79)]/80 tracking-wide uppercase font-satoshi">
                                    Our Origin
                                </span>
                            </div>
                            <h2 className="text-5xl md:text-6xl font-erode font-medium tracking-tighter leading-[0.95] text-black">
                                Why we built{" "}
                                <br className="hidden md:block" />
                                <span className="italic text-[oklch(0.2475_0.0661_146.79)]">
                                    Recovery Compass.
                                </span>
                            </h2>
                        </motion.div>

                        {/* Right: Story */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.8, delay: 0.15 }}
                            className="space-y-8 text-xl text-[oklch(0.2475_0.0661_146.79)]/70 font-satoshi leading-relaxed"
                        >
                            <p className="first-letter:text-5xl first-letter:font-erode first-letter:mr-3 first-letter:float-left first-letter:text-[oklch(0.2475_0.0661_146.79)]">
                                We noticed that millions of people wanted to change their habits (quit smoking, sleep better, feel stronger) but the resources available to them were either dry medical PDFs or overpriced coaching programs that felt out of reach.
                            </p>
                            <p>
                                Recovery Compass was founded to close that gap. We combined the latest research from institutions like the{" "}
                                <span className="font-medium text-[oklch(0.2475_0.0661_146.79)] underline underline-offset-4 decoration-[oklch(0.2475_0.0661_146.79)]/20">World Health Organization</span>,{" "}
                                <span className="font-medium text-[oklch(0.2475_0.0661_146.79)] underline underline-offset-4 decoration-[oklch(0.2475_0.0661_146.79)]/20">Mayo Clinic</span>, the{" "}
                                <span className="font-medium text-[oklch(0.2475_0.0661_146.79)] underline underline-offset-4 decoration-[oklch(0.2475_0.0661_146.79)]/20">National Institutes of Health</span>, and the{" "}
                                <span className="font-medium text-[oklch(0.2475_0.0661_146.79)] underline underline-offset-4 decoration-[oklch(0.2475_0.0661_146.79)]/20">NHS</span>{" "}
                                with thoughtful product design to create programs that are structured, compassionate, and actually work in a busy life.
                            </p>
                            <p>
                                Today Recovery Compass serves users across iOS and Android, helping them track progress, complete daily exercises, follow reflections, and save journal entries: all in one place, all backed by science.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Pillars ────────────────────────────── */}
            <section className="py-16 md:py-24 px-6 md:px-12 max-w-[1200px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-2xl mx-auto mb-14 md:mb-20 space-y-4"
                >
                    <Badge
                        variant="secondary"
                        className="rounded-full px-4 py-1.5 text-xs font-medium tracking-wide border-none bg-[oklch(0.9484_0.0251_149.08)] text-[oklch(0.2475_0.0661_146.79)] hover:bg-[oklch(0.9484_0.0251_149.08)] uppercase"
                    >
                        Our Principles
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-erode font-medium tracking-tighter leading-[1.1] text-black">
                        What we{" "}
                        <span className="italic text-[oklch(0.2475_0.0661_146.79)]">
                            stand for.
                        </span>
                    </h2>
                    <p className="text-lg text-[oklch(0.2475_0.0661_146.79)]/60 font-satoshi max-w-[42rem] mx-auto leading-relaxed">
                        Five principles guide every product decision at Recovery Compass.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PILLARS.map((pillar, i) => (
                        <motion.div
                            key={pillar.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.7, delay: i * 0.08 }}
                            className={`group relative flex flex-col p-10 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${i === 0
                                    ? "bg-[oklch(0.2475_0.0661_146.79)] text-white md:col-span-2 lg:col-span-1 shadow-xl"
                                    : "bg-white border border-[oklch(0.2475_0.0661_146.79)]/5 text-[oklch(0.2475_0.0661_146.79)] shadow-sm"
                                }`}
                        >
                            <div
                                className={`flex-shrink-0 size-14 rounded-2xl flex items-center justify-center mb-8 ${i === 0
                                        ? "bg-white/10"
                                        : "bg-[oklch(0.2475_0.0661_146.79)]/5"
                                    }`}
                            >
                                <pillar.icon
                                    className={`size-6 ${i === 0 ? "text-white" : "text-[oklch(0.2475_0.0661_146.79)]"}`}
                                    strokeWidth={1.5}
                                />
                            </div>
                            <h3
                                className={`font-erode text-2xl md:text-3xl font-medium tracking-tighter mb-4 ${i === 0 ? "text-white" : "text-[oklch(0.2475_0.0661_146.79)]"
                                    }`}
                            >
                                {pillar.title}
                            </h3>
                            <p
                                className={`text-base font-satoshi leading-relaxed ${i === 0 ? "text-white/70" : "text-[oklch(0.2475_0.0661_146.79)]/60"
                                    }`}
                            >
                                {pillar.body}
                            </p>

                            {/* Decorative element for white cards */}
                            {i !== 0 && (
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                    <pillar.icon className="size-24" />
                                </div>
                            )}

                            {/* Glow for dark card */}
                            {i === 0 && (
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500 pointer-events-none" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Programs ────────────────────────────── */}
            <section className="relative bg-[oklch(0.2475_0.0661_146.79)] py-16 md:py-24 overflow-hidden">
                {/* Background decor */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(123,167,151,0.18)_0%,transparent_68%)] opacity-80" />
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px]" />

                <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        {/* Left */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <Badge
                                variant="secondary"
                                className="rounded-full px-4 py-1.5 text-xs font-medium tracking-wide border-none bg-white/10 text-white/80 hover:bg-white/10 uppercase"
                            >
                                Our Programs
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-erode font-medium tracking-tighter leading-[1.1] text-white">
                                Structured paths for{" "}
                                <br className="hidden md:block" />
                                <span className="italic text-white/90">
                                    real change.
                                </span>
                            </h2>
                            <p className="text-lg text-white/60 font-satoshi leading-relaxed max-w-md">
                                Each program is grounded in evidence-based frameworks. Review our{" "}
                                <Link
                                    href="/citations"
                                    className="text-white/90 underline underline-offset-4 hover:text-white transition-colors"
                                >
                                    full source citations
                                </Link>
                                .
                            </p>

                            <Link
                                href="/#programs"
                                className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors group mt-4"
                            >
                                Explore all programs
                                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        {/* Right: Program list */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.15 }}
                            className="space-y-3"
                        >
                            {PROGRAMS.map((prog, i) => (
                                <motion.div
                                    key={prog}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.06 }}
                                    className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.08] bg-white/[0.05] backdrop-blur-sm"
                                >
                                    <div className="flex-shrink-0 size-8 rounded-full bg-white/10 flex items-center justify-center">
                                        <span className="text-xs font-bold text-white/60 font-mono">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <span className="text-sm md:text-base font-medium text-white/90">
                                        {prog}
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Company / Contact ──────────────────────── */}
            <section className="bg-white py-24 md:py-32">
                <div className="max-w-[1200px] mx-auto px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-2xl mx-auto mb-20 space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(0.2475_0.0661_146.79)]/5 border border-[oklch(0.2475_0.0661_146.79)]/10">
                            <span className="text-[10px] md:text-xs font-bold text-[oklch(0.2475_0.0661_146.79)]/80 tracking-wide uppercase font-satoshi">
                                Get In Touch
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-erode font-medium tracking-tighter leading-[0.95] text-black">
                            Built in{" "}
                            <span className="italic text-[oklch(0.2475_0.0661_146.79)]">
                                Bangalore.
                            </span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                        {/* Address Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="p-12 rounded-[2.5rem] bg-[oklch(0.9484_0.0251_149.08)] text-[oklch(0.2475_0.0661_146.79)] relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                <MapPin className="size-32" />
                            </div>
                            <div className="relative z-10">
                                <div className="size-14 rounded-2xl bg-[oklch(0.2475_0.0661_146.79)]/5 flex items-center justify-center mb-8">
                                    <MapPin className="size-6 text-[oklch(0.2475_0.0661_146.79)]" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-erode text-2xl font-medium tracking-tight mb-6">
                                    Recovery Compass LLP
                                </h3>
                                <address className="not-italic text-base text-[oklch(0.2475_0.0661_146.79)]/60 leading-relaxed font-satoshi space-y-2">
                                    <p className="font-medium">Registered in India</p>
                                    <p>
                                        292-94, 3rd Main, 5th Cross
                                        <br />
                                        New Thippasandra
                                        <br />
                                        Bangalore 560075, India
                                    </p>
                                </address>
                            </div>
                        </motion.div>

                        {/* Contact Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="p-12 rounded-[2.5rem] bg-[oklch(0.2475_0.0661_146.79)] text-white relative overflow-hidden group shadow-xl"
                        >
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500 pointer-events-none" />
                            <div className="relative z-10">
                                <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8">
                                    <Mail className="size-6 text-white" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-erode text-2xl font-medium tracking-tight mb-6">
                                    Hello & Support
                                </h3>
                                <p className="text-base text-white/60 leading-relaxed font-satoshi mb-10">
                                    Recovery Compass is available on iOS and Android. We are a small, dedicated team committed to building the best evidence-backed wellness tools available.
                                </p>
                                <a
                                    href="mailto:support@recoverycompass.co"
                                    className="inline-flex items-center gap-2 text-lg font-medium text-white hover:text-white/80 transition-colors underline underline-offset-8 decoration-white/20 hover:decoration-white/50"
                                >
                                    support@recoverycompass.co
                                </a>
                                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-12 text-xs text-white/40 font-satoshi uppercase tracking-widest font-bold">
                                    <Link href="/privacy" className="hover:text-white transition-colors">
                                        Privacy
                                    </Link>
                                    <Link href="/terms" className="hover:text-white transition-colors">
                                        Terms
                                    </Link>
                                    <Link href="/citations" className="hover:text-white transition-colors">
                                        Citations
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}
