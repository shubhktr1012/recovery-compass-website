import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface AppPurchaseWelcomeEmailProps {
    customerName: string;
    programName: string;
    store?: string | null;
    whatsappLink: string;
    calendlyLink: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recoverycompass.co";

function formatStoreLabel(store?: string | null) {
    const normalized = store?.trim().toLowerCase();

    switch (normalized) {
        case "app_store":
        case "app store":
        case "ios":
            return "App Store";
        case "play_store":
        case "play store":
        case "android":
            return "Google Play";
        default:
            return null;
    }
}

export default function AppPurchaseWelcomeEmail({
    customerName = "Seeker",
    programName = "Recovery Compass Program",
    store,
    whatsappLink,
    calendlyLink,
}: AppPurchaseWelcomeEmailProps) {
    const storeLabel = formatStoreLabel(store);

    return (
        <Html lang="en">
            <Head />
            <Preview>Your Recovery Compass program is unlocked.</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Img
                            src={`${baseUrl}/rc-logo-white.svg`}
                            width="80"
                            alt="Recovery Compass Logo"
                            style={logo}
                        />
                        <Text style={brandName}>Recovery Compass</Text>
                        <Text style={headerTagline}>Your journey begins now.</Text>
                    </Section>

                    <Section style={section}>
                        <Text style={h1}>{customerName}, your program is unlocked.</Text>
                        <Text style={p}>
                            You now have access to <strong>{programName}</strong> in the Recovery Compass app.
                            Open the app, complete your personalization, and begin your first session.
                        </Text>
                    </Section>

                    <Section style={card}>
                        <Text style={eyebrow}>Next Step</Text>
                        <Text style={cardTitle}>Open the app and start your journey</Text>
                        <Text style={cardText}>
                            Your access is already attached to this account. If you own multiple programs, choose the one
                            you want active inside the app.
                        </Text>
                    </Section>

                    <Section style={supportCard}>
                        <Text style={eyebrow}>Included Support</Text>
                        <Text style={cardTitle}>Join the community and book your strategy call</Text>
                        <Text style={cardText}>
                            Stay close to the team, ask questions, and get your plan aligned early.
                        </Text>
                        <Button href={whatsappLink} style={primaryButton}>
                            Open WhatsApp Community
                        </Button>
                        <Button href={calendlyLink} style={secondaryButton}>
                            Book Strategy Call
                        </Button>
                    </Section>

                    <Section style={section}>
                        <Hr style={hr} />
                        <Text style={note}>
                            {storeLabel
                                ? `Your official purchase receipt is handled by ${storeLabel}.`
                                : "Your official purchase receipt is handled by the store you used."}
                        </Text>
                    </Section>

                    <Section style={footer}>
                        <Text style={footerText}>
                            With belief in you —
                            <br />
                            <strong>The Recovery Compass Team</strong>
                        </Text>
                        <Text style={footerMeta}>
                            <a href={baseUrl} style={footerLink}>recoverycompass.co</a>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const ff = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const forest = "#11221c";
const muted = "#6b7f77";
const border = "#dde9e4";
const cream = "#f2f7f5";

const main = { backgroundColor: cream, padding: "40px 10px", fontFamily: ff };

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    width: "100%",
    maxWidth: "560px",
    borderRadius: "16px",
    border: `1px solid ${border}`,
    overflow: "hidden" as const,
};

const header = {
    backgroundColor: forest,
    padding: "40px 24px",
    textAlign: "center" as const,
};

const logo = {
    margin: "0 auto 12px",
    display: "block",
};

const brandName = {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 6px",
    fontFamily: ff,
};

const headerTagline = {
    color: "rgba(255,255,255,0.6)",
    fontSize: "13px",
    margin: "0",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    fontFamily: ff,
};

const section = { padding: "32px 32px 0" };

const h1 = {
    color: forest,
    fontSize: "26px",
    fontWeight: "700",
    margin: "0 0 16px",
    lineHeight: "1.3",
    fontFamily: ff,
};

const p = {
    color: "#44554f",
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0",
    fontFamily: ff,
};

const card = {
    margin: "32px 32px 0",
    padding: "24px",
    backgroundColor: "#f5faf8",
    borderRadius: "12px",
    border: `1px solid ${border}`,
};

const supportCard = {
    margin: "16px 32px 0",
    padding: "24px",
    backgroundColor: "#edfaf3",
    borderRadius: "12px",
    borderLeft: "4px solid #25D366",
};

const eyebrow = {
    color: muted,
    fontSize: "12px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em",
    margin: "0 0 8px",
    fontFamily: ff,
};

const cardTitle = {
    color: forest,
    fontSize: "20px",
    fontWeight: "700",
    margin: "0 0 10px",
    fontFamily: ff,
};

const cardText = {
    color: "#44554f",
    fontSize: "15px",
    lineHeight: "1.6",
    margin: "0 0 16px",
    fontFamily: ff,
};

const primaryButton = {
    backgroundColor: "#25D366",
    borderRadius: "999px",
    color: "#0d1e18",
    display: "inline-block",
    fontSize: "14px",
    fontWeight: "700",
    padding: "12px 18px",
    textDecoration: "none",
    fontFamily: ff,
    marginRight: "12px",
};

const secondaryButton = {
    backgroundColor: forest,
    borderRadius: "999px",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "14px",
    fontWeight: "700",
    padding: "12px 18px",
    textDecoration: "none",
    fontFamily: ff,
    marginTop: "12px",
};

const hr = {
    borderColor: border,
    margin: "0",
};

const note = {
    color: muted,
    fontSize: "13px",
    lineHeight: "1.6",
    margin: "20px 0 0",
    fontFamily: ff,
};

const footer = {
    padding: "32px",
};

const footerText = {
    color: "#44554f",
    fontSize: "15px",
    lineHeight: "1.6",
    margin: "0 0 12px",
    fontFamily: ff,
};

const footerMeta = {
    margin: "0",
};

const footerLink = {
    color: forest,
    textDecoration: "none",
    fontFamily: ff,
};
