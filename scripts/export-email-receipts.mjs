import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { render } from "@react-email/render";
import { build } from "esbuild";
import React from "react";

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, "..");
const outputDir = path.join(webRoot, "generated", "receipts");
const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "recovery-compass-receipts-"));

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const receiptEntries = [
  {
    input: path.join(webRoot, "components", "emails", "PrishitaReceipt.tsx"),
    outputName: "PrishitaReceipt.pdf",
  },
  {
    input: path.join(webRoot, "components", "emails", "ShubhReceipt.tsx"),
    outputName: "ShubhReceipt.pdf",
  },
  {
    input: path.join(webRoot, "components", "emails", "DevReceipt.tsx"),
    outputName: "DevReceipt.pdf",
  },
];

async function ensureChrome() {
  await fs.access(chromePath);
}

async function renderReceiptHtml(componentPath) {
  const bundledPath = path.join(
    tempDir,
    `${path.basename(componentPath).replace(/\.[^.]+$/, "")}.mjs`,
  );

  await build({
    entryPoints: [componentPath],
    outfile: bundledPath,
    bundle: true,
    format: "esm",
    platform: "node",
    jsx: "automatic",
    logLevel: "silent",
  });

  const mod = await import(`file://${bundledPath}?t=${Date.now()}`);
  const Component = mod.default ?? Object.values(mod).find((value) => typeof value === "function");

  if (!Component) {
    throw new Error(`No React component export found in ${componentPath}`);
  }

  const html = await render(React.createElement(Component), {
    pretty: true,
  });

  return `<!doctype html>${html}`;
}

async function printHtmlToPdf(htmlPath, pdfPath) {
  await execFileAsync(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--hide-scrollbars",
    "--run-all-compositor-stages-before-draw",
    "--print-to-pdf-no-header",
    `--print-to-pdf=${pdfPath}`,
    `file://${htmlPath}`,
  ]);
}

async function main() {
  await ensureChrome();
  await fs.mkdir(outputDir, { recursive: true });

  for (const entry of receiptEntries) {
    const html = await renderReceiptHtml(entry.input);
    const htmlPath = path.join(tempDir, `${path.basename(entry.outputName, ".pdf")}.html`);
    const pdfPath = path.join(outputDir, entry.outputName);

    await fs.writeFile(htmlPath, html, "utf8");
    await printHtmlToPdf(htmlPath, pdfPath);

    console.log(`Created ${pdfPath}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
