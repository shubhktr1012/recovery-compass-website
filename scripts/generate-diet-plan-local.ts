import fs from "node:fs";
import path from "node:path";

import { buildDietPlanPrompt } from "../lib/diet-plan-prompt";
import { renderDietPlanHtml } from "../lib/diet-plan-pdf-template";
import {
    generateValidatedDietPlanJson,
    resolveDietPlanAiProvider,
} from "../lib/diet-plan-generation";
import { normalizeDietPlanQuestionnaireData } from "../lib/diet-plan-questionnaire";
import { generatePdf } from "../lib/pdf-generator";

const DEFAULT_QUESTIONNAIRE = path.join(__dirname, "fixtures/diet-plan-example.json");
const OUTPUT_DIR = path.join(__dirname, "../generated/diet-plans");

const USAGE = `Local diet plan generation (production pipeline, no order/email)

Usage:
  npm run diet-plan:generate-local
  npm run diet-plan:generate-local -- <questionnaire.json> [--revision <notes.md>]

Options:
  <questionnaire.json>   Canonical or raw Google Form questionnaire JSON.
                         Defaults to scripts/fixtures/diet-plan-example.json.
  --revision <path>      Optional markdown/text block appended to the prompt
                         (nutritionist revisions, coach notes, etc.).

Outputs (gitignored):
  generated/diet-plans/<client>.json
  generated/diet-plans/<client>.html
  generated/diet-plans/RC-Diet-Plan-<client>.pdf

Keep real client questionnaires in questionnaires/local/ (gitignored).
`;

type CliArgs = {
    questionnairePath: string;
    revisionPath: string | null;
};

function printUsage() {
    console.info(USAGE.trim());
}

function resolveRepoPath(inputPath: string) {
    return path.isAbsolute(inputPath) ? inputPath : path.join(process.cwd(), inputPath);
}

function parseArgs(argv: string[]): CliArgs | "help" {
    if (argv.includes("--help") || argv.includes("-h")) {
        return "help";
    }

    const positional = argv.filter((arg) => !arg.startsWith("-"));
    const revisionFlagIndex = argv.findIndex((arg) => arg === "--revision");
    const revisionPath =
        revisionFlagIndex !== -1 && argv[revisionFlagIndex + 1]
            ? resolveRepoPath(argv[revisionFlagIndex + 1])
            : null;

    const questionnairePath = resolveRepoPath(positional[0] ?? DEFAULT_QUESTIONNAIRE);

    return { questionnairePath, revisionPath };
}

function sanitizeFilenamePart(value: string) {
    return value
        .trim()
        .replace(/[^a-z0-9-]+/gi, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60) || "Client";
}

function loadQuestionnaire(questionnairePath: string) {
    if (!fs.existsSync(questionnairePath)) {
        throw new Error(`Questionnaire file not found: ${questionnairePath}`);
    }

    const raw = JSON.parse(fs.readFileSync(questionnairePath, "utf8")) as Record<string, unknown>;
    return normalizeDietPlanQuestionnaireData(raw);
}

function loadRevision(revisionPath: string | null) {
    if (!revisionPath) {
        return "";
    }

    if (!fs.existsSync(revisionPath)) {
        throw new Error(`Revision file not found: ${revisionPath}`);
    }

    const revision = fs.readFileSync(revisionPath, "utf8").trim();
    if (!revision) {
        return "";
    }

    return `

━━━ NUTRITIONIST / COACH REVISION (MANDATORY) ━━━

${revision}

Regenerate the complete plan JSON with these revisions applied throughout all meal options, weekly planner, key foods, dos/donts, and family meal rules.`;
}

async function main() {
    const parsed = parseArgs(process.argv.slice(2));
    if (parsed === "help") {
        printUsage();
        return;
    }

    const aiProvider = resolveDietPlanAiProvider();
    if ("error" in aiProvider) {
        throw new Error(aiProvider.error);
    }

    const questionnaireData = loadQuestionnaire(parsed.questionnairePath);
    const clientName =
        typeof questionnaireData.name === "string" && questionnaireData.name.trim()
            ? questionnaireData.name.trim()
            : "Client";
    const slug = sanitizeFilenamePart(clientName);
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const prompt =
        buildDietPlanPrompt(questionnaireData) + loadRevision(parsed.revisionPath);

    console.info("[DietPlan:local] Requesting AI plan", {
        clientName,
        provider: aiProvider.provider,
        questionnairePath: parsed.questionnairePath,
        revisionPath: parsed.revisionPath,
    });

    const startedAt = Date.now();
    const dietPlan = await generateValidatedDietPlanJson({
        provider: aiProvider.provider,
        prompt,
    });
    console.info("[DietPlan:local] AI plan validated", {
        elapsedMs: Date.now() - startedAt,
    });

    const jsonPath = path.join(OUTPUT_DIR, `${slug}.json`);
    fs.writeFileSync(jsonPath, `${JSON.stringify(dietPlan, null, 2)}\n`);

    const html = renderDietPlanHtml(dietPlan, questionnaireData);
    const htmlPath = path.join(OUTPUT_DIR, `${slug}.html`);
    fs.writeFileSync(htmlPath, html);

    const pdfBuffer = await generatePdf(html);
    const pdfPath = path.join(OUTPUT_DIR, `RC-Diet-Plan-${slug}.pdf`);
    fs.writeFileSync(pdfPath, pdfBuffer);

    console.info("[DietPlan:local] Done", {
        bytes: pdfBuffer.byteLength,
        elapsedMs: Date.now() - startedAt,
        jsonPath,
        htmlPath,
        pdfPath,
    });
}

main().catch((error) => {
    console.error("[DietPlan:local] Failed:", error);
    process.exit(1);
});
