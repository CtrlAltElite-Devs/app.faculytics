import {
  DEFAULT_BUILDER_QUESTION_TYPE,
  DEFAULT_QUALITATIVE_MAX_LENGTH,
} from "@/features/questionnaires/constants/builder";
import { isLeafSection, sortSections } from "@/features/questionnaires/lib/builder-validator";
import type {
  QuestionnaireBuilderDraft,
  QuestionnaireBuilderQualitativeConfig,
  QuestionnaireBuilderQuestionNode,
  QuestionnaireBuilderSectionNode,
  QuestionnaireType,
} from "@/features/questionnaires/types";

export function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function createEmptyQualitativeConfig(): QuestionnaireBuilderQualitativeConfig {
  return {
    enabled: false,
    required: false,
    maxLength: DEFAULT_QUALITATIVE_MAX_LENGTH,
  };
}

export function normalizeQualitativeConfig(
  qualitative?: Partial<QuestionnaireBuilderQualitativeConfig>
): QuestionnaireBuilderQualitativeConfig {
  return {
    ...createEmptyQualitativeConfig(),
    ...qualitative,
    maxLength: qualitative?.maxLength ?? DEFAULT_QUALITATIVE_MAX_LENGTH,
  };
}

export function createQuestion(
  order: number,
  type: QuestionnaireBuilderQuestionNode["type"]
): QuestionnaireBuilderQuestionNode {
  return {
    id: createId("question"),
    prompt: "",
    type,
    order,
    required: true,
  };
}

export function createSection(order: number): QuestionnaireBuilderSectionNode {
  const questionType: QuestionnaireBuilderQuestionNode["type"] = DEFAULT_BUILDER_QUESTION_TYPE;

  return {
    id: createId("section"),
    title: `Section ${order}`,
    order,
    weight: null,
    dimensionCode: null,
    dimensionCodeIssue: null,
    questionType,
    questions: [createQuestion(1, questionType)],
    children: [],
  };
}

export function resequenceQuestions(questions: QuestionnaireBuilderQuestionNode[]) {
  return questions.map((question, index) => ({
    ...question,
    order: index + 1,
  }));
}

export function normalizeSections(
  sections: QuestionnaireBuilderSectionNode[]
): QuestionnaireBuilderSectionNode[] {
  return sections.map((section) => {
    const questionType =
      section.questionType ??
      section.questions
        .slice()
        .sort((left, right) => left.order - right.order)[0]?.type ??
      DEFAULT_BUILDER_QUESTION_TYPE;

    return {
      ...section,
      dimensionCode: isLeafSection(section) ? section.dimensionCode ?? null : null,
      dimensionCodeIssue: isLeafSection(section) ? section.dimensionCodeIssue ?? null : null,
      questionType,
      questions: resequenceQuestions(
        section.questions
          .slice()
          .sort((left, right) => left.order - right.order)
          .map((question) => ({
            ...question,
            type: questionType,
          }))
      ),
      children: normalizeSections(section.children),
    };
  });
}

export function createDraft(
  type: QuestionnaireType,
  overrides?: Partial<QuestionnaireBuilderDraft>
): QuestionnaireBuilderDraft {
  return {
    metadata: {
      type,
      title: "",
      questionnaireId: null,
      versionId: null,
      titleLocked: false,
      questionnaireTitle: null,
      ...overrides?.metadata,
    },
    sections: normalizeSections(overrides?.sections ?? []),
    qualitative: normalizeQualitativeConfig(overrides?.qualitative),
    selectedSectionId: overrides?.selectedSectionId ?? null,
    hydratedFromServer: overrides?.hydratedFromServer ?? false,
  };
}

export function createSyncedDraftSnapshot(
  draft: QuestionnaireBuilderDraft,
  type: QuestionnaireType = draft.metadata.type
): QuestionnaireBuilderDraft {
  return createDraft(type, {
    metadata: {
      ...draft.metadata,
      type,
    },
    sections: draft.sections,
    qualitative: draft.qualitative,
    selectedSectionId:
      draft.selectedSectionId ?? sortSections(draft.sections)[0]?.id ?? null,
    hydratedFromServer: true,
  });
}
