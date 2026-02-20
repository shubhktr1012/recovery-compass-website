"use client";

import { FooterVariantTwo } from "@/components/sections/footer-2";
import { NavbarSticky } from "@/components/navbar-sticky";

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <NavbarSticky simple />
            <main className="flex-1 max-w-4xl mx-auto px-6 py-32 w-full text-center">
                <h1 className="text-4xl md:text-5xl font-bold font-erode text-foreground mb-6">
                    Contact & Support
                </h1>
                <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
                    We&apos;re here to help you on your journey. Whether you have questions about the program, need technical assistance, or want to share your progress, our team is ready to support you.
                </p>

                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto text-left">
                    <div className="p-8 rounded-2xl bg-muted/30 border border-border/50">
                        <h3 className="text-xl font-bold text-foreground mb-4">Email Us</h3>
                        <p className="text-muted-foreground mb-6">
                            For technical support, billing inquiries, or general questions, please drop us an email. We aim to respond within 24 hours.
                        </p>
                        <a href="mailto:shubh12khatri@gmail.com" className="inline-flex items-center text-primary font-medium hover:underline">
                            shubh12khatri@gmail.com
                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </a>
                    </div>

                    <div className="p-8 rounded-2xl bg-muted/30 border border-border/50">
                        <h3 className="text-xl font-bold text-foreground mb-4">India Phone Support</h3>
                        <p className="text-muted-foreground mb-6">
                            Need immediate assistance? Our support line is open Monday to Friday, 9:00 AM to 6:00 PM IST.
                        </p>
                        <a href="tel:+917089983626" className="inline-flex items-center text-primary font-medium hover:underline">
                            +91-7089983626
                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </a>
                    </div>
                </div>
            </main>
            <FooterVariantTwo />
        </div>
    );
}
