"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

type RealityItem = {
    id: string;
    visual: React.ReactNode;
    title: string;
    subtitle: string;
    source: string;
    href: string;
};

const sleepData = [
    { label: "Women", value: 5, tone: "bg-[#7FA595]" },
    { label: "Overall", value: 11, tone: "bg-[#D9B873]" },
    { label: "Men", value: 13, tone: "bg-[#F1D8A5]" },
];

const movementData = [
    { label: "Women", value: 52.4, tone: "bg-[#E3B779]" },
    { label: "Urban", value: 51.7, tone: "bg-[#7FA595]" },
    { label: "Overall", value: 41.4, tone: "bg-[#A7C1B6]" },
];

const tobaccoData = [
    { label: "Any tobacco", value: 28.6, radius: 52, color: "#E88767" },
    { label: "Smokeless", value: 21.4, radius: 38, color: "#D7B26D" },
    { label: "Smoking", value: 10.7, radius: 24, color: "#7FA595" },
];

const metabolicSupportStats = [
    { label: "Hypertension", value: "35.5%" },
    { label: "General obesity", value: "28.6%" },
];

const supportData = [
    { label: "Current", value: 5.1, tone: "bg-[#9EB8AF]" },
    { label: "Gap", value: 80.4, tone: "bg-[#E58D6A]" },
];

function SourceLink({ source, href }: { source: string; href?: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 text-xs tracking-[0.3em] text-black/40 font-bold uppercase font-satoshi hover:text-[#05290C] transition-colors"
        >
            Source: {source}
            <ArrowUpRight className="w-3 h-3 translate-y-[0.5px] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
    );
}

function PointerText({ title, subtitle, source, href }: { title: string; subtitle: string; source: string; href?: string }) {
    return (
        <div className="flex flex-col items-start text-left space-y-4 max-w-sm">
            <SourceLink source={source} href={href} />
            <h3 className="text-xl md:text-2xl font-sans font-bold text-black tracking-tight uppercase">
                {title}
            </h3>
            <p className="text-base md:text-lg text-black/50 font-satoshi leading-relaxed">
                {subtitle}
            </p>
        </div>
    );
}

function VisualContainer({ children, padding = "p-8" }: { children: React.ReactNode; padding?: string }) {
    return (
        <div className={`w-full min-h-[260px] sm:min-h-[300px] lg:min-h-0 lg:aspect-[5/4] bg-[#05290c] rounded-2xl flex items-center justify-center ${padding} overflow-hidden relative group`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(123,167,151,0.18)_0%,transparent_68%)] opacity-80" />
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px]" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/15 to-transparent" />
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                {children}
            </div>
        </div>
    );
}

function StatChip({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">{label}</div>
            <div className="text-sm font-black tracking-tight text-white">{value}</div>
        </div>
    );
}

function SleepStrainVisual() {
    return (
        <div className="flex h-full w-full flex-col justify-between gap-6 px-2 py-3">
            <div className="text-center">
                <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-white/30">Estimated burden</div>
                <div className="text-4xl font-black tracking-tight text-white sm:text-5xl">10.4cr</div>
                <div className="text-xs text-white/55">working-age adults with sleep apnea</div>
            </div>

            <div className="flex h-[150px] items-end justify-between gap-4 px-2">
                {sleepData.map((item) => {
                    const barHeight = `${(item.value / 15) * 100}%`;

                    return (
                        <div key={item.label} className="flex h-full flex-1 flex-col items-center gap-2">
                            <div className="text-[11px] font-black tracking-tight text-white/80">{item.value}%</div>
                            <div className="flex h-full w-full max-w-14 items-end">
                                <div className="w-full" style={{ height: barHeight }}>
                                    <motion.div
                                        initial={{ scaleY: 0, opacity: 0.4 }}
                                        whileInView={{ scaleY: 1, opacity: 1 }}
                                        viewport={{ once: true, amount: 0.5 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className={`${item.tone} h-full origin-bottom rounded-t-[18px] shadow-[0_0_22px_rgba(255,255,255,0.08)]`}
                                    />
                                </div>
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">{item.label}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function MovementGapVisual() {
    return (
        <div className="flex h-full w-full flex-col justify-center gap-6 px-4 sm:px-6">
            <div className="text-center">
                <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-white/30">Insufficient activity</div>
                <div className="text-4xl font-black tracking-tight text-white sm:text-5xl">41.4%</div>
                <div className="text-xs text-white/55">of adults in India</div>
            </div>

            <div className="space-y-4">
                {movementData.map((item, index) => (
                    <div key={item.label} className="space-y-1.5">
                        <div className="flex items-end justify-between gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">{item.label}</span>
                            <span className="text-sm font-black tracking-tight text-white">{item.value}%</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.08]">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${item.value}%` }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.8, delay: index * 0.12, ease: "easeOut" }}
                                className={`${item.tone} h-full rounded-full shadow-[0_0_14px_rgba(255,255,255,0.08)]`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TobaccoBurdenVisual() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-5 px-4 py-4">
            <div className="relative h-44 w-44 sm:h-48 sm:w-48">
                <svg viewBox="0 0 160 160" className="h-full w-full">
                    {tobaccoData.map((item) => {
                        const circumference = 2 * Math.PI * item.radius;
                        const dashOffset = circumference * (1 - item.value / 100);

                        return (
                            <g key={item.label} transform="rotate(-90 80 80)">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r={item.radius}
                                    fill="none"
                                    stroke="rgba(255,255,255,0.08)"
                                    strokeWidth="10"
                                />
                                <motion.circle
                                    cx="80"
                                    cy="80"
                                    r={item.radius}
                                    fill="none"
                                    stroke={item.color}
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    initial={{ strokeDashoffset: circumference }}
                                    whileInView={{ strokeDashoffset: dashOffset }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ duration: 0.9, ease: "easeOut" }}
                                />
                            </g>
                        );
                    })}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <div className="text-4xl font-black tracking-tight text-white">267M</div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.32em] text-white/[0.32]">Adults</div>
                </div>
            </div>

            <div className="grid w-full grid-cols-3 gap-2">
                {tobaccoData.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-center">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">{item.label}</div>
                        <div className="mt-1 text-sm font-black tracking-tight text-white">{item.value}%</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MetabolicLoadVisual() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-5 px-4 py-3">
            <div className="text-center">
                <div className="text-[10px] font-bold uppercase tracking-[0.32em] text-white/30">Abdominal obesity</div>
            </div>

            <div
                className="relative flex h-36 w-36 items-center justify-center rounded-full sm:h-40 sm:w-40"
                style={{
                    background: "conic-gradient(#d6b068 0 39.5%, rgba(255,255,255,0.08) 39.5% 100%)",
                }}
            >
                <div className="flex h-[68%] w-[68%] flex-col items-center justify-center rounded-full bg-[#05290c] text-center">
                    <div className="text-3xl font-black tracking-tight text-white">39.5%</div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">Adults</div>
                </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-2.5">
                {metabolicSupportStats.map((item) => (
                    <StatChip key={item.label} label={item.label} value={item.value} />
                ))}
            </div>
        </div>
    );
}

function SupportGapVisual() {
    return (
        <div className="flex h-full w-full flex-col justify-between gap-5 px-4 py-3">
            <div className="text-center">
                <div className="text-[10px] font-bold uppercase tracking-[0.32em] text-white/30">Treatment gap</div>
                <div className="text-4xl font-black tracking-tight text-white sm:text-5xl">80.4%</div>
                <div className="text-xs text-white/55">current CMD prevalence: 5.1%</div>
            </div>

            <div className="flex h-[150px] items-end justify-center gap-8 px-4">
                {supportData.map((item) => (
                    <div key={item.label} className="flex h-full w-20 flex-col items-center justify-end gap-2">
                        <div className="text-xs font-black tracking-tight text-white">{item.value}%</div>
                        <div className="flex h-full w-full items-end rounded-t-[24px] bg-white/[0.07] p-1">
                            <motion.div
                                initial={{ scaleY: 0, opacity: 0.4 }}
                                whileInView={{ scaleY: 1, opacity: 1 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.85, ease: "easeOut" }}
                                className={`${item.tone} w-full origin-bottom rounded-t-[18px]`}
                                style={{ height: `${item.value}%` }}
                            />
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">{item.label}</div>
                    </div>
                ))}
            </div>

            <div className="mx-auto rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-medium tracking-wide text-white/75">
                Average family spend: Rs 1500/month
            </div>
        </div>
    );
}

const realityItems: RealityItem[] = [
    {
        id: "sleep-strain",
        visual: <SleepStrainVisual />,
        title: "The Sleep Strain",
        subtitle: "AIIMS researchers estimate that 10.4 crore working-age Indians may be living with obstructive sleep apnea. The burden rises to 13% in men and still reaches 5% in women.",
        source: "AIIMS meta-analysis (2023)",
        href: "https://pubmed.ncbi.nlm.nih.gov/37517357/",
    },
    {
        id: "movement-gap",
        visual: <MovementGapVisual />,
        title: "The Movement Gap",
        subtitle: "Insufficient physical activity affects 41.4% of adults in India, climbing above 50% among women and urban adults. Low energy is often a systems problem before it feels like a motivation problem.",
        source: "National NCD Monitoring Survey (2022)",
        href: "https://pubmed.ncbi.nlm.nih.gov/35148500/",
    },
    {
        id: "tobacco-burden",
        visual: <TobaccoBurdenVisual />,
        title: "The Tobacco Burden",
        subtitle: "GATS 2 found that 28.6% of adults in India use tobacco. Smokeless tobacco remains more prevalent than smoking, which is why support needs to meet different patterns of dependence.",
        source: "WHO GATS 2 (2016-17)",
        href: "https://cdn.who.int/media/docs/default-source/searo/india/health-topic-pdf/tobacco/gats-india-2016-17-factsheet.pdf?sfvrsn=27b93d0e_2",
    },
    {
        id: "metabolic-load",
        visual: <MetabolicLoadVisual />,
        title: "The Metabolic Load",
        subtitle: "In the ICMR-INDIAB study, abdominal obesity reached 39.5% of adults, alongside high rates of hypertension and general obesity. Recovery often has to rebuild sleep, movement, and regulation together.",
        source: "ICMR-INDIAB (2023)",
        href: "https://pubmed.ncbi.nlm.nih.gov/37301218/",
    },
    {
        id: "support-gap",
        visual: <SupportGapVisual />,
        title: "The Support Gap",
        subtitle: "Common mental disorders had a 5.1% current prevalence in the National Mental Health Survey, but the treatment gap reached 80.4%. Small daily support matters most when care still feels far away.",
        source: "National Mental Health Survey (2022)",
        href: "https://pubmed.ncbi.nlm.nih.gov/35400745/",
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
                        Across India, the pressure <br className="hidden md:block" />
                        shows up in <span className="text-primary italic">patterns.</span>
                    </h2>
                    <p className="text-lg text-black/50 font-satoshi max-w-[42rem] mx-auto leading-relaxed">
                        Sleep disruption, low movement, tobacco use, metabolic strain, and untreated distress are widespread.
                        Recovery Compass is built around these patterns, not around guilt.
                    </p>
                </div>

                {/* ============ MOBILE / TABLET LAYOUT (< lg) ============ */}
                {/* Simplified Stack: Headline -> Visual -> Subtitle -> Source */}
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
