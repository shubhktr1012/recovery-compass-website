import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const steps = [
    {
        number: "01",
        title: "Pause",
        description: "Urge hits. Start 4-6 breathing. Ground yourself in the present moment.",
    },
    {
        number: "02",
        title: "Observe",
        description: "Watch the urge rise and fall without acting. It always passes.",
    },
    {
        number: "03",
        title: "Move On",
        description: "Let life continue without needing a 'victory'. Just keep going.",
    },
    {
        number: "04",
        title: "Freedom",
        description: "When you stop counting days, you're free. Recovery becomes life.",
    },
];

export function JourneySection() {
    return (
        <section className="py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-white overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                        The Journey
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-foreground">
                        How recovery happens.
                    </h2>
                </div>

                {/* Horizontal Scroll */}
                <div className="relative">
                    {/* Items */}
                    <div className="flex gap-6 overflow-x-auto pb-6 px-2 snap-x snap-mandatory scrollbar-hide -mx-2">
                        {steps.map((step) => (
                            <Card
                                key={step.number}
                                className="flex-shrink-0 w-72 md:w-80 rounded-[32px] border-secondary bg-secondary/5 hover:bg-secondary/10 transition-all duration-300 snap-center"
                            >
                                <CardHeader>
                                    {/* Step Number */}
                                    <span className="text-6xl font-bold text-primary/10 block leading-none">
                                        {step.number}
                                    </span>

                                    {/* Title */}
                                    <CardTitle className="text-2xl font-medium text-foreground pt-2">
                                        {step.title}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Scroll Hint */}
                <p className="text-center text-muted-foreground/40 text-sm mt-6 flex items-center justify-center gap-2">
                    <span className="w-8 h-px bg-muted-foreground/20" />
                    Swipe to explore
                    <span className="w-8 h-px bg-muted-foreground/20" />
                </p>
            </div>
        </section>
    );
}
