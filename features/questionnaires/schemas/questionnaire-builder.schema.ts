import { z } from "zod";

import { BUILDER_QUESTION_TYPES } from "@/features/questionnaires/constants/builder";

export const questionnaireBuilderMetadataSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(120, "Title must be 120 characters or fewer."),
  type: z
    .string()
    .trim()
    .min(1, "Questionnaire type is required.")
    .max(255, "Questionnaire type must be 255 characters or fewer."),
});

export const questionnaireSectionInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Section title is required.")
    .max(120, "Section title must be 120 characters or fewer."),
  weight: z.union([
    z.null(),
    z
      .number()
      .int("Weight must be a whole number.")
      .min(1, "Weight must be at least 1.")
      .max(100, "Weight must be 100 or less."),
  ]),
  dimensionCode: z.union([
    z.null(),
    z
      .string()
      .trim()
      .min(1, "Dimension code is required.")
      .max(255, "Dimension code must be 255 characters or fewer."),
  ]),
});

export const questionnaireQuestionInputSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(5, "Question text must be at least 5 characters.")
    .max(500, "Question text must be 500 characters or fewer."),
  type: z.enum(BUILDER_QUESTION_TYPES),
});

export const questionnaireQualitativeConfigSchema = z.object({
  enabled: z.boolean(),
  required: z.boolean(),
  maxLength: z
    .number()
    .int("Maximum length must be a whole number.")
    .min(1, "Maximum length must be at least 1.")
    .max(5000, "Maximum length must be 5000 characters or fewer."),
});
