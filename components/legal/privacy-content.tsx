"use client";

import { motion } from "framer-motion";

export function PrivacyContent() {
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
                    Privacy Policy
                </h1>
                <div className="h-px w-full bg-foreground/10 mb-12" />
                <p className="italic mb-6">Please read this Privacy Policy carefully.</p>
                <p className="mb-4">
                    Recovery Compass ("Recovery Compass", "we", "us", or "our") is committed to protecting your privacy and carefully managing your personal data.
                </p>
                <p>
                    By accessing or using the Recovery Compass mobile application, website, or related services (collectively, the "Services"), you agree to this Privacy Policy. If you do not agree, please do not use the Services.
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
                <h2 className="font-erode text-2xl font-semibold text-foreground">1. Company Information</h2>
                <div className="space-y-4">
                    <p>Recovery Compass is operated by:</p>
                    <p className="font-bold">Recovery Compass LLP</p>
                    <p>Registered in India</p>
                    <div className="space-y-1">
                        <p className="font-bold">Registered Office:</p>
                        <blockquote className="border-l-2 border-foreground/10 pl-4 italic text-foreground/70">
                            292-94, 3rd Main, 5th Cross<br />
                            New Thippasandra<br />
                            Bangalore 560075<br />
                            India
                        </blockquote>
                    </div>
                    <p><span className="font-bold">Email:</span> support@recoverycompass.co</p>
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
                <h2 className="font-erode text-2xl font-semibold text-foreground">2. Scope of This Policy</h2>
                <div className="space-y-4">
                    <p>This Privacy Policy applies to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Recovery Compass mobile application</li>
                        <li>Recovery Compass website</li>
                        <li>Subscription services</li>
                        <li>Customer support interactions</li>
                    </ul>
                    <p>Your use of the Services is also governed by our <span className="font-medium text-foreground">Terms & Conditions</span>.</p>
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
                <h2 className="font-erode text-2xl font-semibold text-foreground">3. Personal Information We Collect</h2>
                <div className="space-y-4">
                    <p>"Personal Information" means any information that can identify you directly or indirectly, including:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Name</li>
                        <li>Email address</li>
                        <li>Phone number (if used for login)</li>
                        <li>Profile image (optional)</li>
                        <li>Account credentials</li>
                        <li>Journal entries and reflections</li>
                        <li>Programme usage data (e.g., urge check-ins, stress levels)</li>
                    </ul>
                    <p>We only collect the minimum information necessary to provide our Services.</p>
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
                <h2 className="font-erode text-2xl font-semibold text-foreground">4. How We Collect Information</h2>
                <div className="space-y-4">
                    <p>We collect information when you:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Register for an account</li>
                        <li>Use the app features</li>
                        <li>Subscribe to a programme</li>
                        <li>Contact customer support</li>
                        <li>Use social login (e.g., Google login)</li>
                    </ul>
                    <p>
                        Authentication and account management are processed securely via <span className="font-medium text-foreground">Supabase</span>. We do not store your third-party passwords.
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
                <h2 className="font-erode text-2xl font-semibold text-foreground">5. Automatically Collected Information</h2>
                <div className="space-y-4">
                    <p>When you access the Services, we may automatically collect:</p>
                    <ul className="list-disc pl-6 space-y-2 flex flex-wrap gap-x-8 gap-y-2">
                        <li>Device type</li>
                        <li>Operating system</li>
                        <li>App version</li>
                        <li>IP address</li>
                        <li>Usage activity</li>
                        <li>Crash logs</li>
                        <li>Device identifiers</li>
                    </ul>
                    <p>This data helps improve app performance and security.</p>
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
                <h2 className="font-erode text-2xl font-semibold text-foreground">6. Subscription & Payment Information</h2>
                <div className="space-y-4">
                    <p>Subscriptions are processed through:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Apple App Store</li>
                        <li>Google Play Store</li>
                    </ul>
                    <p>Revenue management and subscription validation are handled via <span className="font-medium text-foreground">RevenueCat</span>.</p>
                    <div className="p-6 bg-foreground/[0.03] border border-foreground/5 rounded-2xl">
                        <p className="font-bold mb-2">We do not store:</p>
                        <ul className="flex flex-wrap gap-x-6 text-sm text-foreground/60">
                            <li>• Credit card details</li>
                            <li>• Debit card details</li>
                            <li>• Full payment information</li>
                        </ul>
                    </div>
                    <p className="text-sm">All billing is managed by Apple and Google under their respective policies.</p>
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
                <h2 className="font-erode text-2xl font-semibold text-foreground">7. How We Use Your Information</h2>
                <div className="space-y-4">
                    <p>We use Personal Information to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Provide access to programmes</li>
                        <li>Deliver subscription services</li>
                        <li>Personalize your experience</li>
                        <li>Improve app features</li>
                        <li>Provide customer support</li>
                        <li>Send service-related updates</li>
                        <li>Prevent fraud and misuse</li>
                        <li>Comply with legal obligations</li>
                    </ul>
                    <p className="font-bold">We do not sell your Personal Information.</p>
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
                <h2 className="font-erode text-2xl font-semibold text-foreground">8. Data Storage & Security</h2>
                <div className="space-y-4">
                    <p>Recovery Compass uses <span className="font-medium text-foreground">Supabase</span> for secure cloud hosting and database services.</p>
                    <p>We rely on industry-standard safeguards, including:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Encrypted data transmission (HTTPS/TLS)</li>
                        <li>Secure authentication systems</li>
                        <li>Role-based access control</li>
                        <li>Encrypted database storage</li>
                    </ul>
                    <p className="text-sm italic">
                        However, no digital platform can guarantee absolute security. You are responsible for maintaining the security of your login credentials and device.
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
                <h2 className="font-erode text-2xl font-semibold text-foreground">9. Data Retention</h2>
                <div className="space-y-4">
                    <p>We retain Personal Information:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>While your account remains active</li>
                        <li>As required for legal compliance</li>
                        <li>For resolving disputes</li>
                    </ul>
                    <p>
                        You may request deletion of your account at any time by contacting: <span className="font-medium text-foreground">support@recoverycompass.co</span>
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
                <h2 className="font-erode text-2xl font-semibold text-foreground">10. Your Rights (India — DPDP Act 2023)</h2>
                <div className="space-y-4">
                    <p>Under applicable Indian law, you have the right to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Access your personal data</li>
                        <li>Request correction of inaccurate data</li>
                        <li>Request deletion of personal data</li>
                        <li>Withdraw consent</li>
                        <li>Raise grievances</li>
                    </ul>
                    <p>To exercise your rights, contact: <span className="font-medium text-foreground">support@recoverycompass.co</span></p>
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
                <h2 className="font-erode text-2xl font-semibold text-foreground">11. Data Sharing</h2>
                <div className="space-y-4">
                    <p>We may share Personal Information with:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><span className="font-medium text-foreground">Supabase</span> — Backend hosting provider</li>
                        <li><span className="font-medium text-foreground">RevenueCat</span> — Subscription validation</li>
                        <li><span className="font-medium text-foreground">Apple & Google</span> — Payment processing</li>
                        <li>Analytics service providers</li>
                        <li>Law enforcement — If required by law</li>
                    </ul>
                    <p className="font-bold">We do not sell or rent personal data.</p>
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
                <h2 className="font-erode text-2xl font-semibold text-foreground">12. User-Generated Content</h2>
                <div className="space-y-4">
                    <p>
                        If you choose to share content publicly within the app (where applicable), such content may be visible to other users.
                    </p>
                    <p>
                        Recovery Compass is not responsible for how other users use information you voluntarily make public. Please use discretion when sharing information.
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
                <h2 className="font-erode text-2xl font-semibold text-foreground">13. Third-Party Links & Services</h2>
                <p>
                    The Services may contain links to third-party websites or services. We are not responsible for their privacy practices. Please review their privacy policies separately.
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
                <h2 className="font-erode text-2xl font-semibold text-foreground">14. Children's Privacy</h2>
                <div className="space-y-4">
                    <p>Recovery Compass is intended for individuals aged 18 years and above.</p>
                    <p>
                        We do not knowingly collect Personal Information from individuals under 18. If such information is discovered, we will delete it promptly.
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
                <h2 className="font-erode text-2xl font-semibold text-foreground">15. Business Transfers</h2>
                <p>
                    In the event of merger, acquisition, restructuring, or asset sale, Personal Information may be transferred as part of business assets.
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
                <h2 className="font-erode text-2xl font-semibold text-foreground">16. International Data Transfers</h2>
                <div className="space-y-4">
                    <p>If service providers store data outside India, appropriate safeguards are implemented.</p>
                    <p>
                        By using the Services, you consent to processing of your data in accordance with this Privacy Policy.
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
                <h2 className="font-erode text-2xl font-semibold text-foreground">17. Grievance Officer (India)</h2>
                <div className="space-y-4">
                    <p>For data-related grievances, contact:</p>
                    <div className="space-y-1">
                        <p className="font-bold">Grievance Officer</p>
                        <p><span className="font-medium text-foreground">Email:</span> support@recoverycompass.co</p>
                    </div>
                    <p className="text-sm text-foreground/50">
                        We aim to respond within reasonable timeframes as required under applicable Indian law.
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
                <h2 className="font-erode text-2xl font-semibold text-foreground">18. Opting Out & Account Deletion</h2>
                <div className="space-y-4">
                    <p>You may:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Disable notifications in device settings</li>
                        <li>Delete your account by contacting support</li>
                        <li>Withdraw consent by emailing support@recoverycompass.co</li>
                    </ul>
                    <p className="text-sm italic">Certain data may be retained where legally required.</p>
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
                <h2 className="font-erode text-2xl font-semibold text-foreground">19. Updates to This Privacy Policy</h2>
                <div className="space-y-4">
                    <p>
                        We may update this Privacy Policy periodically. Updated versions will be posted within the app or website.
                    </p>
                    <p>Continued use of the Services constitutes acceptance of changes.</p>
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
                <h2 className="font-erode text-2xl font-semibold text-foreground">20. Contact Information</h2>
                <p>For questions regarding this Privacy Policy:</p>
                <p><span className="font-bold">Email:</span> support@recoverycompass.co</p>
            </motion.section>

            <div className="h-px w-full bg-foreground/10 mt-12 mb-8" />
            <p className="text-center text-sm text-foreground/50 italic">
                By using Recovery Compass, you acknowledge that you have read and understood this Privacy Policy.
            </p>
        </motion.div>
    );
}
