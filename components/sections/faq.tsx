"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import Link from "next/link";

const faqs = [
    {
        question: "What is a craving, really?",
        answer: (
            <>
                Think of a craving as a <strong className="font-semibold text-[oklch(0.2475_0.0661_146.79)]">temporary signal</strong>, not a command. It’s just your body noticing a pattern or stressor. It feels loud, but like a wave, it will rise and fall on its own if you don’t fight it.
            </>
        ),
    },
    {
        question: "Does experiencing urges indicate a regression in progress?",
        answer: (
            <>
                Not at all. Urges are a <strong className="font-semibold text-[oklch(0.2475_0.0661_146.79)]">natural component of neuroplastic change</strong>. Awareness of a craving—rather than automatic submission to it—is the primary indicator of recovery. It signifies that the gap between stimulus and response is widening.
            </>
        ),
    },
    {
        question: "Why is 'white-knuckling' often ineffective?",
        answer: (
            <>
                Willpower is a finite resource. Fighting biology with force creates internal tension, often making the urge louder. <strong className="font-semibold text-[oklch(0.2475_0.0661_146.79)]">Regulation</strong> (calming the body) is far more effective than resistance because it addresses the underlying nervous system state rather than just the symptom.
            </>
        ),
    },
    {
        question: "What is the difference between distraction and grounding?",
        answer: (
            <>
                Distraction is an attempt to escape reality, which can reinforce the fear of the craving. <strong className="font-semibold text-[oklch(0.2475_0.0661_146.79)]">Grounding</strong> anchors you in the present reality. By feeling your feet on the floor or slowing your breath, you signal safety to your body, allowing the urge wave to pass naturally.
            </>
        ),
    },
    {
        question: "How should I navigate a momentary lapse?",
        answer: (
            <>
                A slip is data, not a definition. It often reveals a specific trigger or unmet need. The most effective response is to distinctively <strong className="font-semibold text-[oklch(0.2475_0.0661_146.79)]">avoid judgment</strong>, re-center your nervous system, and immediately return to your baseline practices. Perfection is not the goal; persistence is.
            </>
        ),
    },
    {
        question: "Will these neural patterns eventually subside?",
        answer: (
            <>
                Yes. Neuroplasticity works in both directions. As you consistently separate the trigger from the reward (by noticing the urge but not acting on it), those synaptic connections <strong className="font-semibold text-[oklch(0.2475_0.0661_146.79)]">gradually weaken</strong>. The noise fades into the background as new pathways of regulation are built.
            </>
        ),
    },
];

export function FAQSection() {
    return (
        <section className="py-12 px-6 md:px-12 max-w-[1200px] mx-auto">
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
                        <h2 className="text-4xl md:text-5xl font-erode font-semibold leading-[1.1] text-black">
                            Answering <br /> your
                            <span className="text-[oklch(0.2475_0.0661_146.79)] italic"> questions</span>.
                        </h2>
                        <p className="text-lg text-[oklch(0.2475_0.0661_146.79)]/70 max-w-sm">
                            Got more questions? Reach out to us using the button below.
                        </p>
                    </div>

                    {/* CTA Button */}
                    <Link
                        href="#"
                        className="inline-flex items-center justify-center bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90 rounded-full h-12 px-8 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.2475_0.0661_146.79)] focus-visible:ring-offset-2 transition-colors"
                    >
                        Reach out
                    </Link>
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
