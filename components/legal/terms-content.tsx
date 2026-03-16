"use client";

import { motion } from "framer-motion";

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
                        staggerChildren: 0.1
                    }
                }
            }}
        >
            <motion.section
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <p className="text-sm text-foreground/50 mb-4 font-sans">Last Updated: February 2026</p>
                <h1 className="font-erode text-4xl md:text-5xl font-semibold text-foreground mb-8 tracking-tighter">
                    Terms & Conditions
                </h1>
                <div className="h-px w-full bg-foreground/10 mb-12" />
            </motion.section>

            <motion.section
                className="space-y-6"
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">1. Introduction</h2>
                <p>
                    These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of Recovery Compass (&quot;Platform&quot;, &quot;App&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;), a digital wellness application designed to support smoking cessation.
                </p>
                <p>
                    By accessing or using Recovery Compass, you agree to be bound by these Terms. If you do not agree, please do not use the Platform.
                </p>
                <p>
                    Recovery Compass is operated by Recovery Compass, registered in Karnataka, India, with registered office at:
                </p>
                <blockquote className="border-l-2 border-foreground/20 pl-6 py-2 italic text-foreground/70">
                    292-94, 3rd Main, 5th Cross<br />
                    New Thippasandra<br />
                    Bangalore 560075<br />
                    India
                </blockquote>
                <p>
                    Your use of the Platform is also governed by our <span className="font-medium text-foreground">Privacy Policy</span>.
                </p>
            </motion.section>

            <motion.section
                className="space-y-6"
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">2. Platform Distribution</h2>
                <p>
                    Recovery Compass is available through third-party app distribution platforms including the Apple App Store and Google Play Store. By downloading or subscribing through these platforms, you also agree to their respective terms and billing policies.
                </p>
                <p>
                    Apple and Google are not sponsors of, nor affiliated with, Recovery Compass.
                </p>
            </motion.section>

            <motion.section
                className="space-y-6"
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">3. Subscriptions & Billing</h2>

                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">Pricing & Disclosure</h3>
                    <p>Before purchase, the Platform clearly discloses:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Subscription price</li>
                        <li>Billing frequency (monthly/yearly)</li>
                        <li>Automatic renewal terms</li>
                        <li>Cancellation process</li>
                        <li>Whether a free trial is included</li>
                    </ul>
                    <p>Users must confirm understanding before completing any purchase.</p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">Apple App Store Subscriptions</h3>
                    <p>If you subscribe via Apple:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Payment will be charged to your Apple ID account at confirmation of purchase</li>
                        <li>Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period</li>
                        <li>Your account will be charged for renewal within 24 hours prior to the end of the current period</li>
                        <li>You can manage and cancel subscriptions in your Apple ID account settings after purchase</li>
                        <li>Any unused portion of a free trial, if offered, will be forfeited when you purchase a subscription</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">Google Play Store Subscriptions</h3>
                    <p>If you subscribe via Google Play:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Payment will be charged to your Google Play account at confirmation of purchase</li>
                        <li>Subscriptions renew automatically unless cancelled before the end of the current billing period</li>
                        <li>You can manage or cancel subscriptions in your Google Play account settings</li>
                        <li>Refunds are handled according to Google Play&apos;s refund policies</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">Pricing Changes</h3>
                    <p>
                        Subscription pricing may change with reasonable notice. Existing subscribers may retain prior pricing at our discretion.
                    </p>
                </div>
            </motion.section>

            <motion.section
                className="space-y-6"
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">4. What Recovery Compass Provides</h2>
                <p>
                    Recovery Compass provides structured digital wellness support for smoking cessation, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Guided cessation programmes (6-day and 90-day)</li>
                    <li>Audio content and exercises</li>
                    <li>Journaling tools</li>
                    <li>Urge management techniques</li>
                    <li>Progress tracking</li>
                </ul>

                <div className="p-8 bg-foreground/[0.03] border border-foreground/5 rounded-2xl space-y-4">
                    <h3 className="text-xl font-medium text-foreground">What We Do Not Provide</h3>
                    <p>Recovery Compass is <span className="font-bold text-foreground">not</span> a medical device and does not provide:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Medical advice, diagnosis, or treatment</li>
                        <li>Clinical supervision or therapy</li>
                        <li>Real-time monitoring of user behaviour</li>
                        <li>Management or treatment of withdrawal symptoms</li>
                    </ul>
                    <p>
                        The information and tools provided are for educational and wellness support purposes only. Use of the Platform does not create a therapist-client or medical relationship.
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">No Guaranteed Outcomes</h3>
                    <p>
                        Individual results vary based on personal effort, consistency, and circumstances. Recovery Compass does not guarantee cessation of smoking or any specific outcomes. The Platform&apos;s benefits depend on your participation and engagement.
                    </p>
                </div>
            </motion.section>

            <motion.section
                className="space-y-6"
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">5. User Responsibilities</h2>

                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">Eligibility</h3>
                    <p>The Platform is intended for users aged 18 and above.</p>
                </div>

                <div className="p-8 bg-red-500/[0.03] border border-red-500/10 rounded-2xl space-y-4">
                    <h3 className="text-xl font-medium text-red-900/80">Health Disclaimer</h3>
                    <p>You acknowledge that:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>You are solely responsible for your physical and mental health decisions while using the Platform</li>
                        <li>If you have medical conditions, including substance dependence or withdrawal-related complications, you should consult a qualified healthcare professional before making changes</li>
                        <li>Behavioural change may cause emotional discomfort; emotional shifts may occur during habit change</li>
                        <li>Participation in all programmes is voluntary and at your own discretion and risk</li>
                    </ul>
                    <p className="font-medium text-red-900/90">
                        Users experiencing medical or mental health emergencies should contact appropriate emergency services immediately.
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">Account Security</h3>
                    <p>You are responsible for:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Maintaining confidentiality of your login credentials</li>
                        <li>Ensuring your device meets minimum technical requirements</li>
                        <li>Securing your own devices</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">Programme Usage</h3>
                    <p>
                        The programmes are designed to be followed sequentially for intended effectiveness. You acknowledge that altering, skipping, or modifying structured guidance may reduce effectiveness.
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">Prohibited Conduct</h3>
                    <p>You may not:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Use the Platform for any unlawful, fraudulent, or harmful purpose</li>
                        <li>Use the Platform to promote harmful behaviours, harassment, or illegal substance use</li>
                        <li>Perform automated extraction, scraping, or copying of Platform content</li>
                        <li>Resell, sublicense, distribute, or commercially exploit any content</li>
                        <li>Use bots or automation to access the Platform</li>
                        <li>Attempt to bypass subscription systems</li>
                        <li>Share subscriptions (subscriptions are for individual use only)</li>
                    </ul>
                </div>
            </motion.section>

            <motion.section
                className="space-y-6"
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">6. Refunds & Cancellations</h2>

                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">General Policy</h3>
                    <p>
                        By subscribing, you acknowledge that you are purchasing access to digital content and services delivered electronically, and that access begins immediately upon confirmation of purchase.
                    </p>
                    <p>
                        As the Platform provides digital content accessible immediately upon subscription, refunds are generally not available once access has been granted, except where required under applicable Indian law.
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">Refund Eligibility</h3>
                    <p>Refunds will <span className="font-bold">not</span> be granted for:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Change of mind after access to digital content has been provided</li>
                        <li>Failure to follow structured programme guidance</li>
                        <li>Failure to engage with the programme</li>
                        <li>Partial use of subscription features (no prorated refunds)</li>
                        <li>Consumption of a substantial portion of programme content</li>
                    </ul>
                    <p>
                        Refund requests based on dissatisfaction resulting from failure to follow the recommended usage procedures may not be eligible, except where required by applicable law.
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">Platform-Specific Refunds</h3>
                    <p>
                        Refunds are handled according to the policies of the platform through which the subscription was purchased (Apple App Store, Google Play Store, or direct payment provider).
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">Cancellation</h3>
                    <p>
                        You may cancel your subscription at any time through your Apple ID or Google Play account settings. Cancellation will take effect at the end of your current billing period.
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">Payment Disputes</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Users must contact our support before initiating payment disputes</li>
                        <li>Unauthorized chargebacks may result in suspension of access pending investigation</li>
                    </ul>
                </div>
            </motion.section>

            <motion.section
                className="space-y-6"
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">7. User Content & Data</h2>
                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">Journal Entries</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>You retain ownership of your journal entries and personal reflections</li>
                        <li>You grant the Platform permission to process entries for service delivery</li>
                        <li>Journal entries are not actively monitored unless required by law</li>
                    </ul>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">Feedback</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Feedback provided may be used for product improvement</li>
                        <li>We may use anonymized testimonials with your consent</li>
                    </ul>
                </div>
            </motion.section>

            <motion.section
                className="space-y-6"
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">8. Automated Features & AI</h2>
                <p>Certain features may use automated logic or AI-generated responses. You acknowledge that:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Not all responses are reviewed by human professionals</li>
                    <li>Automated outputs are informational and not professional advice</li>
                    <li>Any AI-generated responses are for guidance and informational purposes only</li>
                </ul>
            </motion.section>

            <motion.section
                className="space-y-6"
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">9. Intellectual Property</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Recovery Compass name, logo, and branding elements are protected intellectual property</li>
                    <li>All programme materials, audio scripts, and digital tools remain company property</li>
                    <li>No content ownership transfers through subscription; you receive access only during your active subscription period</li>
                </ul>
            </motion.section>

            <motion.section
                className="space-y-6"
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">10. Service Availability & Changes</h2>
                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">Availability</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>We do not guarantee uninterrupted access and may perform maintenance periodically</li>
                        <li>The Platform may rely on third-party services (hosting, analytics, payment processors); we are not responsible for failures caused by third-party services</li>
                        <li>Certain features may be released as beta with limited functionality</li>
                        <li>Access may be limited in certain jurisdictions</li>
                    </ul>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">Changes</h3>
                    <p>We reserve the right to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Modify, suspend, or discontinue any feature or programme at our discretion</li>
                        <li>Modify programme structure based on research, feedback, or improvements</li>
                        <li>Discontinue features without prior notice</li>
                    </ul>
                    <p>No guarantee of permanent access to specific features is provided.</p>
                </div>
            </motion.section>

            <motion.section
                className="space-y-6"
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">11. Account Termination</h2>
                <p>We may terminate or suspend your account:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>For violations of these Terms, without prior notice</li>
                    <li>For abusive, threatening, or inappropriate conduct (immediate termination)</li>
                    <li>For fraudulent payment activity (permanent ban)</li>
                </ul>
                <p>
                    In the event of account termination initiated by Recovery Compass, you will be notified where reasonably possible. Refunds and data deletion will be handled in accordance with applicable law.
                </p>
            </motion.section>

            <motion.section
                className="space-y-6"
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">12. Limitation of Liability</h2>
                <p>To the maximum extent permitted under applicable law:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Recovery Compass shall not be liable for indirect, incidental, special, consequential, or punitive damages arising from use of the Platform</li>
                    <li>Our total liability shall not exceed the total subscription fees paid by you in the preceding 12 months</li>
                    <li>We are not liable for failure to perform due to events beyond our control (natural disasters, internet outages, etc.)</li>
                </ul>
                <p>We implement reasonable security safeguards but cannot guarantee absolute security.</p>
            </motion.section>

            <motion.section
                className="space-y-6"
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">13. Indemnification</h2>
                <p>
                    You agree to indemnify and hold harmless Recovery Compass from claims arising from your misuse of the Platform.
                </p>
            </motion.section>

            <motion.section
                className="space-y-6"
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">14. Third-Party Platforms</h2>
                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">Apple</h3>
                    <p>Apple is not responsible for addressing any claims relating to the App, including but not limited to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Product liability claims</li>
                        <li>Any claim that the App fails to conform to applicable legal requirements</li>
                        <li>Consumer protection claims</li>
                        <li>Intellectual property infringement claims</li>
                    </ul>
                    <p>Apple and its subsidiaries are third-party beneficiaries of these Terms and may enforce them.</p>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">Google</h3>
                    <p>Google Play&apos;s terms and refund policies apply to subscriptions made through Google Play.</p>
                </div>
            </motion.section>

            <motion.section
                className="space-y-6"
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">15. Communications</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>You may receive service-related emails</li>
                    <li>Marketing emails require explicit opt-in</li>
                </ul>
            </motion.section>

            <motion.section
                className="space-y-6"
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">16. Governing Law & Disputes</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>These Terms are governed by the laws of India</li>
                    <li>Any disputes shall be subject to the exclusive jurisdiction of courts located in Bangalore, India</li>
                    <li>Disputes may be resolved through arbitration where permitted by law</li>
                    <li>You agree to resolve disputes individually</li>
                </ul>
            </motion.section>

            <motion.section
                className="space-y-6"
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">17. Business Transfers</h2>
                <p>
                    In the event of acquisition or merger, user data and services may transfer to the new entity.
                </p>
            </motion.section>

            <motion.section
                className="space-y-6"
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">18. Severability</h2>
                <p>
                    If any provision of these Terms is found invalid, the remainder of the Terms remain enforceable.
                </p>
            </motion.section>

            <motion.section
                className="space-y-6"
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">19. Entire Agreement</h2>
                <p>
                    These Terms constitute the entire agreement between you and Recovery Compass regarding your use of the Platform.
                </p>
            </motion.section>

            <motion.section
                className="space-y-6"
                variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">20. Contact Us</h2>
                <p>For questions, support, or concerns regarding these Terms, please contact us at:</p>
                <p><span className="font-bold">Email:</span> support@recoverycompass.co</p>
            </motion.section>

            <div className="h-px w-full bg-foreground/10 mt-12 mb-8" />
            <p className="text-center text-sm text-foreground/50 italic">
                By using Recovery Compass, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
            </p>
        </motion.div>
    );
}
