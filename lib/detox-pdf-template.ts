// -----------------------------------------------------------------------------
// 6-Day Detox Program - PDF HTML Template
// -----------------------------------------------------------------------------
// Renders the static 6-day detox program content into a premium A4 HTML
// document matching the design language of the Diet Plan (forest green,
// sage accents, Erode/Satoshi typography). Personalizes sections based
// on the user's primary wellness focus.
// -----------------------------------------------------------------------------

import { readFileSync } from "node:fs";
import { join } from "node:path";

const publicDir = join(process.cwd(), "public");
const assetDataUriCache = new Map<string, string | null>();

function getPublicAssetDataUri(assetPath: string, mimeType: string) {
    const cacheKey = `${mimeType}:${assetPath}`;
    if (assetDataUriCache.has(cacheKey)) {
        return assetDataUriCache.get(cacheKey);
    }

    try {
        const buffer = readFileSync(join(publicDir, assetPath));
        const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
        assetDataUriCache.set(cacheKey, dataUri);
        return dataUri;
    } catch {
        assetDataUriCache.set(cacheKey, null);
        return null;
    }
}

function renderFontFace({
    family,
    file,
    mimeType,
    weight,
    style = "normal",
}: {
    family: string;
    file: string;
    mimeType: string;
    weight: number;
    style?: "normal" | "italic";
}) {
    const dataUri = getPublicAssetDataUri(`fonts/${file}`, mimeType);
    if (!dataUri) {
        return "";
    }

    return `@font-face {
  font-family: '${family}';
  src: url('${dataUri}') format('${file.endsWith(".woff2") ? "woff2" : "opentype"}');
  font-weight: ${weight};
  font-style: ${style};
  font-display: swap;
}`;
}

function renderBrandFontCss() {
    return [
        renderFontFace({ family: "Satoshi", file: "Satoshi-Regular.otf", mimeType: "font/otf", weight: 400 }),
        renderFontFace({ family: "Satoshi", file: "Satoshi-Medium.otf", mimeType: "font/otf", weight: 500 }),
        renderFontFace({ family: "Satoshi", file: "Satoshi-Bold.otf", mimeType: "font/otf", weight: 700 }),
        renderFontFace({ family: "Erode", file: "Erode-Regular.woff2", mimeType: "font/woff2", weight: 400 }),
        renderFontFace({ family: "Erode", file: "Erode-Medium.woff2", mimeType: "font/woff2", weight: 500 }),
        renderFontFace({ family: "Erode", file: "Erode-SemiBold.woff2", mimeType: "font/woff2", weight: 600 }),
        renderFontFace({ family: "Erode", file: "Erode-Bold.woff2", mimeType: "font/woff2", weight: 700 }),
    ].filter(Boolean).join("\n");
}

function esc(str: unknown): string {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function cleanGeneratedHtml(html: string): string {
    return html
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/[\u2013\u2014]/g, "-");
}

// -----------------------------------------------------------------------------
// Focus-Specific Static Data
// -----------------------------------------------------------------------------

type FocusArea = "Better Sleep" | "More Energy" | "Gut Health" | "Quit Smoking / Alcohol" | "Stress Relief" | "General Wellness";

const FOCUS_INFO_MAP: Record<FocusArea, {
    day1: string;
    day2: string;
    day3: string;
    day4: string;
    day5: string;
    day6: string;
    day5Nutrition: string;
    nextStepTitle: string;
    nextStepDesc: string;
}> = {
    "Better Sleep": {
        day1: "Vagus nerve activation directly improves sleep onset. When the nervous system shifts to rest-and-digest before bed, falling asleep takes minutes instead of hours.",
        day2: "Dehydration reduces melatonin production - the sleep hormone. Even mild dehydration at bedtime increases time to fall asleep and reduces sleep depth. Two glasses of warm water in the evening changes this within 2 to 3 days.",
        day3: "Morning sunlight is the single most powerful sleep intervention available. The light signal through the eyes sets the circadian clock that determines when melatonin is released that evening. 10 minutes of morning sun means significantly faster sleep onset at night.",
        day4: "The gut produces 95% of the body's serotonin - the precursor to melatonin. Poor gut function means poor serotonin production, which means poor sleep quality. Fixing the gut directly improves sleep chemistry.",
        day5: "The racing mind at night is the most common cause of sleep difficulty. Pattern awareness shows you exactly what thoughts and worries are keeping you awake. The physiological sigh calms the nervous system within 60 seconds of lying down.",
        day6: "A consistent daily rhythm is what separates people who sleep well from those who do not. The circadian clock governs melatonin release, body temperature drop, and cortisol timing - all three require consistency to work properly.",
        day5Nutrition: "For sleep: avoid chai or coffee after 2 PM - caffeine has a 6-hour half-life and is still in your system at midnight.",
        nextStepTitle: "21-Day Sleep Reset",
        nextStepDesc: "Complete evening protocol, military sleep method, cognitive shuffle, body temperature science, and the full circadian rhythm rebuild. Most users see the biggest change between Days 7 and 14."
    },
    "More Energy": {
        day1: "Cold water spikes alertness within 60 seconds - faster than caffeine and without the crash. The nervous system shift from rest to alert is immediate.",
        day2: "The number one cause of the 3 PM energy crash is mild dehydration - not lack of sleep or food. Structured water timing eliminates this predictably within the first week.",
        day3: "Morning sunlight triggers the appropriate cortisol morning peak - giving genuine alert energy instead of groggy fatigue. Post-meal walking prevents the afternoon energy crash by stabilising blood sugar after eating.",
        day4: "Poor gut function means poor nutrient absorption. You can eat well and still be nutritionally depleted if the gut lining is inflamed. Today's practices improve absorption efficiency - meaning more energy from the same food.",
        day5: "Chronic low-grade stress is one of the biggest energy drains that exists. Cortisol in the bloodstream suppresses mitochondrial function - cellular energy production. Reducing stress releases trapped energy that was being diverted to the stress response.",
        day6: "Energy is not a resource you have or lack - it is a rhythm you maintain or disrupt. Morning sunlight, consistent meal timing, movement, and the eating window together create steady energy without caffeine dependency within 7 to 10 days.",
        day5Nutrition: "For energy: eat a protein-rich breakfast - eggs, dal, curd, or paneer.",
        nextStepTitle: "14-Day Energy Reset",
        nextStepDesc: "Cold therapy protocol, mitochondria science, nutrition timing for sustained energy, stress-energy connection, and the morning routine that replaces caffeine dependency."
    },
    "Gut Health": {
        day1: "The vagus nerve controls gut motility. Activating it every morning means better digestion, less bloating, and more regular bowel movements throughout the day.",
        day2: "The colon requires water to keep stool soft and moving. Mild dehydration firms stool, slows transit time, and causes bloating that looks like a gut problem but is actually a hydration problem.",
        day3: "Post-meal walking directly stimulates the migrating motor complex - your gut's natural cleaning wave. Walking after meals reduces bloating, improves gut motility, and helps the gut empty at the right rate. This is clinical physiology, not wellness advice.",
        day4: "The chewing practice, warm compress, and yoga sequence address three separate mechanisms of gut dysfunction: enzyme insufficiency, slow gastric emptying, and poor colonic motility. Most people feel the difference by this evening.",
        day5: "The gut-brain axis means emotional stress directly alters gut motility, enzyme secretion, and gut bacteria balance. The body tension mapping practice specifically targets gut tension - where most emotional stress is physically stored.",
        day6: "Gut bacteria follow a precise 24-hour clock of activity and dormancy. Eating at consistent times within a consistent window is the most powerful microbiome intervention available - more effective than any probiotic supplement.",
        day5Nutrition: "For gut: add a pinch of turmeric with black pepper to one meal.",
        nextStepTitle: "21-Day Gut Reset",
        nextStepDesc: "Colon massage, diaphragmatic breathing, full spice protocol, fermented foods, circadian eating window, and the complete evening gut repair sequence - with lactose intolerance guidance woven throughout."
    },
    "Quit Smoking / Alcohol": {
        day1: "Vagus nerve activation reduces craving intensity within 90 seconds. Use the cold water face splash the moment an urge appears - the fastest biological urge interrupter available.",
        day2: "Dehydration amplifies cravings by up to 30%. The brain confuses dehydration signals with craving signals. A full glass of water is one of the most effective urge interrupters - and now you know exactly why.",
        day3: "Physical movement metabolises the cortisol and adrenaline that intensify cravings. A 10-minute walk during a strong craving reduces craving intensity by 30 to 40% within the walk itself. Movement is one of the most underused quit tools.",
        day4: "The gut produces dopamine alongside serotonin. Gut inflammation disrupts dopamine production, which makes the brain seek dopamine from elsewhere - including nicotine and alcohol. Improving gut health directly reduces craving intensity over time.",
        day5: "Understanding your emotional triggers is Phase 1 of the 21-Day Quit Program - the most important phase. Most relapses happen because of an emotional trigger the person did not see coming. Pattern awareness gives you advance warning before the urge peaks.",
        day6: "Urges are strongest when the nervous system is dysregulated. A consistent daily rhythm - same morning routine, same meal times, same evening wind-down - reduces nervous system volatility and reduces urge intensity throughout the day.",
        day5Nutrition: "For quit support: replace the post-meal or post-chai craving with saunf (fennel seeds) and a 2-minute walk outside.",
        nextStepTitle: "21-Day Quit Program",
        nextStepDesc: "Urge Surfing, the Delay Technique, social pressure scripts, slip recovery protocol, identity shift, and a complete post-program plan for the 90 days that follow."
    },
    "Stress Relief": {
        day1: "Cold water drops cortisol - the primary stress hormone - within 60 seconds. The fastest natural stress reset available. Free, accessible anywhere, works every time.",
        day2: "Cortisol - the primary stress hormone - is significantly elevated by even mild dehydration. The body interprets dehydration as a physical stressor. Proper hydration is one of the simplest cortisol management tools available.",
        day3: "A 10-minute walk metabolises cortisol and adrenaline faster than any breathing exercise. Post-meal walking is specifically effective for stress because it uses stress hormones for their intended purpose - physical movement - removing them from the bloodstream.",
        day4: "The gut-brain axis is a two-way connection. Gut inflammation increases anxiety and stress reactivity. Gut healing reduces it. The warm compress specifically activates the parasympathetic nervous system through vagus nerve pathways in the gut wall.",
        day5: "The physiological sigh is clinically the fastest stress reset available. 60 seconds. Works every time. Pattern awareness shows your personal stress triggers - more valuable than any technique because it lets you intervene before stress peaks.",
        day6: "Chronic stress is largely a rhythm problem. The cortisol curve is supposed to peak in the morning and drop through the day. Irregular sleep, meals, and no morning anchor disrupt this curve and keep cortisol elevated all day. This routine resets it.",
        day5Nutrition: "For stress: do not skip any meal today - low blood sugar amplifies cortisol significantly.",
        nextStepTitle: "90-Day Master Program",
        nextStepDesc: "The most powerful program in the Recovery Compass library. ACT-based awareness and behaviour change across 7 phases - the program that changes people at the level of identity, not just behaviour."
    },
    "General Wellness": {
        day1: "Warm water on waking activates digestion, rehydrates after overnight fasting, and starts the body's natural morning clearing process. One of the most powerful 3-minute habits you can build.",
        day2: "Oil pulling reduces harmful oral bacteria by up to 30% within one week of daily practice. These bacteria travel to the gut with every meal. Removing them at the source reduces gut inflammation more effectively than most probiotic supplements.",
        day3: "Morning sunlight combined with barefoot grounding delivers Vitamin D, sets the body clock, reduces systemic inflammation, and seeds the gut microbiome with beneficial environmental bacteria. The most powerful combination of free health interventions available.",
        day4: "The gut is the foundation of every other system. Immunity, mood, energy, sleep, and skin health all depend on gut function. Three practices in 15 minutes that simultaneously address all of these is one of the highest-value investments of time in this entire program.",
        day5: "Pattern awareness is the single most powerful health tool most people never use. Understanding when, where, and why your body feels its worst gives you the ability to intervene before the symptom appears rather than reacting after it has already peaked.",
        day6: "A consistent daily rhythm is the foundation of long-term health. Every practice you have built this week becomes exponentially more effective when done at consistent times every day.",
        day5Nutrition: "For general wellness: eat a protein-rich breakfast - eggs, dal, curd, or paneer.",
        nextStepTitle: "90-Day Master Program",
        nextStepDesc: "The complete Recovery Compass journey - energy, sleep, gut, stress, and behaviour change woven into one 90-day program that produces lasting change across every dimension of wellness."
    }
};

// -----------------------------------------------------------------------------
// Render Header / Footer
// -----------------------------------------------------------------------------

function renderRCHeader(page: number): string {
    const logoDataUri = getPublicAssetDataUri("rc-logo-white.svg", "image/svg+xml");
    const logoMarkup = logoDataUri
        ? `<span class="rc-header-brand"><img class="rc-header-logo-mark" src="${logoDataUri}" alt="" /><span class="rc-header-logo">Recovery Compass</span></span>`
        : `<span class="rc-header-logo">Recovery Compass</span>`;

    return `<div class="rc-header">
    ${logoMarkup}
    <span class="rc-header-page">Page ${page}</span>
  </div>`;
}

function renderRCFooter(): string {
    return `<div class="rc-footer">
    <span class="rc-footer-disclaimer">This program is for general wellness. Consult your doctor if you have a diagnosed health condition.</span>
    <span class="rc-footer-brand">Recovery Compass | Free Detox</span>
  </div>`;
}

const HEALTH_CONDITION_NONE = "None of the above";
const SAFETY_NOTES_BY_HEALTH_CONDITION: Record<string, string> = {
    "Type 2 diabetes or pre-diabetes": "Keep medication and meal timing stable, avoid skipping meals, and monitor glucose as advised by your clinician. Stop any practice that causes weakness, dizziness, shaking, or unusual discomfort.",
    "High blood pressure": "Keep breathing, walking, and warm-water practices gentle. Do not force breath holds, overheat the body, or push through light-headedness, chest pressure, or unusual breathlessness.",
    "Heart condition diagnosed": "Use this program only after medical clearance. Keep walks easy, skip any practice that triggers chest discomfort, breathlessness, dizziness, palpitations, or pressure, and follow your cardiologist's limits first.",
    "Pregnant": "Use this only with doctor approval. Avoid intense abdominal pressure, overheating, fasting-style changes, or aggressive detox claims. Prioritise hydration, food safety, rest, and gentle walking.",
    "Gut condition diagnosed": "Keep warm water, chewing, and walking gentle. Skip abdominal movement or compresses if they worsen pain, reflux, nausea, bowel symptoms, or any clinician-restricted condition.",
};

function getQuestionnaireStringArray(value: unknown) {
    if (Array.isArray(value)) {
        return value
            .map((item) => String(item ?? "").trim())
            .filter(Boolean);
    }

    const normalized = String(value ?? "").trim();
    return normalized ? [normalized] : [];
}

function getSelectedHealthConditions(questionnaireData: Record<string, unknown>) {
    const rawConditions = questionnaireData.health_conditions ?? questionnaireData.healthConditions;
    const conditions = getQuestionnaireStringArray(rawConditions)
        .filter((condition) => condition !== HEALTH_CONDITION_NONE);

    return Array.from(new Set(conditions));
}

function renderSafetyNotes(questionnaireData: Record<string, unknown>) {
    const selectedConditions = getSelectedHealthConditions(questionnaireData);

    if (selectedConditions.length === 0) {
        return `<div class="safety-card safety-card--standard">
    <div class="safety-card-label">Safety note from your answers</div>
    <p>You selected no listed medical conditions. Follow the program gently, stay hydrated, and stop any practice that feels painful, dizzying, or unusually uncomfortable.</p>
  </div>`;
    }

    const notes = selectedConditions.map((condition) => {
        const note = SAFETY_NOTES_BY_HEALTH_CONDITION[condition] || "Please check with your doctor before making significant changes to movement, hydration, breathwork, food timing, or daily routine.";

        return `<div class="safety-item">
      <div class="safety-item-title">${esc(condition)}</div>
      <div class="safety-item-text">${esc(note)}</div>
    </div>`;
    }).join("");

    return `<div class="safety-card">
    <div class="safety-card-label">Safety notes from your answers</div>
    <p class="safety-card-intro">You selected: ${esc(selectedConditions.join(", "))}. Please use these notes before starting the daily practices.</p>
    ${notes}
  </div>`;
}

// -----------------------------------------------------------------------------
// Main Renderer
// -----------------------------------------------------------------------------

export function renderDetoxHtml(
    name: string,
    focusInput: string,
    questionnaireData: Record<string, unknown> = {}
): string {
    // Sanitize focus area
    let primaryFocus: FocusArea = "General Wellness";
    const normalizedInput = String(focusInput).trim();
    if (normalizedInput === "Better Sleep" || normalizedInput === "More Energy" || normalizedInput === "Gut Health" || normalizedInput === "Quit Smoking / Alcohol" || normalizedInput === "Stress Relief" || normalizedInput === "General Wellness") {
        primaryFocus = normalizedInput;
    } else {
        // Handle alias mappings if any
        if (normalizedInput.includes("Sleep")) primaryFocus = "Better Sleep";
        else if (normalizedInput.includes("Energy")) primaryFocus = "More Energy";
        else if (normalizedInput.includes("Gut")) primaryFocus = "Gut Health";
        else if (normalizedInput.includes("Smoking") || normalizedInput.includes("Quit")) primaryFocus = "Quit Smoking / Alcohol";
        else if (normalizedInput.includes("Stress")) primaryFocus = "Stress Relief";
    }

    const focusData = FOCUS_INFO_MAP[primaryFocus];
    const clientName = name.trim() || "Seeker";
    const formattedDate = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    return cleanGeneratedHtml(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
${renderBrandFontCss()}

* { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --forest: #06290C;
  --forest-light: #0d4416;
  --sage: #EBF4EC;
  --sage-dark: #d4ebd6;
  --mid: #3D7A4A;
  --subtle: #a8c8ac;
  --ink: #1a1a1a;
  --ink-mid: #444;
  --ink-light: #777;
  --border: #d8e8da;
  --white: #ffffff;
  --page-pad: 18mm;
  --font-serif: 'Erode', Georgia, serif;
  --font-sans: 'Satoshi', system-ui, sans-serif;
}

body {
  font-family: var(--font-sans);
  font-size: 9.5pt;
  line-height: 1.55;
  color: var(--ink);
  background: var(--white);
}

/* Page constraints */
.page {
  width: 210mm;
  min-height: 297mm;
  padding: 0 var(--page-pad) 20mm;
  position: relative;
  page-break-after: always;
}
.page:last-child { page-break-after: avoid; }

@page {
  size: A4;
  margin: 0;
}

@media print {
  .page { page-break-after: always; }
  .page:last-child { page-break-after: avoid; }
}

/* Header style */
.rc-header {
  background: var(--forest);
  margin: 0 calc(-1 * var(--page-pad));
  padding: 10px var(--page-pad);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}
.rc-header-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}
.rc-header-logo-mark {
  width: 24px;
  height: 24px;
  object-fit: contain;
  display: block;
}
.rc-header-logo {
  font-family: var(--font-serif);
  font-size: 11pt;
  font-weight: 600;
  color: var(--white);
  letter-spacing: 0.5px;
}
.rc-header-page {
  font-size: 7.5pt;
  color: rgba(255,255,255,0.55);
}

/* Footer style */
.rc-footer {
  position: fixed;
  bottom: 8mm;
  left: var(--page-pad);
  right: var(--page-pad);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 0.5px solid var(--border);
  padding-top: 4px;
}
.rc-footer-disclaimer {
  font-size: 6.5pt;
  color: var(--ink-light);
}
.rc-footer-brand {
  font-size: 6.5pt;
  color: var(--mid);
  font-weight: 500;
}

/* Layout Blocks */
.cover-wrapper {
  padding-top: 40mm;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.cover-badge {
  font-size: 7.5pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--mid);
  margin-bottom: 5px;
}
.cover-title {
  font-family: var(--font-serif);
  font-size: 34pt;
  font-weight: 600;
  color: var(--forest);
  line-height: 1.1;
  margin-bottom: 15px;
}
.cover-subtitle {
  font-size: 13pt;
  color: var(--ink-mid);
  max-w-[140mm];
  line-height: 1.5;
  margin-bottom: 40mm;
}
.cover-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  border: 0.5px solid var(--border);
  border-radius: 6px;
  background: #fbfdfb;
  overflow: hidden;
}
.cover-cell {
  padding: 10px 12px;
  border-right: 0.5px solid var(--border);
}
.cover-cell:last-child { border-right: none; }
.cover-label {
  font-size: 6.5pt;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--mid);
  margin-bottom: 2px;
}
.cover-value {
  font-size: 8.5pt;
  font-weight: 500;
  color: var(--ink);
}

.intro-lead {
  font-size: 11pt;
  line-height: 1.6;
  color: var(--ink-mid);
  margin-bottom: 16px;
}
.print-callout {
  background: #fbfdfb;
  border: 0.5px solid var(--border);
  border-left: 3px solid var(--mid);
  border-radius: 6px;
  padding: 8px 10px;
  margin: 12px 0 14px;
  font-size: 8.6pt;
  color: var(--ink-mid);
  line-height: 1.45;
}
.print-callout strong {
  color: var(--forest);
}
.section-title {
  font-family: var(--font-serif);
  font-size: 13pt;
  font-weight: 600;
  color: var(--forest);
  border-bottom: 1.5px solid var(--forest);
  padding-bottom: 4px;
  margin-top: 20px;
  margin-bottom: 10px;
}
.day-title-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1.5px solid var(--forest);
  padding-bottom: 4px;
  margin-bottom: 12px;
}
.day-title {
  font-family: var(--font-serif);
  font-size: 14pt;
  font-weight: 600;
  color: var(--forest);
}
.day-time {
  font-size: 8pt;
  font-weight: 500;
  color: var(--mid);
  text-transform: uppercase;
}
.section-subtitle {
  font-family: var(--font-serif);
  font-size: 11pt;
  font-weight: 600;
  color: var(--forest-light);
  margin-top: 12px;
  margin-bottom: 6px;
}

/* Practices & Bullet lists */
.practice-block {
  margin-bottom: 12px;
}
.practice-head {
  font-size: 9.5pt;
  font-weight: 700;
  color: var(--forest);
  margin-bottom: 3px;
}
.practice-desc {
  font-size: 9pt;
  color: var(--ink-mid);
  margin-left: 12px;
  margin-bottom: 4px;
}
.why-works {
  font-size: 8.5pt;
  line-height: 1.5;
  color: var(--ink-light);
  font-style: italic;
  margin-left: 12px;
  margin-top: 3px;
  margin-bottom: 10px;
}

/* Personalization Card */
.personal-card {
  background: var(--sage);
  border-radius: 8px;
  border-left: 3.5px solid var(--mid);
  padding: 10px 14px;
  margin: 14px 0;
}
.personal-card-label {
  font-size: 6.5pt;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--forest);
  margin-bottom: 4px;
}
.personal-card-title {
  font-size: 9.5pt;
  font-weight: 700;
  color: var(--forest);
  margin-bottom: 3px;
}
.personal-card-text {
  font-size: 8.5pt;
  color: var(--forest-light);
  line-height: 1.45;
}
.safety-card {
  background: #fffdf7;
  border: 0.5px solid #e6dcc3;
  border-left: 3.5px solid #b98a2d;
  border-radius: 8px;
  padding: 10px 12px;
  margin: 14px 0 16px;
}
.safety-card--standard {
  background: #fbfdfb;
  border-color: var(--border);
  border-left-color: var(--mid);
}
.safety-card-label {
  font-size: 6.5pt;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--forest);
  margin-bottom: 5px;
}
.safety-card p {
  font-size: 8.5pt;
  color: var(--ink-mid);
  line-height: 1.45;
}
.safety-card-intro {
  margin-bottom: 8px;
}
.safety-item {
  padding-top: 7px;
  margin-top: 7px;
  border-top: 0.5px solid rgba(185, 138, 45, 0.28);
}
.safety-item-title {
  font-size: 8.2pt;
  font-weight: 700;
  color: var(--forest);
  margin-bottom: 2px;
}
.safety-item-text {
  font-size: 8.2pt;
  color: var(--ink-mid);
  line-height: 1.4;
}

/* Schedule & Notes Grid */
.split-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 15px;
}
.grid-col-title {
  font-size: 7.5pt;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--mid);
  border-bottom: 0.5px solid var(--border);
  padding-bottom: 3px;
  margin-bottom: 6px;
}
.schedule-item {
  display: flex;
  justify-content: space-between;
  font-size: 8.5pt;
  border-bottom: 0.5px solid rgba(61,122,74,0.08);
  padding: 3px 0;
}
.schedule-time {
  font-weight: 600;
  color: var(--mid);
}
.schedule-desc {
  text-align: right;
  color: var(--ink-mid);
}
.note-box {
  background: #fdfefd;
  border: 0.5px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 8.5pt;
  color: var(--ink-mid);
  line-height: 1.45;
}

/* End Reflection & Checklist */
.checklist-box {
  background: #fbfdfb;
  border: 0.5px solid var(--border);
  border-radius: 6px;
  padding: 10px 12px;
  margin-top: 14px;
}
.checklist-title {
  font-size: 7.5pt;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--mid);
  margin-bottom: 6px;
}
.checklist-item {
  display: flex;
  gap: 8px;
  font-size: 8.5pt;
  color: var(--ink-mid);
  margin-bottom: 3px;
}
.checklist-item:last-child { margin-bottom: 0; }
.checklist-bullet {
  color: var(--mid);
  font-weight: bold;
}

.reflection-box {
  margin-top: 14px;
  padding-left: 8px;
  border-left: 2px solid var(--border);
}
.reflection-title {
  font-size: 8pt;
  font-weight: 600;
  color: var(--ink-light);
  margin-bottom: 3px;
}
.reflection-quote {
  font-size: 9pt;
  font-style: italic;
  color: var(--ink-mid);
  line-height: 1.4;
}

.routine-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 8.5pt;
}
.routine-table th {
  background: var(--forest);
  color: var(--white);
  padding: 5px 8px;
  text-align: left;
  font-weight: 600;
}
.routine-table td {
  padding: 6px 8px;
  border-bottom: 0.5px solid var(--border);
}
.routine-table tr:nth-child(even) td {
  background: var(--sage);
}

.tracker-intro {
  font-size: 8.6pt;
  color: var(--ink-mid);
  line-height: 1.45;
  margin-bottom: 8px;
}
.tracker-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-top: 8px;
  font-size: 7.15pt;
}
.tracker-table th {
  background: var(--forest);
  color: var(--white);
  padding: 5px 3px;
  text-align: center;
  font-weight: 700;
  line-height: 1.15;
}
.tracker-table th:first-child {
  width: 30%;
  text-align: left;
  padding-left: 7px;
}
.tracker-table td {
  border: 0.5px solid var(--border);
  padding: 3.6px 4px;
  vertical-align: middle;
}
.tracker-table td:first-child {
  color: var(--ink-mid);
  font-weight: 500;
}
.tracker-table td:not(:first-child) {
  text-align: center;
}
.tracker-check {
  display: inline-block;
  width: 9px;
  height: 9px;
  border: 1px solid var(--mid);
  border-radius: 2px;
}
.reflection-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 8px;
  margin-top: 10px;
}
.reflection-card {
  min-height: 34px;
  border: 0.5px solid var(--border);
  border-radius: 6px;
  background: #fbfdfb;
  padding: 6px 8px;
}
.reflection-card-title {
  font-size: 7.2pt;
  font-weight: 700;
  color: var(--forest);
  margin-bottom: 2px;
}
.reflection-card-prompt {
  font-size: 7.1pt;
  color: var(--ink-mid);
  line-height: 1.25;
}

.quote-hero {
  font-size: 11pt;
  font-style: italic;
  color: var(--mid);
  text-align: center;
  margin: 20px 0;
  line-height: 1.5;
}

</style>
</head>
<body>

${renderRCFooter()}

<!-- PAGE 1: COVER PAGE -->
<div class="page">
  <div class="cover-wrapper">
    <div class="cover-badge">Recovery Compass</div>
    <h1 class="cover-title">6-Day Free<br>Detox Program</h1>
    <p class="cover-subtitle">All five major wellness issues - poor sleep, low energy, gut problems, chronic stress, and addictive habits - share the same six root causes. This program fixes all six in six days.</p>

    <div class="cover-strip">
      <div class="cover-cell">
        <div class="cover-label">Client</div>
        <div class="cover-value">${esc(clientName)}</div>
      </div>
      <div class="cover-cell">
        <div class="cover-label">Focus Area</div>
        <div class="cover-value">${esc(primaryFocus)}</div>
      </div>
      <div class="cover-cell">
        <div class="cover-label">Program</div>
        <div class="cover-value">6-Day Detox</div>
      </div>
      <div class="cover-cell">
        <div class="cover-label">Date</div>
        <div class="cover-value">${esc(formattedDate)}</div>
      </div>
    </div>
  </div>
</div>

<!-- PAGE 2: HOW IT WORKS -->
<div class="page">
  ${renderRCHeader(2)}
  <div class="section-title">How this program works</div>
  <p class="intro-lead">This program fixes all six root wellness causes in six days. One key practice per day. Under 15 minutes total. Every single day produces a felt result.</p>

  <p style="margin-bottom: 12px; font-size: 9.5pt; color: var(--ink-mid);">Each day builds on the previous one - do not skip days. By Day 3 most people notice at least two clear physical changes. Day 6 bridges you to the full Recovery Compass program for your issue.</p>

  <div class="print-callout">
    <strong>Before you start:</strong> print the full program and keep it somewhere visible. It will be easier to follow each day's steps and tick the tracker as you complete the week.
  </div>

  ${renderSafetyNotes(questionnaireData)}

  <div class="section-title">The six root causes this program fixes</div>

  <div class="practice-block">
    <div class="practice-head">1. Dysregulated nervous system</div>
    <div class="practice-desc">The vagus nerve controls sleep quality, gut motility, stress response, and craving intensity. Day 1 activates it directly in under 3 minutes.</div>
  </div>
  <div class="practice-block">
    <div class="practice-head">2. Chronic dehydration</div>
    <div class="practice-desc">Even mild dehydration causes fatigue, worsens gut problems, disrupts sleep, amplifies stress, and intensifies cravings. Day 2 fixes this completely.</div>
  </div>
  <div class="practice-block">
    <div class="practice-head">3. No morning anchor routine</div>
    <div class="practice-desc">Sunlight, movement, and cold water in the morning set the body clock that governs energy, sleep, gut rhythm, and cortisol all day. Day 3 builds this anchor.</div>
  </div>
  <div class="practice-block">
    <div class="practice-head">4. Poor gut function</div>
    <div class="practice-desc">The gut produces 95% of the body's serotonin. Poor digestion disrupts mood, energy, sleep, and stress resilience simultaneously. Day 4 addresses this directly.</div>
  </div>
  <div class="practice-block">
    <div class="practice-head">5. Emotional triggers stored in the body</div>
    <div class="practice-desc">Unprocessed stress lives in the nervous system and drives poor sleep, gut tension, low energy, and addictive urges. Day 5 identifies and releases this.</div>
  </div>
  <div class="practice-block">
    <div class="practice-head">6. No consistent daily rhythm</div>
    <div class="practice-desc">The body works on a 24-hour clock. Irregular eating, sleeping, and movement patterns disrupt every system simultaneously. Day 6 builds the complete rhythm.</div>
  </div>

  <p style="margin-top: 25px; font-size: 8.5pt; color: var(--ink-light); font-style: italic;">No cold water or cold drinks on any day of this program. No eating after 9 PM - the body needs a clear overnight rest window.</p>
</div>

<!-- PAGE 3: DAY 1 -->
<div class="page">
  ${renderRCHeader(3)}
  <div class="day-title-row">
    <span class="day-title">Day 1: Root Cause 1 - Dysregulated Nervous System</span>
    <span class="day-time">~12 min total</span>
  </div>
  <div class="section-subtitle">The Nervous System Reset</div>
  <p style="margin-bottom:12px; font-size:9pt; color:var(--ink-mid);">Today you activate the rest-and-digest mode of your nervous system deliberately using three free tools that together take under 5 minutes.</p>

  <div class="practice-block">
    <div class="practice-head">Practice 1 - Cold Water Face Splash (10 seconds)</div>
    <div class="practice-desc">Go to your sink. Splash cold water on your face 5 to 7 times. Do this before tea, before food, before your phone.</div>
    <div class="why-works">Cold water triggers the dive reflex. This immediately fires the vagus nerve: the direct physical connection between your brain and your gut, heart rate, stress response, and sleep quality.</div>
  </div>

  <div class="practice-block">
    <div class="practice-head">Practice 2 - Tongue Scraping (30 seconds)</div>
    <div class="practice-desc">Before brushing your teeth, scrape your tongue from back to front 5 to 7 times. Use a tongue scraper or the back edge of a metal spoon.</div>
    <div class="why-works">The mouth and gut share the same biological system. Scraping removes overnight bacteria film before it is swallowed with your first drink.</div>
  </div>

  <div class="practice-block">
    <div class="practice-head">Practice 3 - 500 ml Warm Water on Waking (3 mins)</div>
    <div class="practice-desc">After tongue scraping, drink 500 ml of warm water slowly. Not hot. Not cold. Warm. Zero cold drinks for the rest of the day.</div>
    <div class="why-works">Warm water triggers the gastrocolic reflex - your gut's natural signal to empty the bowel. Cold water tightens the gut muscle and disrupts digestion.</div>
  </div>

  <div class="personal-card">
    <div class="personal-card-label">Personalised for your focus: ${esc(primaryFocus)}</div>
    <div class="personal-card-text">${esc(focusData.day1)}</div>
  </div>

  <div class="split-grid">
    <div>
      <div class="grid-col-title">Day 1 Water Schedule</div>
      <div class="schedule-item"><span class="schedule-time">On waking</span><span class="schedule-desc">500 ml warm water</span></div>
      <div class="schedule-item"><span class="schedule-time">30m before breakfast</span><span class="schedule-desc">200 ml warm water</span></div>
      <div class="schedule-item"><span class="schedule-time">Mid-morning</span><span class="schedule-desc">200 ml warm/herbal tea</span></div>
      <div class="schedule-item"><span class="schedule-time">30m before lunch</span><span class="schedule-desc">200 ml warm water</span></div>
      <div class="schedule-item"><span class="schedule-time">Afternoon</span><span class="schedule-desc">300 ml warm water</span></div>
    </div>
    <div>
      <div class="grid-col-title">Indian Nutrition Note</div>
      <div class="note-box">
        Eat normal meals. The only change: drink warm water with every meal instead of cold drinks. Skip cold water alongside your morning chai. Ideal addition: squeeze half a lemon into your warm morning water - a traditional liver-cleansing practice.
      </div>
    </div>
  </div>

  <div class="checklist-box">
    <div class="checklist-title">Day 1 Completion Checklist</div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Cold water face splash on waking</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Tongue scraping before brushing</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>500 ml warm water on waking</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>No cold drinks all day</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Hum any note for 2 minutes before bed (vagus nerve stimulation)</span></div>
  </div>
</div>

<!-- PAGE 4: DAY 2 -->
<div class="page">
  ${renderRCHeader(4)}
  <div class="day-title-row">
    <span class="day-title">Day 2: Root Cause 2 - Chronic Dehydration</span>
    <span class="day-time">~13 min total</span>
  </div>
  <div class="section-subtitle">The Hydration and Mouth Reset</div>
  <p style="margin-bottom:12px; font-size:9pt; color:var(--ink-mid);">Today adds oil pulling - a 5-minute traditional practice backed by modern research that removes harmful bacteria from your mouth before they reach your gut.</p>

  <div class="practice-block">
    <div class="practice-head">Practice 1 - Morning Protocol (4 Steps)</div>
    <div class="practice-desc">Step 1: Oil pulling (5 mins). Step 2: Tongue scraping. Step 3: Cold water face splash. Step 4: 500 ml warm water. Done together in sequence, these are more powerful than any supplement.</div>
  </div>

  <div class="practice-block">
    <div class="practice-head">How to do oil pulling (5 minutes)</div>
    <div class="practice-desc">Take 1 tablespoon of sesame oil or coconut oil. Swish gently around your mouth for 5 minutes. Do not gargle or swallow. Spit into a bin (not the sink, oil blocks drains). Rinse and proceed to scraping.</div>
    <div class="why-works">Oil pulling binds to fatty membranes of bacteria, lifting them out of teeth, gums, and tongue crevices. Removing them prevents them from traveling downstream to your gut.</div>
  </div>

  <div class="practice-block">
    <div class="practice-head">Practice 2 - Structured Water Timing</div>
    <div class="practice-desc">Before meals: drink 200 ml warm water 30 minutes before eating. During meals: only small sips. After meals: wait 20 minutes then drink 200 ml warm water. No cold drinks.</div>
    <div class="why-works">Large water amounts during meals dilute digestive enzymes by up to 50%. Drinking water at the wrong temperature and wrong time causes post-meal bloating, low energy, and disrupted sleep.</div>
  </div>

  <div class="personal-card">
    <div class="personal-card-label">Personalised for your focus: ${esc(primaryFocus)}</div>
    <div class="personal-card-text">${esc(focusData.day2)}</div>
  </div>

  <div class="split-grid">
    <div>
      <div class="grid-col-title">Day 2 Water Schedule</div>
      <div class="schedule-item"><span class="schedule-time">On waking</span><span class="schedule-desc">500 ml warm water after protocol</span></div>
      <div class="schedule-item"><span class="schedule-time">30m before lunch</span><span class="schedule-desc">200 ml warm water</span></div>
      <div class="schedule-item"><span class="schedule-time">After lunch (wait 20m)</span><span class="schedule-desc">200 ml warm water</span></div>
      <div class="schedule-item"><span class="schedule-time">Mid-afternoon</span><span class="schedule-desc">300 ml jeera water</span></div>
      <div class="schedule-item"><span class="schedule-time">30m before dinner</span><span class="schedule-desc">200 ml warm water</span></div>
    </div>
    <div>
      <div class="grid-col-title">Indian Nutrition Note</div>
      <div class="note-box">
        Add <strong>jeera water</strong> in the afternoon today. Boil 1 teaspoon of cumin seeds in 300 ml of water for 5 minutes, strain, and drink warm. Cumin directly stimulates digestive enzymes and reduces afternoon bloating and gas. Keep normal meals otherwise.
      </div>
    </div>
  </div>

  <div class="checklist-box">
    <div class="checklist-title">Day 2 Completion Checklist</div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Oil pulling 5 minutes</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Full morning protocol (scrape, splash, warm water)</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Water timing followed: before/after meals, not during</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Jeera water in the afternoon</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>No cold drinks all day</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Evening: hum 2 mins + gargle with warm salt water 30s</span></div>
  </div>
</div>

<!-- PAGE 5: DAY 3 -->
<div class="page">
  ${renderRCHeader(5)}
  <div class="day-title-row">
    <span class="day-title">Day 3: Root Cause 3 - No Morning Anchor</span>
    <span class="day-time">~15 min total</span>
  </div>
  <div class="section-subtitle">The Movement Reset</div>
  <p style="margin-bottom:12px; font-size:9pt; color:var(--ink-mid);">Morning sunlight and movement set the body's circadian clock - the 24-hour rhythm that governs energy, sleep, gut bacterial rhythm, and cravings.</p>

  <div class="practice-block">
    <div class="practice-head">Practice 1 - Morning Sunlight Walk (10 minutes)</div>
    <div class="practice-desc">Within 30 minutes of waking, go outside. Walk in direct sunlight for 10 minutes (not through glass). No sunglasses. Barefoot on grass or soil if possible (grounding).</div>
    <div class="why-works">Morning sunlight sets the circadian clock governing melatonin release at night. It triggers appropriate morning cortisol peak, Vitamin D production, and stimulates gut-derived serotonin.</div>
  </div>

  <div class="practice-block">
    <div class="practice-head">Practice 2 - Post-Meal Walk (10 minutes after lunch & dinner)</div>
    <div class="practice-desc">Walk at a relaxed, comfortable, conversational pace. Breathe through your nose only. Keep one hand resting lightly on your belly. Walking after meals is more impactful than before.</div>
    <div class="why-works">Walking stimulates peristalsis - the muscular wave moving food through intestines. It also lowers post-meal blood sugar by 20 to 30%. Nasal breathing generates nitric oxide, improving gut blood flow.</div>
  </div>

  <div class="personal-card">
    <div class="personal-card-label">Personalised for your focus: ${esc(primaryFocus)}</div>
    <div class="personal-card-text">${esc(focusData.day3)}</div>
  </div>

  <div class="split-grid">
    <div>
      <div class="grid-col-title">Day 3 Water Schedule</div>
      <div class="schedule-item"><span class="schedule-time">On waking</span><span class="schedule-desc">500 ml warm water after protocol</span></div>
      <div class="schedule-item"><span class="schedule-time">30m before breakfast</span><span class="schedule-desc">200 ml warm water</span></div>
      <div class="schedule-item"><span class="schedule-time">30m before lunch</span><span class="schedule-desc">200 ml warm water</span></div>
      <div class="schedule-item"><span class="schedule-time">Mid-afternoon</span><span class="schedule-desc">300 ml jeera or ajwain water</span></div>
      <div class="schedule-item"><span class="schedule-time">30m before dinner</span><span class="schedule-desc">200 ml warm water</span></div>
    </div>
    <div>
      <div class="grid-col-title">Indian Nutrition Note</div>
      <div class="note-box">
        Eat breakfast within 45 minutes of your morning walk. Best choices: <strong>pesarattu</strong> (moong dal dosa) or <strong>idli with sambar</strong> - high protein, low glycemic, fermented. Alternatively, plain curd with a banana. Do not skip breakfast today; skipping it disrupts the cortisol curve morning light just fixed.
      </div>
    </div>
  </div>

  <div class="checklist-box">
    <div class="checklist-title">Day 3 Completion Checklist</div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Full morning protocol (oil, scrape, splash, water)</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Morning sunlight walk 10 minutes</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Breakfast within 45 minutes of the walk</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Post-meal walk after lunch 10 minutes</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Post-meal walk after dinner 10 minutes</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>No cold drinks all day</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Evening humming and gargling</span></div>
  </div>
</div>

<!-- PAGE 6: DAY 4 -->
<div class="page">
  ${renderRCHeader(6)}
  <div class="day-title-row">
    <span class="day-title">Day 4: Root Cause 4 - Poor Gut Function</span>
    <span class="day-time">~15 min total</span>
  </div>
  <div class="section-subtitle">The Gut and Food Reset</div>
  <p style="margin-bottom:12px; font-size:9pt; color:var(--ink-mid);">Today introduces three specific gut practices that address enzyme insufficiency, slow gastric emptying, and poor colonic motility.</p>

  <div class="practice-block">
    <div class="practice-head">Practice 1 - The Chewing Practice</div>
    <div class="practice-desc">Choose your biggest meal. Put phone away. Sit down. On the first 10 bites, chew each bite 20 times before swallowing. Eat the rest of the meal normally.</div>
    <div class="why-works">Digestion begins in the mouth. Chewing 20 times breaks carbohydrates down by 40% using salivary amylase before reaching the stomach. Fermentation decreases, reducing gas and bloating.</div>
  </div>

  <div class="practice-block">
    <div class="practice-head">Practice 2 - Warm Compress after Largest Meal (5 minutes)</div>
    <div class="practice-desc">Take a small towel. Run under warm water and wring out. Lie down comfortably and place the warm cloth on your belly (ribs to belly button). Do nothing else.</div>
    <div class="why-works">Increases blood flow to the stomach, liver, and intestines, speeding up gastric emptying and removing post-meal heaviness.</div>
  </div>

  <div class="practice-block">
    <div class="practice-head">Practice 3 - 8-Minute Gut Yoga Sequence</div>
    <div class="practice-desc">Do on an empty stomach. Poses: 1. Knees to chest (2m). 2. Seated spinal twist (1m each side). 3. Child's pose (1m). 4. Cat & Cow (1m). 5. Lying twist (30s each side).</div>
    <div class="why-works">Each pose compresses and releases a specific section of the digestive tract, wringing the organs and stimulating colonic motility.</div>
  </div>

  <div class="personal-card">
    <div class="personal-card-label">Personalised for your focus: ${esc(primaryFocus)}</div>
    <div class="personal-card-text">${esc(focusData.day4)}</div>
  </div>

  <div class="split-grid">
    <div>
      <div class="grid-col-title">Day 4 Water Schedule</div>
      <div class="schedule-item"><span class="schedule-time">On waking</span><span class="schedule-desc">500 ml warm water after protocol</span></div>
      <div class="schedule-item"><span class="schedule-time">30m before breakfast</span><span class="schedule-desc">200 ml warm water</span></div>
      <div class="schedule-item"><span class="schedule-time">Mid-afternoon</span><span class="schedule-desc">300 ml ajwain water</span></div>
      <div class="schedule-item"><span class="schedule-time">30m before dinner</span><span class="schedule-desc">200 ml warm water</span></div>
    </div>
    <div>
      <div class="grid-col-title">Indian Nutrition Note</div>
      <div class="note-box">
        Add one fermented food to at least one meal today. Options: homemade <strong>curd</strong> (dahi/perugu), fresh <strong>buttermilk</strong> (chaas/majjiga), or naturally fermented <strong>idli/dosa</strong>. A single cup of homemade curd contains more beneficial gut bacteria than most probiotic capsules. Add a slice of ginger to your morning water.
      </div>
    </div>
  </div>

  <div class="checklist-box">
    <div class="checklist-title">Day 4 Completion Checklist</div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Full morning protocol + sunlight walk</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>8-minute gut yoga sequence</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Chewing practice: 10 bites at 20 chews</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Warm compress after biggest meal</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Fermented food added to at least one meal</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Post-meal walks + evening wind-down</span></div>
  </div>
</div>

<!-- PAGE 7: DAY 5 -->
<div class="page">
  ${renderRCHeader(7)}
  <div class="day-title-row">
    <span class="day-title">Day 5: Root Cause 5 - Emotional Triggers Stored in the Body</span>
    <span class="day-time">~14 min total</span>
  </div>
  <div class="section-subtitle">The Mind Reset</div>
  <p style="margin-bottom:12px; font-size:9pt; color:var(--ink-mid);">Unprocessed stress stores in the body as muscular tension and nervous system dysregulation, driving poor sleep, low energy, and cravings.</p>

  <div class="practice-block">
    <div class="practice-head">Practice 1 - The Physiological Sigh (60 seconds)</div>
    <div class="practice-desc">When stress peaks, do this immediately: Take a normal breath in through your nose, take a second smaller sip of air on top, then execute a long, slow exhale through your mouth. Repeat 3 times.</div>
    <div class="why-works">Stanford research shows this is the fastest known biological stress reset. Fully inflates the lung's air sacs, maximizing CO2 removal on the exhale, which drops heart rate and activates the parasympathetic response.</div>
  </div>

  <div class="practice-block">
    <div class="practice-head">Practice 2 - Pattern Awareness (5 minutes)</div>
    <div class="practice-desc">Sit quietly. Ask yourself honestly: 1. When does my primary issue get worst? 2. What emotion is present just before it peaks? 3. What situation triggers it most? 4. What am I actually looking for when the symptom appears? Write one sentence for each.</div>
    <div class="why-works">Simply noticing a trigger-response pattern begins to interrupt it neurologically before any active effort is made. You cannot change a pattern you cannot see.</div>
  </div>

  <div class="practice-block">
    <div class="practice-head">Practice 3 - Body Tension Mapping (3 minutes)</div>
    <div class="practice-desc">Lie on back. Scan from throat to lower belly. Look for tightness or contraction. Place one hand there and take 5 slow breaths. Do not try to fix it, just notice and breathe.</div>
    <div class="why-works">Muscular contraction holds stress. Conscious breathing into tight areas triggers release, often noticed as a sudden sigh, gurgle, or relaxation.</div>
  </div>

  <div class="personal-card">
    <div class="personal-card-label">Personalised for your focus: ${esc(primaryFocus)}</div>
    <div class="personal-card-text">${esc(focusData.day5)}</div>
  </div>

  <div class="split-grid">
    <div>
      <div class="grid-col-title">Day 5 Water Schedule</div>
      <div class="schedule-item"><span class="schedule-time">On waking</span><span class="schedule-desc">500 ml warm ginger water</span></div>
      <div class="schedule-item"><span class="schedule-time">30m before each meal</span><span class="schedule-desc">200 ml warm water</span></div>
      <div class="schedule-item"><span class="schedule-time">Mid-afternoon</span><span class="schedule-desc">300 ml jeera water</span></div>
      <div class="schedule-item"><span class="schedule-time">Before bed</span><span class="schedule-desc">150 ml warm turmeric milk</span></div>
    </div>
    <div>
      <div class="grid-col-title">Indian Nutrition Note</div>
      <div class="note-box">
        ${esc(focusData.day5Nutrition)}
        <br><br>
        *Turmeric Milk:* Boil low-fat milk with half teaspoon turmeric and a pinch of black pepper (increases absorption). No sugar. Drink warm before bed.
      </div>
    </div>
  </div>

  <div class="checklist-box">
    <div class="checklist-title">Day 5 Completion Checklist</div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Full morning protocol + sunlight walk</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Physiological sigh used at least once during stress</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Pattern awareness: 5 mins, four questions answered</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Body tension mapping: 3 mins</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Post-meal walks + gut yoga sequence</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Evening: hum 2 mins + warm turmeric milk</span></div>
  </div>
</div>

<!-- PAGE 8: DAY 6 -->
<div class="page">
  ${renderRCHeader(8)}
  <div class="day-title-row">
    <span class="day-title">Day 6: Root Cause 6 - No Consistent Daily Rhythm</span>
    <span class="day-time">~20 min total</span>
  </div>
  <div class="section-subtitle">The Full Routine</div>
  <p style="margin-bottom:12px; font-size:9pt; color:var(--ink-mid);">Today you run everything you have built this week as one complete daily routine - a single flowing rhythm.</p>

  <p class="quote-hero">"Six days of small signals. The body has been listening the whole time."</p>

  <div class="split-grid">
    <div>
      <div class="grid-col-title">Your Morning Routine (15 mins)</div>
      <div style="font-size:8.5pt; color:var(--ink-mid); line-height: 1.6;">
        1. <strong>Morning belly check</strong> (2 min) - lie on back, notice tension.<br>
        2. <strong>Oil pulling</strong> (5 min) - swish sesame or coconut oil.<br>
        3. <strong>Tongue scraping</strong> (30s) - 5-7 strokes with scraper.<br>
        4. <strong>Cold face splash</strong> (10s) - before food or phone.<br>
        5. <strong>700 ml warm ginger water</strong> (3 min) - drink slowly.<br>
        6. <strong>Morning sunlight walk</strong> (10 min) - barefoot grounding.
      </div>
    </div>
    <div>
      <div class="grid-col-title">Your Evening Routine (20 mins)</div>
      <div style="font-size:8.5pt; color:var(--ink-mid); line-height: 1.6;">
        1. <strong>Post-dinner walk</strong> (10 min) - relaxed pace, nasal breathing.<br>
        2. <strong>Warm compress on belly</strong> (5 min) - after largest meal.<br>
        3. <strong>Gut yoga</strong> (8 min) - knees to chest, seated twist, child's pose, cat-cow, lying twist.<br>
        4. <strong>Physiological sigh</strong> (60s) - 3 double-inhale cycles.<br>
        5. <strong>Body tension mapping</strong> (3 min) - scan & release.<br>
        6. <strong>Bedtime drink</strong> - warm turmeric milk or chamomile tea.<br>
        7. <strong>Humming (2m) & Gargling (30s)</strong> - vagus nerve close.
      </div>
    </div>
  </div>

  <div class="personal-card" style="margin-top:20px;">
    <div class="personal-card-label">Personalised for your focus: ${esc(primaryFocus)}</div>
    <div class="personal-card-text">${esc(focusData.day6)}</div>
  </div>

  <div class="split-grid">
    <div>
      <div class="grid-col-title">12-Hour Eating Window</div>
      <div class="note-box">
        Note what time you eat breakfast today. Your last food should be 12 hours after your first meal. Example: if breakfast is at 8 AM, last food is at 8 PM. After the window closes, drink warm water, herbal tea, or jeera water only. This resets the gut bacteria clock.
      </div>
    </div>
    <div>
      <div class="grid-col-title">Day 6 Water Schedule</div>
      <div class="schedule-item"><span class="schedule-time">On waking</span><span class="schedule-desc">700 ml warm ginger water</span></div>
      <div class="schedule-item"><span class="schedule-time">On waking</span><span class="schedule-desc">Fenugreek water (1 tsp soaked)</span></div>
      <div class="schedule-item"><span class="schedule-time">30m before meals</span><span class="schedule-desc">200 ml warm water</span></div>
      <div class="schedule-item"><span class="schedule-time">After meals (wait 20m)</span><span class="schedule-desc">200 ml warm water</span></div>
      <div class="schedule-item"><span class="schedule-time">Before bed</span><span class="schedule-desc">Warm turmeric milk</span></div>
    </div>
  </div>

  <div class="checklist-box" style="margin-top:10px;">
    <div class="checklist-title">Day 6 Completion Checklist</div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Full morning routine (6 steps) + sunlight walk completed</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Gut yoga sequence + Chewing practice followed</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Warm compress after biggest meal + post-meal walks done</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>12-hour eating window started and followed</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Full evening routine (7 steps) completed before sleep</span></div>
    <div class="checklist-item"><span class="checklist-bullet">[ ]</span><span>Identified my next full Recovery Compass program</span></div>
  </div>
</div>

<!-- PAGE 9: QUICK REFERENCE CARD & NEXT STEPS -->
<div class="page">
  ${renderRCHeader(9)}
  <div class="section-title" style="margin-top:0;">Quick Reference Card - Daily Habits</div>
  <p style="font-size:9pt; color:var(--ink-mid); margin-bottom: 8px;">Keep this page. Return to it on any hard day.</p>

  <table class="routine-table">
    <thead>
      <tr>
        <th style="width: 25%;">Routine</th>
        <th>Steps & Frequency</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Morning Routine</strong></td>
        <td>Belly check (2m) -> Oil pulling (5m) -> Tongue scrape (30s) -> Cold face splash (10s) -> 700ml warm ginger water -> Sunlight walk (10m)</td>
      </tr>
      <tr>
        <td><strong>Evening Routine</strong></td>
        <td>Post-dinner walk (10m) -> Warm belly compress (5m) -> Gut yoga (8m) -> Physiological sigh (60s) -> Body scan (3m) -> Turmeric milk -> Hum (2m) & Gargle (30s)</td>
      </tr>
      <tr>
        <td><strong>Water Timing</strong></td>
        <td>On waking (700ml) | 30m before each meal (200ml) | Mid-afternoon (300ml jeera/ajwain water) | 20m after meals (200ml) | Bedtime (150ml). Total: 3L warm, no cold drinks.</td>
      </tr>
      <tr>
        <td><strong>Permanent Habits</strong></td>
        <td>1. Morning sunlight walk. 2. Tongue scraping & warm water daily. 3. Post-meal walk. 4. Chewing practice (10 bites at 20 chews). 5. Physiological sigh. 6. 12-hour eating window.</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">Your Next Steps on Day 7</div>
  <p style="font-size:9.5pt; line-height: 1.5; color: var(--ink-mid); margin-bottom: 12px;">The 6-Day Detox is complete. The practices are working. Your next step is the full Recovery Compass program for your primary focus. The full programs go deeper, providing complete tools, day-by-day structure, and specific techniques to make the results permanent.</p>

  <div style="background: var(--sage); padding: 12px 16px; border-radius: 8px; border: 0.5px solid var(--border);">
    <h3 style="font-family: var(--font-serif); font-size: 11pt; color: var(--forest); margin-bottom: 4px;">Your Recommended Next Program: ${esc(focusData.nextStepTitle)}</h3>
    <p style="font-size: 9pt; color: var(--forest-light); line-height: 1.45;">${esc(focusData.nextStepDesc)}</p>
  </div>

  <p style="margin-top: 20px; font-size: 8.5pt; text-align: center; color: var(--ink-light);">
    Open the <strong>Recovery Compass</strong> app on Day 7, select your recommended program, and continue your journey.
  </p>
</div>

<!-- PAGE 10: DAILY TRACKER -->
<div class="page">
  ${renderRCHeader(10)}
  <div class="section-title" style="margin-top:0;">Your 6-Day Daily Tracker</div>
  <p class="tracker-intro">Tick each practice as you complete it. One honest tick per day is enough. Use this page as a simple accountability sheet for the full detox week.</p>

  <table class="tracker-table">
    <thead>
      <tr>
        <th>Practice</th>
        <th>Day 1<br>Nervous<br>System</th>
        <th>Day 2<br>Hydration</th>
        <th>Day 3<br>Movement</th>
        <th>Day 4<br>Gut<br>Reset</th>
        <th>Day 5<br>Mind<br>Reset</th>
        <th>Day 6<br>Full<br>Routine</th>
      </tr>
    </thead>
    <tbody>
      ${[
        "Cold water face splash",
        "Tongue scraping",
        "Warm water on waking",
        "Oil pulling",
        "Morning sunlight walk",
        "Post-meal walk (lunch)",
        "Post-meal walk (dinner)",
        "Gut yoga 8 minutes",
        "Chewing practice",
        "Warm compress",
        "Physiological sigh",
        "Pattern awareness",
        "Evening humming",
        "No cold drinks all day",
        "Eating window maintained"
      ].map((practice) => `<tr><td>${esc(practice)}</td>${Array.from({ length: 6 }, () => `<td><span class="tracker-check"></span></td>`).join("")}</tr>`).join("")}
    </tbody>
  </table>

  <div class="section-title" style="margin-top:14px;">Daily One-Line Reflections</div>
  <div class="reflection-grid">
    <div class="reflection-card">
      <div class="reflection-card-title">Day 1</div>
      <div class="reflection-card-prompt">Where did I feel my nervous system shift today?</div>
    </div>
    <div class="reflection-card">
      <div class="reflection-card-title">Day 2</div>
      <div class="reflection-card-prompt">Did I notice any difference when drinking water before meals?</div>
    </div>
    <div class="reflection-card">
      <div class="reflection-card-title">Day 3</div>
      <div class="reflection-card-prompt">How did my body feel after the morning walk and sunlight?</div>
    </div>
    <div class="reflection-card">
      <div class="reflection-card-title">Day 4</div>
      <div class="reflection-card-prompt">How did the chewing practice and warm compress change the meal?</div>
    </div>
    <div class="reflection-card">
      <div class="reflection-card-title">Day 5</div>
      <div class="reflection-card-prompt">What is my most reliable trigger for my primary health issue?</div>
    </div>
    <div class="reflection-card">
      <div class="reflection-card-title">Day 6</div>
      <div class="reflection-card-prompt">What one practice made the biggest difference this week?</div>
    </div>
  </div>
</div>

</body>
</html>`);
}
