import fs from "node:fs";
import path from "node:path";

import { render } from "@react-email/render";
import puppeteer from "puppeteer";
import React from "react";

import WelcomeReceiptEmail from "../components/emails/WelcomeReceiptEmail";

type ReceiptSeed = {
    customerName: string;
    programName: string;
    amountFormatted: string;
    orderId: string;
    receiptDate: string;
};

const receipts: ReceiptSeed[] = [
    {
        customerName: "James",
        programName: "21-Day Deep Sleep Reset",
        amountFormatted: "₹2,599.00",
        orderId: "RC-INV-202601-001",
        receiptDate: "2026-01-21T10:00:00Z",
    },
    {
        customerName: "Prajwal",
        programName: "6-Day Control",
        amountFormatted: "₹599.00",
        orderId: "RC-INV-202602-002",
        receiptDate: "2026-02-12T10:00:00Z",
    },
    {
        customerName: "Tejas",
        programName: "14-Day Energy Restore",
        amountFormatted: "₹1,499.00",
        orderId: "RC-INV-202602-003",
        receiptDate: "2026-02-18T10:00:00Z",
    },
    {
        customerName: "Mohit",
        programName: "6-Day Control",
        amountFormatted: "₹599.00",
        orderId: "RC-INV-202603-004",
        receiptDate: "2026-03-02T10:00:00Z",
    },
    {
        customerName: "Vineeth",
        programName: "14-Day Energy Restore",
        amountFormatted: "₹1,499.00",
        orderId: "RC-INV-202603-005",
        receiptDate: "2026-03-20T10:00:00Z",
    },
    {
        customerName: "Prishita Agrawal",
        programName: "90-Day Smoking Reset",
        amountFormatted: "₹5,999.00",
        orderId: "RC-INV-202604-006",
        receiptDate: "2026-04-10T10:00:00Z",
    },
    {
        customerName: "Shubh Khatri",
        programName: "21-Day Deep Sleep Reset",
        amountFormatted: "₹2,599.00",
        orderId: "RC-INV-202604-007",
        receiptDate: "2026-04-15T10:00:00Z",
    },
    {
        customerName: "Dev",
        programName: "30-Day Men's Vitality Reset",
        amountFormatted: "₹4,999.00",
        orderId: "RC-INV-202604-008",
        receiptDate: "2026-04-18",
    },
];

async function generate() {
    const browser = await puppeteer.launch({ headless: true });
    const outputDir = path.join(__dirname, "../generated/receipts");

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const receipt of receipts) {
        const element = React.createElement(WelcomeReceiptEmail, {
            customerName: receipt.customerName,
            programName: receipt.programName,
            amountFormatted: receipt.amountFormatted,
            orderId: receipt.orderId,
            receiptDate: receipt.receiptDate,
            whatsappLink: "https://chat.whatsapp.com/GgW0StdlYGB4FG4EqfgGv0",
            calendlyLink: "https://calendly.com/anjan-recoverycompass/30min",
        });

        const html = await render(element);
        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: "networkidle0" });

        const outputPath = path.join(outputDir, `${receipt.orderId}.pdf`);
        await page.pdf({
            path: outputPath,
            format: "A4",
            printBackground: true,
            margin: { top: "20px", bottom: "20px" },
        });
        console.log(`Generated ${receipt.orderId}.pdf`);
        await page.close();
    }

    await browser.close();
    console.log("All PDFs generated successfully.");
}

generate().catch(console.error);
