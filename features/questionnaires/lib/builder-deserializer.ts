import {
  DEFAULT_BUILDER_QUESTION_TYPE,
  DEFAULT_QUALITATIVE_MAX_LENGTH,
} from "@/features/questionnaires/constants/builder";
import type {
  BuilderQuestionType,
  QuestionnaireBuilderDraft,
  QuestionnaireBuilderQualitativeConfig,
  QuestionnaireBuilderQuestionNode,
  QuestionnaireBuilderSectionNode,
  QuestionnaireSchemaQuestion,
  QuestionnaireSchemaSectionTreeNode,
  QuestionnaireVersionDetail,
  QuestionnaireVersionSchema,
} from "@/features/questionnaires/types";

function normalizeQualitativeConfig(
  qualitative?: Partial<QuestionnaireBuilderQualitativeConfig>
): QuestionnaireBuilderQualitativeConfig {
  return {
    enabled: qualitative?.enabled ?? false,
    required: qualitative?.required ?? false,
    maxLength: qualitative?.maxLength ?? DEFAULT_QUALITATIVE_MAX_LENGTH,
  };
}

function sortByOrder<T extends { order: number }>(items: T[] | undefined) {
  return [...(items ?? [])].sort((left, right) => left.order - right.order);
}

function mapQuestion(
  question: QuestionnaireSchemaQuestion,
  order: number,
  type: BuilderQuestionType
): QuestionnaireBuilderQuestionNode {
  return {
    id: question.id,
    prompt: question.text,
    type,
    order,
    required: question.required,
  };
}

function resolveLeafDimensionState(questions: QuestionnaireSchemaQuestion[]) {
  const codes = Array.from(
    new Set(
      questions
        .map((question) => question.dimensionCode?.trim() ?? "")
        .filter((code) => code.length > 0)
    )
  );

  if (codes.length === 0) {
    return {
      dimensionCode: null,
      dimensionCodeIssue: null,
    } as const;
  }

  return {
    dimensionCode: codes[0] ?? null,
    dimensionCodeIssue: codes.length > 1 ? ("inconsistent" as const) : null,
  };
}

function inferQuestionType(section: QuestionnaireBuilderSectionNode): BuilderQuestionType {
  if (section.questions.length > 0) {
    return section.questions[0]?.type ?? DEFAULT_BUILDER_QUESTION_TYPE;
  }

  for (const child of section.children) {
    const childType = inferQuestionType(child);
    if (childType) {
      return childType;
    }
  }

  return DEFAULT_BUILDER_QUESTION_TYPE;
}

function mapSectionTreeNode(
  node: QuestionnaireSchemaSectionTreeNode
): QuestionnaireBuilderSectionNode {
  const children = sortByOrder(node.sections).map(mapSectionTreeNode);
  const isLeaf = children.length === 0;
  const questions = isLeaf
    ? sortByOrder(node.questions).map((question, index) =>
        mapQuestion(question, index + 1, question.type)
      )
    : [];
  const { dimensionCode, dimensionCodeIssue } = resolveLeafDimensionState(
    sortByOrder(node.questions)
  );
  const questionType =
    questions[0]?.type ?? children[0]?.questionType ?? DEFAULT_BUILDER_QUESTION_TYPE;

  return {
    id: node.id,
    title: node.title,
    order: node.order,
    weight: isLeaf ? (node.weight ?? null) : null,
    dimensionCode: isLeaf ? dimensionCode : null,
    dimensionCodeIssue: isLeaf ? dimensionCodeIssue : null,
    questionType,
    questions,
    children,
  };
}

function buildSectionsFromFlatSchema(
  schema: QuestionnaireVersionSchema
): QuestionnaireBuilderSectionNode[] {
  return sortByOrder(schema.sections).map((section, index) => {
    const sortedQuestions = sortByOrder(section.questions);
    const questions = sortedQuestions.map((question, questionIndex) =>
      mapQuestion(question, questionIndex + 1, question.type)
    );
    const { dimensionCode, dimensionCodeIssue } = resolveLeafDimensionState(sortedQuestions);
    const questionType = questions[0]?.type ?? DEFAULT_BUILDER_QUESTION_TYPE;

    return {
      id: section.id,
      title: section.title,
      order: index + 1,
      weight: section.weight,
      dimensionCode,
      dimensionCodeIssue,
      questionType,
      questions,
      children: [],
    };
  });
}

function findFirstSectionId(sections: QuestionnaireBuilderSectionNode[]): string | null {
  for (const section of sortByOrder(sections)) {
    return section.id;
  }

  return null;
}

export function deserializeQuestionnaireVersionToDraft(
  version: QuestionnaireVersionDetail
): Pick<QuestionnaireBuilderDraft, "metadata" | "sections" | "qualitative" | "selectedSectionId"> {
  const schema = version.schemaSnapshot;
  const sections =
    schema.sectionTree && schema.sectionTree.length > 0
      ? sortByOrder(schema.sectionTree).map(mapSectionTreeNode)
      : buildSectionsFromFlatSchema(schema);

  const normalizedSections = sections.map((section) => ({
    ...section,
    questionType: inferQuestionType(section),
  }));

  return {
    metadata: {
      type: version.questionnaireType,
      title: version.questionnaireTitle,
      questionnaireId: version.questionnaireId,
      versionId: version.id,
      titleLocked: false,
      questionnaireTitle: version.questionnaireTitle,
    },
    sections: normalizedSections,
    qualitative: normalizeQualitativeConfig(schema.qualitativeFeedback),
    selectedSectionId: findFirstSectionId(normalizedSections),
  };
}
