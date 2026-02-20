"use client";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";

import { MinimalNewsletterForm } from "@/components/newsletter-form";
import Link from "next/link";

interface FooterVariantTwoProps {
    onCtaClick?: () => void; // Deprecated
}

export function FooterVariantTwo({ }: FooterVariantTwoProps) {
    return (
        <footer className="w-full bg-[oklch(0.2475_0.0661_146.79)] text-white pt-20 pb-8 border-t border-white/5">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12">

                {/* Main Content Area */}
                <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24 mb-20">

                    {/* Left Column: Brand & Subscribe */}
                    <div className="lg:max-w-md space-y-8">
                        {/* Brand */}
                        <div className="flex items-center gap-2 text-white">
                            <Image
                                src="/rc-logo-white.svg"
                                alt=""
                                width={32}
                                height={32}
                                className="size-8"
                            />
                            <span className="font-erode text-2xl font-semibold tracking-tighter">
                                Recovery Compass
                            </span>
                        </div>

                        <div className="space-y-8">
                            {/* Headline */}
                            <h3 className="text-2xl md:text-3xl font-medium leading-tight text-white/90">
                                You don&apos;t have to quit today.<br />
                                Just join the list.
                            </h3>

                            {/* Input Field Group */}
                            <div className="pt-2">
                                <MinimalNewsletterForm alignment="left" className="mx-0 lg:ml-0" />
                            </div>

                            {/* Disclaimer */}
                            <p className="text-xs text-white/40 leading-relaxed max-w-[320px]">
                                By subscribing you agree to with our{" "}
                                <Link
                                    href="/privacy"
                                    className="underline hover:text-white transition-colors cursor-pointer"
                                >
                                    Privacy Policy
                                </Link>{" "}
                                and provide consent to receive updates from our company.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Links */}
                    <div className="flex flex-col md:flex-row gap-12 lg:gap-24 pt-4">
                        {/* Legal */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-medium text-white/90">Legal</h4>
                            <ul className="space-y-4 text-sm text-white/60">
                                <li>
                                    <Link
                                        href="/terms"
                                        className="hover:text-white transition-colors cursor-pointer"
                                    >
                                        Terms & Conditions
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/privacy"
                                        className="hover:text-white transition-colors cursor-pointer"
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Socials */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-medium text-white/90">Socials</h4>
                            <ul className="space-y-4 text-sm text-white/60">
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">Twitter / X</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">Instagram</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-medium text-white/90">Company</h4>
                            <ul className="space-y-4 text-sm text-white/60">
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">Contact Us</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <Separator className="bg-white/10 mb-8" />

                {/* Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
                    <p>© 2026 Recovery Compass. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span className="opacity-50">Designed for clarity.</span>
                    </div>
                </div>

            </div>
        </footer>
    );
}
