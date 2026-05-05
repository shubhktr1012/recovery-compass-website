"use client";

import { motion } from "framer-motion";
import QRCode from "react-qr-code";

export function AppDownloadSection() {
    return (
        <section className="py-16 md:py-24 px-6 md:px-12 max-w-[1400px] mx-auto scroll-mt-24">
            <div className="relative w-full rounded-[40px] overflow-hidden bg-[oklch(0.97_0.01_150)] dark:bg-[oklch(0.2_0.05_150)] shadow-sm border border-black/5 dark:border-white/5">
                
                {/* Background Details */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-[oklch(0.2475_0.0661_146.79)]/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-[oklch(0.2475_0.0661_146.79)]/5 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-16 lg:p-20 items-center">
                    
                    {/* Left Content */}
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
                                Experience the full power of Recovery Compass on the go. Track progress, access programs, and stay connected-anytime, anywhere.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 justify-center lg:justify-start">
                            {/* App Store Button */}
                            <a
                                href="https://apps.apple.com/in/app/recovery-compass-wellness/id6761656102"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-black text-white px-6 py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 814 1000" className="w-8 h-8 fill-current shrink-0" aria-hidden="true">
                                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 268.5-317.3 71 0 130.1 46.4 175 46.4 42.3 0 109.1-49.1 185.6-49.1 29.8 0 108.2 2.6 168.4 79.3zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                                </svg>
                                <div className="text-left">
                                    <div className="text-[10px] font-medium opacity-80 uppercase tracking-wider mb-0.5">Download on the</div>
                                    <div className="text-xl font-semibold leading-none tracking-tight">App Store</div>
                                </div>
                            </a>

                            <div className="hidden sm:block w-px h-16 bg-black/10 dark:bg-white/10" />

                            {/* QR Code */}
                            <div className="hidden sm:flex items-center gap-4">
                                <div className="bg-white p-2 rounded-xl shadow-sm border border-black/5">
                                    <QRCode 
                                        value="https://apps.apple.com/in/app/recovery-compass-wellness/id6761656102"
                                        size={72}
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        viewBox={`0 0 256 256`}
                                        level="L"
                                    />
                                </div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    Scan to <br/>download
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Content - iPhone Mockup */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="flex justify-center lg:justify-end"
                    >
                        {/* Premium iPhone Frame */}
                        <div className="relative w-[300px] h-[600px] bg-black rounded-[50px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border-[8px] border-black overflow-hidden flex items-center justify-center transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700 ease-out">
                            
                            {/* Screen Area */}
                            <div className="w-full h-full bg-zinc-950 overflow-hidden relative">
                                
                                {/* Placeholder Abstract UI */}
                                <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.2475_0.0661_146.79)]/40 to-zinc-950 p-6 flex flex-col pt-16">
                                    
                                    {/* Header Mock */}
                                    <div className="flex gap-4 items-center mb-8">
                                        <div className="w-12 h-12 bg-white/20 rounded-2xl animate-pulse"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 w-24 bg-white/20 rounded-full"></div>
                                            <div className="h-3 w-16 bg-white/10 rounded-full"></div>
                                        </div>
                                    </div>
                                    
                                    {/* Grid Widgets */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="h-28 bg-white/10 rounded-3xl border border-white/5 backdrop-blur-sm p-4 flex flex-col justify-between">
                                            <div className="w-8 h-8 rounded-full bg-[oklch(0.2475_0.0661_146.79)]/50"></div>
                                            <div className="h-2 w-16 bg-white/20 rounded-full"></div>
                                        </div>
                                        <div className="h-28 bg-[oklch(0.2475_0.0661_146.79)]/20 rounded-3xl border border-[oklch(0.2475_0.0661_146.79)]/20 backdrop-blur-sm p-4 flex flex-col justify-between">
                                            <div className="w-8 h-8 rounded-full bg-white/20"></div>
                                            <div className="h-2 w-16 bg-white/30 rounded-full"></div>
                                        </div>
                                    </div>
                                    
                                    {/* Large Widget */}
                                    <div className="h-36 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm p-5 space-y-4">
                                         <div className="h-3 w-20 bg-white/20 rounded-full"></div>
                                         <div className="space-y-2">
                                            <div className="h-2 w-full bg-white/10 rounded-full"></div>
                                            <div className="h-2 w-4/5 bg-white/10 rounded-full"></div>
                                            <div className="h-2 w-full bg-white/10 rounded-full"></div>
                                         </div>
                                    </div>

                                    {/* Bottom Nav Mock */}
                                    <div className="absolute bottom-6 inset-x-6 h-16 bg-white/10 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-around px-4">
                                        <div className="w-6 h-6 rounded-full bg-white/30"></div>
                                        <div className="w-6 h-6 rounded-full bg-white/10"></div>
                                        <div className="w-6 h-6 rounded-full bg-white/10"></div>
                                        <div className="w-6 h-6 rounded-full bg-white/10"></div>
                                    </div>

                                </div>
                            </div>

                            {/* Dynamic Island / Notch */}
                            <div className="absolute top-2 inset-x-0 h-7 bg-black rounded-full w-[120px] mx-auto z-20"></div>
                            
                            {/* Reflection overlay for realism */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
