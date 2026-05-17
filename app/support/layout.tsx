import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Support & Contact",
    description: "Get help with your Recovery Compass account, purchase, program access, or technical issue.",
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
