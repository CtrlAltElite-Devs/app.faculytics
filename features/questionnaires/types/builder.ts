import {
  BUILDER_QUESTION_TYPES,
  DEFAULT_BUILDER_QUESTION_TYPE,
  DEFAULT_QUALITATIVE_MAX_LENGTH,
  MAX_SECTION_NESTING_LEVEL,
} from "@/features/questionnaires/constants/builder";
import type {
  QuestionnaireType,
  QuestionnaireVersionDetail,
  QuestionnaireVersionItem,
} from "@/features/questionnaires/types";

export type BuilderQuestionType = (typeof BUILDER_QUESTION_TYPES)[number];

export type QuestionnaireBuilderQuestionNode = {
  id: string;
  prompt: string;
  type: BuilderQuestionType;
  order: number;
  required: boolean;
};

export type QuestionnaireBuilderSectionNode = {
  id: string;
  title: string;
  order: number;
  weight: number | null;
  dimensionCode: string | null;
  dimensionCodeIssue: "inconsistent" | null;
  questionType: BuilderQuestionType;
  questions: QuestionnaireBuilderQuestionNode[];
  children: QuestionnaireBuilderSectionNode[];
};

export type QuestionnaireBuilderSectionUpdates = Partial<
  Pick<QuestionnaireBuilderSectionNode, "title" | "weight" | "questionType" | "dimensionCode">
>;

export type QuestionnaireBuilderQualitativeConfig = {
  enabled: boolean;
  required: boolean;
  maxLength: number;
};

export type QuestionnaireBuilderMetadata = {
  type: QuestionnaireType;
  title: string;
  questionnaireId: string | null;
  versionId: string | null;
  titleLocked: boolean;
  questionnaireTitle: string | null;
};

export type QuestionnaireBuilderDraft = {
  metadata: QuestionnaireBuilderMetadata;
  sections: QuestionnaireBuilderSectionNode[];
  qualitative: QuestionnaireBuilderQualitativeConfig;
  selectedSectionId: string | null;
  hydratedFromServer: boolean;
};

export type QuestionnaireBuilderServerContext = {
  type: QuestionnaireType;
  questionnaireId: string | null;
  questionnaireTitle: string | null;
  versions: QuestionnaireVersionItem[];
  draftVersion: QuestionnaireVersionDetail | null;
};

export type QuestionnaireBuilderPreviewQuestion = {
  id: string;
  prompt: string;
  type: BuilderQuestionType;
  required: boolean;
  order: number;
};

export type QuestionnaireBuilderPreviewSection = {
  id: string;
  title: string;
  order: number;
  weight: number | null;
  depth: number;
  path: string[];
  questions: QuestionnaireBuilderPreviewQuestion[];
  children: QuestionnaireBuilderPreviewSection[];
};

export type QuestionnaireBuilderPreviewModel = {
  title: string;
  type: QuestionnaireType;
  sections: QuestionnaireBuilderPreviewSection[];
  qualitative: QuestionnaireBuilderQualitativeConfig;
};

export type QuestionnaireSchemaQuestion = {
  id: string;
  text: string;
  type: BuilderQuestionType;
  order: number;
  required: boolean;
  dimensionCode: string;
};

export type QuestionnaireSchemaSectionTreeNode = {
  id: string;
  order: number;
  title: string;
  weight?: number;
  questions?: QuestionnaireSchemaQuestion[];
  sections?: QuestionnaireSchemaSectionTreeNode[];
};

export type QuestionnaireSchemaLeafSection = {
  id: string;
  order: number;
  title: string;
  weight: number;
  parentPath: string[];
  questions: QuestionnaireSchemaQuestion[];
};

export type QuestionnaireSchemaQualitativeFeedback = {
  enabled: boolean;
  required: boolean;
  maxLength: number;
};

export type QuestionnaireVersionSchema = {
  meta: {
    version: 1;
    maxScore: 5;
    scoringModel: "SECTION_WEIGHTED";
    questionnaireType: QuestionnaireType;
  };
  sectionTree?: QuestionnaireSchemaSectionTreeNode[];
  sections: QuestionnaireSchemaLeafSection[];
  qualitativeFeedback?: QuestionnaireSchemaQualitativeFeedback;
};

export type QuestionnaireBuilderValidationIssue = {
  code: string;
  message: string;
  target:
    | {
        type: "global";
      }
    | {
        type: "section";
        id: string;
        field?: "title" | "weight" | "questions" | "structure" | "dimensionCode";
      }
    | {
        type: "question";
        id: string;
        sectionId: string;
        field?: "prompt" | "type";
      }
    | {
        type: "qualitative";
        field?: "maxLength";
      };
};

export type QuestionnaireBuilderValidationResult = {
  isValid: boolean;
  issues: QuestionnaireBuilderValidationIssue[];
  sectionIssues: Record<string, QuestionnaireBuilderValidationIssue[]>;
  questionIssues: Record<string, QuestionnaireBuilderValidationIssue[]>;
  qualitativeIssues: QuestionnaireBuilderValidationIssue[];
  totalLeafWeight: number;
  leafSectionCount: number;
};

export {
  BUILDER_QUESTION_TYPES,
  DEFAULT_BUILDER_QUESTION_TYPE,
  DEFAULT_QUALITATIVE_MAX_LENGTH,
  MAX_SECTION_NESTING_LEVEL,
};
