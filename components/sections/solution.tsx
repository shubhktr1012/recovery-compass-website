import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
        <section className="py-24 md:py-32 px-6 md:px-16 lg:px-24">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                        The Solution
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-foreground">
                        Tangible tools for real change.
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to navigate urges and build lasting habits.
                    </p>
                </div>

                {/* Bento Grid with Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card
                            key={feature.title}
                            className={cn(
                                "rounded-[32px] border-secondary bg-secondary/10 hover:bg-secondary/20 transition-all duration-300",
                                index === 0 ? "md:col-span-2 lg:col-span-2" : ""
                            )}
                        >
                            <CardHeader className="pb-2">
                                {/* Icon Placeholder */}
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                    <div className="w-6 h-6 bg-primary/20 rounded-lg" />
                                </div>

                                {/* Label */}
                                <CardDescription className="text-xs uppercase tracking-widest font-medium text-muted-foreground/60">
                                    {feature.label}
                                </CardDescription>

                                {/* Title */}
                                <CardTitle className="text-2xl font-medium text-foreground">
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">
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
