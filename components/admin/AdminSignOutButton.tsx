"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminSignOutButton({
  className,
  showLabel = true,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.replace("/sign-in");
    router.refresh();
  }

  return (
    <Button
      className={cn(
        "h-9 rounded-full border-white/10 bg-white/[0.07] text-white hover:bg-white/[0.12]",
        className
      )}
      disabled={isSigningOut}
      onClick={handleSignOut}
      type="button"
      variant="outline"
    >
      {isSigningOut ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <LogOut className="size-3.5" />
      )}
      {showLabel ? "Sign out" : <span className="sr-only">Sign out</span>}
    </Button>
  );
}
