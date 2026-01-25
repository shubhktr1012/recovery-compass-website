"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, ArrowRight, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WaitlistDialog({ open, onOpenChange }: WaitlistDialogProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      console.log("Waitlist signup:", email);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/*
        Style Update:
        - Warm background (bg-background) instead of default white
        - Softer borders (rounded-3xl)
        - Subtle border color (border-primary/10)
      */}
      <DialogContent className="sm:max-w-md bg-background border border-primary/10 rounded-[2rem] shadow-2xl p-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-6 bg-secondary/30"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>
              <div className="space-y-2">
                <DialogTitle className="text-3xl font-serif text-foreground">Welcome to clarity.</DialogTitle>
                <DialogDescription className="text-center max-w-[280px] mx-auto text-muted-foreground text-base">
                  We've reserved your spot. Watch your inbox for your exclusive invite code.
                </DialogDescription>
              </div>
              <Button
                className="mt-4 rounded-full px-8 bg-background border border-border hover:bg-secondary text-foreground"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  setStatus("idle");
                  setEmail("");
                }}
              >
                Close
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8"
            >
              <DialogHeader className="space-y-4 text-center sm:text-left">
                <div className="mx-auto sm:mx-0 w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary mb-2">
                  <Leaf className="w-6 h-6" />
                </div>
                <DialogTitle className="font-serif text-3xl text-foreground">Request Access</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground leading-relaxed">
                  Join the private beta to start tracking your journey to clarity.
                  <br className="hidden sm:block"/> Spots are currently limited to ensure quality.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground/80 pl-1">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-secondary/30 border-primary/10 focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl transition-all text-base"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all bg-primary text-primary-foreground"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Securing spot...
                    </>
                  ) : (
                    <>
                      Join the Waitlist
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground pt-2">
                  No spam. Unsubscribe anytime.
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
