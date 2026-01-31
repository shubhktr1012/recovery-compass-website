import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function PhilosophySection() {
    return (
        <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
            <div className="max-w-3xl mx-auto text-center space-y-8">
                {/* Section Label */}
                <Badge variant="secondary" className="text-xs uppercase tracking-widest font-medium">
                    Our Philosophy
                </Badge>

                {/* Headline */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                    Clarity starts in silence.
                </h2>

                {/* Body */}
                <p className="text-lg md:text-xl text-neutral-500 leading-relaxed">
                    Fighting urges doesn't work. Recovery Compass offers regulation instead —
                    a calm, structured approach that works with your body, not against it.
                </p>

                {/* Visual Divider */}
                <div className="pt-8 flex justify-center">
                    <Separator className="w-16" />
                </div>
            </div>
        </section>
    );
}
