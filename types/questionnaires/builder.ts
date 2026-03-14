import type {
  QuestionnaireType,
  QuestionnaireVersionItem,
} from "@/types/questionnaires";

export const BUILDER_QUESTION_TYPES = ["LIKERT_1_5", "YES_NO"] as const;

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
  questions: QuestionnaireBuilderQuestionNode[];
  children: QuestionnaireBuilderSectionNode[];
};

export type QuestionnaireBuilderQualitativeConfig = {
  enabled: boolean;
  title: string;
  description: string;
  placeholder: string;
  required: boolean;
};

export type QuestionnaireBuilderMetadata = {
  type: QuestionnaireType;
  title: string;
  questionnaireId: string | null;
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

export type QuestionnaireSchemaQualitativeSection = {
  id: string;
  order: number;
  title: string;
  description: string;
  placeholder: string;
  required: boolean;
  type: "QUALITATIVE_COMMENT";
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
  qualitativeSection?: QuestionnaireSchemaQualitativeSection;
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
        field?: "title" | "weight" | "questions" | "structure";
      }
    | {
        type: "question";
        id: string;
        sectionId: string;
        field?: "prompt" | "type";
      }
    | {
        type: "qualitative";
        field?: "title" | "description" | "placeholder";
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
