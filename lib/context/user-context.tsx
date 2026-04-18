"use client";

import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AuthModal } from "@/components/auth-modal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const dbToWebSlug: Record<string, string> = {
    "six_day_reset": "6-day-compass-reset",
    "ninety_day_transform": "90-day-smoke-free-journey",
    "sleep_disorder_reset": "14-day-sleep-reset",
    "energy_vitality": "21-day-energy-reset",
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

    const syncAuthenticatedState = useCallback(async (candidateSession: Session | null) => {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data.user) {
            if (candidateSession) {
                await clearStaleSession("auth.getUser no longer recognizes the session", error);
                return;
            }

            clearAuthState();
            return;
        }

        setSession(candidateSession);
        setUser(data.user);
        await Promise.all([
            fetchProfile(data.user.id),
            fetchOwnedPrograms(data.user.id),
        ]);
    }, [clearStaleSession, fetchOwnedPrograms, fetchProfile]);

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            await syncAuthenticatedState(session);
            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            await syncAuthenticatedState(session);
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [syncAuthenticatedState]);

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
        setSessionNotice(null);
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
            {sessionNotice ? (
                <div className="fixed inset-x-0 top-4 z-[120] flex justify-center px-4 pointer-events-none">
                    <div className="w-full max-w-xl pointer-events-auto">
                        <Alert className="border-forest/15 bg-white/95 shadow-lg backdrop-blur">
                            <div className="pr-10">
                                <AlertTitle className="font-satoshi-bold text-forest">
                                    Session ended
                                </AlertTitle>
                                <AlertDescription className="font-satoshi text-forest/70">
                                    <p>{sessionNotice}</p>
                                </AlertDescription>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSessionNotice(null)}
                                className="absolute right-3 top-3 rounded-full px-2 py-1 text-xs font-satoshi-bold uppercase tracking-[1px] text-forest/45 transition hover:bg-forest/5 hover:text-forest"
                                aria-label="Dismiss session notice"
                            >
                                Dismiss
                            </button>
                        </Alert>
                    </div>
                </div>
            ) : null}
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
