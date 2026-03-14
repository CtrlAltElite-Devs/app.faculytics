import {
  collectLeafSections,
  isLeafSection,
  sortSections,
} from "@/lib/questionnaires/builder-validator";
import type {
  QuestionnaireBuilderDraft,
  QuestionnaireBuilderPreviewModel,
  QuestionnaireBuilderPreviewSection,
  QuestionnaireBuilderQuestionNode,
  QuestionnaireBuilderSectionNode,
  QuestionnaireSchemaQuestion,
  QuestionnaireSchemaSectionTreeNode,
  QuestionnaireVersionSchema,
} from "@/types/questionnaires";

function serializeQuestion(question: QuestionnaireBuilderQuestionNode): QuestionnaireSchemaQuestion {
  return {
    id: question.id,
    text: question.prompt.trim(),
    type: question.type,
    order: question.order,
    required: question.required,
  };
}

function serializeSectionTree(
  section: QuestionnaireBuilderSectionNode
): QuestionnaireSchemaSectionTreeNode {
  const base: QuestionnaireSchemaSectionTreeNode = {
    id: section.id,
    order: section.order,
    title: section.title.trim(),
  };

  if (isLeafSection(section)) {
    base.weight = section.weight ?? 0;
    base.questions = section.questions
      .slice()
      .sort((left, right) => left.order - right.order)
      .map(serializeQuestion);
  } else {
    base.sections = sortSections(section.children).map(serializeSectionTree);
  }

  return base;
}

export function buildQuestionnaireSectionTree(
  draft: QuestionnaireBuilderDraft
): QuestionnaireSchemaSectionTreeNode[] {
  return sortSections(draft.sections).map(serializeSectionTree);
}

export function serializeQuestionnaireBuilderDraft(
  draft: QuestionnaireBuilderDraft
): QuestionnaireVersionSchema {
  const sections = collectLeafSections(draft.sections).map((section, index) => {
    const parentPath: string[] = [];

    const walk = (
      nodes: QuestionnaireBuilderSectionNode[],
      ancestors: string[]
    ): boolean => {
      for (const node of nodes) {
        if (node.id === section.id) {
          parentPath.push(...ancestors);
          return true;
        }

        if (walk(node.children, [...ancestors, node.id])) {
          return true;
        }
      }

      return false;
    };

    walk(draft.sections, []);

    return {
      id: section.id,
      order: index + 1,
      title: section.title.trim(),
      weight: section.weight ?? 0,
      parentPath,
      questions: section.questions
        .slice()
        .sort((left, right) => left.order - right.order)
        .map(serializeQuestion),
    };
  });

  return {
    meta: {
      version: 1,
      maxScore: 5,
      scoringModel: "SECTION_WEIGHTED",
      questionnaireType: draft.metadata.type,
    },
    sections,
    ...(draft.qualitative.enabled
      ? {
          qualitativeSection: {
            id: "qualitative-comment",
            order: sections.length + 1,
            title: draft.qualitative.title.trim(),
            description: draft.qualitative.description.trim(),
            placeholder: draft.qualitative.placeholder.trim(),
            required: draft.qualitative.required,
            type: "QUALITATIVE_COMMENT" as const,
          },
        }
      : {}),
  };
}

function buildPreviewSection(
  section: QuestionnaireBuilderSectionNode,
  depth: number,
  path: string[]
): QuestionnaireBuilderPreviewSection {
  return {
    id: section.id,
    title: section.title,
    order: section.order,
    weight: section.weight,
    depth,
    path,
    questions: section.questions
      .slice()
      .sort((left, right) => left.order - right.order)
      .map((question) => ({
        id: question.id,
        prompt: question.prompt,
        type: question.type,
        required: question.required,
        order: question.order,
      })),
    children: sortSections(section.children).map((child) =>
      buildPreviewSection(child, depth + 1, [...path, section.title])
    ),
  };
}

export function buildQuestionnairePreviewModel(
  draft: QuestionnaireBuilderDraft
): QuestionnaireBuilderPreviewModel {
  return {
    title: draft.metadata.title.trim() || draft.metadata.questionnaireTitle || "Untitled questionnaire",
    type: draft.metadata.type,
    sections: sortSections(draft.sections).map((section) => buildPreviewSection(section, 0, [])),
    qualitative: draft.qualitative,
  };
}
