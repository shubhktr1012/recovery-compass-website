import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
        <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-neutral-50 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
                        The Journey
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                        How recovery happens.
                    </h2>
                </div>

                {/* Horizontal Scroll */}
                <div className="relative">
                    {/* Gradient Fades */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-neutral-50 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-neutral-50 to-transparent z-10 pointer-events-none" />

                    {/* Cards */}
                    <div className="flex gap-6 overflow-x-auto pb-6 px-2 snap-x snap-mandatory scrollbar-hide -mx-2">
                        {steps.map((step) => (
                            <Card
                                key={step.number}
                                className="flex-shrink-0 w-72 md:w-80 rounded-3xl border-neutral-200 hover:border-neutral-300 transition-colors snap-center"
                            >
                                <CardHeader>
                                    {/* Step Number */}
                                    <CardDescription className="text-5xl font-bold text-neutral-100">
                                        {step.number}
                                    </CardDescription>

                                    {/* Title */}
                                    <CardTitle className="text-2xl font-semibold text-neutral-900 pt-2">
                                        {step.title}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <p className="text-neutral-500 leading-relaxed">
                                        {step.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Scroll Hint */}
                <p className="text-center text-neutral-400 text-sm mt-6">
                    ← Swipe to explore →
                </p>
            </div>
        </section>
    );
}
