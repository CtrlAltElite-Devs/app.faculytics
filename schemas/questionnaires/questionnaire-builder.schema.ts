import { z } from "zod";

import { BUILDER_QUESTION_TYPES, QUESTIONNAIRE_TYPES } from "@/types/questionnaires";

export const questionnaireBuilderMetadataSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(120, "Title must be 120 characters or fewer."),
  type: z.enum(QUESTIONNAIRE_TYPES),
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
  title: z
    .string()
    .trim()
    .min(3, "Comment section title must be at least 3 characters.")
    .max(120, "Comment section title must be 120 characters or fewer."),
  description: z
    .string()
    .trim()
    .max(500, "Comment section description must be 500 characters or fewer."),
  placeholder: z
    .string()
    .trim()
    .max(200, "Comment placeholder must be 200 characters or fewer."),
  required: z.boolean(),
});
