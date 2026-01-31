"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

interface NavbarProps {
    onCtaClick?: () => void;
}

export function Navbar({ onCtaClick }: NavbarProps) {
    const { scrollY } = useScroll();

    const navBg = useTransform(
        scrollY,
        [0, 100],
        ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.9)"]
    );
    const navShadow = useTransform(
        scrollY,
        [0, 100],
        ["none", "0 1px 3px 0 rgb(0 0 0 / 0.08)"]
    );

    return (
        <motion.nav
            style={{
                backgroundColor: navBg,
                boxShadow: navShadow,
                backdropFilter: "blur(12px)",
            }}
            className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-6 md:px-12 lg:px-20"
        >
            {/* Logo */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-200 rounded-xl flex items-center justify-center">
                    <span className="text-neutral-400 text-xs">Logo</span>
                </div>
                <div className="flex flex-col leading-none">
                    <span className="font-serif font-semibold text-lg text-black tracking-[0.15em]">Recovery</span>
                    <span className="font-serif font-semibold text-lg text-black">Compass</span>
                </div>
            </div>

            {/* CTA */}
            <Button
                className="rounded-full font-semibold px-6 bg-neutral-900 hover:bg-neutral-800 text-white"
                onClick={onCtaClick}
            >
                Join Waitlist
            </Button>
        </motion.nav>
    );
}
