"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FormStatus = "idle" | "loading" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

function useEnquiryForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;

    const timeout = window.setTimeout(() => {
      setToastMessage(null);
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status !== "idle") {
      setStatus("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Enquiry failed:", data.error);
        setStatus("error");
        return;
      }

      setStatus("success");
      setToastMessage("Thanks, we’ve received your enquiry and will get back to you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
      window.setTimeout(() => setStatus("idle"), 1200);
    } catch (error) {
      console.error("Enquiry error:", error);
      setStatus("error");
    }
  };

  return {
    formData,
    handleChange,
    status,
    handleSubmit,
    isDisabled: status === "loading",
    toastMessage,
    dismissToast: () => setToastMessage(null),
  };
}

function StatusMessages({ status }: { status: FormStatus }) {
  return (
    <div className="w-full text-center">
      <AnimatePresence mode="wait">
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-center gap-1.5 text-red-400 text-sm font-medium">
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
              <span>Something went wrong. Please try again.</span>
            </div>
          </motion.div>
        )}
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-center gap-1.5 text-green-400 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>Enquiry sent. We&apos;ll be in touch shortly.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface DefaultNewsletterFormProps {
  alignment?: "left" | "center" | "right";
  className?: string;
}

export function DefaultNewsletterForm({ alignment = "right", className }: DefaultNewsletterFormProps) {
  const { formData, handleChange, status, handleSubmit, isDisabled, toastMessage, dismissToast } =
    useEnquiryForm();

  const inputClasses =
    "h-12 rounded-full bg-white/90 border-0 text-zinc-900 placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:bg-white transition-all font-medium px-6 shadow-md";

  return (
    <div
      className={cn(
        "w-full max-w-md mx-auto",
        alignment === "right" && "lg:ml-auto",
        alignment === "left" && "lg:mr-auto",
        className
      )}
    >
      <AnimatePresence>
        {toastMessage ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="fixed bottom-4 right-4 z-[120] w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-emerald-200 bg-white/95 p-4 shadow-2xl backdrop-blur"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-emerald-100 p-1 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-zinc-900">Enquiry sent</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600">{toastMessage}</p>
              </div>
              <button
                type="button"
                onClick={dismissToast}
                className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400 transition hover:text-zinc-700"
              >
                Close
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="relative space-y-4">
        <Input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className={inputClasses}
          required
          disabled={isDisabled}
          aria-label="Your Name"
          autoComplete="name"
        />

        <Input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className={inputClasses}
          required
          disabled={isDisabled}
          aria-label="Email Address"
          autoComplete="email"
        />

        <Input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className={inputClasses}
          required
          disabled={isDisabled}
          aria-label="Phone Number"
          autoComplete="tel"
        />

        <textarea
          name="message"
          placeholder="Tell us how we can help."
          value={formData.message}
          onChange={handleChange}
          className="min-h-32 w-full resize-none rounded-[1.5rem] bg-white/90 border-0 text-zinc-900 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:bg-white transition-all font-medium px-6 py-4 shadow-md"
          required
          disabled={isDisabled}
          aria-label="Your Message"
        />

        <Button
          type="submit"
          disabled={isDisabled}
          className={cn(
            "w-full h-12 rounded-full bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90 font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
            status === "loading" && "opacity-80 cursor-not-allowed",
            status === "success" && "bg-green-500 text-white hover:bg-green-600"
          )}
        >
          {status === "loading" ? (
            <Loader2 className="h-5 w-5 animate-spin mx-auto" aria-hidden="true" />
          ) : status === "success" ? (
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              <span>Enquiry Sent</span>
            </div>
          ) : (
            "Send Enquiry"
          )}
        </Button>

        <StatusMessages status={status} />
      </form>

      <div className="mt-4 flex flex-col items-center gap-2">
        <p className="text-xs text-white/60 font-medium flex items-center gap-1.5 px-4 py-1 rounded-full bg-black/20 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
          Private enquiry. We only use these details to get back to you.
        </p>
      </div>
    </div>
  );
}

interface MinimalNewsletterFormProps {
  alignment?: "left" | "center" | "right";
  className?: string;
}

export function MinimalNewsletterForm({ alignment = "left", className }: MinimalNewsletterFormProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md",
        alignment === "right" && "lg:ml-auto",
        alignment === "left" && "lg:mr-auto",
        className
      )}
    >
      <Button
        asChild
        className="bg-white text-[oklch(0.2475_0.0661_146.79)] hover:bg-white/90 rounded-full px-8 h-12 font-medium transition-all hover:scale-105 active:scale-95 group"
      >
        <Link href="/#contact">Send an Enquiry</Link>
      </Button>
    </div>
  );
}
