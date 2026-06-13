import { existsSync } from "node:fs";

function getDevChromeExecutablePath() {
    const candidates = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
        "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ];

    return candidates.find((candidate) => existsSync(candidate));
}

export async function generatePdf(html: string): Promise<Buffer> {
    type PdfPage = {
        setContent: (content: string, options: { waitUntil: "networkidle0" }) => Promise<void>;
        pdf: (options: {
            format: "A4";
            printBackground: boolean;
            margin: { top: string; right: string; bottom: string; left: string };
        }) => Promise<Uint8Array>;
    };
    type PdfBrowser = {
        newPage: () => Promise<PdfPage>;
        close: () => Promise<void>;
    };

    let browser: PdfBrowser | null = null;

    try {
        if (process.env.NODE_ENV === "production") {
            const chromium = (await import("@sparticuz/chromium")).default;
            const puppeteer = (await import("puppeteer-core")).default;
            const headless = "shell" as const;

            browser = await puppeteer.launch({
                args: await puppeteer.defaultArgs({ args: chromium.args, headless }),
                defaultViewport: {
                    width: 1280,
                    height: 720,
                    deviceScaleFactor: 1,
                },
                executablePath: await chromium.executablePath(),
                headless,
            }) as unknown as PdfBrowser;
        } else {
            const puppeteer = (await import("puppeteer")).default;
            browser = await puppeteer.launch({
                executablePath: getDevChromeExecutablePath(),
                headless: true,
            }) as unknown as PdfBrowser;
        }

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
        });

        return Buffer.from(pdf);
    } finally {
        await browser?.close();
    }
}
