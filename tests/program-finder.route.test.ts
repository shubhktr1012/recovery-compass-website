import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const getUser = vi.fn();
  const onboardingUpsert = vi.fn();
  const profileUpsert = vi.fn();
  const questionnaireRunInsert = vi.fn();
  const from = vi.fn((table: string) => {
    if (table === "onboarding_responses") {
      return { upsert: onboardingUpsert };
    }
    if (table === "profiles") {
      return { upsert: profileUpsert };
    }
    if (table === "questionnaire_runs") {
      return { insert: questionnaireRunInsert };
    }
    throw new Error(`Unexpected table: ${table}`);
  });
  const createSupabaseServerClient = vi.fn(async () => ({
    auth: { getUser },
    from,
  }));

  return {
    createSupabaseServerClient,
    from,
    getUser,
    onboardingUpsert,
    profileUpsert,
    questionnaireRunInsert,
  };
});

vi.mock("@/lib/supabase-server", () => ({
  createSupabaseServerClient: mocks.createSupabaseServerClient,
}));

import { POST } from "@/app/api/program-finder/complete/route";
import type { OnboardingAnswers } from "@/lib/recovery-profile";

function buildRequest(body: unknown) {
  return {
    json: async () => body,
  } as unknown;
}

function buildAnswers(overrides?: Partial<OnboardingAnswers>): OnboardingAnswers {
  return {
    name: "Shubh",
    phoneNumber: "+919999999999",
    age: "24",
    gender: "Male",
    path: "self_select",
    selfSelectJourney: "energy_vitality",
    guidedMainIssue: null,
    questionValues: {},
    ...overrides,
  };
}

describe("POST /api/program-finder/complete", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_ENABLE_PROGRAM_FINDER = "true";
    mocks.createSupabaseServerClient.mockClear();
    mocks.getUser.mockReset();
    mocks.from.mockClear();
    mocks.onboardingUpsert.mockReset();
    mocks.profileUpsert.mockReset();
    mocks.questionnaireRunInsert.mockReset();

    mocks.getUser.mockResolvedValue({
      data: { user: { id: "user-1", email: "shubh@example.com" } },
      error: null,
    });
    mocks.onboardingUpsert.mockResolvedValue({ error: null });
    mocks.profileUpsert.mockResolvedValue({ error: null });
    mocks.questionnaireRunInsert.mockResolvedValue({ error: null });
  });

  it("returns 404 when Program Finder is disabled", async () => {
    process.env.NEXT_PUBLIC_ENABLE_PROGRAM_FINDER = "false";

    const response = await POST(buildRequest({ answers: buildAnswers() }) as never);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ message: "Program Finder is not available." });
    expect(mocks.createSupabaseServerClient).not.toHaveBeenCalled();
  });

  it("rejects unauthenticated users", async () => {
    mocks.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: null,
    });

    const response = await POST(buildRequest({ answers: buildAnswers() }) as never);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ message: "Unauthorized" });
  });

  it("saves the shared questionnaire payload and returns the recommendation", async () => {
    const response = await POST(buildRequest({ answers: buildAnswers() }) as never);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      journey: "energy_vitality",
      recommendedProgram: "energy_vitality",
      primaryConcernLabel: "Energy Restore",
    });

    expect(mocks.onboardingUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "user-1",
        target_selection: "Energy Restore",
      }),
      { onConflict: "user_id" }
    );
    expect(mocks.profileUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "user-1",
        email: "shubh@example.com",
        onboarding_complete: true,
        recommended_program: "energy_vitality",
        phone_number: "+919999999999",
      }),
      { onConflict: "id" }
    );
    expect(mocks.questionnaireRunInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "user-1",
        source: "website_program_finder",
        recommended_program: "energy_vitality",
      })
    );
  });
});
