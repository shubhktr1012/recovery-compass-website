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
    title: "Control",
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
    title: "Smoking Reset",
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
    title: "Deep Sleep Reset",
    cardDescription:
      "Finally wake up feeling rested, with a calmer evening rhythm and sleep that actually restores you.",
    article: {
      subtitle: "21 days to finally wake up feeling rested.",
      whoIsItFor:
        "Most people have forgotten what it actually feels like to sleep well. They have just gotten used to tired. Dragging yourself out of bed, running on caffeine, and feeling foggy by midday is not normal. That is a sleep problem.",
      curriculumOverview:
        "This reset helps you fall asleep easier, wake up actually refreshed, calm stress, lower cortisol, improve focus, support better workouts, and give your skin the kind of glow real rest creates.",
      dailyRhythm:
        "No supplements. No equipment. Nothing to buy. Sleep is not laziness. It is where your body does its best work.",
    },
    days: 21,
    phases: 3,
    dailyTimeLabel: "13-21 min/day",
    practiceLabel: "Includes sleep audio",
    hasAudio: true,
    priceInr: 2599,
    priceLabel: "Launch price",
    cardFacts: [
      { label: "Best for", value: "Tired mornings, caffeine reliance, foggy days" },
      { label: "Daily practice", value: "Morning light, caffeine cutoff, evening wind-down" },
      { label: "Signature tool", value: "Sleep pressure reset + guided sleep audio" },
    ],
    highlights: [
      { label: "Rested Mornings", text: "Fall asleep easier and wake up actually refreshed" },
      { label: "Calmer Mind", text: "Less stress, lower cortisol, and more presence through the day" },
      { label: "Better Output", text: "Better focus and getting more done without burning out" },
      { label: "Visible Rest", text: "Skin that glows because real rest shows on your face" },
    ],
    accent: "dark",
    availability: "paid_checkout",
  },
  {
    id: "14-day-energy-restore",
    dbSlug: "energy_vitality",
    category: "Restore Balance",
    tag: "Energy Reset Foundations",
    title: "Energy Restore",
    cardDescription:
      "Feel like yourself again by rebuilding the daily rhythm behind stamina, focus, cravings, and afternoon slumps.",
    article: {
      subtitle: "14 days to feel like yourself again.",
      whoIsItFor:
        "Most people do not realise how constantly feeling low has become their new normal. Low energy creeps up as the afternoon slump, mental fog, and days that feel like you are just getting through.",
      curriculumOverview:
        "This reset is designed for stamina that carries you through the day, fewer cravings, fewer afternoon slumps, a sharper mind, and the mental space to enjoy hobbies and move your body.",
      dailyRhythm:
        "No supplements. No equipment. Nothing to buy. Just you, and a reset your body has been waiting for.",
    },
    days: 14,
    phases: 2,
    dailyTimeLabel: "13-19 min/day",
    practiceLabel: "Movement-led",
    hasAudio: false,
    priceInr: 1499,
    priceLabel: "Launch price",
    cardFacts: [
      { label: "Best for", value: "Low energy, mental fog, afternoon slumps" },
      { label: "Daily practice", value: "Water, sunlight, movement, pressure points" },
      { label: "Signature tool", value: "Morning activation stack" },
    ],
    highlights: [
      { label: "Stamina", text: "More energy that carries you through the day" },
      { label: "Cravings", text: "Fewer cravings and no more afternoon slumps" },
      { label: "Clarity", text: "A sharper, clearer, and more focused mind" },
      { label: "Optimism", text: "Greater sense of optimism and confidence" },
    ],
    accent: "light",
    availability: "paid_checkout",
  },
  {
    id: "mens-vitality-reset-program",
    dbSlug: "male_sexual_health",
    category: "Build Vitality",
    tag: "Reset & Activation",
    title: "Men’s Vitality Reset",
    cardDescription:
      "Feel strong, sharp, and like yourself again by addressing stress, stamina, blood flow, recovery, and confidence.",
    article: {
      subtitle: "30 days to feel strong, sharp, and like yourself again.",
      whoIsItFor:
        "Low energy, stress that will not switch off, and a body that is not performing the way it used to are things most men quietly accept as getting older. You should not.",
      curriculumOverview:
        "This program works on the parts most men never think to address: performance anxiety, blood flow, endurance, hormone-supportive night routines, stress, heart health, and recovery.",
      dailyRhythm:
        "No supplements. No equipment. Nothing to buy. Your body has not given up. It has just been waiting for the right reset.",
    },
    days: 30,
    phases: 3,
    dailyTimeLabel: "12-20 min/day",
    practiceLabel: "Breathing + strength",
    hasAudio: false,
    priceInr: 4999,
    priceLabel: "Launch price",
    cardFacts: [
      { label: "Best for", value: "Low energy, stress, performance confidence" },
      { label: "Daily practice", value: "Strength work, walking, breath regulation" },
      { label: "Signature tool", value: "4-2-6 breath + pelvic strength" },
    ],
    highlights: [
      { label: "Confidence", text: "Calm performance anxiety and build real, lasting confidence" },
      { label: "Blood Flow", text: "Support stronger blood flow and physical endurance" },
      { label: "Recovery", text: "A night routine that supports hormones and proper recovery" },
      { label: "Stamina", text: "More stamina in the gym, at work, and in the bedroom" },
    ],
    accent: "dark",
    availability: "paid_checkout",
  },
  {
    id: "radiance-journey",
    dbSlug: "age_reversal",
    category: "Build Vitality",
    tag: "Rejuvenation Journey",
    title: "Age Well",
    cardDescription:
      "Feel younger, look better, and move with ease through a body-first reset for long-term vitality.",
    article: {
      subtitle: "90 days to feel younger, look better, and move with ease.",
      whoIsItFor:
        "Most people accept feeling stiff, tired, and older than they should as just part of life. It does not have to be.",
      curriculumOverview:
        "This is a 90-day reset that works with your body, not against it. It supports healthier-looking skin, stronger muscles, natural rhythm, better posture, easier weight management, lower stress, and more years spent feeling active and functional.",
      dailyRhythm:
        "No supplements. No equipment. Nothing to buy. Just your body, doing what it was always meant to do.",
    },
    days: 90,
    phases: 4,
    dailyTimeLabel: "25-30 min/day",
    practiceLabel: "Facial + walking routines",
    hasAudio: false,
    priceInr: 6999,
    priceLabel: "Launch price",
    cardFacts: [
      { label: "Best for", value: "Stiffness, tiredness, skin tone, long-term vitality" },
      { label: "Daily practice", value: "Walking, facial activation, regulation, sleep prep" },
      { label: "Signature tool", value: "Circulation + facial routine" },
    ],
    highlights: [
      { label: "Skin", text: "Skin that looks healthier and feels firmer" },
      { label: "Strength", text: "Stronger muscles that stay with you as you age" },
      { label: "Posture", text: "Better posture and a body that feels good to live in" },
      { label: "Stress", text: "Calm the nervous system and bring stress levels down" },
    ],
    accent: "light",
    availability: "paid_checkout",
  },
  {
    id: "21-day-smoking-alcohol-quit",
    dbSlug: "smoking_alcohol_quit",
    category: "Break Habits",
    tag: "Guided Quit Journey",
    title: "Smoking & Alcohol Quit",
    cardDescription:
      "Put them down for good with a structured path for the moments when everything in you says to light one up.",
    article: {
      subtitle: "21 days to put them down for good.",
      whoIsItFor:
        "You already know you want to quit, and that means the first step has already been taken. The hard part is not the decision. It is what happens in those moments when everything in you says light one up.",
      curriculumOverview:
        "This program helps you understand what actually triggers you, calm your nervous system instead of reaching for a cigarette, break the habit loop without white-knuckling it, and build real confidence that is not leaning on cigarettes anymore.",
      dailyRhythm:
        "No supplements. No equipment. Nothing to buy. You do not need more willpower. You need a better way through.",
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
      { label: "Daily practice", value: "Trigger mapping, urge tools, grounding techniques" },
      { label: "Signature tool", value: "5-minute Delay + Urge Surfing" },
    ],
    highlights: [
      { label: "Triggers", text: "Understand what actually triggers you and how to move through it" },
      { label: "Nervous System", text: "Calm your nervous system instead of reaching for a cigarette" },
      { label: "Habit Loop", text: "Break the habit loop without white-knuckling it" },
      { label: "Real Moments", text: "Light movements and grounding techniques that work in real moments" },
    ],
    accent: "dark",
    availability: "paid_checkout",
  },
  {
    id: "21-day-gut-reset",
    dbSlug: "gut_health_reset",
    category: "Restore Balance",
    tag: "Gut-Brain Connection",
    title: "Gut Reset",
    cardDescription:
      "Fix what has been bothering you from the inside: bloating, slow digestion, heaviness, reflux, and gut tension.",
    article: {
      subtitle: "21 days to fix what has been bothering you from the inside.",
      whoIsItFor:
        "Bloating, sluggish digestion, and that heavy uncomfortable feeling after eating are things most people live with for years, thinking it is just how their body works. It is not. Your gut just needs a reset.",
      curriculumOverview:
        "This program supports better food absorption, less bloating and gas, digestion that actually works, relief from acid reflux, easier weight management, stronger immunity, less inflammation, and more stable energy during the cycle for women.",
      dailyRhythm:
        "No supplements. No equipment. Nothing to buy. Take care of your gut, and your gut takes care of everything else.",
    },
    days: 21,
    phases: 3,
    dailyTimeLabel: "10-15 min/day",
    practiceLabel: "Physical + breath practices",
    hasAudio: false,
    priceInr: 4999,
    priceLabel: "Launch price",
    cardFacts: [
      { label: "Best for", value: "Bloating, sluggish digestion, gut discomfort" },
      { label: "Daily practice", value: "Hydration, chewing, post-meal walks, belly work" },
      { label: "Signature tool", value: "Vagus activation + motility routine" },
    ],
    highlights: [
      { label: "Absorption", text: "Help your body absorb the goodness from food the way it should" },
      { label: "Bloating", text: "Reduce bloating, gas, constipation, and discomfort" },
      { label: "Reflux", text: "Support relief from acid reflux and post-meal heaviness" },
      { label: "Inflammation", text: "Support less inflammation throughout the body" },
    ],
    accent: "light",
    availability: "paid_checkout",
  },
  {
    id: "6-day-free-detox",
    dbSlug: "free_detox_reset",
    category: "Restore Balance",
    tag: "App Starter Reset",
    title: "Free Detox Program",
    cardDescription:
      "Six days. One practice a day. A free starting point for the root causes behind sleep, energy, gut, stress, and cravings.",
    article: {
      subtitle: "Six days. One practice a day. Results you can actually feel.",
      whoIsItFor:
        "Poor sleep, low energy, gut problems, chronic stress, and addictive habits look different on the surface. Underneath, they share the same six root causes.",
      curriculumOverview:
        "This plan fixes all six. One per day. Under 15 minutes. Each day targets one root cause with a single, simple practice and a personal note showing how that day connects to your specific issue.",
      dailyRhythm:
        "Nothing to buy. No supplements. No equipment needed. The best starting point is the one that costs you nothing.",
    },
    days: 6,
    phases: 1,
    dailyTimeLabel: "10-15 min/day",
    practiceLabel: "Free starter",
    hasAudio: false,
    priceInr: null,
    priceLabel: "Free in the app",
    cardFacts: [
      { label: "Best for", value: "Poor sleep, low energy, gut issues, stress, cravings" },
      { label: "Daily practice", value: "One root-cause practice a day" },
      { label: "Signature tool", value: "6-day starter habit stack" },
    ],
    highlights: [
      { label: "Root Cause", text: "Each day targets one root cause with a simple practice" },
      { label: "Personal Note", text: "Every day shows how the practice connects to your specific issue" },
      { label: "Everyday Items", text: "Practices use Indian foods and items already in your home" },
      { label: "Tracker", text: "Comes with a daily journal tracker to keep you on track" },
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
