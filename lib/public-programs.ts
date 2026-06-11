export const PROGRAM_CATEGORIES = ["Break Habits", "Restore Balance", "Build Vitality"] as const;

export type ProgramCategory = (typeof PROGRAM_CATEGORIES)[number];

export const CANONICAL_PROGRAM_SLUGS = [
  "six_day_reset",
  "ninety_day_transform",
  "sleep_disorder_reset",
  "energy_vitality",
  "age_reversal",
  "male_sexual_health",
  "smoking_alcohol_quit",
  "gut_health_reset",
  "free_detox_reset",
] as const;

export type CanonicalProgramSlug = (typeof CANONICAL_PROGRAM_SLUGS)[number];

export const KNOWN_PROGRAM_SLUGS = CANONICAL_PROGRAM_SLUGS;

export const CHECKOUT_PROGRAM_SLUGS = [
  "sleep_disorder_reset",
  "energy_vitality",
  "age_reversal",
  "male_sexual_health",
  "smoking_alcohol_quit",
  "gut_health_reset",
] as const;

export const GRANTABLE_PROGRAM_SLUGS = [
  ...CHECKOUT_PROGRAM_SLUGS,
  "six_day_reset",
  "ninety_day_transform",
] as const;

export type ProgramHighlight = {
  label: string;
  text: string;
};

export type ProgramCardFact = {
  label: "Best for" | "Daily practice" | "Signature tool";
  value: string;
};

export type ProgramArticle = {
  subtitle: string;
  whoIsItFor: string;
  curriculumOverview: string;
  dailyRhythm: string;
};

export type ProgramAvailability = "paid_checkout" | "app_only_free" | "legacy";

type PublicProgramDefinition = {
  id: string;
  dbSlug: CanonicalProgramSlug;
  category: ProgramCategory;
  tag: string;
  title: string;
  cardDescription: string;
  article: ProgramArticle;
  days: number;
  phases: number;
  dailyTimeLabel: string;
  practiceLabel?: string;
  hasAudio: boolean;
  priceInr: number | null;
  priceLabel: string;
  cardFacts: readonly [ProgramCardFact, ProgramCardFact, ProgramCardFact];
  highlights: readonly ProgramHighlight[];
  accent: "dark" | "light";
  isDietPlan?: boolean;
  availability: ProgramAvailability;
};

export const publicPrograms = [
  {
    id: "6-day-compass-reset",
    dbSlug: "six_day_reset",
    category: "Break Habits",
    tag: "Decision & Reset",
    title: "6-Day Control",
    cardDescription:
      "Break autopilot, make smoking inconvenient and conscious, and regain control through interruption instead of perfection.",
    article: {
      subtitle: "The bridge between intention and action.",
      whoIsItFor:
        "Designed for those who feel trapped in an automatic, unconscious smoking pattern and need a structured, low-pressure way to prove to themselves that they are in control.",
      curriculumOverview:
        "Six days of progressive behavioral disruption using urge delay, trigger removal, routine changes, grounding, and reflection.",
      dailyRhythm:
        "Each day gives one clear interruption task, one trigger-level action, and one reflection so the habit becomes conscious before it becomes negotiable.",
    },
    days: 6,
    phases: 2,
    dailyTimeLabel: "10-12 min/day",
    hasAudio: false,
    priceInr: 599,
    priceLabel: "Launch price",
    cardFacts: [
      { label: "Best for", value: "Automatic smoking patterns" },
      { label: "Daily practice", value: "Urge delay, trigger removal, reflection" },
      { label: "Signature tool", value: "10-minute delay rule" },
    ],
    highlights: [
      { label: "Core Rule", text: "Delay every urge by 10 minutes" },
      { label: "Reset", text: "Throw away cigarettes, lighters, and ashtrays" },
      { label: "Disruption", text: "Change one trigger routine to break the loop" },
      { label: "Urge Protocol", text: "Grounding and light movement while the timer runs" },
    ],
    accent: "dark",
    availability: "legacy",
  },
  {
    id: "90-day-smoke-free-journey",
    dbSlug: "ninety_day_transform",
    category: "Break Habits",
    tag: "Daily Guided Modules",
    title: "90-Day Smoking Reset",
    cardDescription:
      "A 90-day reset for pattern recognition, emotional steadiness, low-pressure journaling, and long-term smoking recovery.",
    article: {
      subtitle: "Rewiring the deeply ingrained neural pathways.",
      whoIsItFor:
        "For those ready to commit to long-term behavioral change, seeking daily guidance to help stabilize their nervous system during the crucial 3-month rewiring phase.",
      curriculumOverview:
        "Daily guided modules focused on pattern recognition, resilience building, optional low-pressure journaling, and long-term stabilization.",
      dailyRhythm:
        "Each day combines a short guided practice, a pattern-awareness prompt, and a journal cue to keep the reset steady over 90 days.",
    },
    days: 90,
    phases: 4,
    dailyTimeLabel: "About 7 min/day",
    practiceLabel: "Audio-led",
    hasAudio: true,
    priceInr: 5999,
    priceLabel: "Launch price",
    cardFacts: [
      { label: "Best for", value: "Long-term smoking recovery" },
      { label: "Daily practice", value: "Guided audio, pattern awareness, journaling" },
      { label: "Signature tool", value: "90-day neural pathway reset" },
    ],
    highlights: [
      { label: "Daily Focus", text: "Notice patterns without trying to change everything at once" },
      { label: "Guided Exercise", text: "Short 2-4 minute daily practice" },
      { label: "Journal", text: "Optional prompts for reflection without pressure" },
      { label: "Long-Term Shift", text: "Pattern-level awareness, resilience, and sustained confidence" },
    ],
    accent: "light",
    availability: "legacy",
  },
  {
    id: "21-day-deep-sleep-reset",
    dbSlug: "sleep_disorder_reset",
    category: "Restore Balance",
    tag: "Reset the Body Clock",
    title: "21-Day Deep Sleep Reset",
    cardDescription:
      "A 21-day sleep protocol that rebuilds morning light, caffeine cut-off, breathing, downshift, and sleep-prep cues.",
    article: {
      subtitle: "Calming the hyperactive nervous system.",
      whoIsItFor:
        "For those caught in the frustrating cycle of waking up exhausted, feeling wired all day, and lying awake at night.",
      curriculumOverview:
        "Sunlight protocols, caffeine timing, physiological sigh techniques, evening downshifts, and guided sleep audio.",
      dailyRhythm:
        "Each day builds sleep pressure from morning light and movement, then narrows the evening toward breathing, wind-down, and sleep preparation.",
    },
    days: 21,
    phases: 3,
    dailyTimeLabel: "13-21 min/day",
    practiceLabel: "Includes sleep audio",
    hasAudio: true,
    priceInr: 2599,
    priceLabel: "Launch price",
    cardFacts: [
      { label: "Best for", value: "Wired nights and tired mornings" },
      { label: "Daily practice", value: "Morning light, caffeine cutoff, evening wind-down" },
      { label: "Signature tool", value: "Sleep pressure reset + guided sleep audio" },
    ],
    highlights: [
      { label: "Morning Signal", text: "Sunlight exposure within 30 minutes of waking" },
      { label: "Breathing", text: "Hydration plus 10 cycles of physiological sigh" },
      { label: "Sleep Pressure", text: "Light morning movement to make the body naturally tired at night" },
      { label: "Night Routine", text: "No caffeine after 2 PM and guided sleep meditation before bed" },
    ],
    accent: "dark",
    availability: "paid_checkout",
  },
  {
    id: "14-day-energy-restore",
    dbSlug: "energy_vitality",
    category: "Restore Balance",
    tag: "Energy Reset Foundations",
    title: "14-Day Energy Restore",
    cardDescription:
      "A 14-day physical rhythm reset for hydration, sunlight, cold activation, movement, pressure points, and evening reflection.",
    article: {
      subtitle: "Reclaiming your natural momentum.",
      whoIsItFor:
        "For individuals feeling chronically sluggish, dealing with mid-afternoon slumps, or struggling to find the physical motivation to accomplish daily goals.",
      curriculumOverview:
        "Hydration, light exposure, cold activation, full-body movement, pressure-point work, and evening reflection.",
      dailyRhythm:
        "Each day starts with water and light, adds manageable activation, and closes with recovery cues that make energy more predictable.",
    },
    days: 14,
    phases: 2,
    dailyTimeLabel: "13-19 min/day",
    practiceLabel: "Movement-led",
    hasAudio: false,
    priceInr: 1499,
    priceLabel: "Launch price",
    cardFacts: [
      { label: "Best for", value: "Low energy and afternoon slumps" },
      { label: "Daily practice", value: "Water, sunlight, movement, pressure points" },
      { label: "Signature tool", value: "Morning activation stack" },
    ],
    highlights: [
      { label: "Foundation", text: "500 ml water within 10 minutes of waking" },
      { label: "Circadian Reset", text: "10-15 minutes of morning sunlight" },
      { label: "Activation", text: "10 minutes of movement plus a light walk" },
      { label: "Recovery", text: "Deep breathing before bed and a fixed sleep time" },
    ],
    accent: "light",
    availability: "paid_checkout",
  },
  {
    id: "mens-vitality-reset-program",
    dbSlug: "male_sexual_health",
    category: "Build Vitality",
    tag: "Reset & Activation",
    title: "30-Day Men's Vitality Reset",
    cardDescription:
      "Break automatic habits, calm performance anxiety, and activate the muscles that support blood flow and sexual strength.",
    article: {
      subtitle: "Physical activation and psychological calm.",
      whoIsItFor:
        "Men seeking to overcome performance anxiety, break negative compulsive habits, and restore physical confidence through natural regulation.",
      curriculumOverview:
        "Pelvic strength work, glute bridges, squats, brisk walking, 4-2-6 breathing, and recovery-focused night routines.",
      dailyRhythm:
        "Each day pairs a physical activation block with a breathing reset and recovery cue, so confidence is trained through repeatable actions.",
    },
    days: 30,
    phases: 3,
    dailyTimeLabel: "12-20 min/day",
    practiceLabel: "Breathing + strength",
    hasAudio: false,
    priceInr: 4999,
    priceLabel: "Launch price",
    cardFacts: [
      { label: "Best for", value: "Performance anxiety and vitality confidence" },
      { label: "Daily practice", value: "Strength work, walking, breath regulation" },
      { label: "Signature tool", value: "4-2-6 breath + pelvic strength" },
    ],
    highlights: [
      { label: "Urge Control", text: "Use a breathing reset when the urge appears and let it pass in 5-10 minutes" },
      { label: "Performance Anxiety", text: "4-2-6 breathing to activate the relaxation response" },
      { label: "Vitality Exercise", text: "Pelvic strength, glute bridges, squats, and a brisk walk" },
      { label: "Recovery", text: "Night routine to support hormones and physical recovery" },
    ],
    accent: "dark",
    availability: "paid_checkout",
  },
  {
    id: "radiance-journey",
    dbSlug: "age_reversal",
    category: "Build Vitality",
    tag: "Rejuvenation Journey",
    title: "90-Day Biohacking Reset",
    cardDescription:
      "A 90-day longevity protocol for relaxed walking, facial activation, regulation practices, sleep prep, and recovery routines.",
    article: {
      subtitle: "Cellular renewal through rhythm and blood flow.",
      whoIsItFor:
        "For those looking to move beyond superficial skincare treatments into deep, systemic lifestyle restoration for lasting vitality and appearance.",
      curriculumOverview:
        "Relaxed walking, facial activation, nervous-system regulation, sleep preparation, and recovery routines.",
      dailyRhythm:
        "Each day combines circulation, facial work, regulation, and sleep preparation so the protocol stays physical, visible, and repeatable.",
    },
    days: 90,
    phases: 4,
    dailyTimeLabel: "25-30 min/day",
    practiceLabel: "Facial + walking routines",
    hasAudio: false,
    priceInr: 6999,
    priceLabel: "Launch price",
    cardFacts: [
      { label: "Best for", value: "Age reversal, skin tone, long-term vitality" },
      { label: "Daily practice", value: "Walking, facial activation, regulation, sleep prep" },
      { label: "Signature tool", value: "Circulation + facial routine" },
    ],
    highlights: [
      { label: "Circulation", text: "20-minute relaxed walk to improve blood flow and cellular energy" },
      { label: "Face Exercise", text: "Daily facial muscle activation to support firmness and lift" },
      { label: "Regulation", text: "Guided calming practice to relax the nervous system and lower cortisol" },
      { label: "Sleep Preparation", text: "Consistent sleep routine to support hormone balance and repair" },
    ],
    accent: "light",
    availability: "paid_checkout",
  },
  {
    id: "21-day-smoking-alcohol-quit",
    dbSlug: "smoking_alcohol_quit",
    category: "Break Habits",
    tag: "Guided Quit Journey",
    title: "21-Day Smoking & Alcohol Quit",
    cardDescription:
      "A guided quit path for smoking, alcohol, or both, with trigger mapping, urge tools, and slip recovery.",
    article: {
      subtitle: "Outlast the urge, reclaim your rhythm.",
      whoIsItFor:
        "Designed for those ready to quit smoking, alcohol, or both, seeking a structured, clinically backed path to map triggers and build physical resistance.",
      curriculumOverview:
        "Three phases covering pattern mapping, trigger disruption, Delay and Urge Surfing protocols, social pressure strategies, and slip recovery.",
      dailyRhythm:
        "Daily guided modules pairing behavioral science lessons, optional journaling, and audio-guided reflection routines.",
    },
    days: 21,
    phases: 3,
    dailyTimeLabel: "15-20 min/day",
    practiceLabel: "Audio-guided",
    hasAudio: true,
    priceInr: 5999,
    priceLabel: "Launch price",
    cardFacts: [
      { label: "Best for", value: "Smoking, alcohol, or both" },
      { label: "Daily practice", value: "Trigger mapping, guided reflection, urge tools" },
      { label: "Signature tool", value: "5-minute Delay + Urge Surfing" },
    ],
    highlights: [
      { label: "Trigger Mapping", text: "Map times, places, and emotions driving the urge" },
      { label: "Delay Protocol", text: "Outlast cravings with the evidence-backed 5-minute protocol" },
      { label: "Urge Surfing", text: "Observe and ride out physical spikes without willpower fatigue" },
      { label: "Dual Support", text: "Integrated tools for nicotine, alcohol, or both" },
    ],
    accent: "dark",
    availability: "paid_checkout",
  },
  {
    id: "21-day-gut-reset",
    dbSlug: "gut_health_reset",
    category: "Restore Balance",
    tag: "Gut-Brain Connection",
    title: "21-Day Gut Reset",
    cardDescription:
      "A structured gut-health reset with daily hydration, nervous-system, movement, and eating-rhythm practices.",
    article: {
      subtitle: "The second brain runs on rhythm.",
      whoIsItFor:
        "For anyone struggling with bloating, slow digestion, morning sluggishness, or stress-related gut tension seeking a natural, body-first reset.",
      curriculumOverview:
        "Daily physical and behavioral prompts focused on vagus nerve stimulation, mouth-gut hygiene, thermal therapy, and circadian windows.",
      dailyRhythm:
        "A 5-step morning sequence, post-meal activation, abdominal movement, and calming evening rest practices.",
    },
    days: 21,
    phases: 3,
    dailyTimeLabel: "10-15 min/day",
    practiceLabel: "Physical + breath practices",
    hasAudio: false,
    priceInr: 4999,
    priceLabel: "Launch price",
    cardFacts: [
      { label: "Best for", value: "Bloating, slow digestion, gut tension" },
      { label: "Daily practice", value: "Hydration, chewing, post-meal walks, belly work" },
      { label: "Signature tool", value: "Vagus activation + motility routine" },
    ],
    highlights: [
      { label: "Vagus Activation", text: "Morning face splash, tongue scraping, and humming" },
      { label: "Motility Support", text: "Warm compress and 10-minute post-meal walks" },
      { label: "Belly Yoga", text: "8-minute targeted sequence to release trapped gas" },
      { label: "Bacteria Clock", text: "Reset digestion timing using a 12-hour eating window" },
    ],
    accent: "light",
    availability: "paid_checkout",
  },
  {
    id: "6-day-free-detox",
    dbSlug: "free_detox_reset",
    category: "Restore Balance",
    tag: "App Starter Reset",
    title: "6-Day Free Detox",
    cardDescription:
      "A free six-day starter journey for nervous-system, hydration, movement, gut, mind, and daily-rhythm reset practices.",
    article: {
      subtitle: "Six days of small, structural signals.",
      whoIsItFor:
        "For individuals looking to experience the Recovery Compass method with a zero-cost, low-pressure introduction to daily physical habits.",
      curriculumOverview:
        "Six days of progressive, body-first habits addressing hydration, oral health, morning light, chewing mechanics, and physiological sighs.",
      dailyRhythm:
        "One simple habit added each morning and evening to build a complete, repeatable daily routine.",
    },
    days: 6,
    phases: 1,
    dailyTimeLabel: "10-15 min/day",
    practiceLabel: "Free starter",
    hasAudio: false,
    priceInr: null,
    priceLabel: "Free in the app",
    cardFacts: [
      { label: "Best for", value: "Trying Recovery Compass for free" },
      { label: "Daily practice", value: "Hydration, oral care, light, gut rhythm" },
      { label: "Signature tool", value: "6-day starter habit stack" },
    ],
    highlights: [
      { label: "Vagus Reset", text: "Vagus nerve stimulation with cold water and humming" },
      { label: "Mouth-Gut Gateway", text: "Morning oil pulling and tongue scraping" },
      { label: "Light Anchor", text: "10-minute outdoor walk to align melatonin timing" },
      { label: "Belly Warmth", text: "Chewing mechanics and warm compresses after food" },
    ],
    accent: "dark",
    availability: "app_only_free",
  },
] as const satisfies readonly PublicProgramDefinition[];

export type PublicProgram = (typeof publicPrograms)[number];
export type PublicProgramId = PublicProgram["id"];

export const WEBSITE_PROGRAM_ID_ALIASES = {
  "14-day-sleep-reset": "21-day-deep-sleep-reset",
  "21-day-energy-reset": "14-day-energy-restore",
} as const satisfies Record<string, PublicProgramId>;

export const PUBLIC_PROGRAM_BY_ID = Object.fromEntries(
  publicPrograms.map((program) => [program.id, program])
) as Record<PublicProgramId, PublicProgram>;

export const publicCatalogPrograms = publicPrograms.filter(
  (program) => program.availability === "paid_checkout"
);

export const checkoutPrograms = publicPrograms.filter(
  (program) => program.availability === "paid_checkout"
);

export const legacyPrograms = publicPrograms.filter(
  (program) => program.availability === "legacy"
);

export const appOnlyPrograms = publicPrograms.filter(
  (program) => program.availability === "app_only_free"
);

export const grantablePrograms = publicPrograms.filter(
  (program) => program.availability === "paid_checkout" || program.availability === "legacy"
);

export const categoryPrograms = {
  "Break Habits": publicCatalogPrograms.filter((program) => program.category === "Break Habits"),
  "Restore Balance": publicCatalogPrograms.filter((program) => program.category === "Restore Balance"),
  "Build Vitality": publicCatalogPrograms.filter((program) => program.category === "Build Vitality"),
} satisfies Record<ProgramCategory, readonly PublicProgram[]>;

export const allPrograms = publicPrograms;

export const CANONICAL_PROGRAM_DISPLAY_NAMES = Object.fromEntries(
  publicPrograms.map((program) => [program.dbSlug, program.title])
) as Record<CanonicalProgramSlug, string>;

const legacyWebToDbSlug = Object.fromEntries(
  Object.entries(WEBSITE_PROGRAM_ID_ALIASES).map(([legacyId, canonicalId]) => [
    legacyId,
    PUBLIC_PROGRAM_BY_ID[canonicalId].dbSlug,
  ])
) as Record<string, CanonicalProgramSlug>;

export const WEB_TO_DB_PROGRAM_SLUG = {
  ...Object.fromEntries(publicPrograms.map((program) => [program.id, program.dbSlug])),
  ...legacyWebToDbSlug,
} as Readonly<Record<string, CanonicalProgramSlug>>;

export const DB_TO_WEB_PROGRAM_SLUG = Object.fromEntries(
  publicPrograms.map((program) => [program.dbSlug, program.id])
) as Readonly<Record<CanonicalProgramSlug, PublicProgramId>>;

export const publicProgramStats = {
  programCount: publicCatalogPrograms.length,
  guidedDays: publicCatalogPrograms.reduce((total, program) => total + program.days, 0),
  platformCount: 2,
};

export function canonicalizePublicProgramId(id: string): PublicProgramId | null {
  const alias = WEBSITE_PROGRAM_ID_ALIASES[id as keyof typeof WEBSITE_PROGRAM_ID_ALIASES];
  if (alias) {
    return alias;
  }

  return id in PUBLIC_PROGRAM_BY_ID ? (id as PublicProgramId) : null;
}

export function getPublicProgramById(id: string): PublicProgram | undefined {
  const canonicalId = canonicalizePublicProgramId(id);
  return canonicalId ? PUBLIC_PROGRAM_BY_ID[canonicalId] : undefined;
}

export function formatProgramPrice(program: PublicProgram): string {
  return program.priceInr == null ? "TBD" : `₹${program.priceInr.toLocaleString("en-IN")}`;
}

export function getProgramFacts(program: PublicProgram): string[] {
  const practiceLabel = "practiceLabel" in program ? program.practiceLabel : undefined;

  return [
    `${program.days} days`,
    `${program.phases} phases`,
    program.dailyTimeLabel,
    practiceLabel,
  ].filter((fact): fact is string => Boolean(fact));
}

export function getProgramCardStructureFacts(program: PublicProgram): string[] {
  return [
    `${program.phases} phases`,
    program.dailyTimeLabel,
  ].filter((fact): fact is string => Boolean(fact));
}

export function programHasAudio(id: string): boolean {
  return getPublicProgramById(id)?.hasAudio ?? false;
}

export function programIsNinetyDay(id: string): boolean {
  return getPublicProgramById(id)?.days === 90;
}

export function toCartItem(program: PublicProgram) {
  return {
    id: program.id,
    title: program.title,
    price: program.priceInr,
    tag: program.tag,
  };
}
