import { useRef } from "react";
import { cn } from "@/lib/utils";

export function ProblemSection() {
    return (
        <section className="relative py-12 overflow-hidden bg-white">
            <div className="max-w-[1200px] mx-auto px-6 relative z-10">

                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
                    <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground mb-6">
                        You know <span className="italic font-serif">why</span> you should quit.
                        <br />
                        But your body has other plans.
                    </h2>
                </div>

                {/* The Venn of Conflict - Desktop Layout */}
                <div className="hidden md:block relative h-[500px] lg:h-[600px] w-full max-w-[800px] lg:max-w-[900px] mx-auto">

                    {/* Left Circle: The Conscious Mind */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] rounded-full bg-neutral-200/80 backdrop-blur-sm mix-blend-multiply flex items-center justify-center p-8 lg:p-12 transition-transform duration-[3000ms] ease-in-out hover:scale-[1.02]">
                        <div className="max-w-[200px] lg:max-w-[240px] text-center -ml-8 lg:-ml-12 space-y-4">
                            <span className="block text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                                The Conscious Mind
                            </span>
                            <h3 className="text-2xl lg:text-3xl font-serif italic text-foreground/80">
                                "I want to stop."
                            </h3>
                            <ul className="text-sm text-foreground/60 space-y-2">
                                <li>I care about my health.</li>
                                <li>I'm tired of this cycle.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Circle: The Unconscious Body */}
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] rounded-full bg-neutral-400/80 backdrop-blur-sm mix-blend-multiply flex items-center justify-center p-8 lg:p-12 transition-transform duration-[4000ms] ease-in-out hover:scale-[1.02]">
                        <div className="max-w-[200px] lg:max-w-[240px] text-center -mr-8 lg:-mr-12 space-y-4">
                            <span className="block text-xs uppercase tracking-widest text-foreground/40 font-semibold">
                                The Unconscious Body
                            </span>
                            <h3 className="text-2xl lg:text-3xl font-sans font-medium text-foreground">
                                "I need relief."
                            </h3>
                            <ul className="text-sm text-foreground space-y-2">
                                <li>I need dopamine to function.</li>
                                <li>I'm overwhelmed.</li>
                            </ul>
                        </div>
                    </div>

                    {/* The Overlap: The Friction (More visible via blend mode) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20 pointer-events-none">
                        <p className="text-base lg:text-lg font-medium text-foreground bg-white/50 px-4 py-2 rounded-full backdrop-blur-md border border-foreground/10">
                            Why can't I just quit?
                        </p>
                    </div>

                </div>

                {/* Mobile Layout: Stacked Cards (Fallback for Venn) */}
                <div className="md:hidden space-y-4">
                    <div className="p-8 rounded-[32px] bg-secondary/30 border border-secondary text-center space-y-4">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">The Conscious Mind</span>
                        <h3 className="text-2xl font-serif italic text-foreground">"I want to stop."</h3>
                        <p className="text-muted-foreground text-sm">I care about my health. I'm tired of the cycle.</p>
                    </div>

                    <div className="relative z-10 -mt-8 mx-4 p-4 text-center">
                        <span className="inline-block bg-background border border-secondary rounded-full px-4 py-1 text-xs font-bold text-muted-foreground shadow-sm">
                            VS
                        </span>
                    </div>

                    <div className="p-8 rounded-[32px] bg-primary text-primary-foreground text-center space-y-4 -mt-8 pt-12">
                        <span className="text-xs uppercase tracking-widest text-primary-foreground/60 font-bold">The Unconscious Body</span>
                        <h3 className="text-2xl font-medium">"I need relief."</h3>
                        <p className="text-primary-foreground/80 text-sm">I need dopamine to function. I'm overwhelmed.</p>
                    </div>
                </div>

                {/* The Bridge / Validation */}
                <div className="mt-16 md:mt-24 max-w-2xl mx-auto text-center space-y-6">
                    <div className="w-px h-16 bg-secondary mx-auto"></div>
                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                        This isn't a failure of character. It's a <span className="font-medium text-foreground">biological conflict</span>.
                    </p>
                    <p className="text-muted-foreground">
                        Willpower is a finite resource. Your nervous system's drive for regulation is infinite. <br className="hidden md:block" />
                        You can't fight biology with force.
                    </p>
                    <div className="pt-8">
                        <div className="inline-block px-6 py-3 rounded-xl bg-secondary/30 border border-secondary space-y-1">
                            <p className="text-sm font-semibold text-foreground">Who This Is For</p>
                            <p className="text-xs text-muted-foreground">People tired of willpower-based methods.</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
