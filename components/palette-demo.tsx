"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Activity, CheckCircle2, AlertCircle } from "lucide-react";

export function PaletteDemo() {
    return (
        <section className="py-24 bg-background">
            <div className="max-w-5xl mx-auto px-6 space-y-12">
                <div className="space-y-4 text-center">
                    <Badge variant="outline" className="uppercase tracking-widest">System Visualization</Badge>
                    <h2 className="text-4xl font-serif text-primary">The "Extended" Minimal System</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        This component demonstrates how your 3-color triad (Canvas, Moss, Sage) is "extended"
                        to cover all semantic roles without introducing new hues.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Card 1: Interactive Elements (Primary/Secondary) */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Interactive States</CardTitle>
                            <CardDescription>Buttons and controls using the core triad.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <Label>Primary Actions (Moss)</Label>
                                <div className="flex gap-2 flex-wrap">
                                    <Button>Default</Button>
                                    <Button className="opacity-90">Hover View</Button>
                                    <Button disabled>Disabled</Button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Secondary Actions (Sage/Mist)</Label>
                                <div className="flex gap-2 flex-wrap">
                                    <Button variant="secondary">Secondary</Button>
                                    <Button variant="outline">Outline</Button>
                                    <Button variant="ghost">Ghost</Button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Destructive (Muted Red)</Label>
                                <div className="flex gap-2">
                                    <Button variant="destructive">Remove Item</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 2: Forms & Surfaces (Muted/Border) */}
                    <Card className="shadow-lg bg-muted/30">
                        <CardHeader>
                            <CardTitle>Forms & Surfaces</CardTitle>
                            <CardDescription>Inputs and muted backgrounds.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" placeholder="hello@example.com" />
                                <p className="text-xs text-muted-foreground">Detailed functional text in muted foreground.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Focus State</Label>
                                <Input className="ring-2 ring-ring ring-offset-2" placeholder="Focused input..." />
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/50 p-4 rounded-b-xl">
                            <p className="text-xs text-muted-foreground w-full text-center">Surface: Secondary/Muted</p>
                        </CardFooter>
                    </Card>

                    {/* Card 3: Data & Alerts (Charts/Accent) */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Data & Feedback</CardTitle>
                            <CardDescription>Charts and system alerts.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Chart Visualization */}
                            <div className="space-y-2">
                                <Label>Monochromatic Data Scale</Label>
                                <div className="flex h-24 w-full items-end gap-1">
                                    <div className="w-1/5 bg-[var(--chart-1)] h-[40%] rounded-t"></div>
                                    <div className="w-1/5 bg-[var(--chart-2)] h-[70%] rounded-t"></div>
                                    <div className="w-1/5 bg-[var(--chart-3)] h-[50%] rounded-t"></div>
                                    <div className="w-1/5 bg-[var(--chart-4)] h-[90%] rounded-t"></div>
                                    <div className="w-1/5 bg-[var(--chart-5)] h-[30%] rounded-t"></div>
                                </div>
                                <p className="text-xs text-muted-foreground text-center">Variables: --chart-1 to --chart-5</p>
                            </div>

                            {/* Alerts */}
                            <Alert className="bg-accent/20 border-accent/50">
                                <Terminal className="h-4 w-4" />
                                <AlertTitle>Heads up!</AlertTitle>
                                <AlertDescription className="text-xs">
                                    This is an accent-colored system alert using Sage Mist.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </div>

                {/* Dark Mode Preview Block (Mockup) */}
                <div className="rounded-3xl overflow-hidden border border-border">
                    <div className="bg-[#1D2706] p-8 text-white space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-serif">Dark Mode Preview</h3>
                            <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-none">Deep Moss BG</Badge>
                        </div>
                        <p className="text-white/60 max-w-xl">
                            In dark mode, the "Deep Moss" becomes the background, and "Canvas White" becomes the text/primary.
                            The system inverts gracefully without needing new colors.
                        </p>
                        <div className="flex gap-4">
                            <Button className="bg-white text-[#1D2706] hover:bg-white/90">Primary Action</Button>
                            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">Secondary</Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
