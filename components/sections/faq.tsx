"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const faqs = [
    {
        question: "What if I’m not sure where to begin?",
        answer: (
            <>
                Recovery Compass is designed to <strong className="font-semibold text-[oklch(0.2475_0.0661_146.79)]">meet you where you are</strong>. Some programmes offer a short reset when you need immediate direction, while others support longer-term change around habits, sleep, energy, and daily balance. You don&apos;t need to have everything figured out before you start.
            </>
        ),
    },
    {
        question: "Will this feel like another app that pressures me to stay perfect?",
        answer: (
            <>
                No. Recovery Compass is built around <strong className="font-semibold text-[oklch(0.2475_0.0661_146.79)]">steady awareness, small daily actions, and compassionate progress</strong>. There&apos;s no streak pressure, no guilt-based tracking, and no expectation that change has to happen in a straight line.
            </>
        ),
    },
    {
        question: "What does daily support actually look like?",
        answer: (
            <>
                It looks like <strong className="font-semibold text-[oklch(0.2475_0.0661_146.79)]">simple guided steps, calm routines, supportive check-ins, and practical tools for real-life moments</strong>. The goal is to help you pause, reset, and move forward without making the process feel heavy or overwhelming.
            </>
        ),
    },
    {
        question: "What if I have a difficult day or fall back into an old pattern?",
        answer: (
            <>
                A difficult day doesn&apos;t erase progress. It usually points to a trigger, a stress point, or an unmet need. Recovery Compass is built to help you <strong className="font-semibold text-[oklch(0.2475_0.0661_146.79)]">notice what happened, reset without shame, and keep going with more awareness</strong>.
            </>
        ),
    },
    {
        question: "Do I need a lot of time every day for this to work?",
        answer: (
            <>
                No. The programmes are built around <strong className="font-semibold text-[oklch(0.2475_0.0661_146.79)]">manageable daily practices</strong>, not long routines or intense effort. The focus is on consistency, clarity, and small steps that feel realistic enough to keep returning to.
            </>
        ),
    },
    {
        question: "Is Recovery Compass a medical treatment?",
        answer: (
            <>
                No. Recovery Compass provides <strong className="font-semibold text-[oklch(0.2475_0.0661_146.79)]">educational guidance and wellness practices</strong> designed to support healthier habits and daily balance. It is not intended to diagnose, treat, or replace professional medical advice.
            </>
        ),
    },
];

export function FAQSection() {
    return (
        <section className="py-16 md:py-24 px-6 md:px-12 max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row gap-16 lg:gap-24">

                {/* Left Column: Header & CTA */}
                <div className="flex-1 space-y-8 md:sticky md:top-32 h-fit">
                    {/* Badge */}
                    <Badge
                        variant="secondary"
                        className="rounded-full px-4 py-1.5 text-xs font-medium tracking-wide border-none bg-[oklch(0.9484_0.0251_149.08)] text-[oklch(0.2475_0.0661_146.79)] hover:bg-[oklch(0.9484_0.0251_149.08)]"
                    >
                        THE BASICS
                    </Badge>

                    {/* Headings */}
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-erode font-medium tracking-tighter leading-[1.10] text-black">
                            Answering <br /> your
                            <span className="text-[oklch(0.2475_0.0661_146.79)] italic"> questions</span>.
                        </h2>
                        <p className="text-lg text-[oklch(0.2475_0.0661_146.79)]/70 max-w-sm">
                            Got more questions? Reach out to us using the button below.
                        </p>
                    </div>

                    {/* CTA Button */}
                    <a
                        href="mailto:info@recoverycompass.co"
                        className="inline-flex items-center justify-center bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90 rounded-full h-12 px-8 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.2475_0.0661_146.79)] focus-visible:ring-offset-2 transition-colors"
                    >
                        Reach out
                    </a>
                </div>

                {/* Right Column: Accordion Questions */}
                <div className="flex-[1.5]">
                    <Accordion type="single" collapsible className="space-y-6">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border-b border-[oklch(0.2475_0.0661_146.79)]/20 px-0 pb-6 data-[state=open]:border-[oklch(0.2475_0.0661_146.79)] transition-colors duration-300"
                            >
                                <AccordionTrigger
                                    className="group hover:no-underline py-2 [&>svg]:hidden" // Hide default chevron, add group for child styling, restore py-2
                                >
                                    <div className="flex items-center justify-between w-full gap-4">
                                        <span className="text-xl md:text-2xl font-medium text-[oklch(0.2475_0.0661_146.79)] text-left font-erode">
                                            {faq.question}
                                        </span>

                                        {/* Custom Circular Button */}
                                        <div className="relative shrink-0 flex items-center justify-center size-10 rounded-full bg-white border border-[oklch(0.2475_0.0661_146.79)]/20 group-data-[state=open]:bg-[oklch(0.2475_0.0661_146.79)] group-data-[state=open]:border-[oklch(0.2475_0.0661_146.79)] transition-all duration-500">
                                            <Plus
                                                className="size-5 text-[oklch(0.2475_0.0661_146.79)] transition-transform duration-500 group-data-[state=open]:rotate-45 group-data-[state=open]:text-white"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>
                                </AccordionTrigger>

                                <AccordionContent className="pt-4 pr-12">
                                    <p className="font-satoshi text-lg text-[oklch(0.2475_0.0661_146.79)]/80 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

            </div>
        </section>
    );
}
