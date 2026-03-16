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
} from "@/types/questionnaires";

const DEFAULT_QUESTION_TYPE: BuilderQuestionType = "LIKERT_1_5";

function normalizeQualitativeConfig(
  qualitative?: Partial<QuestionnaireBuilderQualitativeConfig>
): QuestionnaireBuilderQualitativeConfig {
  return {
    enabled: qualitative?.enabled ?? false,
    required: qualitative?.required ?? false,
    maxLength: qualitative?.maxLength ?? 1000,
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

function inferQuestionType(section: QuestionnaireBuilderSectionNode): BuilderQuestionType {
  if (section.questions.length > 0) {
    return section.questions[0]?.type ?? DEFAULT_QUESTION_TYPE;
  }

  for (const child of section.children) {
    const childType = inferQuestionType(child);
    if (childType) {
      return childType;
    }
  }

  return DEFAULT_QUESTION_TYPE;
}

function mapSectionTreeNode(node: QuestionnaireSchemaSectionTreeNode): QuestionnaireBuilderSectionNode {
  const children = sortByOrder(node.sections).map(mapSectionTreeNode);
  const isLeaf = children.length === 0;
  const questions = isLeaf
    ? sortByOrder(node.questions).map((question, index) =>
        mapQuestion(question, index + 1, question.type)
      )
    : [];
  const questionType = questions[0]?.type ?? children[0]?.questionType ?? DEFAULT_QUESTION_TYPE;

  return {
    id: node.id,
    title: node.title,
    order: node.order,
    weight: isLeaf ? node.weight ?? null : null,
    questionType,
    questions,
    children,
  };
}

function buildSectionsFromFlatSchema(
  schema: QuestionnaireVersionSchema
): QuestionnaireBuilderSectionNode[] {
  return sortByOrder(schema.sections).map((section, index) => {
    const questions = sortByOrder(section.questions).map((question, questionIndex) =>
      mapQuestion(question, questionIndex + 1, question.type)
    );
    const questionType = questions[0]?.type ?? DEFAULT_QUESTION_TYPE;

    return {
      id: section.id,
      title: section.title,
      order: index + 1,
      weight: section.weight,
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
      titleLocked: true,
      questionnaireTitle: version.questionnaireTitle,
    },
    sections: normalizedSections,
    qualitative: normalizeQualitativeConfig(schema.qualitativeFeedback),
    selectedSectionId: findFirstSectionId(normalizedSections),
  };
}
