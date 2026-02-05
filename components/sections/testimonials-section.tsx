import { Badge } from "@/components/ui/badge";
import { TestimonialMarquee } from "@/components/sections/testimonials/testimonial-marquee";

export function TestimonialsSection() {
    return (
        <section className="py-12 md:py-16 overflow-hidden">
            <div className="container mx-auto px-6 mb-12 flex flex-col items-center">
                <Badge
                    variant="secondary"
                    className="rounded-full px-4 py-1.5 text-xs font-medium tracking-wide border-none bg-[oklch(0.9484_0.0251_149.08)] text-[oklch(0.2475_0.0661_146.79)] hover:bg-[oklch(0.9484_0.0251_149.08)] mb-6"
                >
                    TESTIMONIALS
                </Badge>
                <h2 className="text-4xl md:text-5xl font-sans font-semibold leading-[1.1] text-black text-center">
                    Stories of <span className="text-[oklch(0.2475_0.0661_146.79)]">change.</span>
                </h2>
            </div>
            <TestimonialMarquee />
        </section>
    );
}
