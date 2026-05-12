"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import QRCode from "react-qr-code";
import Image from "next/image";
import { APP_STORE_URL, PLAY_STORE_URL, SMART_APP_URL } from "@/lib/constants";

export function AppDownloadSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const leftPhoneY = useTransform(scrollYProgress, [0, 0.5, 1], ["35%", "25%", "15%"]);
    const rightPhoneY = useTransform(scrollYProgress, [0, 0.5, 1], ["-35%", "-25%", "-15%"]);
    const phoneOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section ref={containerRef} id="app-download" className="py-16 md:py-24 px-6 md:px-12 max-w-[1400px] mx-auto scroll-mt-24">
            <div className="relative w-full rounded-[40px] overflow-hidden bg-[oklch(0.97_0.01_150)] dark:bg-[oklch(0.2_0.05_150)] shadow-sm border border-black/5 dark:border-white/5">
                
                {/* Background Details */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-[oklch(0.2475_0.0661_146.79)]/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-[oklch(0.2475_0.0661_146.79)]/5 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center h-full">
                    
                    {/* Left Content */}
                    <div className="lg:col-span-5 p-8 md:p-16 lg:p-20 lg:pr-0">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="space-y-8 max-w-xl mx-auto lg:mx-0 text-center lg:text-left"
                        >
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-erode font-medium tracking-tighter text-foreground leading-[1.10]">
                                Your journey,<br />
                                <span className="text-[oklch(0.2475_0.0661_146.79)]">now in your pocket.</span>
                            </h2>
                            <p className="text-lg md:text-xl text-muted-foreground font-satoshi leading-relaxed">
                                Experience the full power of Recovery Compass on the go. Track progress, access programs, and stay connected—anytime, anywhere.
                            </p>
                        </div>

                        {/* Store Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
                            {/* App Store Button */}
                            <a
                                href={APP_STORE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                id="app-download-appstore-cta"
                                className="inline-flex items-center gap-3 bg-black text-white px-5 py-3.5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 814 1000" className="w-7 h-7 fill-current shrink-0" aria-hidden="true">
                                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 268.5-317.3 71 0 130.1 46.4 175 46.4 42.3 0 109.1-49.1 185.6-49.1 29.8 0 108.2 2.6 168.4 79.3zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                                </svg>
                                <div className="text-left">
                                    <div className="text-[10px] font-medium opacity-80 uppercase tracking-wider mb-0.5">Download on the</div>
                                    <div className="text-lg font-semibold leading-none tracking-tight">App Store</div>
                                </div>
                            </a>

                            {/* Play Store Button */}
                            <a
                                href={PLAY_STORE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                id="app-download-playstore-cta"
                                className="inline-flex items-center gap-3 bg-black text-white px-5 py-3.5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7 fill-current shrink-0" aria-hidden="true">
                                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 0 1 0 1.38l-2.302 2.302L15.396 12l2.302-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.635z" />
                                </svg>
                                <div className="text-left">
                                    <div className="text-[10px] font-medium opacity-80 uppercase tracking-wider mb-0.5">Get it on</div>
                                    <div className="text-lg font-semibold leading-none tracking-tight">Google Play</div>
                                </div>
                            </a>
                        </div>

                        {/* QR Codes Section */}
                        <div className="flex items-center gap-6 pt-2 justify-center lg:justify-start">
                            {/* Desktop: Two QR codes */}
                            <div className="hidden sm:flex items-center gap-6">
                                {/* App Store QR */}
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-xl shadow-sm border border-black/5">
                                        <QRCode 
                                            value={APP_STORE_URL}
                                            size={64}
                                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                            viewBox={`0 0 256 256`}
                                            level="L"
                                        />
                                    </div>
                                    <div className="text-xs font-medium text-muted-foreground leading-tight">
                                        Scan for<br/>iOS
                                    </div>
                                </div>

                                <div className="w-px h-12 bg-black/10 dark:bg-white/10" />

                                {/* Play Store QR */}
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-xl shadow-sm border border-black/5">
                                        <QRCode 
                                            value={PLAY_STORE_URL}
                                            size={64}
                                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                            viewBox={`0 0 256 256`}
                                            level="L"
                                        />
                                    </div>
                                    <div className="text-xs font-medium text-muted-foreground leading-tight">
                                        Scan for<br/>Android
                                    </div>
                                </div>
                            </div>

                            {/* Mobile: Single smart QR linking to website */}
                            <div className="sm:hidden flex items-center gap-3">
                                <div className="bg-white p-2 rounded-xl shadow-sm border border-black/5">
                                    <QRCode 
                                        value={SMART_APP_URL}
                                        size={64}
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        viewBox={`0 0 256 256`}
                                        level="L"
                                    />
                                </div>
                                <div className="text-xs font-medium text-muted-foreground leading-tight">
                                    Scan to<br/>download
                                </div>
                            </div>
                        </div>
                        </motion.div>
                    </div>

                    {/* Right Content - iPhone Mockups */}
                    <div className="relative h-[500px] md:h-[600px] lg:col-span-7 flex items-center justify-center gap-6 md:gap-8 lg:pt-0">
                        
                        {/* Left Phone (Appears from bottom, 1/4 cut off at bottom) */}
                        <motion.div 
                            style={{ y: leftPhoneY, opacity: phoneOpacity }}
                            className="relative z-20 shadow-2xl rounded-[40px]"
                        >
                            <div className="relative w-[240px] md:w-[280px] h-[500px] md:h-[580px] bg-black rounded-[40px] border-[8px] border-black overflow-hidden flex items-center justify-center">
                                {/* Dynamic Island / Notch */}
                                <div className="absolute top-2 inset-x-0 h-6 bg-black rounded-full w-[90px] mx-auto z-20"></div>
                                {/* Screen Area */}
                                <div className="w-full h-full bg-zinc-950 overflow-hidden relative">
                                    <Image 
                                        src="/app-dashboard.webp" 
                                        alt="Recovery Compass Dashboard" 
                                        fill 
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                {/* Reflection overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                            </div>
                        </motion.div>

                        {/* Right Phone (Appears from top, 1/4 cut off at top) */}
                        <motion.div 
                            style={{ y: rightPhoneY, opacity: phoneOpacity }}
                            className="relative z-10 shadow-2xl rounded-[40px] hidden sm:block"
                        >
                            <div className="relative w-[240px] md:w-[280px] h-[500px] md:h-[580px] bg-black rounded-[40px] border-[8px] border-black overflow-hidden flex items-center justify-center">
                                {/* Dynamic Island / Notch */}
                                <div className="absolute top-2 inset-x-0 h-6 bg-black rounded-full w-[90px] mx-auto z-20"></div>
                                {/* Screen Area */}
                                <div className="w-full h-full bg-zinc-950 overflow-hidden relative">
                                    <Image 
                                        src="/app-widget.webp" 
                                        alt="Recovery Compass Widget" 
                                        fill 
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                {/* Reflection overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                            </div>
                        </motion.div>

                    </div>

                </div>
            </div>
        </section>
    );
}
