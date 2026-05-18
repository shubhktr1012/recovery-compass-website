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
                Start with the program that matches your current goal. Short resets give immediate structure; longer programs give a day-by-day path for deeper change.
            </>
        ),
    },
    {
        question: "Will this feel like another app that pressures me to stay perfect?",
        answer: (
            <>
                No. The app uses flexible progress, practical cards, and reflections. Missing a day does not erase the program.
            </>
        ),
    },
    {
        question: "What does daily support actually look like?",
        answer: (
            <>
                It looks like timed cards, breathing or movement routines, journal prompts, and progress checkpoints. The exact mix depends on the program.
            </>
        ),
    },
    {
        question: "What if I have a difficult day or fall back into an old pattern?",
        answer: (
            <>
                Use it as information. The next card helps you notice the trigger, reset the routine, and continue from where you are.
            </>
        ),
    },
    {
        question: "Do I need a lot of time every day for this to work?",
        answer: (
            <>
                No. Each program shows its daily time range before you start, from short resets to heavier protocols.
            </>
        ),
    },
    {
        question: "Is Recovery Compass a medical treatment?",
        answer: (
            <>
                No. Recovery Compass provides educational wellness programs. It does not diagnose, treat, or replace professional medical advice.
            </>
        ),
    },
];

export function FAQSection() {
    return (
        <section className="py-16 md:py-24 px-6 md:px-12 max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row gap-16 lg:gap-24">

                {/* Left Column: Header */}
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
                            Quick answers before you choose a program.
                        </p>
                    </div>
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
