import { publicPrograms } from "@/lib/public-programs";

export const PROGRAM_OPTION_VALUES = publicPrograms.map((program) => program.title);

const PROGRAM_VALUE_ALIAS_BY_NAME: Record<string, string> = {
  "Sleep Reset": "Deep Sleep Reset Program",
  "Deep Sleep Reset": "Deep Sleep Reset Program",
  "21-Day Deep Sleep Reset": "Deep Sleep Reset Program",
  "14-Day Sleep Reset": "Deep Sleep Reset Program",
  "Energy Vitality": "Energy Restore Program",
  "Energy Restore": "Energy Restore Program",
  "14-Day Energy Restore": "Energy Restore Program",
  "14-Day Energy Reset": "Energy Restore Program",
  "Men's Vitality": "Men’s Vitality Reset Program",
  "Men’s Vitality": "Men’s Vitality Reset Program",
  "Men's Vitality Reset": "Men’s Vitality Reset Program",
  "Men’s Vitality Reset": "Men’s Vitality Reset Program",
  "30-Day Men's Vitality Reset": "Men’s Vitality Reset Program",
  "30-Day Men’s Vitality Reset": "Men’s Vitality Reset Program",
  "Age Well": "Age Reversal Program",
  "Age Reversal": "Age Reversal Program",
  "90-Day Age Reversal": "Age Reversal Program",
  "90-Day Biohacking Reset": "Age Reversal Program",
  "Smoking & Alcohol Quit": "Smoking & Alcohol Quit Program",
  "21-Day Smoking & Alcohol Quit": "Smoking & Alcohol Quit Program",
  "21-Day Smoking Alcohol Quit": "Smoking & Alcohol Quit Program",
  "Gut Reset": "Gut Reset Program",
  "21-Day Gut Reset": "Gut Reset Program",
  "21-Day Gut Health Reset": "Gut Reset Program",
  "Gut Health Reset": "Gut Reset Program",
  "6-Day Free Detox Program": "Free Detox Program",
  "6-Day Detox Program": "Free Detox Program",
  "Free Detox Plan": "Free Detox Program",
  "6-Day Control": "Control",
  "90-Day Smoking Reset": "Smoking Reset",
  "90-Day Master": "Smoking Reset",
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
