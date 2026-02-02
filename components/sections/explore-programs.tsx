import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export function ExploreProgramsSection() {
    return (
        <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-[#F8FAF2]">
            <div className="max-w-[1200px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-left">
                    <div className="max-w-2xl space-y-4">
                        <span className="text-xs uppercase tracking-widest text-[#1C2706]/60 font-semibold">
                            Our Programs
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-[#1C2706] leading-[1.1]">
                            The path to steady change.
                        </h2>
                    </div>
                    <p className="text-lg text-[#1C2706]/70 max-w-sm leading-relaxed">
                        Start with a focused reset. Build
                        long-term stability when you're ready.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 6-Day Program - Primary */}
                    <Card className="relative overflow-hidden border-none shadow-xl shadow-[#1C2706]/5 bg-white rounded-[40px] p-4 group transition-all duration-500 hover:shadow-2xl hover:shadow-[#1C2706]/10">
                        <div className="absolute top-8 right-8 bg-[#1C2706] text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold">
                            Most Popular
                        </div>
                        <CardHeader className="space-y-4 pt-8 pb-4">
                            <CardDescription className="text-xs uppercase tracking-[0.2em] font-bold text-[#1C2706]/40">
                                6-Day Program
                            </CardDescription>
                            <CardTitle className="text-3xl md:text-4xl font-normal text-[#1C2706]">
                                The Reset
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <p className="text-[#1C2706]/70 leading-relaxed text-lg">
                                Break the cycle. A short-term immersion designed to disrupt your autopilot and restore your dopamine baseline.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-[#1C2706]/80 font-medium tracking-tight">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1C2706] flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                    The 10-Minute Urge Protocol
                                </div>
                                <div className="flex items-center gap-3 text-sm text-[#1C2706]/80 font-medium tracking-tight">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1C2706] flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                    Identity Shift Workshop
                                </div>
                                <div className="flex items-center gap-3 text-sm text-[#1C2706]/80 font-medium tracking-tight">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1C2706] flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                    Money-Back Guarantee
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-8 pb-4">
                            <Button className="w-full h-14 rounded-full bg-[#1C2706] hover:bg-[#2a3a09] text-white text-base font-medium transition-all group-hover:scale-[1.02]">
                                Start the 6-Day Reset
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* 90-Day Program - Secondary */}
                    <Card className="relative overflow-hidden border border-[#1C2706]/10 bg-transparent rounded-[40px] p-4 group transition-all duration-500 hover:bg-[#1C2706]/[0.02]">
                        <CardHeader className="space-y-4 pt-8 pb-4">
                            <CardDescription className="text-xs uppercase tracking-[0.2em] font-bold text-[#1C2706]/40">
                                90-Day Program
                            </CardDescription>
                            <CardTitle className="text-3xl md:text-4xl font-normal text-[#1C2706]">
                                The Foundation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <p className="text-[#1C2706]/70 leading-relaxed text-lg">
                                Long-term stability. A comprehensive roadmap to cement your identity as a non-smoker for the rest of your life.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-[#1C2706]/80 font-medium tracking-tight">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1C2706]/10 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-[#1C2706]" />
                                    </div>
                                    Personalized Accountability
                                </div>
                                <div className="flex items-center gap-3 text-sm text-[#1C2706]/80 font-medium tracking-tight">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1C2706]/10 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-[#1C2706]" />
                                    </div>
                                    Deep Emotional Intelligence
                                </div>
                                <div className="flex items-center gap-3 text-sm text-[#1C2706]/80 font-medium tracking-tight">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1C2706]/10 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-[#1C2706]" />
                                    </div>
                                    Results-Backed Guarantee
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-8 pb-4">
                            <Button variant="outline" className="w-full h-14 rounded-full border-[#1C2706]/20 bg-transparent hover:bg-[#1C2706] hover:text-white text-[#1C2706] text-base font-medium transition-all group-hover:scale-[1.02]">
                                Explore the Foundation
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    );
}
