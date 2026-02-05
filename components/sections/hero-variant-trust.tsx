
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
}

export function HeroVariantTrust({ onPrimaryClick, onSecondaryClick }: HeroSectionProps) {
    return (
        <section className="relative min-h-screen flex items-end justify-center px-6 md:px-16 lg:px-24 pt-24 pb-15 overflow-hidden">

            {/* Background Image */}
            <div className="absolute inset-0 z-0 bg-neutral-900">
                <Image
                    src="/hero-2.png"
                    alt="Recovery Compass Hero"
                    fill
                    className="object-cover opacity-80"
                    priority
                />

                {/* Subtle Geometric Overlays (kept for premium feel)
                <div
                    className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                    style={{
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                /> */}
            </div>

            {/* Content Overlay - Deep Moss gradient, limited to lower half */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 z-10 bg-gradient-to-t from-[oklch(0.2475_0.0661_146.79)]/95 via-[oklch(0.2475_0.0661_146.79)]/50 to-transparent" />


            {/* Content Container */}
            <div className="relative z-20 w-full max-w-[1200px]">
                <div className="w-full md:max-w-[85%] lg:max-w-full grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-12 xl:gap-x-20 items-start text-left">

                    {/* Left Column: Trust Bar & Headline */}
                    <div className="lg:col-span-7 space-y-6 md:space-y-8 lg:-mt-[6rem]">
                        {/* Avatar Trust Bar - First to animate */}
                        <motion.div
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        >
                            <div className="flex -space-x-3">
                                {[
                                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64",
                                    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&h=64",
                                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64",
                                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64"
                                ].map((src, i) => (
                                    <img
                                        key={i}
                                        src={src}
                                        alt="Community member"
                                        className="relative w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white object-cover transition-transform duration-300 hover:-translate-y-1"
                                    />
                                ))}
                            </div>
                            <p className="text-sm lg:text-base font-medium text-white/90">
                                Join 2,140+ beyond the urge
                            </p>
                        </motion.div>

                        {/* Status Pill - First visually, animate with headline */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                            </span>
                            <span className="text-xs font-medium text-white/90 tracking-wide uppercase">
                                Currently In Development — Launching Mid-March
                            </span>
                        </motion.div>

                        {/* Headline - Second to animate */}
                        <motion.h1
                            className="text-5xl lg:text-7xl font-sans font-medium tracking-tight leading-[1.1] text-white"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
                        >
                            A smarter way to navigate quitting.
                        </motion.h1>
                    </div>

                    {/* Right Column: Subheadline & CTAs */}
                    <div className="lg:col-span-5 space-y-6 md:space-y-8 lg:pb-2">
                        {/* Subheadline - Third to animate */}
                        <motion.p
                            className="text-lg lg:text-xl text-neutral-200 leading-relaxed font-medium"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                        >
                            Navigate urges, calm your body, and build steady change - one day at a time. Stop fighting biology with force and start using a structured approach that works with your nervous system.
                        </motion.p>

                        {/* CTAs - Last to animate */}
                        <motion.div
                            className="flex flex-row gap-3 justify-start w-full"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.65 }}
                        >
                            <Button
                                className="rounded-full px-6 py-3 lg:px-8 lg:py-4 text-base lg:text-lg font-medium bg-white hover:bg-neutral-100 text-neutral-900 shadow-lg shadow-black/20 h-auto whitespace-nowrap"
                                onClick={onPrimaryClick}
                            >
                                Join the Waitlist
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-full px-6 py-3 lg:px-8 lg:py-4 text-base lg:text-lg font-medium border-neutral-300/50 bg-transparent text-white hover:bg-white hover:text-neutral-900 hover:border-white h-auto whitespace-nowrap transition-colors"
                                onClick={onSecondaryClick}
                            >
                                Explore Programs
                            </Button>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
