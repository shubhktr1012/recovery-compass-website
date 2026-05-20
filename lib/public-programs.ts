export const PROGRAM_CATEGORIES = ["Break Habits", "Restore Balance", "Build Vitality"] as const;

export type ProgramCategory = (typeof PROGRAM_CATEGORIES)[number];

export const CANONICAL_PROGRAM_SLUGS = [
  "six_day_reset",
  "ninety_day_transform",
  "sleep_disorder_reset",
  "energy_vitality",
  "age_reversal",
  "male_sexual_health",
] as const;

export type CanonicalProgramSlug = (typeof CANONICAL_PROGRAM_SLUGS)[number];

export type ProgramHighlight = {
  label: string;
  text: string;
};

export type ProgramArticle = {
  subtitle: string;
  whoIsItFor: string;
  curriculumOverview: string;
  dailyRhythm: string;
};

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
  highlights: readonly ProgramHighlight[];
  accent: "dark" | "light";
  isDietPlan?: boolean;
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
    highlights: [
      { label: "Core Rule", text: "Delay every urge by 10 minutes" },
      { label: "Reset", text: "Throw away cigarettes, lighters, and ashtrays" },
      { label: "Disruption", text: "Change one trigger routine to break the loop" },
      { label: "Urge Protocol", text: "Grounding and light movement while the timer runs" },
    ],
    accent: "dark",
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
    highlights: [
      { label: "Daily Focus", text: "Notice patterns without trying to change everything at once" },
      { label: "Guided Exercise", text: "Short 2-4 minute daily practice" },
      { label: "Journal", text: "Optional prompts for reflection without pressure" },
      { label: "Long-Term Shift", text: "Pattern-level awareness, resilience, and sustained confidence" },
    ],
    accent: "light",
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
    highlights: [
      { label: "Morning Signal", text: "Sunlight exposure within 30 minutes of waking" },
      { label: "Breathing", text: "Hydration plus 10 cycles of physiological sigh" },
      { label: "Sleep Pressure", text: "Light morning movement to make the body naturally tired at night" },
      { label: "Night Routine", text: "No caffeine after 2 PM and guided sleep meditation before bed" },
    ],
    accent: "dark",
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
    highlights: [
      { label: "Foundation", text: "500 ml water within 10 minutes of waking" },
      { label: "Circadian Reset", text: "10-15 minutes of morning sunlight" },
      { label: "Activation", text: "10 minutes of movement plus a light walk" },
      { label: "Recovery", text: "Deep breathing before bed and a fixed sleep time" },
    ],
    accent: "light",
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
    highlights: [
      { label: "Urge Control", text: "Use a breathing reset when the urge appears and let it pass in 5-10 minutes" },
      { label: "Performance Anxiety", text: "4-2-6 breathing to activate the relaxation response" },
      { label: "Vitality Exercise", text: "Pelvic strength, glute bridges, squats, and a brisk walk" },
      { label: "Recovery", text: "Night routine to support hormones and physical recovery" },
    ],
    accent: "dark",
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
    highlights: [
      { label: "Circulation", text: "20-minute relaxed walk to improve blood flow and cellular energy" },
      { label: "Face Exercise", text: "Daily facial muscle activation to support firmness and lift" },
      { label: "Regulation", text: "Guided calming practice to relax the nervous system and lower cortisol" },
      { label: "Sleep Preparation", text: "Consistent sleep routine to support hormone balance and repair" },
    ],
    accent: "light",
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

export const categoryPrograms = {
  "Break Habits": publicPrograms.filter((program) => program.category === "Break Habits"),
  "Restore Balance": publicPrograms.filter((program) => program.category === "Restore Balance"),
  "Build Vitality": publicPrograms.filter((program) => program.category === "Build Vitality"),
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

export const publicProgramStats = {
  programCount: publicPrograms.length,
  guidedDays: publicPrograms.reduce((total, program) => total + program.days, 0),
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
