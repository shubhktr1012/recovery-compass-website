"use client";

import React, { createContext, useCallback, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AuthModal } from "@/components/auth-modal";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const dbToWebSlug: Record<string, string> = {
    "six_day_reset": "6-day-compass-reset",
    "ninety_day_transform": "90-day-smoke-free-journey",
    "sleep_disorder_reset": "21-day-deep-sleep-reset",
    "energy_vitality": "14-day-energy-restore",
    "age_reversal": "radiance-journey",
    "male_sexual_health": "mens-vitality-reset-program",
};

type Profile = {
    id: string;
    email: string | null;
    onboarding_complete: boolean;
    full_name?: string | null;
    avatar_url?: string | null;
    updated_at: string;
};

type UserContextType = {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
    isAuthModalOpen: boolean;
    openAuthModal: (tab?: "signin" | "signup", onSuccess?: () => void) => void;
    closeAuthModal: () => void;
    ownedPrograms: string[];
    hasActiveProgram: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

/* ── Session-expiry toast ─────────────────────────── */
function SessionToast({ title = "Session ended", message, onDismiss }: { title?: string; message: string; onDismiss: () => void }) {
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        timerRef.current = setTimeout(onDismiss, 10_000);
        return () => clearTimeout(timerRef.current);
    }, [onDismiss]);

    return (
        <motion.div
            role="alert"
            initial={{ opacity: 0, y: -12, x: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, x: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed top-5 right-5 z-[120] w-[360px] max-w-[calc(100vw-2.5rem)] pointer-events-auto"
        >
            <div className="relative overflow-hidden rounded-2xl border border-[oklch(0.2475_0.0661_146.79)]/10 bg-white/90 shadow-xl shadow-black/[0.08] backdrop-blur-xl">
                {/* Gradient accent bar */}
                <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[oklch(0.2475_0.0661_146.79)] via-[oklch(0.55_0.12_160)] to-[oklch(0.2475_0.0661_146.79)]/40" />

                <div className="px-5 pt-5 pb-4">
                    <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[oklch(0.2475_0.0661_146.79)]/[0.08]">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[oklch(0.2475_0.0661_146.79)]">
                                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5ZM8 10a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="currentColor"/>
                            </svg>
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[oklch(0.2475_0.0661_146.79)]">
                                {title}
                            </p>
                            <p className="mt-1 text-[13px] leading-relaxed text-[oklch(0.2475_0.0661_146.79)]/60">
                                {message}
                            </p>
                        </div>

                        {/* Close */}
                        <button
                            type="button"
                            onClick={onDismiss}
                            className="shrink-0 rounded-lg p-1.5 text-[oklch(0.2475_0.0661_146.79)]/30 transition-colors hover:bg-[oklch(0.2475_0.0661_146.79)]/5 hover:text-[oklch(0.2475_0.0661_146.79)]/60"
                            aria-label="Dismiss"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Auto-dismiss progress bar */}
                <motion.div
                    className="h-[2px] bg-[oklch(0.2475_0.0661_146.79)]/20 origin-left"
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: 10, ease: "linear" }}
                />
            </div>
        </motion.div>
    );
}

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalTab, setAuthModalTab] = useState<"signin" | "signup">("signin");
    const [authSuccessCallback, setAuthSuccessCallback] = useState<(() => void) | null>(null);
    const [ownedPrograms, setOwnedPrograms] = useState<string[]>([]);
    const [hasActiveProgram, setHasActiveProgram] = useState(false);
    const [sessionNotice, setSessionNotice] = useState<string | null>(null);

    const clearAuthState = useCallback(() => {
        setSession(null);
        setUser(null);
        setProfile(null);
        setOwnedPrograms([]);
        setHasActiveProgram(false);
    }, []);

    const clearStaleSession = useCallback(async (reason: string, error?: unknown) => {
        console.warn(`Clearing stale web session: ${reason}`, error);
        try {
            await supabase.auth.signOut({ scope: "local" });
        } catch (signOutError) {
            console.warn("Failed to clear stale local web session.", signOutError);
        }
        clearAuthState();
        setSessionNotice("Your session expired because this account is no longer available. Please sign in again if needed.");
    }, [clearAuthState]);

    const isUnauthorizedAuthError = useCallback((error: unknown) => {
        if (!error || typeof error !== "object") {
            return false;
        }

        const authError = error as {
            status?: number;
            code?: string;
            message?: string;
            name?: string;
        };

        if (authError.status === 401 || authError.status === 403) {
            return true;
        }

        const haystack = `${authError.code ?? ""} ${authError.name ?? ""} ${authError.message ?? ""}`.toLowerCase();

        return (
            haystack.includes("jwt") ||
            haystack.includes("session") ||
            haystack.includes("token") ||
            haystack.includes("unauthorized") ||
            haystack.includes("forbidden") ||
            haystack.includes("refresh token") ||
            haystack.includes("auth session missing")
        );
    }, []);

    const isRefreshTokenNotFoundError = useCallback((error: unknown) => {
        if (!error || typeof error !== "object") {
            return false;
        }

        const authError = error as {
            code?: string;
            message?: string;
            name?: string;
        };

        const haystack = `${authError.code ?? ""} ${authError.name ?? ""} ${authError.message ?? ""}`.toLowerCase();

        return (
            authError.code === "refresh_token_not_found" ||
            haystack.includes("refresh token not found") ||
            haystack.includes("invalid refresh token")
        );
    }, []);

    const fetchOwnedPrograms = useCallback(async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from("program_access")
                .select("owned_program, purchase_state, updated_at")
                .eq("user_id", userId)
                .order("updated_at", { ascending: false });

            if (error) {
                if (isUnauthorizedAuthError(error)) {
                    await clearStaleSession("program_access fetch returned unauthorized", error);
                    return;
                }
                console.error("Error fetching program_access:", error);
                setOwnedPrograms([]);
                setHasActiveProgram(false);
                return;
            }

            if (data && data.length > 0) {
                // Collect ALL owned program slugs (active, completed, or archived)
                const ownedSlugs = data
                    .filter(r => ["owned_active", "owned_completed", "owned_archived"].includes(r.purchase_state))
                    .map(r => dbToWebSlug[r.owned_program])
                    .filter((slug): slug is string => Boolean(slug));

                setOwnedPrograms(ownedSlugs);
                setHasActiveProgram(data.some(r => r.purchase_state === "owned_active"));
            } else {
                setOwnedPrograms([]);
                setHasActiveProgram(false);
            }
        } catch (e) {
            if (isUnauthorizedAuthError(e)) {
                await clearStaleSession("program_access fetch threw unauthorized", e);
                return;
            }
            console.error("Failed to fetch owned programs:", e);
            setOwnedPrograms([]);
            setHasActiveProgram(false);
        }
    }, [clearStaleSession, isUnauthorizedAuthError]);

    const fetchProfile = useCallback(async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();

            if (data) {
                setProfile(data as Profile);
            } else if (error && error.code === "PGRST116") {
                // Profile doesn't exist yet, we'll handle this in sign-up flow
                setProfile(null);
            } else if (error) {
                if (isUnauthorizedAuthError(error)) {
                    await clearStaleSession("profile fetch returned unauthorized", error);
                    return;
                }
                console.error("Error fetching profile:", error);
            }
        } catch (e) {
            if (isUnauthorizedAuthError(e)) {
                await clearStaleSession("profile fetch threw unauthorized", e);
                return;
            }
            console.error("Error fetching profile:", e);
        }
    }, [clearStaleSession, isUnauthorizedAuthError]);

    const hydrateAccountData = useCallback((userId: string) => {
        void Promise.all([
            fetchProfile(userId),
            fetchOwnedPrograms(userId),
        ]).catch((error) => {
            console.error("Failed to hydrate account data:", error);
        });
    }, [fetchOwnedPrograms, fetchProfile]);

    const syncAuthenticatedState = useCallback(async (candidateSession: Session | null) => {
        if (!candidateSession) {
            clearAuthState();
            return;
        }

        // The session has already been accepted by Supabase auth-js. Reflect it
        // immediately so production latency in profile/program queries does not
        // make the UI look signed out after login.
        setSession(candidateSession);
        setUser(candidateSession.user);
        setIsLoading(false);

        const { data, error } = await supabase.auth.getUser();

        if (error || !data.user) {
            await clearStaleSession("auth.getUser no longer recognizes the session", error);
            return;
        }

        setSession(candidateSession);
        setUser(data.user);
        hydrateAccountData(data.user.id);
    }, [clearAuthState, clearStaleSession, hydrateAccountData]);

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession()
            .then(async ({ data: { session } }) => {
                await syncAuthenticatedState(session);
                setIsLoading(false);
            })
            .catch((error) => {
                if (!isRefreshTokenNotFoundError(error)) {
                    console.error("Failed to read initial auth session:", error);
                }
                clearAuthState();
                setIsLoading(false);
            });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            void syncAuthenticatedState(session).finally(() => {
                setIsLoading(false);
            });
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [clearAuthState, isRefreshTokenNotFoundError, syncAuthenticatedState]);

    const openAuthModal = (tab: "signin" | "signup" = "signin", onSuccess?: () => void) => {
        setAuthModalTab(tab);
        setAuthSuccessCallback(() => onSuccess || null);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
        setAuthSuccessCallback(null);
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        clearAuthState();
        setSessionNotice("signed-out");
    };

    return (
        <UserContext.Provider
            value={{
                user,
                session,
                profile,
                isLoading,
                signOut,
                isAuthModalOpen,
                openAuthModal,
                closeAuthModal,
                ownedPrograms,
                hasActiveProgram
            }}
        >
            {children}
            <AnimatePresence>
                {sessionNotice && (() => {
                    const isSignOut = sessionNotice === "signed-out";
                    return (
                        <SessionToast
                            title={isSignOut ? "Signed out" : "Session ended"}
                            message={isSignOut ? "You've been signed out successfully. Sign in again anytime." : sessionNotice}
                            onDismiss={() => setSessionNotice(null)}
                        />
                    );
                })()}
            </AnimatePresence>
            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={closeAuthModal} 
                defaultTab={authModalTab}
                onSuccess={() => {
                    if (authSuccessCallback) {
                        authSuccessCallback();
                    }
                    closeAuthModal();
                }}
            />
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
