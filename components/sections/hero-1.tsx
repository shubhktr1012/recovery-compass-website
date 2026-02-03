
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
}

export function HeroSection({ onPrimaryClick, onSecondaryClick }: HeroSectionProps) {
    return (
        <section className="relative min-h-screen flex items-end justify-center px-6 pt-24 pb-15 overflow-hidden">

            {/* Background Image */}
            {/* Background Image Placeholder */}
            <div className="absolute inset-0 z-0 bg-[#262626]">
                {/* Architectural Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `linear-gradient(#F8FAF2 1px, transparent 1px), linear-gradient(90deg, #F8FAF2 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Diagonal Cut / abstract accent */}
                <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-[#ffffff08] to-transparent pointer-events-none" />

                {/* Placeholder Badge */}
                <div className="absolute top-8 right-8 border border-white/20 px-4 py-2 rounded-full backdrop-blur-md">
                    <p className="text-xs font-mono text-white/60 tracking-widest uppercase">
                        Asset: Hero Visual
                    </p>
                </div>

                {/* Central Annotation */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                    <span className="text-6xl font-bold text-white uppercase tracking-tighter transform -rotate-12 border-4 border-white p-8 rounded-xl border-dashed">
                        Image Goes Here
                    </span>
                </div>
            </div>

            {/* Content Overlay - Gradient removed as per request */}
            {/* <div className="absolute inset-0 z-10 bg-gradient-to-r from-neutral-50 via-neutral-50/80 to-transparent w-full md:w-3/4 lg:w-2/3" /> */}

            {/* Content Container */}
            <div className="relative z-20 w-full max-w-[1200px]">
                <div className="w-full md:max-w-[50%] space-y-6 text-left">
                    {/* Feature Badges */}
                    <div className="flex flex-wrap gap-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D5DEC5]" />
                            <span className="text-sm font-medium text-white/90">Nervous System Regulation</span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D5DEC5]" />
                            <span className="text-sm font-medium text-white/90">Evidence-Based Support</span>
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tight leading-[1.1] text-white">
                        A smarter way to navigate quitting.
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-neutral-200 max-w-xl leading-relaxed font-medium">
                        Navigate urges, calm your body, and build steady change—one day at a time. Stop fighting biology with force and start using a structured approach that works with your nervous system.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-row gap-3 justify-start pt-4 w-full">
                        <Button
                            className="rounded-full px-6 py-3 text-base font-medium bg-white hover:bg-neutral-100 text-neutral-900 shadow-lg shadow-black/20 h-auto whitespace-nowrap"
                            onClick={onPrimaryClick}
                        >
                            Join the Waitlist
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-full px-6 py-3 text-base font-medium border-neutral-300/50 bg-transparent text-white hover:bg-white/10 h-auto whitespace-nowrap"
                            onClick={onSecondaryClick}
                        >
                            Explore Programs
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
