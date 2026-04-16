"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AuthModal } from "@/components/auth-modal";

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
            }
            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
                await fetchProfile(session.user.id);
            } else {
                setProfile(null);
            }
            
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

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
                closeAuthModal
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
