import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Support & Contact",
    description: "Get help with the Recovery Compass application. Contact our support team for inquiries, bug reports, and assistance.",
    alternates: {
        canonical: "/support",
    },
};

export default function SupportLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
