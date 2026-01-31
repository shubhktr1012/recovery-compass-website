import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface FooterSectionProps {
    onCtaClick?: () => void;
}

export function FooterSection({ onCtaClick }: FooterSectionProps) {
    return (
        <footer className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-neutral-900 text-white">
            <div className="max-w-4xl mx-auto">

                {/* Soft CTA */}
                <div className="text-center space-y-8 mb-20">
                    <p className="text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed text-neutral-200">
                        You don't have to quit today.<br />
                        Just join the list.
                    </p>

                    <Button
                        size="lg"
                        className="rounded-full px-10 py-6 text-base font-semibold bg-white text-neutral-900 hover:bg-neutral-100"
                        onClick={onCtaClick}
                    >
                        Join the Waitlist
                    </Button>
                </div>

                {/* Separator */}
                <Separator className="bg-neutral-800" />

                {/* Footer Bottom */}
                <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo Placeholder */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center">
                            <span className="text-neutral-500 text-[10px]">Logo</span>
                        </div>
                        <span className="font-medium text-neutral-400">Recovery Compass</span>
                    </div>

                    {/* Copyright */}
                    <p className="text-sm text-neutral-500">
                        © {new Date().getFullYear()} Recovery Compass. Designed for real life.
                    </p>

                    {/* Links */}
                    <div className="flex gap-6 text-sm text-neutral-500">
                        <a href="#" className="hover:text-neutral-300 transition-colors">
                            Privacy
                        </a>
                        <a href="#" className="hover:text-neutral-300 transition-colors">
                            Terms
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
}
