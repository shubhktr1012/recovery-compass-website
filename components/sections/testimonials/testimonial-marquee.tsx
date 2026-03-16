"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame } from "framer-motion";
import { TestimonialCard } from "./testimonial-card";
import { cn } from "@/lib/utils";

// Utility to wrap value within a range
const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface Testimonial {
    id: number;
    quote: string;
    name: string;
    role: string;
    avatarSrc?: string;
    rating: number;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        quote: "This program stopped the noise in my head. I finally feel free after 15 years of struggle.",
        name: "Sarah Jenkins",
        role: "Graphic Designer",
        avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150",
        rating: 5,
    },
    {
        id: 2,
        quote: "I tried patches, gum, everything. Understanding the psychology was the missing piece.",
        name: "David Chen",
        role: "Software Engineer",
        avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150",
        rating: 5,
    },
    {
        id: 3,
        quote: "The cravings didn't disappear, but I learned how to surf them. Truly life-changing.",
        name: "Elena Rodriguez",
        role: "Architect",
        avatarSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150",
        rating: 5,
    },
    {
        id: 4,
        quote: "Simple, science-backed, and compassionate. It doesn't feel like a struggle anymore.",
        name: "Michael Ross",
        role: "Teacher",
        avatarSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150",
        rating: 5,
    },
    {
        id: 5,
        quote: "For the first time, I don't feel like I'm depriving myself. I feel like I'm gaining my life back.",
        name: "Jessica Park",
        role: "Marketing Director",
        avatarSrc: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150",
        rating: 5,
    },
];

interface ParallaxTextProps {
    children: React.ReactNode;
    baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxTextProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    /**
     * This is a magic wrapping for the length of the text - you
     * have to replace for wrapping that works for you or dynamically
     * calculate
     */
    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    const directionFactor = useRef<number>(1);
    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        /**
         * This is what changes the direction of the scroll once we
         * switch scrolling directions.
         */
        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    /**
     * The number of times to repeat the child text should be dynamically calculated
     * based on the size of the text and viewport. Likewise, the x motion value is
     * currently wrapped between -20 and -45% - this 25% is derived from the fact
     * that we have four children (100% / 4). This would also want deriving from the
     * dynamically generated number of children.
     */
    return (
        <div className="overflow-hidden m-0 flex flex-nowrap whitespace-nowrap">
            <motion.div className="flex flex-nowrap" style={{ x }}>
                {children}
                {children}
                {children}
                {children}
            </motion.div>
        </div>
    );
}


export function TestimonialMarquee({ className }: { className?: string }) {
    return (
        <section className={cn("w-full py-20 bg-transparent overflow-hidden", className)}>
            <div className="relative w-full">
                {/* Left Gradient Overlay - Subtler & Narrower */}
                <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-gradient-to-r from-white/40 to-transparent" />

                {/* Right Gradient Overlay - Subtler & Narrower */}
                <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-gradient-to-l from-white/40 to-transparent" />

                <ParallaxText baseVelocity={0.5}>
                    {testimonials.map((t) => (
                        <TestimonialCard
                            key={t.id}
                            quote={t.quote}
                            name={t.name}
                            role={t.role}
                            rating={t.rating}
                            avatarSrc={t.avatarSrc}
                            className="mx-3" // Add horizontal margin for spacing in marquee
                        />
                    ))}
                </ParallaxText>
            </div>
        </section>
    );
}
