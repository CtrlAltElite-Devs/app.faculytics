import type { QuestionnaireBuilderPreviewSection } from "@/features/questionnaires/types/builder";

/**
 * Recursively collects IDs of all required questions across sections.
 * Used to validate that a student has answered all required questions before submission.
 */
export function collectRequiredIds(section: QuestionnaireBuilderPreviewSection): string[] {
  if (section.questions.length > 0) {
    return section.questions.filter((q) => q.required).map((q) => q.id);
  }
  return section.children.flatMap(collectRequiredIds);
}
