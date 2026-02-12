"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

/**
 * Common Pointer Components
 */
function PointerText({ title, subtitle, source, href }: { title: string; subtitle: string; source: string; href?: string }) {
    return (
        <div className="flex flex-col items-start text-left space-y-4 max-w-sm">
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 text-xs tracking-[0.3em] text-black/40 font-bold uppercase font-satoshi hover:text-[#05290C] transition-colors"
            >
                Source: {source}
                <ArrowUpRight className="w-3 h-3 translate-y-[0.5px] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <h3 className="text-xl md:text-2xl font-sans font-bold text-black tracking-tight uppercase">
                {title}
            </h3>
            <p className="text-base md:text-lg text-black/50 font-satoshi leading-relaxed">
                {subtitle}
            </p>
        </div>
    );
}

/**
 * Visual Containers - Dark Green Styling
 */
function VisualContainer({ children, padding = "p-8" }: { children: React.ReactNode; padding?: string }) {
    return (
        <div className={`w-full aspect-[4/3] md:aspect-[5/4] bg-[#05290c] rounded-2xl flex items-center justify-center ${padding} overflow-hidden relative group`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,125,107,0.15)_0%,transparent_70%)] opacity-50" />
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                {children}
            </div>
        </div>
    );
}

/**
 * 1. The Dopamine Spike (Research: Di Chiara, 2000)
 */
function DopamineChart() {
    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            <div className="relative w-full h-full max-h-[180px]">
                {/* Y-Axis Labels */}
                <div className="absolute -left-2 inset-y-0 flex flex-col justify-between text-[10px] font-bold text-white/20 uppercase tracking-tighter">
                    <span>250%</span>
                    <span>150%</span>
                    <span>100%</span>
                </div>

                <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
                    {/* Baseline */}
                    <line x1="0" y1="80" x2="200" y2="80" stroke="white" strokeWidth="0.5" strokeDasharray="2 4" strokeOpacity="0.1" />

                    {/* Natural Reward (Smoother Curve) */}
                    <motion.path
                        d="M0,80 C40,80 60,65 100,65 S160,80 200,80"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="2"
                        strokeOpacity="0.3"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                    />

                    {/* Nicotine Hijack (Bézier Spike) */}
                    <motion.path
                        d="M0,80 L30,80 C40,80 45,20 55,20 C65,20 75,60 90,65 C110,70 150,80 200,80"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "circOut" }}
                        className="drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]"
                    />

                    {/* Peak Focal Point */}
                    <motion.g
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <circle cx="55" cy="20" r="4" fill="white" />
                        <circle cx="55" cy="20" r="12" stroke="#EF4444" strokeWidth="1.5" fill="none">
                            <animate attributeName="scale" from="1" to="2.5" dur="1.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                    </motion.g>
                </svg>

                {/* Legend */}
                <div className="flex justify-center gap-12 mt-8">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-0.5 bg-[#F59E0B] opacity-60" />
                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Natural</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-1 bg-[#EF4444]" />
                        <span className="text-[9px] font-bold text-[#EF4444] uppercase tracking-[0.2em]">Nicotine Hijack</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * 2. The Time Tax Chart (Data-driven cumulative loss)
 */
function TimeTaxChart() {
    const data = [
        { label: "Daily", value: "1.4 Hours", width: "15%", sub: "Standard Workout" },
        { label: "Monthly", value: "1.75 Days", width: "35%", sub: "A Full Weekend" },
        { label: "Yearly", value: "21 Days", width: "70%", sub: "A Long Vacation" },
        { label: "Decade", value: "7 Months", width: "100%", sub: "A Life Chapter" },
    ];

    return (
        <div className="w-full h-full flex flex-col justify-center space-y-6 px-4 md:px-8">
            <div className="flex flex-col space-y-1 mb-2">
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Cumulative Loss</span>
                <h4 className="text-xl font-bold text-white uppercase tracking-tight">The Life Debt</h4>
            </div>

            <div className="space-y-5">
                {data.map((item, index) => (
                    <div key={item.label} className="space-y-1.5 px-1">
                        <div className="flex justify-between items-end">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{item.label}</span>
                                <span className="text-xs text-white/60 font-medium italic">{item.sub}</span>
                            </div>
                            <span className="text-sm font-black text-[#10B981] tabular-nums tracking-tight">
                                {item.value}
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: item.width }}
                                transition={{ duration: 1, delay: 0.2 + index * 0.15, ease: "circOut" }}
                                className="h-full bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * 3. The 12-Hour Reset (Biological Recovery)
 */
function OxygenResetVisual() {
    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="relative w-40 h-40 md:w-44 md:h-44 scale-110 md:scale-125">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.05" />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#06B6D4"
                        strokeWidth="8"
                        strokeDasharray="283"
                        initial={{ strokeDashoffset: 0, opacity: 0.8 }}
                        whileInView={{ strokeDashoffset: 283, opacity: 0.1 }}
                        transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                    />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="6"
                        strokeDasharray="220"
                        initial={{ strokeDashoffset: 220 }}
                        whileInView={{ strokeDashoffset: 0 }}
                        transition={{ duration: 3, ease: "easeOut" }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-white leading-none">12h</span>
                    <span className="text-[8px] font-bold text-white/30 uppercase mt-1">Reset</span>
                </div>
            </div>
        </div>
    );
}

/**
 * 4. The Annual Cost (Financial Impact)
 */
function FinancialCostVisual() {
    const items = [
        { name: "iPhone 16 Pro", cost: "$999", delay: 0 },
        { name: "Gym (Year)", cost: "$720", delay: 0.2 },
        { name: "Flights", cost: "$1,200", delay: 0.4 },
    ];

    return (
        <div className="w-full h-full flex flex-col justify-center px-6 space-y-4">
            <div className="text-center mb-2">
                <span className="text-3xl font-black text-[#F59E0B] tracking-tight">$2,920</span>
                <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">Annual Tobacco Tax</p>
            </div>
            <div className="space-y-2">
                {items.map((item) => (
                    <motion.div
                        key={item.name}
                        initial={{ x: -10, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: item.delay }}
                        className="flex justify-between items-center py-2 border-b border-white/5"
                    >
                        <span className="text-[10px] text-white/40 font-bold uppercase">{item.name}</span>
                        <span className="text-xs text-white/80 font-mono italic">{item.cost}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

/**
 * 5. The 3-Minute Wave (Behavioral)
 */
function CravingWaveVisual() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="w-full h-32 relative overflow-hidden scale-110 md:scale-125">
                <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#F97316" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#FB923C" stopOpacity="1" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
                        </linearGradient>
                    </defs>
                    <motion.path
                        d="M -80 75 Q -40 10, 0 75 T 80 75 T 160 75 T 240 75 T 320 75"
                        fill="none"
                        stroke="url(#waveGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, x: 0 }}
                        animate={{ x: -80 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{
                            pathLength: { duration: 1.5, ease: "easeOut" },
                            x: { duration: 3, repeat: Infinity, ease: "linear" }
                        }}
                    />
                    {/* Floating Pulse Point */}
                    <motion.circle
                        cx="100" cy="70" r="3" fill="#FB923C"
                        animate={{ y: [0, -30, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]"
                    />
                </svg>
            </div>
            <div className="mt-4 flex justify-between w-full px-2">
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-white/30 uppercase">Peak</span>
                    <span className="text-xs text-white/80 font-black tracking-tighter">Minutes 3-5</span>
                </div>
                <div className="text-right">
                    <span className="text-[9px] font-bold text-white/30 uppercase">Verdict</span>
                    <span className="text-xs text-[#F97316] font-black tracking-tighter italic">Hold On</span>
                </div>
            </div>
        </div>
    );
}

// Data definition for consistent rendering
const realityItems = [
    {
        id: "override",
        visual: <DopamineChart />,
        title: "The Override",
        subtitle: "Nicotine bypasses natural limits, hitting 250% and forcefully rewriting your reward logic.",
        source: "Di Chiara, G. (2000)",
        href: "https://pubmed.ncbi.nlm.nih.gov/11073861/",
    },
    {
        id: "time-tax",
        visual: <TimeTaxChart />,
        title: "The Time Tax",
        subtitle: "Average daily loss based on 14 units. Reclaim 21 full days of life every year.",
        source: "CDC NHIS (2022)",
        href: "https://www.cdc.gov/tobacco/data_statistics/fact_sheets/adult_data/cig_smoking/index.html",
    },
    {
        id: "oxygen",
        visual: <OxygenResetVisual />,
        title: "The 12-Hour Reset",
        subtitle: "Carbon monoxide levels in your blood drop to normal within half a day. Biological recovery begins immediately.",
        source: "WHO (2024)",
        href: "https://www.who.int/news-room/fact-sheets/detail/tobacco",
    },
    {
        id: "cost",
        visual: <FinancialCostVisual />,
        title: "The Annual Cost",
        subtitle: "$2,920 per year is the average U.S. cost for a pack-a-day habit. Reclaim your capital.",
        source: "Tobacco-Free Kids (2024)",
        href: "https://www.tobaccofreekids.org/problem/toll-us",
    },
    {
        id: "craving",
        visual: <CravingWaveVisual />,
        title: "The 3-Minute Wave",
        subtitle: "The average intense craving peaks and passes in just 3-5 minutes. You only need to wait.",
        source: "Hughes, J.R. (1992)",
        href: "https://pubmed.ncbi.nlm.nih.gov/1572972/"
    }
];

export function ProblemSection() {

    return (
        <section className="relative bg-[#FAFAFA] overflow-hidden py-16 md:py-24">
            <div className="max-w-[1200px] mx-auto px-6 relative z-10">

                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24 space-y-4">
                    <Badge
                        variant="secondary"
                        className="rounded-full px-4 py-1.5 text-xs font-medium tracking-wide border-none bg-[oklch(0.9484_0.0251_149.08)] text-[oklch(0.2475_0.0661_146.79)] hover:bg-[oklch(0.9484_0.0251_149.08)] uppercase"
                    >
                        The Reality
                    </Badge>
                    <h2 className="text-4xl md:text-6xl font-erode font-medium tracking-tighter leading-[1.1] text-black">
                        You aren’t failing. <br className="hidden md:block" />
                        You’re just <span className="text-primary italic">overpowered.</span>
                    </h2>
                    {/* <p className="text-lg text-black/50 font-satoshi max-w-md mx-auto leading-relaxed">
                        Redefining recovery through <span className="text-black font-semibold">biological data</span>, not willpower.
                    </p> */}
                </div>

                {/* ============ MOBILE / TABLET LAYOUT (< lg) ============ */}
                {/* Simplified Stack: Headline -> Visual -> Subtitle -> Source */}
                {/* Shows only first 3 items */}
                <div className="flex flex-col space-y-20 lg:hidden">
                    {realityItems.map((item) => (
                        <div key={item.id} className="flex flex-col space-y-6">
                            {/* Headline */}
                            <h3 className="text-2xl font-sans font-bold text-black tracking-tight">
                                {item.title}
                            </h3>

                            {/* Visual Container */}
                            <VisualContainer padding="p-4">
                                {item.visual}
                            </VisualContainer>

                            {/* Subtitle & Source */}
                            <div className="flex flex-col space-y-4 max-w-lg">
                                <p className="text-lg text-black/60 font-satoshi leading-relaxed">
                                    {item.subtitle}
                                </p>
                                <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-1.5 text-xs tracking-[0.3em] text-black/40 font-bold uppercase font-satoshi hover:text-[#05290C] transition-colors"
                                >
                                    Source: {item.source}
                                    <ArrowUpRight className="w-3 h-3 translate-y-[0.5px] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ============ DESKTOP LAYOUT (>= lg) ============ */}
                {/* Original Complex Grid */}
                <div className="hidden lg:block">
                    {/* Row 1: 2 Columns */}
                    <div className="grid grid-cols-2 gap-16 mb-16">
                        {/* Item 1: Text -> Visual */}
                        <div className="flex flex-col items-start space-y-12">
                            <PointerText
                                source={realityItems[0].source}
                                title={realityItems[0].title}
                                subtitle={realityItems[0].subtitle}
                                href={realityItems[0].href}
                            />
                            <VisualContainer padding="p-4">
                                {realityItems[0].visual}
                            </VisualContainer>
                        </div>

                        {/* Item 2: Visual -> Text */}
                        <div className="flex flex-col items-start space-y-12">
                            <VisualContainer padding="p-4">
                                {realityItems[1].visual}
                            </VisualContainer>
                            <PointerText
                                source={realityItems[1].source}
                                title={realityItems[1].title}
                                subtitle={realityItems[1].subtitle}
                                href={realityItems[1].href}
                            />
                        </div>
                    </div>

                    {/* Row 2: 3 Columns */}
                    <div className="grid grid-cols-3 gap-6">
                        {realityItems.slice(2).map((item) => (
                            <div key={item.id} className="flex flex-col items-start space-y-8">
                                <VisualContainer padding="p-4">
                                    {item.visual}
                                </VisualContainer>
                                <PointerText
                                    source={item.source}
                                    title={item.title}
                                    subtitle={item.subtitle}
                                    href={item.href}
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
