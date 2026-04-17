"use client";

import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AuthModal } from "@/components/auth-modal";

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
    ownedProgram: string | null;
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
    const [ownedProgram, setOwnedProgram] = useState<string | null>(null);
    const [hasActiveProgram, setHasActiveProgram] = useState(false);

    const fetchOwnedProgram = useCallback(async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from("program_access")
                .select("owned_program, purchase_state, updated_at")
                .eq("user_id", userId)
                .order("updated_at", { ascending: false });

            if (error) {
                console.error("Error fetching program_access:", error);
                setOwnedProgram(null);
                setHasActiveProgram(false);
                return;
            }

            if (data && data.length > 0) {
                const activeRecord = data.find(r => r.purchase_state === "owned_active");
                const anyRecord = activeRecord || data.find(r => ["owned_completed", "owned_archived"].includes(r.purchase_state));

                if (anyRecord) {
                    setOwnedProgram(dbToWebSlug[anyRecord.owned_program] || null);
                } else {
                    setOwnedProgram(null);
                }

                if (activeRecord) {
                    setHasActiveProgram(true);
                } else {
                    setHasActiveProgram(false);
                }
            } else {
                setOwnedProgram(null);
                setHasActiveProgram(false);
            }
        } catch (e) {
            console.error("Failed to fetch owned programs:", e);
            setOwnedProgram(null);
            setHasActiveProgram(false);
        }
    }, []);

    const fetchProfile = async (userId: string) => {
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
            }
        } catch (e) {
            console.error("Error fetching profile:", e);
        }
    };

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
                fetchOwnedProgram(session.user.id);
            } else {
                setOwnedProgram(null);
                setHasActiveProgram(false);
            }
            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
                await Promise.all([
                    fetchProfile(session.user.id),
                    fetchOwnedProgram(session.user.id)
                ]);
            } else {
                setProfile(null);
                setOwnedProgram(null);
                setHasActiveProgram(false);
            }
            
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [fetchOwnedProgram]);

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
        setOwnedProgram(null);
        setHasActiveProgram(false);
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
                ownedProgram,
                hasActiveProgram
            }}
        >
            {children}
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
