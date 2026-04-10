import type { Metadata } from "next";
import Link from "next/link";
import { FooterVariantTwo } from "@/components/sections/footer-2";
import { NavbarSticky } from "@/components/navbar-sticky";

export const metadata: Metadata = {
    title: "Delete Your Recovery Compass Account",
    description: "Learn how to permanently delete your Recovery Compass account and associated app data.",
};

export default function DeleteAccountPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <NavbarSticky simple />

            <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full">
                <div className="space-y-12 text-foreground/80 leading-relaxed pb-20 font-sans">
                    
                    <section>
                        <h1 className="font-erode text-4xl md:text-5xl font-semibold text-foreground mb-8 tracking-tighter">
                            Delete Your Account
                        </h1>
                        <div className="h-px w-full bg-foreground/10 mb-12" />
                        
                        <p className="mb-8">
                            You can permanently delete your Recovery Compass account at any time.
                        </p>

                        <div className="p-6 md:p-8 bg-foreground/[0.03] border border-foreground/5 rounded-2xl">
                            <p className="mb-4">
                                If you still have access to the app, the fastest way is to delete your account directly inside Recovery Compass:
                            </p>
                            <div className="flex flex-wrap items-center gap-2 font-medium">
                                <span className="text-foreground/70">Account</span>
                                <span className="text-foreground/40">→</span>
                                <span className="text-foreground/70">Settings</span>
                                <span className="text-foreground/40">→</span>
                                <span className="text-foreground">Permanently Delete Account</span>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="font-erode text-2xl font-semibold text-foreground">Delete your account in the app</h2>
                        <div className="space-y-4">
                            <p>If you can sign in to the app, open Recovery Compass and go to:</p>
                            <blockquote className="border-l-2 border-foreground/10 pl-5 py-1 italic text-foreground/70">
                                Account → Settings → Permanently Delete Account
                            </blockquote>
                            <p>You&apos;ll be asked to confirm before deletion is completed.</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="font-erode text-2xl font-semibold text-foreground">Can&apos;t access the app?</h2>
                        <div className="space-y-4">
                            <p>
                                If you can&apos;t access the app, you can request account deletion by contacting us from the email address associated with your Recovery Compass account.
                            </p>
                            <p>
                                <span className="font-semibold text-foreground">Email:</span>{" "}
                                <a href="mailto:support@recoverycompass.co" className="text-foreground hover:opacity-70 transition-opacity">
                                    support@recoverycompass.co
                                </a>
                            </p>
                            <p>
                                Please include the subject line: <span className="font-semibold text-foreground">Delete my Recovery Compass account</span>
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="font-erode text-2xl font-semibold text-foreground">What gets deleted</h2>
                        <div className="space-y-4">
                            <p>
                                When your account deletion request is completed, we permanently delete or de-identify the personal data associated with your Recovery Compass account, including:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Your profile information</li>
                                <li>Your onboarding responses</li>
                                <li>Your journal entries</li>
                                <li>Your program progress</li>
                                <li>Your saved app data associated with your account</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="font-erode text-2xl font-semibold text-foreground">What may be retained for a limited time</h2>
                        <p>
                            We may retain limited information when required for legal, security, fraud-prevention, billing, or regulatory compliance purposes. Where retention is required, we keep only what is necessary for that purpose and for the minimum period required.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="font-erode text-2xl font-semibold text-foreground">How long it takes</h2>
                        <p>
                            Requests made directly inside the app are processed as part of the deletion flow. Requests sent by email are typically processed within 7 business days after we verify account ownership.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="font-erode text-2xl font-semibold text-foreground">Need help?</h2>
                        <div className="space-y-4">
                            <p>
                                If you need help locating your account or submitting a deletion request, contact:
                            </p>
                            <a href="mailto:support@recoverycompass.co" className="inline-block font-medium text-foreground hover:opacity-70 transition-opacity">
                                support@recoverycompass.co
                            </a>
                        </div>
                    </section>

                    <div className="h-px w-full bg-foreground/10 mt-16 mb-8" />
                    
                    <p className="text-sm text-foreground/50 italic text-center md:text-left">
                        For more information about how we handle personal data, please see our <Link href="/privacy" className="text-foreground hover:underline underline-offset-4">Privacy Policy</Link>.
                    </p>

                </div>
            </main>

            <FooterVariantTwo />
        </div>
    );
}
