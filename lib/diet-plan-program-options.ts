import { publicPrograms } from "@/lib/public-programs";

export const PROGRAM_OPTION_VALUES = publicPrograms.map((program) => program.title);

const PROGRAM_VALUE_ALIAS_BY_NAME: Record<string, string> = {
  "Sleep Reset": "Deep Sleep Reset",
  "21-Day Deep Sleep Reset": "Deep Sleep Reset",
  "14-Day Sleep Reset": "Deep Sleep Reset",
  "Energy Vitality": "Energy Restore",
  "14-Day Energy Restore": "Energy Restore",
  "14-Day Energy Reset": "Energy Restore",
  "Men's Vitality": "Men’s Vitality Reset",
  "Men’s Vitality": "Men’s Vitality Reset",
  "30-Day Men's Vitality Reset": "Men’s Vitality Reset",
  "30-Day Men’s Vitality Reset": "Men’s Vitality Reset",
  "Age Reversal": "Age Well",
  "90-Day Age Reversal": "Age Well",
  "90-Day Biohacking Reset": "Age Well",
  "21-Day Smoking & Alcohol Quit": "Smoking & Alcohol Quit",
  "21-Day Smoking Alcohol Quit": "Smoking & Alcohol Quit",
  "21-Day Gut Reset": "Gut Reset",
  "21-Day Gut Health Reset": "Gut Reset",
  "Gut Health Reset": "Gut Reset",
  "6-Day Free Detox Program": "Free Detox Program",
  "6-Day Detox Program": "Free Detox Program",
  "Free Detox Plan": "Free Detox Program",
  "6-Day Control": "Control",
  "90-Day Smoking Reset": "Smoking Reset",
};

export function normalizeProgramValues(values: string[]) {
  return Array.from(
    new Set(values.map((value) => PROGRAM_VALUE_ALIAS_BY_NAME[value] ?? value))
  );
}

export function normalizeQuestionnaireProgramValues<T extends Record<string, unknown>>(
  questionnaireData: T
): T {
  if (!Array.isArray(questionnaireData.programs)) {
    return questionnaireData;
  }

  return {
    ...questionnaireData,
    programs: normalizeProgramValues(
      questionnaireData.programs.filter(
        (program): program is string => typeof program === "string"
      )
    ),
  };
}
