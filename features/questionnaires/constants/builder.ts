export const BUILDER_QUESTION_TYPES = ["LIKERT_1_5", "YES_NO"] as const;

export const DEFAULT_BUILDER_QUESTION_TYPE = "LIKERT_1_5";

export const MAX_SECTION_NESTING_LEVEL = 4;

export const DEFAULT_QUALITATIVE_MAX_LENGTH = 1000;


export const LIKERT_OPTIONS = ["1", "2", "3", "4", "5"] as const;

export const YES_NO_OPTIONS = ["Yes", "No"] as const;

export const YES_NO_VALUE_MAP: Record<string, number> = { Yes: 5, No: 1 };

export const YES_NO_REVERSE_MAP: Record<number, string> = { 5: "Yes", 1: "No" };



