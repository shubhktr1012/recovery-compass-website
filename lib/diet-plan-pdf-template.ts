// ─────────────────────────────────────────────────────────────────────────────
// Diet Plan — PDF HTML Template
// ─────────────────────────────────────────────────────────────────────────────
// Takes the structured JSON from the Anthropic API and renders it into a
// fully branded A4 HTML document that Puppeteer converts to PDF.
//
// Visual design matches the sample plans:
//   — Forest green header + page numbers
//   — Client info strip (Name | Region | Condition | Goal | Programs)
//   — ✓ and ■ lists for dos/donts
//   — Two-column veg/nonveg layout when isDualTrack is true
//   — Clean 7-day table
//   — Footer with disclaimer on every page
// ─────────────────────────────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */

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

export function renderDietPlanHtml(
    plan: Record<string, any>,
    q: Record<string, any>
): string {
    const meta      = plan.meta      ?? {};
    const isDual    = meta.isDualTrack === true;

    return `<!DOCTYPE html>
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

/* ── Page layout ─────────────────────────────────────────────── */

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

/* ── Header ──────────────────────────────────────────────────── */

.rc-header {
  background: var(--forest);
  margin: 0 calc(-1 * var(--page-pad));
  padding: 10px var(--page-pad);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
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
  font-weight: 400;
}

.rc-plan-title {
  background: var(--forest-light);
  margin: 0 calc(-1 * var(--page-pad));
  padding: 6px var(--page-pad);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.rc-plan-title-text {
  font-family: var(--font-sans);
  font-size: 8pt;
  color: rgba(255,255,255,0.85);
  font-weight: 500;
}

.rc-plan-tagline {
  font-size: 7pt;
  color: rgba(255,255,255,0.45);
}

/* ── Client info strip ───────────────────────────────────────── */

.rc-client-strip {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0;
  border: 0.5px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 14px;
}

.rc-client-cell {
  padding: 7px 9px;
  border-right: 0.5px solid var(--border);
}

.rc-client-cell:last-child { border-right: none; }

.rc-client-label {
  font-size: 6.5pt;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--mid);
  margin-bottom: 2px;
}

.rc-client-value {
  font-size: 8.5pt;
  font-weight: 500;
  color: var(--ink);
  line-height: 1.3;
}

/* ── Section titles ──────────────────────────────────────────── */

.rc-section {
  margin-bottom: 14px;
}

.rc-section-title {
  font-family: var(--font-serif);
  font-size: 12pt;
  font-weight: 600;
  color: var(--forest);
  border-bottom: 1.5px solid var(--forest);
  padding-bottom: 3px;
  margin-bottom: 8px;
}

.rc-section-subtitle {
  font-size: 7.5pt;
  color: var(--ink-light);
  font-weight: 400;
  font-style: italic;
  margin-left: 8px;
}

.rc-meal-timing {
  font-size: 7.5pt;
  font-weight: 500;
  color: var(--mid);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
}

/* ── About section ───────────────────────────────────────────── */

.rc-about p {
  font-size: 9pt;
  color: var(--ink-mid);
  margin-bottom: 6px;
  line-height: 1.6;
}

/* ── Dos and donts ───────────────────────────────────────────── */

.rc-rules-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px;
}

.rc-rules-col-title {
  font-size: 7.5pt;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.rc-rules-col-title.do  { color: var(--mid); }
.rc-rules-col-title.dont { color: #8B1A1A; }

.rc-rule-item {
  display: flex;
  gap: 7px;
  margin-bottom: 5px;
  font-size: 8.5pt;
  line-height: 1.45;
  align-items: flex-start;
}

.rc-rule-bullet {
  flex-shrink: 0;
  font-size: 9pt;
  margin-top: 0.5px;
  font-weight: 600;
}

.rc-rule-bullet.do   { color: var(--mid); }
.rc-rule-bullet.dont { color: #8B1A1A; }

/* ── Meal options ────────────────────────────────────────────── */

.rc-option {
  border: 0.5px solid var(--border);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 8px;
  break-inside: avoid;
}

.rc-option-header {
  background: var(--sage);
  padding: 5px 10px;
  font-size: 8pt;
  font-weight: 600;
  color: var(--forest);
  letter-spacing: 0.2px;
}

.rc-option-body {
  display: grid;
  gap: 0;
}

.rc-option-body.dual-track {
  grid-template-columns: 1fr 1fr;
}

.rc-option-body.single-track {
  grid-template-columns: 1fr;
}

.rc-track {
  padding: 8px 10px;
}

.rc-track + .rc-track {
  border-left: 0.5px solid var(--border);
}

.rc-track-label {
  display: inline-block;
  font-size: 6.5pt;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  padding: 1.5px 6px;
  border-radius: 20px;
  margin-bottom: 5px;
}

.rc-track-label.veg    { background: var(--sage); color: var(--forest); }
.rc-track-label.nonveg { background: #FFF3E0; color: #7A4010; }

.rc-track ul {
  list-style: none;
  margin-bottom: 5px;
}

.rc-track ul li {
  font-size: 8.5pt;
  color: var(--ink);
  padding: 1.5px 0;
  line-height: 1.45;
}

.rc-track ul li::before {
  content: "•";
  color: var(--subtle);
  margin-right: 5px;
}

.rc-track-note {
  font-size: 7.5pt;
  color: var(--ink-light);
  font-style: italic;
  line-height: 1.4;
  padding-top: 3px;
  border-top: 0.5px solid var(--border);
}

/* ── Snack section ───────────────────────────────────────────── */

.rc-snack {
  display: grid;
  gap: 10px;
  margin-bottom: 8px;
  break-inside: avoid;
  page-break-inside: avoid;
}

.rc-snack-section {
  break-inside: avoid;
  page-break-inside: avoid;
}

.rc-snack.dual-track {
  grid-template-columns: 1fr 1fr;
}

.rc-snack.single-track {
  grid-template-columns: 1fr;
}

.rc-snack-col {
  background: var(--sage);
  border-radius: 5px;
  padding: 8px 10px;
}

.rc-snack-col.nonveg-col {
  background: #FFF8F0;
}

.rc-snack ul {
  list-style: none;
}

.rc-snack ul li {
  font-size: 8.5pt;
  padding: 2px 0;
  line-height: 1.4;
}

.rc-snack ul li::before {
  content: "•";
  color: var(--subtle);
  margin-right: 5px;
}

/* ── Bedtime drinks ──────────────────────────────────────────── */

.rc-bedtime {
  background: var(--sage);
  border-radius: 5px;
  padding: 10px 12px;
  margin-bottom: 8px;
}

.rc-bedtime ul { list-style: none; }
.rc-bedtime ul li {
  font-size: 8.5pt;
  padding: 2.5px 0;
  line-height: 1.45;
  border-bottom: 0.5px solid rgba(61,122,74,0.15);
  break-inside: avoid;
}
.rc-bedtime ul li:last-child { border-bottom: none; }
.rc-bedtime ul li::before { content: "•"; color: var(--mid); margin-right: 6px; }

.rc-bedtime.compact {
  padding: 8px 10px;
}

.rc-bedtime.compact ul {
  columns: 2;
  column-gap: 14px;
}

/* ── Dining out ──────────────────────────────────────────────── */

.rc-venue {
  margin-bottom: 10px;
  break-inside: avoid;
}

.rc-venue-name {
  font-size: 9pt;
  font-weight: 600;
  color: var(--forest);
  margin-bottom: 5px;
}

.rc-venue-grid {
  display: grid;
  gap: 8px;
}

.rc-venue-grid.dual-track {
  grid-template-columns: 1fr 1fr 1fr;
}

.rc-venue-grid.single-track {
  grid-template-columns: 1fr 1fr;
}

.rc-venue-col {
  background: var(--sage);
  border-radius: 4px;
  padding: 7px 9px;
}

.rc-venue-col.avoid {
  background: #FFF0F0;
}

.rc-venue-col-title {
  font-size: 7pt;
  font-weight: 600;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.rc-venue-col-title.veg-label    { color: var(--mid); }
.rc-venue-col-title.nonveg-label { color: #7A4010; }
.rc-venue-col-title.avoid-label  { color: #8B1A1A; }

.rc-venue-col ul { list-style: none; }
.rc-venue-col ul li {
  font-size: 8pt;
  padding: 1.5px 0;
  line-height: 1.4;
}
.rc-venue-col ul li::before { content: "•"; color: var(--subtle); margin-right: 5px; }

.rc-travel-tips {
  margin-top: 8px;
}

.rc-travel-tips li {
  font-size: 8.5pt;
  padding: 2px 0;
  line-height: 1.45;
  list-style: none;
  display: flex;
  gap: 7px;
  align-items: flex-start;
}

/* ── Weekly planner ──────────────────────────────────────────── */

.rc-planner-label {
  font-size: 7.5pt;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.rc-planner-label.veg-label    { color: var(--mid); }
.rc-planner-label.nonveg-label { color: #7A4010; }

.rc-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 12px;
  font-size: 8pt;
  break-inside: avoid;
}

.rc-table th {
  background: var(--forest);
  color: var(--white);
  padding: 5px 7px;
  text-align: left;
  font-size: 7.5pt;
  font-weight: 600;
  letter-spacing: 0.4px;
}

.rc-table td {
  padding: 5px 7px;
  border-bottom: 0.5px solid var(--border);
  vertical-align: top;
  line-height: 1.4;
}

.rc-table tr:nth-child(even) td { background: var(--sage); }

.rc-table td:first-child {
  font-weight: 600;
  color: var(--mid);
  white-space: nowrap;
  font-size: 7.5pt;
}

/* ── Key foods ───────────────────────────────────────────────── */

.rc-key-foods ul { list-style: none; }
.rc-key-foods ul li {
  font-size: 8.5pt;
  padding: 3px 0 3px 0;
  border-bottom: 0.5px solid var(--border);
  display: flex;
  gap: 7px;
  align-items: flex-start;
  line-height: 1.45;
}
.rc-key-foods ul li:last-child { border-bottom: none; }

.rc-check-icon { color: var(--mid); font-weight: 700; flex-shrink: 0; }

/* ── Family meal rules ───────────────────────────────────────── */

.rc-family-rules ul { list-style: none; }
.rc-family-rules ul li {
  font-size: 8.5pt;
  padding: 2.5px 0;
  line-height: 1.45;
  display: flex;
  gap: 7px;
}
.rc-family-rules ul li::before {
  content: "→";
  color: var(--mid);
  font-weight: 600;
  flex-shrink: 0;
}

/* ── Program notes ───────────────────────────────────────────── */

.rc-program-notes {
  background: var(--sage);
  border-radius: 5px;
  padding: 10px 12px;
}
.rc-program-notes ul { list-style: none; }
.rc-program-notes ul li {
  font-size: 8.5pt;
  padding: 3px 0;
  border-bottom: 0.5px solid rgba(61,122,74,0.15);
  line-height: 1.45;
  display: flex;
  gap: 7px;
}
.rc-program-notes ul li:last-child { border-bottom: none; }
.rc-program-notes ul li::before {
  content: "■";
  color: var(--forest);
  flex-shrink: 0;
  font-size: 7pt;
  margin-top: 2px;
}

/* ── Footer ──────────────────────────────────────────────────── */

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

/* ── Section intro text ──────────────────────────────────────── */

.rc-intro {
  font-size: 8.5pt;
  color: var(--ink-mid);
  margin-bottom: 8px;
  line-height: 1.55;
  font-style: italic;
}

.rc-meal-section-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
  border-bottom: 1.5px solid var(--forest);
  padding-bottom: 3px;
}

.rc-meal-section-title {
  font-family: var(--font-serif);
  font-size: 12pt;
  font-weight: 600;
  color: var(--forest);
}

</style>
</head>
<body>

${renderFooter()}

<div class="page">
  ${renderHeader(meta, q, 1)}
  ${renderClientStrip(meta, q)}
  ${renderAbout(plan.about)}
  ${renderDosAndDonts(plan.dos, plan.donts)}
</div>

<div class="page">
  ${renderPageHeader(meta, 2)}
  ${renderMealSection("Breakfast", plan.meals?.breakfast, isDual)}
</div>

<div class="page">
  ${renderPageHeader(meta, 3)}
  ${renderSnackSection("Mid-morning snack", "Optional · " + (plan.meals?.midMorning?.timing ?? "10:30 – 11:00 AM"), plan.meals?.midMorning, isDual)}
  ${renderMealSection("Lunch", plan.meals?.lunch, isDual)}
  ${renderSnackSection("Afternoon snack", "Optional · " + (plan.meals?.afternoon?.timing ?? "4:00 – 5:00 PM"), plan.meals?.afternoon, isDual)}
</div>

<div class="page">
  ${renderPageHeader(meta, 4)}
  ${renderMealSection("Dinner", plan.meals?.dinner, isDual)}
  ${renderBedtimeSection(plan.meals?.bedtime)}
</div>

<div class="page">
  ${renderPageHeader(meta, 5)}
  ${renderDiningOut(plan.diningOut, isDual)}
</div>

<div class="page">
  ${renderPageHeader(meta, 6)}
  ${renderWeeklyPlanner(plan.weeklyPlanner, isDual)}
  ${plan.familyMealRules?.length ? renderFamilyRules(plan.familyMealRules) : ""}
</div>

<div class="page">
  ${renderPageHeader(meta, 7)}
  ${plan.keyFoods?.length ? renderKeyFoods(plan.keyFoods) : ""}
  ${plan.programNotes?.length ? renderProgramNotes(plan.programNotes) : ""}
</div>

</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper renderers
// ─────────────────────────────────────────────────────────────────────────────

function esc(str: unknown): string {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function renderFooter(): string {
    return `<div class="rc-footer">
    <span class="rc-footer-disclaimer">Wellness plan for educational purposes only. Consult your doctor before changing diet.</span>
    <span class="rc-footer-brand">Recovery Compass · Guided Wellness</span>
  </div>`;
}

function renderHeader(meta: Record<string, any>, q: Record<string, any>, page: number): string {
    const conditions = (q.conditions ?? []).filter((c: string) => c !== "None").join(" + ") || "";
    const planTitle = `Personalised Diet Plan — ${esc(q.name || "Client")} · ${esc(q.region || q.city || "India")}${conditions ? " · " + esc(conditions) : ""}`;

    return `${renderRCHeader(page)}
  <div class="rc-plan-title">
    <span class="rc-plan-title-text">${planTitle}</span>
    <span class="rc-plan-tagline">Recovery Compass · Guided Wellness</span>
  </div>`;
}

function renderPageHeader(meta: Record<string, any>, page: number): string {
    return `${renderRCHeader(page)}`;
}

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

function renderClientStrip(meta: Record<string, any>, q: Record<string, any>): string {
    const programs = (meta.programs ?? []).join(" · ") || "—";
    const conditions = (q.conditions ?? []).filter((c: string) => c !== "None").join(", ") || "None";

    return `<div class="rc-client-strip">
    <div class="rc-client-cell">
      <div class="rc-client-label">Client</div>
      <div class="rc-client-value">${esc(q.name || "—")}</div>
    </div>
    <div class="rc-client-cell">
      <div class="rc-client-label">Region</div>
      <div class="rc-client-value">${esc(q.region || q.city || "—")}</div>
    </div>
    <div class="rc-client-cell">
      <div class="rc-client-label">Condition</div>
      <div class="rc-client-value">${esc(conditions)}</div>
    </div>
    <div class="rc-client-cell">
      <div class="rc-client-label">Goal</div>
      <div class="rc-client-value">${esc(meta.goal || q.goal || "—")}</div>
    </div>
    <div class="rc-client-cell">
      <div class="rc-client-label">Programs</div>
      <div class="rc-client-value">${esc(programs)}</div>
    </div>
  </div>`;
}

function renderAbout(about: string[]): string {
    if (!about?.length) return "";
    return `<div class="rc-section rc-about">
    <div class="rc-section-title">About This Plan</div>
    ${(about as string[]).map((p) => `<p>${esc(p)}</p>`).join("")}
  </div>`;
}

function renderDosAndDonts(dos: string[], donts: string[]): string {
    const doHtml = (dos ?? []).map((item: string) => {
        const clean = item.replace(/^✓\s*/, "");
        return `<div class="rc-rule-item">
      <span class="rc-rule-bullet do">✓</span>
      <span>${esc(clean)}</span>
    </div>`;
    }).join("");

    const dontHtml = (donts ?? []).map((item: string) => {
        const clean = item.replace(/^■\s*/, "");
        return `<div class="rc-rule-item">
      <span class="rc-rule-bullet dont">■</span>
      <span>${esc(clean)}</span>
    </div>`;
    }).join("");

    return `<div class="rc-rules-grid">
    <div>
      <div class="rc-rules-col-title do">Do</div>
      ${doHtml}
    </div>
    <div>
      <div class="rc-rules-col-title dont">Don't</div>
      ${dontHtml}
    </div>
  </div>`;
}

function renderMealSection(title: string, meal: Record<string, any>, isDual: boolean): string {
    if (!meal) return "";
    const options = (meal.options ?? []) as Record<string, any>[];

    return `<div class="rc-section">
    <div class="rc-meal-section-header">
      <span class="rc-meal-section-title">${title}</span>
      <span class="rc-section-subtitle">Daily · ${esc(meal.timing ?? "")}</span>
    </div>
    ${meal.intro ? `<div class="rc-intro">${esc(meal.intro)}</div>` : ""}
    ${options.map((opt) => renderMealOption(opt, isDual)).join("")}
  </div>`;
}

function renderMealOption(opt: Record<string, any>, isDual: boolean): string {
    const veg   = opt.veg   as { items: string[]; note: string } | null;
    const nonveg = opt.nonveg as { items: string[]; note: string } | null;

    const hasVeg = Boolean(veg?.items?.length || veg?.note);
    const hasNonveg = Boolean(nonveg?.items?.length || nonveg?.note);
    const showDual = isDual && hasVeg && hasNonveg;

    const renderTrack = (
        track: { items?: string[]; note?: string },
        kind: "veg" | "nonveg",
        showLabel: boolean
    ) => `
      <div class="rc-track">
        ${showLabel ? `<span class="rc-track-label ${kind}">■ ${kind === "veg" ? "Veg" : "Non-Veg"}</span>` : ""}
        <ul>${(track.items ?? []).map((i: string) => `<li>${esc(i)}</li>`).join("")}</ul>
        ${track.note ? `<div class="rc-track-note">${esc(track.note)}</div>` : ""}
      </div>`;

    const columns = showDual
        ? renderTrack(veg ?? {}, "veg", true) + renderTrack(nonveg ?? {}, "nonveg", true)
        : hasVeg
            ? renderTrack(veg ?? {}, "veg", isDual)
            : hasNonveg
                ? renderTrack(nonveg ?? {}, "nonveg", isDual)
                : "";

    if (!columns) {
        return "";
    }

    return `<div class="rc-option">
    <div class="rc-option-header">${esc(opt.title ?? "")}</div>
    <div class="rc-option-body ${showDual ? "dual-track" : "single-track"}">
      ${columns}
    </div>
  </div>`;
}

function renderSnackSection(title: string, timing: string, snack: Record<string, any>, isDual: boolean): string {
    if (!snack) return "";

    const vegItems    = (snack.veg    ?? []) as string[];
    const nonvegItems = (snack.nonveg ?? []) as string[];
    const singleItems = (snack.items  ?? vegItems) as string[];

    const showDual = isDual && nonvegItems.length > 0;

    const vegHtml = (showDual ? vegItems : singleItems).map((i: string) => `<li>${esc(i)}</li>`).join("");
    const nonvegHtml = nonvegItems.map((i: string) => `<li>${esc(i)}</li>`).join("");

    return `<div class="rc-section rc-snack-section">
    <div class="rc-meal-section-header">
      <span class="rc-meal-section-title">${title}</span>
      <span class="rc-section-subtitle">${esc(timing)}</span>
    </div>
    ${snack.intro ? `<div class="rc-intro">${esc(snack.intro)}</div>` : ""}
    <div class="rc-snack ${showDual ? "dual-track" : "single-track"}">
      <div class="rc-snack-col">
        ${showDual ? `<div class="rc-planner-label veg-label">■ Veg</div>` : ""}
        <ul>${vegHtml}</ul>
      </div>
      ${showDual ? `<div class="rc-snack-col nonveg-col">
        <div class="rc-planner-label nonveg-label">■ Non-Veg</div>
        <ul>${nonvegHtml}</ul>
      </div>` : ""}
    </div>
  </div>`;
}

function renderBedtimeSection(bedtime: Record<string, any>): string {
    if (!bedtime) return "";
    const items = (bedtime.items ?? []) as string[];

    return `<div class="rc-section">
    <div class="rc-meal-section-header">
      <span class="rc-meal-section-title">Bedtime Drink</span>
      <span class="rc-section-subtitle">Nightly · ${esc(bedtime.timing ?? "9:00 – 9:30 PM")}</span>
    </div>
    <div class="rc-bedtime compact">
      <ul>${items.map((i: string) => `<li>${esc(i)}</li>`).join("")}</ul>
    </div>
  </div>`;
}

function renderDiningOut(diningOut: Record<string, any>, isDual: boolean): string {
    if (!diningOut) return "";
    const venues    = (diningOut.venues     ?? []) as Record<string, any>[];
    const tips      = (diningOut.travelTips ?? []) as string[];

    return `<div class="rc-section">
    <div class="rc-section-title">Dining Out Guide <span class="rc-section-subtitle">Smart choices at every restaurant</span></div>
    ${venues.map((v) => renderVenue(v, isDual)).join("")}
    ${tips.length ? `<div class="rc-travel-tips">
      <ul>${tips.map((t: string) => `<li><span style="color:var(--mid);font-weight:600;flex-shrink:0">✓</span><span>${esc(t.replace(/^✓\s*/, ""))}</span></li>`).join("")}</ul>
    </div>` : ""}
  </div>`;
}

function renderVenue(v: Record<string, any>, isDual: boolean): string {
    const vegItems    = (v.veg    ?? v.items ?? []) as string[];
    const nonvegItems = (v.nonveg ?? []) as string[];
    const skipItems   = (v.skip ?? v.vegSkip ?? []) as string[];

    const showDual = isDual && nonvegItems.length > 0;

    return `<div class="rc-venue">
    <div class="rc-venue-name">${esc(v.name ?? "")}</div>
    <div class="rc-venue-grid ${showDual ? "dual-track" : "single-track"}">
      <div class="rc-venue-col">
        <div class="rc-venue-col-title veg-label">${showDual ? "■ Veg — order" : "Good choices"}</div>
        <ul>${vegItems.map((i: string) => `<li>${esc(i)}</li>`).join("")}</ul>
      </div>
      ${showDual ? `<div class="rc-venue-col">
        <div class="rc-venue-col-title nonveg-label">■ Non-Veg — order</div>
        <ul>${nonvegItems.map((i: string) => `<li>${esc(i)}</li>`).join("")}</ul>
      </div>` : ""}
      <div class="rc-venue-col avoid">
        <div class="rc-venue-col-title avoid-label">Skip these</div>
        <ul>${skipItems.map((i: string) => `<li>${esc(i)}</li>`).join("")}</ul>
      </div>
    </div>
  </div>`;
}

function renderWeeklyPlanner(weeklyPlanner: Record<string, any>, isDual: boolean): string {
    if (!weeklyPlanner) return "";
    const vegDays    = (weeklyPlanner.veg    ?? weeklyPlanner.single ?? []) as Record<string, string>[];
    const nonvegDays = (weeklyPlanner.nonveg ?? []) as Record<string, string>[];

    const tableHtml = (days: Record<string, string>[], label?: string, labelClass?: string) => `
    ${label ? `<div class="rc-planner-label ${labelClass}">${label}</div>` : ""}
    <table class="rc-table">
      <thead>
        <tr>
          <th>Day</th>
          <th>Breakfast</th>
          <th>Lunch</th>
          <th>Dinner</th>
        </tr>
      </thead>
      <tbody>
        ${days.map((d) => `<tr>
          <td>${esc(d.day)}</td>
          <td>${esc(d.breakfast)}</td>
          <td>${esc(d.lunch)}</td>
          <td>${esc(d.dinner)}</td>
        </tr>`).join("")}
      </tbody>
    </table>`;

    return `<div class="rc-section">
    <div class="rc-section-title">7-Day Sample Planner <span class="rc-section-subtitle">Swap freely within the same category</span></div>
    ${isDual && nonvegDays.length
        ? tableHtml(vegDays, "■ Vegetarian week", "veg-label") + tableHtml(nonvegDays, "■ Non-vegetarian week", "nonveg-label")
        : tableHtml(vegDays)}
  </div>`;
}

function renderKeyFoods(keyFoods: string[]): string {
    return `<div class="rc-section rc-key-foods">
    <div class="rc-section-title">Key Foods for Your Conditions</div>
    <ul>
      ${(keyFoods as string[]).map((item: string) => {
        const clean = item.replace(/^✓\s*/, "");
        return `<li><span class="rc-check-icon">✓</span><span>${esc(clean)}</span></li>`;
      }).join("")}
    </ul>
  </div>`;
}

function renderFamilyRules(rules: string[]): string {
    return `<div class="rc-section rc-family-rules">
    <div class="rc-section-title">The "Same Family Meal" Rules</div>
    <ul>${(rules as string[]).map((r: string) => {
        const clean = r.replace(/^→\s*/, "");
        return `<li>${esc(clean)}</li>`;
    }).join("")}</ul>
  </div>`;
}

function renderProgramNotes(notes: string[]): string {
    return `<div class="rc-section">
    <div class="rc-section-title">Program-Specific Food Notes</div>
    <div class="rc-program-notes">
      <ul>${(notes as string[]).map((n: string) => {
        const clean = n.replace(/^■\s*/, "");
        return `<li>${esc(clean)}</li>`;
    }).join("")}</ul>
    </div>
  </div>`;
}
