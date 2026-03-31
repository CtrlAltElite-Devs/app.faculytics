import { z } from "zod";

export const createQuestionnaireTypeManagementSchema = z.object({
  name: z.string().min(1, "Name is required.").max(255, "Name must be at most 255 characters."),
  code: z
    .string()
    .min(1, "Code is required.")
    .max(255, "Code must be at most 255 characters.")
    .regex(/^[A-Z][A-Z0-9_]*$/, "Code must be SCREAMING_SNAKE_CASE and start with a letter."),
  description: z
    .string()
    .max(255, "Description must be at most 255 characters.")
    .optional()
    .or(z.literal("")),
});

export type CreateQuestionnaireTypeManagementFormValues = z.infer<
  typeof createQuestionnaireTypeManagementSchema
>;

export const editQuestionnaireTypeManagementSchema = z.object({
  name: z.string().min(1, "Name is required.").max(255, "Name must be at most 255 characters."),
  description: z
    .string()
    .max(255, "Description must be at most 255 characters.")
    .optional()
    .or(z.literal("")),
});

export type EditQuestionnaireTypeManagementFormValues = z.infer<
  typeof editQuestionnaireTypeManagementSchema
>;
