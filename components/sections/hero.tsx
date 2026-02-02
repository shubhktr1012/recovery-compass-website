import Image from "next/image";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
}

export function HeroSection({ onPrimaryClick, onSecondaryClick }: HeroSectionProps) {
    return (
        <section className="relative min-h-screen flex items-end justify-center px-8 pt-24 pb-20 overflow-hidden">

            {/* Background Image */}
            <div className="absolute inset-0 z-0 bg-neutral-100">
                <Image
                    src="/hero.jpeg"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Content Overlay - Gradient removed as per request */}
            {/* <div className="absolute inset-0 z-10 bg-gradient-to-r from-neutral-50 via-neutral-50/80 to-transparent w-full md:w-3/4 lg:w-2/3" /> */}

            {/* Content Container */}
            <div className="relative z-20 w-full max-w-[1200px]">
                <div className="w-full md:max-w-[50%] space-y-8 text-center md:text-left">
                    {/* Headline */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal tracking-tight leading-[1.1] text-white">
                        A smarter way to navigate quitting.
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-neutral-200 max-w-xl mx-auto md:mx-0 leading-relaxed font-medium">
                        Navigate urges, calm your body, and build steady change - one day at a time.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                        <Button
                            size="lg"
                            className="rounded-full px-8 py-6 text-base font-semibold bg-white hover:bg-neutral-100 text-neutral-900 shadow-lg shadow-black/20"
                            onClick={onPrimaryClick}
                        >
                            Join the Waitlist
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-full px-8 py-6 text-base font-semibold border-neutral-300/50 bg-transparent text-white hover:bg-white/10"
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
