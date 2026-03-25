import { DEFAULT_QUALITATIVE_MAX_LENGTH } from "@/features/questionnaires/constants/builder";
import { isLeafSection, sortSections } from "@/features/questionnaires/lib/builder-validator";
import type {
  QuestionnaireBuilderDraft,
  QuestionnaireBuilderPreviewModel,
  QuestionnaireBuilderPreviewSection,
  QuestionnaireBuilderQuestionNode,
  QuestionnaireBuilderSectionNode,
  QuestionnaireType,
  QuestionnaireSchemaQuestion,
  QuestionnaireSchemaSectionTreeNode,
  QuestionnaireVersionSchema,
} from "@/features/questionnaires/types";

function getQuestionnaireTypeCode(type: QuestionnaireType): string {
  switch (type) {
    case "FACULTY_IN_CLASSROOM":
      return "ic";
    case "FACULTY_OUT_OF_CLASSROOM":
      return "oc";
    case "FACULTY_FEEDBACK":
    default:
      return "ff";
  }
}

function buildSchemaSectionId(typeCode: string, path: number[]): string {
  return `sec-${typeCode}-${path.join("-")}`;
}

function buildSchemaQuestionId(
  typeCode: string,
  sectionPath: number[],
  questionOrder: number
): string {
  return `q-${typeCode}-${[...sectionPath, questionOrder].join("-")}`;
}

function serializeQuestion(
  question: QuestionnaireBuilderQuestionNode,
  schemaQuestionId: string,
  questionType: QuestionnaireBuilderQuestionNode["type"],
  dimensionCode: string
): QuestionnaireSchemaQuestion {
  return {
    id: schemaQuestionId,
    text: question.prompt.trim(),
    type: questionType,
    order: question.order,
    required: question.required,
    dimensionCode,
  };
}

function serializeSectionTree(
  section: QuestionnaireBuilderSectionNode,
  typeCode: string,
  path: number[]
): QuestionnaireSchemaSectionTreeNode {
  const base: QuestionnaireSchemaSectionTreeNode = {
    id: buildSchemaSectionId(typeCode, path),
    order: section.order,
    title: section.title.trim(),
  };

  if (isLeafSection(section)) {
    base.weight = section.weight ?? 0;
    base.questions = section.questions
      .slice()
      .sort((left, right) => left.order - right.order)
      .map((question, index) =>
        serializeQuestion(
          question,
          buildSchemaQuestionId(typeCode, path, index + 1),
          section.questionType,
          section.dimensionCode ?? ""
        )
      );
  } else {
    base.sections = sortSections(section.children).map((child, index) =>
      serializeSectionTree(child, typeCode, [...path, index + 1])
    );
  }

  return base;
}

export function buildQuestionnaireSectionTree(
  draft: QuestionnaireBuilderDraft
): QuestionnaireSchemaSectionTreeNode[] {
  const typeCode = getQuestionnaireTypeCode(draft.metadata.type);

  return sortSections(draft.sections).map((section, index) =>
    serializeSectionTree(section, typeCode, [index + 1])
  );
}

export function serializeQuestionnaireBuilderDraft(
  draft: QuestionnaireBuilderDraft
): QuestionnaireVersionSchema {
  const typeCode = getQuestionnaireTypeCode(draft.metadata.type);
  const leafEntries: Array<{
    section: QuestionnaireBuilderSectionNode;
    path: number[];
    parentPath: string[];
  }> = [];

  const walkSections = (nodes: QuestionnaireBuilderSectionNode[], ancestorPaths: number[][]) => {
    sortSections(nodes).forEach((node, index) => {
      const path = [...(ancestorPaths.at(-1) ?? []), index + 1];

      if (isLeafSection(node)) {
        leafEntries.push({
          section: node,
          path,
          parentPath: ancestorPaths.map((ancestorPath) =>
            buildSchemaSectionId(typeCode, ancestorPath)
          ),
        });
        return;
      }

      walkSections(node.children, [...ancestorPaths, path]);
    });
  };

  walkSections(draft.sections, []);

  const sections = leafEntries.map(({ section, path, parentPath }, index) => ({
    id: buildSchemaSectionId(typeCode, path),
    order: index + 1,
    title: section.title.trim(),
    weight: section.weight ?? 0,
    parentPath,
    questions: section.questions
      .slice()
      .sort((left, right) => left.order - right.order)
      .map((question, questionIndex) =>
        serializeQuestion(
          question,
          buildSchemaQuestionId(typeCode, path, questionIndex + 1),
          section.questionType,
          section.dimensionCode ?? ""
        )
      ),
  }));

  return {
    meta: {
      version: 1,
      maxScore: 5,
      scoringModel: "SECTION_WEIGHTED",
      questionnaireType: draft.metadata.type,
    },
    sectionTree: buildQuestionnaireSectionTree(draft),
    sections,
    qualitativeFeedback: {
      enabled: draft.qualitative.enabled,
      required: draft.qualitative.required,
      maxLength: draft.qualitative.maxLength ?? DEFAULT_QUALITATIVE_MAX_LENGTH,
    },
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
        type: section.questionType,
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
    title:
      (
        draft.metadata.title ??
        draft.metadata.questionnaireTitle ??
        "Untitled questionnaire"
      ).trim() || "Untitled questionnaire",
    type: draft.metadata.type,
    sections: sortSections(draft.sections).map((section) => buildPreviewSection(section, 0, [])),
    qualitative: draft.qualitative,
  };
}
