import { describe, expect, it } from "vitest";

import { renderDetoxHtml } from "@/lib/detox-pdf-template";

describe("renderDetoxHtml", () => {
    it("includes condition-specific safety notes from questionnaire answers", () => {
        const html = renderDetoxHtml("Mira", "Gut Health", {
            health_conditions: ["Pregnant", "Heart condition diagnosed"],
        });

        expect(html).toContain("Safety notes from your answers");
        expect(html).toContain("Pregnant");
        expect(html).toContain("doctor approval");
        expect(html).toContain("Heart condition diagnosed");
        expect(html).toContain("medical clearance");
    });

    it("uses a standard safety note when no listed health conditions are selected", () => {
        const html = renderDetoxHtml("Mira", "Gut Health", {
            health_conditions: ["None of the above"],
        });

        expect(html).toContain("Safety note from your answers");
        expect(html).toContain("no listed medical conditions");
        expect(html).not.toContain("medical clearance");
    });
});
