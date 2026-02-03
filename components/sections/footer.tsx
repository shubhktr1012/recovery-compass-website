import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface FooterSectionProps {
    onCtaClick?: () => void;
}

export function FooterSection({ onCtaClick }: FooterSectionProps) {
    return (
        <footer className="py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-primary text-white">
            <div className="max-w-4xl mx-auto">

                {/* Soft CTA */}
                <div className="text-center space-y-8 mb-20">
                    <p className="text-2xl md:text-3xl lg:text-4xl font-medium leading-[1.3] text-white/90">
                        You don't have to quit today.<br />
                        Just join the list.
                    </p>

                    <Button
                        size="lg"
                        className="rounded-full px-10 py-6 h-auto text-lg font-medium bg-white text-primary hover:bg-neutral-100 transition-all duration-300"
                        onClick={onCtaClick}
                    >
                        Join the Waitlist
                    </Button>
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
                        <a href="#" className="hover:text-white transition-colors">
                            Privacy
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            Terms
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
}
