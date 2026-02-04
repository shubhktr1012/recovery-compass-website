
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
}

export function HeroVariantTrust({ onPrimaryClick, onSecondaryClick }: HeroSectionProps) {
    return (
        <section className="relative min-h-screen flex items-end justify-center px-6 md:px-16 lg:px-24 pt-24 pb-15 overflow-hidden">

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
                <div className="w-full md:max-w-[85%] lg:max-w-full grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-12 xl:gap-x-20 items-start text-left">

                    {/* Left Column: Trust Bar & Headline */}
                    <div className="lg:col-span-7 space-y-6 md:space-y-8 lg:-mt-[6rem]">
                        {/* Avatar Trust Bar */}
                        <div className="flex items-center gap-3">
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
                                        className="relative w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-[oklch(0.2475_0.0661_146.79)] object-cover transition-transform duration-300 hover:-translate-y-1"
                                    />
                                ))}
                            </div>
                            <p className="text-sm lg:text-base font-medium text-white/90">
                                Join 2,140+ beyond the urge
                            </p>
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl lg:text-7xl font-medium tracking-tight leading-[1.1] text-white">
                            A smarter way to navigate quitting.
                        </h1>
                    </div>

                    {/* Right Column: Subheadline & CTAs */}
                    <div className="lg:col-span-5 space-y-6 md:space-y-8 lg:pb-2">
                        {/* Subheadline */}
                        <p className="text-lg lg:text-xl text-neutral-200 leading-relaxed font-medium">
                            Navigate urges, calm your body, and build steady change - one day at a time. Stop fighting biology with force and start using a structured approach that works with your nervous system.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-row gap-3 justify-start w-full">
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
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
