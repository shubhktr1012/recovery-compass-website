"use client";

import React, { useState } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Loader2, AlertCircle, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultTab?: "signin" | "signup";
}

export function AuthModal({ isOpen, onClose, defaultTab = "signin" }: AuthModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailAuth = async (type: "signin" | "signup") => {
        setIsLoading(true);
        setError(null);
        try {
            if (type === "signup") {
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    }
                });
                if (authError) throw authError;

                // Create profile immediately to match app behavior
                if (authData.user) {
                    const { error: profileError } = await supabase
                        .from("profiles")
                        .upsert({
                            id: authData.user.id,
                            email: authData.user.email,
                            onboarding_complete: false,
                            updated_at: new Date().toISOString()
                        });
                    if (profileError) console.error("Profile creation error:", profileError);
                }
            } else {
                const { error: authError } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (authError) throw authError;
            }
            onClose();
        } catch (err: any) {
            setError(err.message || "An error occurred during authentication.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialAuth = async (provider: "google" | "apple") => {
        setIsLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message || `An error occurred while signing in with ${provider}.`);
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl bg-white">
                <div className="p-8 pb-10">
                    <DialogHeader className="mb-8 items-center text-center">
                        <div className="w-12 h-12 bg-[oklch(0.2475_0.0661_146.79)]/5 rounded-2xl flex items-center justify-center mb-4">
                            <Mail className="size-6 text-[oklch(0.2475_0.0661_146.79)]" />
                        </div>
                        <DialogTitle className="font-erode text-3xl font-semibold tracking-tight text-[oklch(0.2475_0.0661_146.79)]">
                            Welcome Back
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 font-medium text-base mt-2">
                            Sign in to sync your progress across devices.
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue={defaultTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8 bg-zinc-100/50 p-1 rounded-2xl h-12">
                            <TabsTrigger 
                                value="signin" 
                                className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[oklch(0.2475_0.0661_146.79)] transition-all"
                            >
                                Sign In
                            </TabsTrigger>
                            <TabsTrigger 
                                value="signup" 
                                className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[oklch(0.2475_0.0661_146.79)] transition-all"
                            >
                                Create Account
                            </TabsTrigger>
                        </TabsList>

                        <div className="space-y-4">
                            {/* Social Logins */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <Button 
                                    variant="outline" 
                                    className="h-12 rounded-2xl border-zinc-200 hover:bg-zinc-50 hover:text-inherit flex gap-2 font-bold text-sm transition-all"
                                    onClick={() => handleSocialAuth("google")}
                                    disabled={isLoading}
                                >
                                    <svg className="size-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    Google
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="h-12 rounded-2xl border-zinc-200 hover:bg-zinc-50 hover:text-inherit flex gap-2 font-bold text-sm transition-all"
                                    onClick={() => handleSocialAuth("apple")}
                                    disabled={isLoading}
                                >
                                    <svg className="size-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M17.05 20.28c-.96.95-2.04 1.9-3.3 1.9-1.23 0-1.63-.75-3.08-.75-1.46 0-1.9.73-3.08.75-1.2.02-2.43-1.07-3.41-2.06C2.2 18.15.65 14.15 2.65 10.66c1-1.74 2.8-2.85 4.75-2.88 1.48-.02 2.88 1.01 3.79 1.01.91 0 2.6-1.25 4.38-1.07.75.03 2.85.3 4.2 2.26-1.1.66-1.85 1.83-1.85 3.19 0 1.63 1.1 2.72 2.15 3.3-.7 2.02-1.95 3.8-2.98 4.81ZM14.96 5.88c-.78.96-1.96 1.63-3.23 1.55-.17-1.25.4-2.5 1.15-3.41.8-.95 2.1-1.63 3.2-1.6.17 1.34-.34 2.5-1.12 3.46Z" />
                                    </svg>
                                    Apple
                                </Button>
                            </div>

                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-zinc-100" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-zinc-400 font-bold tracking-widest">Or continue with</span>
                                </div>
                            </div>

                            <TabsContent value="signin" className="m-0 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email-signin" className="text-zinc-600 font-bold text-xs uppercase tracking-wider ml-1">Email</Label>
                                    <Input
                                        id="email-signin"
                                        type="email"
                                        placeholder="hello@example.com"
                                        className="h-12 rounded-2xl bg-zinc-50 border-none focus-visible:ring-2 focus-visible:ring-[oklch(0.2475_0.0661_146.79)] focus-visible:bg-white transition-all font-medium px-4"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <Label htmlFor="password-signin" className="text-zinc-600 font-bold text-xs uppercase tracking-wider">Password</Label>
                                        <button className="text-xs font-bold text-[oklch(0.2475_0.0661_146.79)] hover:opacity-70 transition-opacity">Forgot?</button>
                                    </div>
                                    <Input
                                        id="password-signin"
                                        type="password"
                                        placeholder="••••••••"
                                        className="h-12 rounded-2xl bg-zinc-50 border-none focus-visible:ring-2 focus-visible:ring-[oklch(0.2475_0.0661_146.79)] focus-visible:bg-white transition-all font-medium px-4"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <Button 
                                    className="w-full h-12 rounded-2xl bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90 font-bold text-base shadow-lg shadow-[oklch(0.2475_0.0661_146.79)]/10 mt-2"
                                    onClick={() => handleEmailAuth("signin")}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="animate-spin size-5" /> : "Sign In"}
                                </Button>
                            </TabsContent>

                            <TabsContent value="signup" className="m-0 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email-signup" className="text-zinc-600 font-bold text-xs uppercase tracking-wider ml-1">Email</Label>
                                    <Input
                                        id="email-signup"
                                        type="email"
                                        placeholder="hello@example.com"
                                        className="h-12 rounded-2xl bg-zinc-50 border-none focus-visible:ring-2 focus-visible:ring-[oklch(0.2475_0.0661_146.79)] focus-visible:bg-white transition-all font-medium px-4"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-signup" className="text-zinc-600 font-bold text-xs uppercase tracking-wider ml-1">Create Password</Label>
                                    <Input
                                        id="password-signup"
                                        type="password"
                                        placeholder="••••••••"
                                        className="h-12 rounded-2xl bg-zinc-50 border-none focus-visible:ring-2 focus-visible:ring-[oklch(0.2475_0.0661_146.79)] focus-visible:bg-white transition-all font-medium px-4"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <Button 
                                    className="w-full h-12 rounded-2xl bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90 font-bold text-base shadow-lg shadow-[oklch(0.2475_0.0661_146.79)]/10 mt-2"
                                    onClick={() => handleEmailAuth("signup")}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="animate-spin size-5" /> : "Create Account"}
                                </Button>
                                <p className="text-[10px] text-zinc-400 text-center px-4 leading-relaxed font-medium">
                                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </TabsContent>

                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="size-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
