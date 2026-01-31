import Image from "next/image";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
}

export function HeroSection({ onPrimaryClick, onSecondaryClick }: HeroSectionProps) {
    return (
        <section className="min-h-[90vh] flex items-center justify-center px-6 md:px-12 lg:px-20 pt-24 pb-16">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                {/* Left: Content */}
                <div className="space-y-8 text-center lg:text-left">
                    {/* Headline */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]">
                        A smarter way to navigate quitting.
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-neutral-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        Navigate urges, calm your body, and build steady change — one day at a time.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                        <Button
                            size="lg"
                            className="rounded-full px-8 py-6 text-base font-semibold bg-neutral-900 hover:bg-neutral-800 text-white"
                            onClick={onPrimaryClick}
                        >
                            Join the Waitlist
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-full px-8 py-6 text-base font-semibold border-neutral-300 hover:bg-neutral-100"
                            onClick={onSecondaryClick}
                        >
                            Learn More
                        </Button>
                    </div>
                </div>

                {/* Right: Image */}
                <div className="relative">
                    <div className="aspect-[4/3] bg-neutral-100 rounded-3xl flex items-center justify-center border border-neutral-200 overflow-hidden">
                        <div className="text-center p-8">
                            <div className="w-16 h-16 bg-neutral-200 rounded-2xl mx-auto mb-4" />
                            <span className="text-neutral-400 text-sm">Hero Image</span>
                            <p className="text-neutral-300 text-xs mt-1">Recommended: 800×600</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
