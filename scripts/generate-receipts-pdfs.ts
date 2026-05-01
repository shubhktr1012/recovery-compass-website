import { render } from '@react-email/render';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import React from 'react';

// Import components
import JamesReceipt from '../components/emails/JamesReceipt';
import PrajwalReceipt from '../components/emails/PrajwalReceipt';
import TejasReceipt from '../components/emails/TejasReceipt';
import MohitReceipt from '../components/emails/MohitReceipt';
import VineethReceipt from '../components/emails/VineethReceipt';
import PrishitaReceipt from '../components/emails/PrishitaReceipt';
import ShubhReceipt from '../components/emails/ShubhReceipt';
import DevReceipt from '../components/emails/DevReceipt';

const receipts = [
    { component: JamesReceipt, orderId: "RC-INV-202601-001" },
    { component: PrajwalReceipt, orderId: "RC-INV-202602-002" },
    { component: TejasReceipt, orderId: "RC-INV-202602-003" },
    { component: MohitReceipt, orderId: "RC-INV-202603-004" },
    { component: VineethReceipt, orderId: "RC-INV-202603-005" },
    { component: PrishitaReceipt, orderId: "RC-INV-202604-006" },
    { component: ShubhReceipt, orderId: "RC-INV-202604-007" },
    { component: DevReceipt, orderId: "RC-INV-202604-008" },
];

async function generate() {
    const browser = await puppeteer.launch({ headless: true });
    const outputDir = path.join(__dirname, '../generated/receipts');
    
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const r of receipts) {
        // @ts-ignore
        const element = React.createElement(r.component);
        const html = await render(element);
        const page = await browser.newPage();
        
        // Wait until network is idle to make sure images (like the logo) are loaded
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        const outputPath = path.join(outputDir, `${r.orderId}.pdf`);
        await page.pdf({ 
            path: outputPath, 
            format: 'A4', 
            printBackground: true,
            margin: { top: '20px', bottom: '20px' }
        });
        console.log(`Generated ${r.orderId}.pdf`);
        await page.close();
    }

    await browser.close();
    console.log("All PDFs generated successfully.");
}

generate().catch(console.error);
