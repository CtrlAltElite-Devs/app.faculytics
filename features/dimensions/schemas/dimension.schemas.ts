import { z } from "zod";

import { QUESTIONNAIRE_TYPES } from "@/features/questionnaires/constants";

export const createDimensionSchema = z.object({
  displayName: z
    .string()
    .min(1, "Display name is required.")
    .max(255, "Display name must be at most 255 characters."),
  questionnaireType: z.enum(QUESTIONNAIRE_TYPES, {
    message: "Questionnaire type is required.",
  }),
  code: z
    .string()
    .regex(
      /^[A-Z][A-Z0-9_]*$/,
      "Code must start with a letter and contain only A-Z, 0-9, and underscores."
    )
    .optional()
    .or(z.literal("")),
});

export type CreateDimensionFormValues = z.infer<typeof createDimensionSchema>;

export const editDimensionSchema = z.object({
  displayName: z
    .string()
    .min(1, "Display name is required.")
    .max(255, "Display name must be at most 255 characters."),
});

export type EditDimensionFormValues = z.infer<typeof editDimensionSchema>;
