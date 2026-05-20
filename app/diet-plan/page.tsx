import type { Metadata } from "next";
import { DietPlanClient } from "./diet-plan-client";

export const metadata: Metadata = {
    title: "Personalised Diet Plan | Recovery Compass Wellness",
    description:
        "Answer a 7-step intake form and receive a personalised Recovery Compass diet plan PDF by email.",
    alternates: {
        canonical: "/diet-plan",
    },
    openGraph: {
        title: "Personalised Diet Plan | Recovery Compass Wellness",
        description:
            "A culturally grounded diet plan PDF built around your health conditions, food habits, and regional cuisine.",
        url: "https://recoverycompass.co/diet-plan",
    },
};

export default function DietPlanPage() {
    return <DietPlanClient />;
}
