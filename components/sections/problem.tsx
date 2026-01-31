export function ProblemSection() {
    return (
        <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-neutral-50">
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Left: Visual */}
                    <div className="order-2 lg:order-1">
                        <div className="aspect-square max-w-md mx-auto bg-neutral-100 rounded-3xl flex items-center justify-center border border-neutral-200">
                            <div className="text-center p-8">
                                <div className="flex items-center justify-center gap-4 mb-4">
                                    {/* Chaos Wave */}
                                    <div className="flex gap-1">
                                        {[40, 20, 60, 15, 50, 25, 45].map((h, i) => (
                                            <div key={i} className="w-2 bg-neutral-300 rounded-full" style={{ height: h }} />
                                        ))}
                                    </div>
                                    {/* Arrow */}
                                    <span className="text-neutral-300 text-2xl">→</span>
                                    {/* Calm Wave */}
                                    <div className="flex gap-1 items-end">
                                        {[30, 35, 32, 34, 33, 35, 31].map((h, i) => (
                                            <div key={i} className="w-2 bg-neutral-400 rounded-full" style={{ height: h }} />
                                        ))}
                                    </div>
                                </div>
                                <span className="text-neutral-400 text-sm">Chaos → Calm</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="order-1 lg:order-2 space-y-6 text-center lg:text-left">
                        <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
                            The Problem
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                            Your body isn't failing. It's just unregulated.
                        </h2>
                        <p className="text-lg text-neutral-500 leading-relaxed">
                            Willpower isn't the answer. Your nervous system needs support, not force.
                            We help you understand and work with your body's natural patterns.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
