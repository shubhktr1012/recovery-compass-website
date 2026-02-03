import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "What is a craving, really?",
        answer: "A temporary signal, not a command. Your body is just noticing a pattern — it doesn't mean you have to act on it.",
    },
    {
        question: "Do cravings mean I'm failing?",
        answer: "No. They mean your system noticed a pattern. Cravings are information, not failure. They fade when you stop fighting them.",
    },
    {
        question: "Do they ever go away?",
        answer: "Yes. They fade when you stop fighting them. The more you observe without acting, the weaker they become over time.",
    },
    {
        question: "What if I slip?",
        answer: "A slip doesn't erase progress. Stop, breathe, continue. Recovery isn't linear — it's directional. Keep moving forward.",
    },
];

export function FAQSection() {
    return (
        <section className="py-24 md:py-32 px-6 md:px-16 lg:px-24">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                        FAQ
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-foreground">
                        Questions about cravings.
                    </h2>
                </div>

                {/* Accordion */}
                <Accordion type="single" collapsible className="space-y-4">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="border border-secondary rounded-2xl overflow-hidden bg-white hover:bg-secondary/5 transition-all duration-300 px-2 data-[state=open]:border-secondary/60"
                        >
                            <AccordionTrigger className="px-4 py-5 text-left font-medium text-foreground hover:no-underline">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-5 text-muted-foreground leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
