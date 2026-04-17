import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Preview,
    Section,
    Text,
    Row,
    Column,
} from "@react-email/components";
import * as React from "react";

interface WelcomeReceiptEmailProps {
    customerName: string;
    programName: string;
    amountFormatted: string;
    orderId: string;
    whatsappLink: string;
    calendlyLink: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recoverycompass.co";

export const WelcomeReceiptEmail = ({
    customerName = "Seeker",
    programName = "Recovery Compass Program",
    amountFormatted = "₹4,999.00",
    orderId = "order_placeholder",
    whatsappLink = "https://chat.whatsapp.com/GgW0StdlYGB4FG4EqfgGv0",
    calendlyLink = "https://calendly.com/anjan-recoverycompass/30min",
}: WelcomeReceiptEmailProps) => {
    return (
        <Html lang="en">
            <Head />
            <Preview>Welcome to Recovery Compass. Your receipt and first steps are inside.</Preview>
            <Body style={main}>
                <Container style={container}>

                    {/* Header */}
                    <Section style={header}>
                        <Text style={brandName}>Recovery Compass</Text>
                        <Text style={headerTagline}>Your journey begins now.</Text>
                    </Section>

                    {/* Welcome */}
                    <Section style={section}>
                        <Text style={h1}>Welcome, {customerName}.</Text>
                        <Text style={p}>
                            Your payment is confirmed and your spot is locked in. We are honoured to walk this road with you. Here is everything you need to get started right now:
                        </Text>
                    </Section>

                    {/* WhatsApp CTA */}
                    <Section style={waBlock}>
                        <Text style={ctaEyebrow}>Step 1</Text>
                        <Text style={ctaTitle}>Join the Inner Circle</Text>
                        <Text style={ctaText}>
                            Connect with guides and fellow members walking the same path in our private WhatsApp community.
                        </Text>
                        <Button href={whatsappLink} style={waBtn}>
                            Open WhatsApp Community →
                        </Button>
                    </Section>

                    {/* Calendly CTA */}
                    <Section style={calBlock}>
                        <Text style={ctaEyebrow}>Step 2 · Included Free</Text>
                        <Text style={ctaTitle}>Book Your 1-on-1 Strategy Call</Text>
                        <Text style={ctaText}>
                            A private session to set your baseline and personalise your routine — included in your plan at no extra cost.
                        </Text>
                        <Button href={calendlyLink} style={calBtn}>
                            Schedule on Calendly →
                        </Button>
                    </Section>

                    {/* Divider */}
                    <Section style={section}>
                        <Hr style={hr} />
                    </Section>

                    {/* Receipt */}
                    <Section style={section}>
                        <Text style={receiptTitle}>Payment Receipt</Text>

                        <Row style={tableHeaderRow}>
                            <Column style={colLeftHeader}>
                                <Text style={tableHeaderText}>Description</Text>
                            </Column>
                            <Column style={colRightHeader}>
                                <Text style={tableHeaderText}>Amount</Text>
                            </Column>
                        </Row>

                        <Row style={tableRow}>
                            <Column style={colLeftItem}>
                                <Text style={itemName}>{programName}</Text>
                                <Text style={itemSub}>Order: {orderId}</Text>
                            </Column>
                            <Column style={colRightItem}>
                                <Text style={itemAmount}>{amountFormatted}</Text>
                            </Column>
                        </Row>

                        <Row style={totalRow}>
                            <Column style={colLeftTotal}>
                                <Text style={totalLabel}>Total Paid</Text>
                            </Column>
                            <Column style={colRightTotal}>
                                <Text style={totalAmount}>{amountFormatted}</Text>
                            </Column>
                        </Row>

                        <Text style={receiptNote}>
                            Please keep this email for your records.
                        </Text>
                    </Section>

                    {/* Footer */}
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
};

export default WelcomeReceiptEmail;

// ─────────────────────────────────────────────────────────────────────────────
// Styles — email-safe only (no flex, no grid)
// ─────────────────────────────────────────────────────────────────────────────

const ff = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const forest = "#11221c";
const muted = "#6b7f77";
const border = "#dde9e4";
const cream = "#f2f7f5";

const main = { backgroundColor: cream, padding: "20px 10px", fontFamily: ff };

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    width: "100%",
    maxWidth: "560px",
    borderRadius: "12px",
    border: `1px solid ${border}`,
    overflow: "hidden" as const,
};

const header = {
    backgroundColor: forest,
    padding: "32px 24px",
    textAlign: "center" as const,
};

const brandName = {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "700",
    margin: "0 0 6px",
    letterSpacing: "-0.3px",
    fontFamily: ff,
};

const headerTagline = {
    color: "rgba(255,255,255,0.45)",
    fontSize: "12px",
    margin: "0",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    fontFamily: ff,
};

const section = { padding: "24px 24px 0" };

const h1 = {
    color: forest,
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 0 14px",
    lineHeight: "1.3",
    fontFamily: ff,
};

const p = {
    color: "#44554f",
    fontSize: "15px",
    lineHeight: "1.6",
    margin: "0",
    fontFamily: ff,
};

// WhatsApp block
const waBlock = {
    margin: "24px 24px 0",
    padding: "20px",
    backgroundColor: "#edfaf3",
    borderRadius: "8px",
    borderLeft: "4px solid #25D366",
};

// Calendly block
const calBlock = {
    margin: "16px 24px 0",
    padding: "20px",
    backgroundColor: "#eef4ff",
    borderRadius: "8px",
    borderLeft: "4px solid #006BFF",
};

const ctaEyebrow = {
    fontSize: "10px",
    fontWeight: "700",
    color: muted,
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em",
    margin: "0 0 4px",
    fontFamily: ff,
};

const ctaTitle = {
    fontSize: "17px",
    fontWeight: "700",
    color: forest,
    margin: "0 0 8px",
    fontFamily: ff,
};

const ctaText = {
    fontSize: "14px",
    color: "#44554f",
    lineHeight: "1.5",
    margin: "0 0 16px",
    fontFamily: ff,
};

const waBtn = {
    backgroundColor: "#25D366",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    textDecoration: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    display: "inline-block",
    fontFamily: ff,
};

const calBtn = {
    backgroundColor: "#006BFF",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    textDecoration: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    display: "inline-block",
    fontFamily: ff,
};

const hr = { borderColor: border, margin: "0" };

const receiptTitle = {
    fontSize: "16px",
    fontWeight: "700",
    color: forest,
    margin: "0 0 16px",
    fontFamily: ff,
};

const tableHeaderRow = {
    // borderBottom: `2px solid ${forest}`, -> borderBottom on Row doesn't work well across all clients
};

const tableRow = {
    // borderBottom: `1px solid ${border}`,
};

const totalRow = {
    // padding applied to columns instead
};

const colLeftHeader = { width: "65%", verticalAlign: "bottom" as const, borderBottom: `2px solid ${forest}`, paddingBottom: "8px" };
const colRightHeader = { width: "35%", verticalAlign: "bottom" as const, textAlign: "right" as const, borderBottom: `2px solid ${forest}`, paddingBottom: "8px" };

const colLeftItem = { width: "65%", verticalAlign: "top" as const, borderBottom: `1px solid ${border}`, paddingTop: "12px", paddingBottom: "12px"  };
const colRightItem = { width: "35%", verticalAlign: "top" as const, textAlign: "right" as const, borderBottom: `1px solid ${border}`, paddingTop: "12px", paddingBottom: "12px" };

const colLeftTotal = { width: "65%", verticalAlign: "top" as const, paddingTop: "12px" };
const colRightTotal = { width: "35%", verticalAlign: "top" as const, textAlign: "right" as const, paddingTop: "12px" };


const tableHeaderText = {
    fontSize: "10px",
    fontWeight: "700",
    color: muted,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    margin: "0",
    fontFamily: ff,
};

const itemName = { fontSize: "14px", fontWeight: "600", color: forest, margin: "0 0 3px", fontFamily: ff };
const itemSub = { fontSize: "12px", color: muted, margin: "0", fontFamily: ff };
const itemAmount = { fontSize: "14px", fontWeight: "600", color: forest, margin: "0", fontFamily: ff };
const totalLabel = { fontSize: "15px", fontWeight: "700", color: forest, margin: "0", fontFamily: ff };
const totalAmount = { fontSize: "17px", fontWeight: "700", color: forest, margin: "0", fontFamily: ff };

const receiptNote = { fontSize: "12px", color: muted, margin: "16px 0 0", fontStyle: "italic", fontFamily: ff, lineHeight: "1.4" };

const footer = {
    padding: "24px",
    marginTop: "24px",
    borderTop: `1px solid ${border}`,
    backgroundColor: cream,
};

const footerText = { fontSize: "14px", color: muted, margin: "0 0 8px", lineHeight: "1.5", fontFamily: ff };
const footerMeta = { fontSize: "12px", color: muted, margin: "0", fontFamily: ff };
const footerLink = { color: forest, textDecoration: "underline" };
