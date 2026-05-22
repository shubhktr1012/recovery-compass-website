import { unstable_cache } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type HomepageCommunityMember = {
    id: string;
    avatarUrl: string | null;
    displayName: string | null;
    initials: string;
};

export type HomepageCommunityData = {
    memberCount: number | null;
    latestMembers: HomepageCommunityMember[];
};

type ProfileSnapshot = {
    id: string;
    avatar_url: string | null;
    display_name: string | null;
    email: string | null;
};

function getInitials(displayName: string | null, email: string | null) {
    const nameSource = displayName?.trim();

    if (nameSource) {
        return nameSource
            .split(/\s+/)
            .filter(Boolean)
            .map((part) => part.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }

    const emailLocalPart = email?.split("@")[0]?.replace(/[._-]+/g, " ").trim();

    if (emailLocalPart) {
        const parts = emailLocalPart.split(/\s+/).filter(Boolean);

        if (parts.length > 1) {
            return parts
                .map((part) => part.charAt(0))
                .join("")
                .slice(0, 2)
                .toUpperCase();
        }

        return emailLocalPart.slice(0, 2).toUpperCase();
    }

    return "RC";
}

async function resolveAvatarUrl(avatarPath: string | null) {
    if (!avatarPath) {
        return null;
    }

    if (avatarPath.startsWith("http")) {
        return avatarPath;
    }

    const { data, error } = await supabaseAdmin.storage
        .from("profile-images")
        .createSignedUrl(avatarPath, 60 * 60 * 24);

    if (error) {
        console.error("Failed to sign homepage avatar URL:", error);
        return null;
    }

    return data?.signedUrl ?? null;
}

const getHomepageCommunityDataCached = unstable_cache(
    async (): Promise<HomepageCommunityData> => {
        try {
            const fetchPromise = (async () => {
                const [countResult, latestProfilesResult] = await Promise.all([
                    supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
                    supabaseAdmin
                        .from("profiles")
                        .select("id, avatar_url, display_name, email")
                        .order("created_at", { ascending: false })
                        .limit(4),
                ]);

                if (countResult.error) throw countResult.error;
                if (latestProfilesResult.error) throw latestProfilesResult.error;

                const latestMembers = await Promise.all(
                    (latestProfilesResult.data ?? []).map(async (profile) => {
                        const snapshot = profile as ProfileSnapshot;
                        return {
                            id: snapshot.id,
                            avatarUrl: await resolveAvatarUrl(snapshot.avatar_url),
                            displayName: snapshot.display_name,
                            initials: getInitials(snapshot.display_name, snapshot.email),
                        };
                    })
                );

                return {
                    memberCount: countResult.count ?? latestMembers.length,
                    latestMembers,
                };
            })();

            // 3.5 second timeout to prevent hanging the page render
            const timeoutPromise = new Promise<HomepageCommunityData>((_, reject) => {
                setTimeout(() => reject(new Error("Timeout fetching community data")), 3500);
            });

            return await Promise.race([fetchPromise, timeoutPromise]);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("Failed to load homepage community data:", message);
            return {
                memberCount: null,
                latestMembers: [],
            };
        }
    },
    ["homepage-community-data"],
    { revalidate: 300 }
);

export async function getHomepageCommunityData(): Promise<HomepageCommunityData> {
    return getHomepageCommunityDataCached();
}
