"use client";

import { motion } from "framer-motion";

const sectionVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

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
            staggerChildren: 0.08,
          },
        },
      }}
    >
      <motion.section variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <p className="text-sm text-foreground/50 mb-4 font-sans">Last Updated: May 2026</p>
        <h1 className="font-erode text-4xl md:text-5xl font-semibold text-foreground mb-8 tracking-tighter">
          Privacy Policy
        </h1>
        <div className="h-px w-full bg-foreground/10 mb-12" />
        <p className="italic mb-6">Please read this Privacy Policy carefully.</p>
        <p className="mb-4">
          Recovery Compass (&quot;Recovery Compass&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) provides a mobile app,
          website, and related services that support habit change, sleep, energy, daily wellness routines,
          journaling, purchases, entitlements, and questionnaire-based services.
        </p>
        <p>
          This policy explains what data we collect, how we use it, which service providers help us run the
          product, and what choices you have.
        </p>
      </motion.section>

      <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h2 className="font-erode text-2xl font-semibold text-foreground">1. Company Information</h2>
        <div className="space-y-4">
          <p>Recovery Compass is operated by:</p>
          <p className="font-bold">Recovery Compass LLP</p>
          <p>Registered in India</p>
          <div className="space-y-1">
            <p className="font-bold">Registered Office:</p>
            <blockquote className="border-l-2 border-foreground/10 pl-4 italic text-foreground/70">
              292-94, 3rd Main, 5th Cross
              <br />
              New Thippasandra
              <br />
              Bangalore 560075
              <br />
              India
            </blockquote>
          </div>
          <p>
            <span className="font-bold">Email:</span> support@recoverycompass.co
          </p>
        </div>
      </motion.section>

      <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h2 className="font-erode text-2xl font-semibold text-foreground">2. Scope of This Policy</h2>
        <div className="space-y-4">
          <p>This Privacy Policy applies to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>the Recovery Compass mobile app</li>
            <li>the Recovery Compass website</li>
            <li>our account, purchase, subscription, support, and email flows</li>
            <li>our educational citations and legal pages</li>
          </ul>
          <p>
            Your use of the Services is also governed by our <span className="font-medium text-foreground">Terms &amp; Conditions</span>.
          </p>
        </div>
      </motion.section>

      <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h2 className="font-erode text-2xl font-semibold text-foreground">3. Data We Collect</h2>
        <div className="space-y-4">
          <p>Depending on how you use the Services, we may collect:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>account data such as email address, display name, login provider, and optional phone number</li>
            <li>optional profile image uploads</li>
            <li>onboarding and questionnaire answers</li>
            <li>recommended program or journey selections generated from your responses</li>
            <li>program progress, completion state, and active program preferences</li>
            <li>journal entries, reflections, moods, cravings, physical symptoms, and related check-in data</li>
            <li>step-count and movement data if you enable Motion &amp; Fitness or Health Connect features</li>
            <li>notification preferences, push opt-in state, and push token identifiers</li>
            <li>subscription, entitlement, and purchase state, including store product identifiers and RevenueCat customer identifiers</li>
            <li>diet-plan questionnaire responses, fulfilment status, and claim or recovery link metadata for supported website flows</li>
            <li>in-app analytics events such as card progress, day progress, notification taps, and related product usage events</li>
            <li>client-side error and diagnostic reports linked to your account when you are signed in</li>
            <li>support messages, enquiry submissions, and operational email records</li>
            <li>website checkout information for web purchases, including order and payment verification details</li>
          </ul>
          <p>We do not store your Apple, Google, card, or bank passwords.</p>
        </div>
      </motion.section>

      <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h2 className="font-erode text-2xl font-semibold text-foreground">4. How We Collect Data</h2>
        <div className="space-y-4">
          <p>We collect data when you:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>create an account or sign in with email, Google, or Apple</li>
            <li>complete onboarding, questionnaires, and journal prompts</li>
            <li>use program content, reminders, and progress features</li>
            <li>enable profile photo upload, notifications, or step tracking</li>
            <li>purchase a program or add-on through the app stores or the website</li>
            <li>complete a diet-plan questionnaire or resume a diet-plan order through a claim link</li>
            <li>contact us through support or enquiry forms</li>
          </ul>
          <p>
            Authentication and primary app data storage are handled through <span className="font-medium text-foreground">Supabase</span>.
          </p>
        </div>
      </motion.section>

      <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h2 className="font-erode text-2xl font-semibold text-foreground">5. Automatically Collected Technical Data</h2>
        <div className="space-y-4">
          <p>We may automatically collect technical information such as:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>device type, operating system, app version, and browser details</li>
            <li>IP address and basic request metadata</li>
            <li>session and authentication state needed to keep you signed in</li>
            <li>website performance and usage telemetry used to improve reliability</li>
            <li>in-app event telemetry and error diagnostics used to improve stability, performance, and support</li>
            <li>server-side logs for security, fraud prevention, debugging, and webhook processing</li>
          </ul>
        </div>
      </motion.section>

      <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h2 className="font-erode text-2xl font-semibold text-foreground">6. Permissions and Sensitive Features</h2>
        <div className="space-y-4">
          <p>The app may request access to selected device capabilities:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><span className="font-medium text-foreground">Photos</span> to let you choose a profile image</li>
            <li><span className="font-medium text-foreground">Notifications</span> to deliver reminders if you opt in</li>
            <li><span className="font-medium text-foreground">Motion &amp; Fitness / Health Connect step data</span> to show daily movement progress if you enable step tracking</li>
          </ul>
          <p>
            We do not request camera access for core app use, and microphone access is disabled in the current build.
          </p>
          <p>
            Some in-program screens may also use device-level privacy protection, such as restricting screenshots
            or obscuring app previews, to reduce accidental exposure of sensitive wellness content.
          </p>
        </div>
      </motion.section>

      <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h2 className="font-erode text-2xl font-semibold text-foreground">7. Purchases and Payment Information</h2>
        <div className="space-y-4">
          <p>Program purchases, add-ons, subscriptions if offered, and supported website checkouts may be processed through:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Apple App Store</li>
            <li>Google Play Store</li>
            <li>Razorpay for website purchases</li>
          </ul>
          <p>
            Purchase validation, entitlement syncing, and restore flows may be handled through <span className="font-medium text-foreground">RevenueCat</span>.
          </p>
          <div className="p-6 bg-foreground/[0.03] border border-foreground/5 rounded-2xl">
            <p className="font-bold mb-2">We do not store:</p>
            <ul className="flex flex-wrap gap-x-6 text-sm text-foreground/60">
              <li>• full card numbers</li>
              <li>• bank credentials</li>
              <li>• App Store or Google Play passwords</li>
            </ul>
          </div>
        </div>
      </motion.section>

      <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h2 className="font-erode text-2xl font-semibold text-foreground">8. How We Use Data</h2>
        <div className="space-y-4">
          <p>We use data to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>create and manage your account</li>
            <li>deliver onboarding, program access, journal history, and progress features</li>
            <li>generate recommendations and personalize your experience</li>
            <li>restore purchases and validate subscription or entitlement access</li>
            <li>fulfil diet-plan orders, generate related outputs, and deliver fulfilment emails or claim links</li>
            <li>send service-related emails and reminders</li>
            <li>provide support and respond to deletion requests</li>
            <li>detect abuse, prevent fraud, and secure the platform</li>
            <li>improve product quality, stability, and operational visibility</li>
            <li>comply with legal obligations</li>
          </ul>
          <p className="font-bold">We do not sell your personal data.</p>
        </div>
      </motion.section>

      <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h2 className="font-erode text-2xl font-semibold text-foreground">9. Service Providers and Data Sharing</h2>
        <div className="space-y-4">
          <p>We share data only as needed to run the Services, including with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><span className="font-medium text-foreground">Supabase</span> for authentication, database, storage, and server-side functions</li>
            <li><span className="font-medium text-foreground">RevenueCat</span> for purchase restoration, subscription, and entitlement management</li>
            <li><span className="font-medium text-foreground">Apple and Google</span> for in-app purchase processing</li>
            <li><span className="font-medium text-foreground">Razorpay</span> for website payment processing</li>
            <li><span className="font-medium text-foreground">Resend</span> for transactional email delivery</li>
            <li><span className="font-medium text-foreground">Vercel</span> for website hosting and performance telemetry</li>
            <li><span className="font-medium text-foreground">Google or Anthropic</span> for diet-plan generation workflows when enabled</li>
            <li>law enforcement or regulators where required by law</li>
          </ul>
          <p>We do not rent or broker personal data.</p>
        </div>
      </motion.section>

      <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h2 className="font-erode text-2xl font-semibold text-foreground">10. Cookies, Local Storage, and Similar Technologies</h2>
        <div className="space-y-4">
          <p>On the website, we use cookies, local storage, and related technologies for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>authentication and session continuity</li>
            <li>security and fraud prevention</li>
            <li>basic functional preferences</li>
            <li>site performance measurement and operational insights</li>
          </ul>
          <p>
            You can manage cookie settings through your browser, but blocking essential cookies may affect sign-in or checkout flows.
          </p>
        </div>
      </motion.section>

      <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h2 className="font-erode text-2xl font-semibold text-foreground">11. Data Retention</h2>
        <div className="space-y-4">
          <p>We retain data for as long as needed to operate the Services, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>while your account remains active</li>
            <li>to preserve subscription, financial, fraud-prevention, and audit records where required</li>
            <li>to resolve disputes and support requests</li>
          </ul>
          <p>
            When you request deletion, we delete or de-identify data unless limited retention is required for legal, billing, security, or fraud-prevention purposes.
          </p>
        </div>
      </motion.section>

      <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h2 className="font-erode text-2xl font-semibold text-foreground">12. Your Rights and Choices</h2>
        <div className="space-y-4">
          <p>Subject to applicable law, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>access your personal data</li>
            <li>request correction of inaccurate information</li>
            <li>request deletion of your account and associated data</li>
            <li>withdraw consent for optional permissions such as notifications, photos, or step tracking</li>
            <li>raise a support or privacy complaint</li>
          </ul>
          <p>
            You can manage some permissions directly through your device settings. You can also contact <span className="font-medium text-foreground">support@recoverycompass.co</span>.
          </p>
        </div>
      </motion.section>

      <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h2 className="font-erode text-2xl font-semibold text-foreground">13. Account Deletion</h2>
        <div className="space-y-4">
          <p>You can request deletion in either of these ways:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>inside the app through Account → Settings → Permanently Delete Account</li>
            <li>through our public deletion instructions page at <span className="font-medium text-foreground">/delete-account</span></li>
          </ul>
          <p>
            If you cannot access the app, email <span className="font-medium text-foreground">support@recoverycompass.co</span> from the email address linked to your account.
          </p>
        </div>
      </motion.section>

      <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h2 className="font-erode text-2xl font-semibold text-foreground">14. Security</h2>
        <div className="space-y-4">
          <p>We use reasonable technical and organizational safeguards, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>HTTPS/TLS for data in transit</li>
            <li>authenticated access controls</li>
            <li>role-based backend access</li>
            <li>managed cloud infrastructure and secure storage controls</li>
          </ul>
          <p className="text-sm italic">
            No system can guarantee absolute security, so you should also protect your device and account credentials.
          </p>
        </div>
      </motion.section>

      <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h2 className="font-erode text-2xl font-semibold text-foreground">15. International Transfers</h2>
        <div className="space-y-4">
          <p>
            Some of our service providers may process data outside your state or country. Where this happens, we rely on the provider’s standard protections and contractual safeguards as applicable.
          </p>
        </div>
      </motion.section>

      <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h2 className="font-erode text-2xl font-semibold text-foreground">16. Children&apos;s Privacy</h2>
        <div className="space-y-4">
          <p>Recovery Compass is intended for adults and is not designed for children under 18.</p>
          <p>
            If we learn that we have collected personal data from a child in violation of applicable law, we will delete that data promptly.
          </p>
        </div>
      </motion.section>

      <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h2 className="font-erode text-2xl font-semibold text-foreground">17. Health and Wellness Content</h2>
        <div className="space-y-4">
          <p>
            Recovery Compass provides educational and wellness-oriented content. It is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <p>
            If you have a medical condition, urgent symptoms, or a health emergency, consult a qualified healthcare professional or emergency services.
          </p>
        </div>
      </motion.section>

      <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h2 className="font-erode text-2xl font-semibold text-foreground">18. Public Sharing</h2>
        <div className="space-y-4">
          <p>
            The current Services do not include a public social feed or public journal-posting feature. If we add public sharing features in the future, we will update this policy and the related in-app disclosures.
          </p>
        </div>
      </motion.section>

      <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h2 className="font-erode text-2xl font-semibold text-foreground">19. Updates to This Policy</h2>
        <div className="space-y-4">
          <p>
            We may update this Privacy Policy from time to time. When we do, we will post the updated version on our website and may also surface updated disclosures in the app where appropriate.
          </p>
        </div>
      </motion.section>

      <motion.section className="space-y-6" variants={sectionVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h2 className="font-erode text-2xl font-semibold text-foreground">20. Contact Information</h2>
        <div className="space-y-4">
          <p>For questions about this Privacy Policy or your data:</p>
          <p>
            <span className="font-bold">Email:</span> support@recoverycompass.co
          </p>
        </div>
      </motion.section>

      <div className="h-px w-full bg-foreground/10 mt-12 mb-8" />
      <p className="text-center text-sm text-foreground/50 italic">
        By using Recovery Compass, you acknowledge that you have read and understood this Privacy Policy.
      </p>
    </motion.div>
  );
}
