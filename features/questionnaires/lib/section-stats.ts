import type { QuestionnaireBuilderSectionNode } from "@/features/questionnaires/types";

export function countDescendantSections(node: QuestionnaireBuilderSectionNode): number {
  return node.children.reduce((total, child) => total + 1 + countDescendantSections(child), 0);
}

export function countNestedQuestions(node: QuestionnaireBuilderSectionNode): number {
  return node.questions.length + node.children.reduce((total, child) => total + countNestedQuestions(child), 0);
}
