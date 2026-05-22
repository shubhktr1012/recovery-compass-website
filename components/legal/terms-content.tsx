"use client";

import { motion } from "framer-motion";

const sectionVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
};

export function TermsContent() {
    return (
        <motion.div
            className="space-y-12 text-foreground/80 leading-relaxed max-w-4xl mx-auto pb-20"
            initial="initial"
            animate="animate"
            variants={{
                initial: { opacity: 0 },
                animate: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1,
                    },
                },
            }}
        >
            <motion.section variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
                <p className="text-sm text-foreground/50 mb-4 font-sans">Last Updated: May 2026</p>
                <h1 className="font-erode text-4xl md:text-5xl font-semibold text-foreground mb-8 tracking-tighter">
                    Terms &amp; Conditions
                </h1>
                <div className="h-px w-full bg-foreground/10 mb-12" />
            </motion.section>

            <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
                <h2 className="font-erode text-2xl font-semibold text-foreground">1. Introduction</h2>
                <p>
                    These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of Recovery Compass
                    (&quot;Recovery Compass&quot;, &quot;Platform&quot;, &quot;Services&quot;, &quot;we&quot;, &quot;our&quot;, or
                    &quot;us&quot;), including the Recovery Compass mobile app, website, purchases, support
                    flows, and related digital services.
                </p>
                <p>
                    By accessing or using Recovery Compass, you agree to be bound by these Terms. If you do
                    not agree, please do not use the Services.
                </p>
                <p>
                    Recovery Compass is operated by <span className="font-medium text-foreground">Recovery Compass LLP</span>,
                    registered in India, with registered office at:
                </p>
                <blockquote className="border-l-2 border-foreground/20 pl-6 py-2 italic text-foreground/70">
                    292-94, 3rd Main, 5th Cross
                    <br />
                    New Thippasandra
                    <br />
                    Bangalore 560075
                    <br />
                    India
                </blockquote>
                <p>
                    Your use of the Services is also governed by our <span className="font-medium text-foreground">Privacy Policy</span>.
                </p>
            </motion.section>

            <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
                <h2 className="font-erode text-2xl font-semibold text-foreground">2. What Recovery Compass Provides</h2>
                <p>
                    Recovery Compass provides structured digital wellness content, journaling, progress tools,
                    reminders, and related purchase flows designed to support habit change and wellness goals.
                </p>
                <p>Current offerings may include, for example:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>guided digital programs for smoking recovery, sleep support, energy support, and other wellness goals</li>
                    <li>daily cards, lessons, exercises, audio, routines, reflections, and progress tracking</li>
                    <li>personalized recommendations based on questionnaire responses</li>
                    <li>website and in-app purchase flows for programs and add-ons</li>
                    <li>custom diet-plan services and questionnaire-based fulfilment flows</li>
                </ul>
                <div className="p-8 bg-foreground/[0.03] border border-foreground/5 rounded-2xl space-y-4">
                    <h3 className="text-xl font-medium text-foreground">What We Do Not Provide</h3>
                    <p>
                        Recovery Compass is not a medical device and does not provide medical advice, diagnosis,
                        treatment, emergency response, or clinical supervision.
                    </p>
                    <p>
                        The Services are provided for educational and wellness-support purposes only. Use of
                        the Services does not create a doctor-patient, therapist-client, or other regulated
                        healthcare relationship.
                    </p>
                </div>
            </motion.section>

            <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
                <h2 className="font-erode text-2xl font-semibold text-foreground">3. Eligibility and Accounts</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>The Services are intended for users aged 18 and above.</li>
                    <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                    <li>You are responsible for the activity that occurs through your account.</li>
                    <li>You must provide accurate information when creating an account or making a purchase.</li>
                </ul>
            </motion.section>

            <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
                <h2 className="font-erode text-2xl font-semibold text-foreground">4. Purchases, Billing, and Access</h2>
                <div className="space-y-4">
                    <p>
                        Recovery Compass may offer one-time purchases, add-ons, promotional offers, or
                        subscription-based access, depending on the specific feature or checkout flow presented to you.
                    </p>
                    <p>
                        The price, currency, product scope, and billing terms shown at checkout for the
                        specific purchase are the terms that apply to that purchase.
                    </p>
                    <p>Purchases may be processed through:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Apple App Store</li>
                        <li>Google Play Store</li>
                        <li>Razorpay for supported website purchases</li>
                    </ul>
                    <p>
                        Entitlement validation and purchase restoration may be handled through
                        <span className="font-medium text-foreground"> RevenueCat </span>
                        or other operational systems used to confirm access.
                    </p>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">Digital Access</h3>
                    <p>
                        When a purchase succeeds, you receive a limited, personal, non-transferable right to
                        access the purchased content or service in accordance with the offer shown at checkout.
                    </p>
                    <p>
                        Some purchases may require additional steps after payment, such as completing a
                        questionnaire before fulfilment can be completed.
                    </p>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">Pricing Changes</h3>
                    <p>
                        We may change pricing, packaging, or offers at any time for future purchases. Those changes
                        will not retroactively alter a purchase you already completed unless required by law or
                        clearly disclosed as part of a continuing subscription product.
                    </p>
                </div>
            </motion.section>

            <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
                <h2 className="font-erode text-2xl font-semibold text-foreground">5. Refunds, Cancellations, and Payment Disputes</h2>
                <div className="space-y-4">
                    <p>
                        Recovery Compass provides digital content and services that may become accessible
                        immediately after purchase or after fulfilment steps are completed. Except where required
                        by applicable law, refunds are generally not available after digital access or fulfilment
                        has begun.
                    </p>
                    <p>Refunds may be handled according to the policies of the platform used for purchase, including Apple, Google, or Razorpay.</p>
                    <p>
                        If a purchase is subscription-based, cancellation rules for that purchase will be governed
                        by the checkout terms and the relevant platform billing policies.
                    </p>
                    <p>
                        If you believe a charge was unauthorized or materially incorrect, contact
                        <span className="font-medium text-foreground"> support@recoverycompass.co </span>
                        before initiating a dispute where reasonably possible.
                    </p>
                </div>
            </motion.section>

            <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
                <h2 className="font-erode text-2xl font-semibold text-foreground">6. Health and Wellness Disclaimer</h2>
                <div className="p-8 bg-red-500/[0.03] border border-red-500/10 rounded-2xl space-y-4">
                    <p>You acknowledge that:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>You are solely responsible for your physical and mental health decisions.</li>
                        <li>If you have a medical condition, symptoms, injuries, allergies, or health concerns, you should consult a qualified healthcare professional before acting on wellness guidance.</li>
                        <li>Behavioural or lifestyle change may cause discomfort, emotional changes, or uneven results.</li>
                        <li>Participation in programs, routines, exercises, and diet-related guidance is voluntary and at your own discretion and risk.</li>
                    </ul>
                    <p className="font-medium text-red-900/90">
                        If you are experiencing a medical or mental health emergency, contact appropriate emergency services or a qualified healthcare professional immediately.
                    </p>
                </div>
                <p>
                    Recovery Compass does not guarantee any specific outcome, including smoking cessation,
                    sleep improvement, energy improvement, symptom relief, or any other health-related result.
                </p>
            </motion.section>

            <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
                <h2 className="font-erode text-2xl font-semibold text-foreground">7. User Responsibilities and Prohibited Conduct</h2>
                <p>You may not:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>use the Services for unlawful, fraudulent, abusive, or harmful purposes</li>
                    <li>attempt to bypass paywalls, purchase checks, entitlement systems, or access controls</li>
                    <li>share, resell, sublicense, or commercially exploit purchased access or platform content</li>
                    <li>copy, scrape, or automate extraction of content or data from the Services</li>
                    <li>interfere with platform security, reliability, or normal operation</li>
                    <li>use the Services to promote harmful behaviour, harassment, or illegal conduct</li>
                </ul>
            </motion.section>

            <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
                <h2 className="font-erode text-2xl font-semibold text-foreground">8. User Content, Questionnaire Responses, and AI Features</h2>
                <div className="space-y-4">
                    <p>
                        You retain ownership of journal entries, questionnaire responses, and other content you
                        submit, but you grant us permission to process that content as needed to operate the Services.
                    </p>
                    <p>
                        Certain features may use automated logic or AI-assisted generation, including recommendation
                        flows or diet-plan fulfilment. Those outputs are informational and operational in nature and are
                        not professional advice.
                    </p>
                    <p>
                        You should review generated outputs carefully and use independent judgment, especially for
                        health, fitness, nutrition, or wellness-related decisions.
                    </p>
                </div>
            </motion.section>

            <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
                <h2 className="font-erode text-2xl font-semibold text-foreground">9. Intellectual Property</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Recovery Compass name, logo, branding, program content, scripts, design, and digital tools are protected intellectual property.</li>
                    <li>No ownership of platform content transfers to you through purchase or use.</li>
                    <li>You receive only the limited usage rights explicitly described by the relevant purchase or feature.</li>
                </ul>
            </motion.section>

            <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
                <h2 className="font-erode text-2xl font-semibold text-foreground">10. Service Availability and Changes</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>We do not guarantee uninterrupted availability of the Services.</li>
                    <li>The Services may rely on third-party infrastructure, payment providers, app stores, email services, analytics systems, or AI providers.</li>
                    <li>We may modify, improve, suspend, or discontinue features, programs, offers, or content at our discretion.</li>
                    <li>Some features may be released in limited form, may vary by platform, or may not be available in all jurisdictions.</li>
                </ul>
            </motion.section>

            <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
                <h2 className="font-erode text-2xl font-semibold text-foreground">11. Account Suspension or Termination</h2>
                <p>We may suspend or terminate access if you:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>violate these Terms</li>
                    <li>engage in abusive, threatening, or fraudulent conduct</li>
                    <li>attempt to misuse payment systems or platform infrastructure</li>
                </ul>
                <p>
                    Where reasonably possible, we will notify you. Refunds, if any, will be handled according to
                    applicable law and the platform used for purchase.
                </p>
            </motion.section>

            <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
                <h2 className="font-erode text-2xl font-semibold text-foreground">12. Limitation of Liability</h2>
                <p>To the maximum extent permitted under applicable law:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Recovery Compass is not liable for indirect, incidental, special, consequential, or punitive damages arising from use of the Services.</li>
                    <li>Our total liability for claims arising from the Services will not exceed the amount you paid to us for the specific purchase or service giving rise to the claim during the preceding 12 months.</li>
                    <li>We are not liable for delays or failures caused by events beyond our reasonable control.</li>
                </ul>
            </motion.section>

            <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
                <h2 className="font-erode text-2xl font-semibold text-foreground">13. Third-Party Platforms</h2>
                <div className="space-y-4">
                    <p>
                        Apple, Google, RevenueCat, Razorpay, Supabase, Vercel, Resend, and any AI service providers
                        we use are independent third parties. Their own terms and policies may also apply.
                    </p>
                    <p>
                        Apple and Google are not responsible for the content, maintenance, support, or claims
                        related to Recovery Compass except as required by their platform terms.
                    </p>
                </div>
            </motion.section>

            <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
                <h2 className="font-erode text-2xl font-semibold text-foreground">14. Communications</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>You may receive service-related emails, purchase confirmations, fulfilment updates, reminder emails, and support communications.</li>
                    <li>Marketing emails, if any, require appropriate consent where required by law.</li>
                </ul>
            </motion.section>

            <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
                <h2 className="font-erode text-2xl font-semibold text-foreground">15. Governing Law and Disputes</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>These Terms are governed by the laws of India.</li>
                    <li>Any disputes shall be subject to the exclusive jurisdiction of courts located in Bangalore, India, unless applicable law requires otherwise.</li>
                    <li>Where permitted by law, disputes may be resolved through arbitration or other alternative dispute resolution procedures.</li>
                </ul>
            </motion.section>

            <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
                <h2 className="font-erode text-2xl font-semibold text-foreground">16. Business Transfers, Severability, and Entire Agreement</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>In the event of a merger, acquisition, or transfer of business assets, user data and services may transfer to the new entity subject to applicable law.</li>
                    <li>If any provision of these Terms is found unenforceable, the remaining provisions remain in effect.</li>
                    <li>These Terms, together with the Privacy Policy and any specific checkout disclosures, form the entire agreement between you and Recovery Compass regarding the Services.</li>
                </ul>
            </motion.section>

            <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
                <h2 className="font-erode text-2xl font-semibold text-foreground">17. Contact Us</h2>
                <p>For questions, support, or concerns regarding these Terms, contact us at:</p>
                <p>
                    <span className="font-bold">Email:</span> support@recoverycompass.co
                </p>
            </motion.section>

            <div className="h-px w-full bg-foreground/10 mt-12 mb-8" />
            <p className="text-center text-sm text-foreground/50 italic">
                By using Recovery Compass, you acknowledge that you have read, understood, and agree to be bound by these Terms &amp; Conditions.
            </p>
        </motion.div>
    );
}
