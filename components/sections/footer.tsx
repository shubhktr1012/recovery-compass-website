import { Separator } from "@/components/ui/separator";
import { DefaultNewsletterForm } from "@/components/newsletter-form";
import Link from "next/link";

export function FooterSection() {
    return (
        <footer className="py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-primary text-white">
            <div className="max-w-4xl mx-auto">

                {/* Soft CTA */}
                <div className="text-center space-y-8 mb-20">
                    <p className="text-2xl md:text-3xl lg:text-4xl font-erode font-medium tracking-tighter leading-[1.10] text-white/90">
                        You don't have to quit today.<br />
                        Just join the list.
                    </p>

                    <DefaultNewsletterForm alignment="center" />
                </div>

                {/* Separator */}
                <Separator className="bg-white/10" />

                {/* Footer Bottom */}
                <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                            <div className="w-4 h-4 bg-white/20 rounded-sm" />
                        </div>
                        <span className="font-medium text-white/60 tracking-tight">Recovery Compass</span>
                    </div>

                    {/* Copyright */}
                    <p className="text-sm text-white/40">
                        © {new Date().getFullYear()} Recovery Compass. Designed for real life.
                    </p>

                    {/* Links */}
                    <div className="flex gap-8 text-sm text-white/40">
                        <Link href="/privacy" className="hover:text-white transition-colors">
                            Privacy
                        </Link>
                        <Link href="/terms" className="hover:text-white transition-colors">
                            Terms
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
