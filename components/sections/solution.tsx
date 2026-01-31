import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
    {
        label: "Immediate Relief",
        title: "The Urge Protocol",
        description: "10-Minute Timer + 5-4-3-2-1 Grounding. Immediate relief when you need it most.",
    },
    {
        label: "Long Term",
        title: "Body Restoration",
        description: "Watch your dopamine baseline reset. Track the physical changes as your body heals.",
    },
    {
        label: "The Path",
        title: "6-Day Reset",
        description: "Day 1: Break Autopilot. Day 4: Identity Shift. Day 6: Stability. A clear path forward.",
    },
];

export function SolutionSection() {
    return (
        <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
                        The Solution
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                        Tangible tools for real change.
                    </h2>
                    <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
                        Everything you need to navigate urges and build lasting habits.
                    </p>
                </div>

                {/* Bento Grid with ShadCN Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card
                            key={feature.title}
                            className={`rounded-3xl border-neutral-200 hover:border-neutral-300 transition-colors ${index === 0 ? "md:col-span-2" : ""
                                }`}
                        >
                            <CardHeader className="pb-2">
                                {/* Icon Placeholder */}
                                <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mb-4">
                                    <span className="text-neutral-400 text-xs">Icon</span>
                                </div>

                                {/* Label */}
                                <CardDescription className="text-xs uppercase tracking-widest font-medium">
                                    {feature.label}
                                </CardDescription>

                                {/* Title */}
                                <CardTitle className="text-xl font-semibold text-neutral-900">
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="text-neutral-500 leading-relaxed">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
