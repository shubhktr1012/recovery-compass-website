"use client";

import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// Citations data — replace placeholder entries with real content when provided
// ─────────────────────────────────────────────────────────────────────────────

type Citation = {
    title: string;
    url: string;
};

type CitationGroup = {
    heading: string;
    citations: Citation[];
};

const CITATION_GROUPS: CitationGroup[] = [
    {
        heading: "Smoking Cessation & Nicotine Addiction",
        citations: [
            {
                title: "World Health Organization (WHO) – Tobacco Fact Sheet",
                url: "https://www.who.int/news-room/fact-sheets/detail/tobacco",
            },
            {
                title: "Centers for Disease Control and Prevention (CDC) – About Tobacco",
                url: "https://www.cdc.gov/tobacco/about/index.html",
            },
            {
                title: "Centers for Disease Control and Prevention (CDC) – Benefits of Quitting",
                url: "https://www.cdc.gov/tobacco/about/benefits-of-quitting.html",
            },
            {
                title: "National Health Service (NHS) – Stop Smoking Support and Services",
                url: "https://www.nhs.uk/live-well/quit-smoking/nhs-stop-smoking-services-help-you-quit/",
            },
            {
                title: "Mayo Clinic – Nicotine Dependence: Symptoms and Causes",
                url: "https://www.mayoclinic.org/diseases-conditions/nicotine-dependence/symptoms-causes/syc-20351584",
            },
            {
                title: "Mayo Clinic – Coping with Nicotine Cravings",
                url: "https://www.mayoclinic.org/diseases-conditions/nicotine-dependence/in-depth/nicotine-craving/art-20045454",
            },
            {
                title: "Journal of Addiction Research – Craving and Urge Management in Addiction Behaviour",
                url: "https://www.addictionresearch.com",
            },
        ],
    },
    {
        heading: "Male Sexual Health & Pelvic Floor Training",
        citations: [
            {
                title: "Mayo Clinic – Pelvic Floor Muscle Exercises",
                url: "https://www.mayoclinic.org",
            },
            {
                title: "Cleveland Clinic – Pelvic Floor Exercises: Benefits for Sexual Function",
                url: "https://my.clevelandclinic.org",
            },
            {
                title: "National Health Service (NHS) – Pelvic Floor Exercises for Men",
                url: "https://www.nhs.uk",
            },
            {
                title: "International Society for Sexual Medicine (ISSM) – Pelvic Floor Exercises and Erectile Function",
                url: "https://www.issm.info",
            },
            {
                title: "European Association of Urology – Pelvic Floor Training in ED Management Guidelines",
                url: "https://www.uroweb.org",
            },
        ],
    },
    {
        heading: "Exercise, Circulation & Cardiovascular Health",
        citations: [
            {
                title: "Harvard Medical School – Physical Activity and Sexual Health",
                url: "https://www.health.harvard.edu",
            },
            {
                title: "American Heart Association – Walking and Vascular Function",
                url: "https://www.heart.org",
            },
        ],
    },
    {
        heading: "Stress Reduction & Breathing Techniques",
        citations: [
            {
                title: "American Psychological Association – Breathing Exercises and Stress Control",
                url: "https://www.apa.org",
            },
            {
                title: "Cleveland Clinic – Relaxation Techniques and the Nervous System",
                url: "https://my.clevelandclinic.org",
            },
            {
                title: "National Institutes of Health (NIH) – Balanced Muscle Training and Recovery",
                url: "https://www.nih.gov",
            },
        ],
    },
    {
        heading: "Sleep Hygiene & Circadian Health",
        citations: [
            {
                title: "National Institute on Aging (NIH) – A Good Night's Sleep",
                url: "https://www.nia.nih.gov/health/sleep/good-nights-sleep",
            },
            {
                title: "Mayo Clinic – Sleep Hygiene: 6 Tips for Better Sleep",
                url: "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/sleep/art-20048379",
            },
            {
                title: "National Sleep Foundation – Sleep Hygiene and Tips",
                url: "https://www.thensf.org/sleep-tips/",
            },
        ],
    },
    {
        heading: "Nutrition, Energy & Fatigue Management",
        citations: [
            {
                title: "Harvard Health Publishing – 9 Tips to Boost Your Energy — Naturally",
                url: "https://www.health.harvard.edu/energy-and-fatigue/9-tips-to-boost-your-energy-naturally",
            },
            {
                title: "Cleveland Clinic – How to Boost Your Energy Levels",
                url: "https://health.clevelandclinic.org/how-to-boost-your-energy-levels/",
            },
            {
                title: "National Health Service (NHS) – Self-help Tips to Fight Fatigue",
                url: "https://www.nhs.uk/live-well/sleep-and-tiredness/self-help-tips-to-fight-fatigue/",
            },
        ],
    },
    {
        heading: "Longevity & Healthy Aging Lifestyle",
        citations: [
            {
                title: "National Institute on Aging (NIH) – Healthy Aging Resource Center",
                url: "https://www.nia.nih.gov/health/healthy-aging",
            },
            {
                title: "Harvard Medical School – Longevity: Lifestyle Strategies for a Healthy, Long Life",
                url: "https://www.health.harvard.edu/topics/longevity",
            },
            {
                title: "American Academy of Dermatology (AAD) – Anti-Aging Skin Care",
                url: "https://www.aad.org/public/everyday-care/skin-care-basics/ant-aging",
            },
        ],
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// Section animation variants (matches terms-content.tsx / privacy-content.tsx)
// ─────────────────────────────────────────────────────────────────────────────

const sectionVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function CitationsContent() {
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
            {/* Header */}
            <motion.section
                variants={sectionVariants}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <p className="text-sm text-foreground/50 mb-4 font-sans">Last Updated: April 2026</p>
                <h1 className="font-erode text-4xl md:text-5xl font-semibold text-foreground mb-8 tracking-tighter">
                    Citations &amp; Disclaimer
                </h1>
                <div className="h-px w-full bg-foreground/10 mb-12" />
            </motion.section>

            {/* Disclaimer */}
            <motion.section
                className="space-y-6"
                variants={sectionVariants}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="p-8 bg-foreground/[0.03] border border-foreground/5 rounded-2xl space-y-4">
                    <h2 className="font-erode text-2xl font-semibold text-foreground">Disclaimer</h2>
                    <p>
                        The content provided by Recovery Compass, including programme materials, audio guides, and written resources, is for <span className="font-medium text-foreground">educational and informational purposes only</span>. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
                    </p>
                    <p>
                        Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay seeking it because of information provided through this platform.
                    </p>
                    <p>
                        Recovery Compass does not claim to cure, treat, or prevent any disease or medical condition. Individual results may vary based on personal effort, consistency, and circumstances.
                    </p>
                </div>
            </motion.section>

            {/* About Our Sources */}
            <motion.section
                className="space-y-6"
                variants={sectionVariants}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">About Our Sources</h2>
                <p>
                    Recovery Compass draws on peer-reviewed research, clinical guidelines, and established wellness frameworks to inform the design of its programmes and content. Below you will find grouped references to the sources that support our approach.
                </p>
            </motion.section>

            {/* Citation Groups */}
            {CITATION_GROUPS.length > 0 ? (
                CITATION_GROUPS.map((group, groupIndex) => (
                    <motion.section
                        key={groupIndex}
                        className="space-y-6"
                        variants={sectionVariants}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="font-erode text-2xl font-semibold text-foreground">
                            {group.heading}
                        </h2>
                        <ol className="list-decimal pl-6 space-y-4">
                            {group.citations.map((citation, citationIndex) => (
                                <li key={citationIndex}>
                                    <a
                                        href={citation.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-foreground hover:underline underline-offset-4 transition-colors"
                                    >
                                        {citation.title}
                                    </a>
                                    <span className="block text-sm text-foreground/40 mt-0.5 break-all">
                                        {citation.url}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </motion.section>
                ))
            ) : (
                <motion.section
                    className="space-y-6"
                    variants={sectionVariants}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="p-8 bg-foreground/[0.03] border border-foreground/5 rounded-2xl text-center">
                        <p className="text-foreground/50 italic">
                            Citations and source references will be added here.
                        </p>
                    </div>
                </motion.section>
            )}

            {/* Contact */}
            <motion.section
                className="space-y-6"
                variants={sectionVariants}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="font-erode text-2xl font-semibold text-foreground">Questions About Our Sources</h2>
                <p>
                    If you have questions about the research behind our programmes or would like to request additional references, please contact us at:
                </p>
                <p><span className="font-bold">Email:</span> support@recoverycompass.co</p>
            </motion.section>

            <div className="h-px w-full bg-foreground/10 mt-12 mb-8" />
            <p className="text-center text-sm text-foreground/50 italic">
                This page is maintained as part of our commitment to transparency and evidence-informed wellness practices.
            </p>
        </motion.div>
    );
}
