import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { render } from "@react-email/render";
import React from "react";
import WelcomeReceiptEmail from "../components/emails/WelcomeReceiptEmail";

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, "..");
const outputDir = path.join(webRoot, "generated", "receipts");
const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "recovery-compass-receipts-"));

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const receiptEntries = [
  {
    customerName: "Prishita Agrawal",
    programName: "90-Day Smoking Reset",
    amountFormatted: "₹5,999.00",
    orderId: "RC-INV-202604-006",
    receiptDate: "2026-04-10T10:00:00Z",
    outputName: "PrishitaReceipt.pdf",
  },
  {
    customerName: "Shubh Khatri",
    programName: "21-Day Deep Sleep Reset",
    amountFormatted: "₹2,599.00",
    orderId: "RC-INV-202604-007",
    receiptDate: "2026-04-15T10:00:00Z",
    outputName: "ShubhReceipt.pdf",
  },
  {
    customerName: "Dev",
    programName: "30-Day Men's Vitality Reset",
    amountFormatted: "₹4,999.00",
    orderId: "RC-INV-202604-008",
    receiptDate: "2026-04-18",
    outputName: "DevReceipt.pdf",
  },
];

async function ensureChrome() {
  await fs.access(chromePath);
}

async function renderReceiptHtml(receipt) {
  const html = await render(React.createElement(WelcomeReceiptEmail, {
    customerName: receipt.customerName,
    programName: receipt.programName,
    amountFormatted: receipt.amountFormatted,
    orderId: receipt.orderId,
    receiptDate: receipt.receiptDate,
    whatsappLink: "https://chat.whatsapp.com/GgW0StdlYGB4FG4EqfgGv0",
    calendlyLink: "https://calendly.com/anjan-recoverycompass/30min",
  }), {
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
    const html = await renderReceiptHtml(entry);
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
