"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const faqs = [
    {
        question: "What is a craving, really?",
        answer: (
            <>
                Think of a craving as a <strong className="font-semibold text-[var(--primary)]">temporary signal</strong>, not a command. It’s just your body noticing a pattern or stressor. It feels loud, but like a wave, it will rise and fall on its own if you don’t fight it.
            </>
        ),
    },
    {
        question: "Does experiencing urges indicate a regression in progress?",
        answer: (
            <>
                Not at all. Urges are a <strong className="font-semibold text-[var(--primary)]">natural component of neuroplastic change</strong>. Awareness of a craving—rather than automatic submission to it—is the primary indicator of recovery. It signifies that the gap between stimulus and response is widening.
            </>
        ),
    },
    {
        question: "Why is 'white-knuckling' often ineffective?",
        answer: (
            <>
                Willpower is a finite resource. Fighting biology with force creates internal tension, often making the urge louder. <strong className="font-semibold text-[var(--primary)]">Regulation</strong> (calming the body) is far more effective than resistance because it addresses the underlying nervous system state rather than just the symptom.
            </>
        ),
    },
    {
        question: "What is the difference between distraction and grounding?",
        answer: (
            <>
                Distraction is an attempt to escape reality, which can reinforce the fear of the craving. <strong className="font-semibold text-[var(--primary)]">Grounding</strong> anchors you in the present reality. By feeling your feet on the floor or slowing your breath, you signal safety to your body, allowing the urge wave to pass naturally.
            </>
        ),
    },
    {
        question: "How should I navigate a momentary lapse?",
        answer: (
            <>
                A slip is data, not a definition. It often reveals a specific trigger or unmet need. The most effective response is to distinctively <strong className="font-semibold text-[var(--primary)]">avoid judgment</strong>, re-center your nervous system, and immediately return to your baseline practices. Perfection is not the goal; persistence is.
            </>
        ),
    },
    {
        question: "Will these neural patterns eventually subside?",
        answer: (
            <>
                Yes. Neuroplasticity works in both directions. As you consistently separate the trigger from the reward (by noticing the urge but not acting on it), those synaptic connections <strong className="font-semibold text-[var(--primary)]">gradually weaken</strong>. The noise fades into the background as new pathways of regulation are built.
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
                        className="rounded-full px-4 py-1.5 text-xs font-medium tracking-wide border-none bg-[var(--secondary)] text-[var(--primary)] hover:bg-[var(--secondary)]"
                    >
                        THE BASICS
                    </Badge>

                    {/* Headings */}
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-erode font-semibold leading-[1.1] text-black">
                            Answering <br /> your
                            <span className="text-[var(--primary)] italic"> questions</span>.
                        </h2>
                        <p className="text-lg text-[var(--primary)]/70 max-w-sm">
                            Got more questions? Reach out to us using the button below.
                        </p>
                    </div>

                    {/* CTA Button */}
                    <Link href="#" className="inline-block">
                        <Button
                            className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 rounded-full h-12 px-8 text-base shadow-none border-2 border-transparent hover:border-[var(--accent)]"
                        >
                            Reach out
                        </Button>
                    </Link>
                </div>

                {/* Right Column: Accordion Questions */}
                <div className="flex-[1.5]">
                    <Accordion type="single" collapsible className="space-y-6">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border-b border-[var(--primary)]/20 px-0 pb-6 data-[state=open]:border-[var(--accent)] transition-colors duration-300"
                            >
                                <AccordionTrigger
                                    className="group hover:no-underline py-2 [&>svg]:hidden" // Hide default chevron, add group for child styling, restore py-2
                                >
                                    <div className="flex items-center justify-between w-full gap-4">
                                        <span className="text-xl md:text-2xl font-medium text-[var(--primary)] text-left font-erode">
                                            {faq.question}
                                        </span>

                                        {/* Custom Circular Button */}
                                        <div className="relative shrink-0 flex items-center justify-center size-10 rounded-full bg-white border border-[var(--primary)]/20 group-data-[state=open]:bg-[var(--accent)] group-data-[state=open]:border-[var(--accent)] transition-all duration-500">
                                            <Plus
                                                className="size-5 text-[var(--primary)] transition-transform duration-500 group-data-[state=open]:rotate-45 group-data-[state=open]:text-[var(--primary)]"
                                            />
                                        </div>
                                    </div>
                                </AccordionTrigger>

                                <AccordionContent className="pt-4 pr-12">
                                    <p className="font-satoshi text-lg text-[var(--primary)]/80 leading-relaxed">
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
