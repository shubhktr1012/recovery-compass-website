"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => {
    const context = useContext(LenisContext);
    return context;
};

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    const [lenis, setLenis] = useState<Lenis | null>(null);

    useEffect(() => {
        // Initialize Lenis
        const instance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing
            orientation: "vertical",
            smoothWheel: true,
        });

        // Avoid setting state synchronously inside effect body if possible
        // but here Lenis instance is created asynchronously in useEffect
        setTimeout(() => setLenis(instance), 0);

        // RAF loop for Lenis
        let rafId: number;
        function raf(time: number) {
            instance.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        // Cleanup
        return () => {
            instance.destroy();
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <LenisContext.Provider value={lenis}>
            {children}
        </LenisContext.Provider>
    );
}
