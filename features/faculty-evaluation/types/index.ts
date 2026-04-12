import type {
  QuestionnaireFormValues,
  QuestionnaireTypeSummary,
} from "@/features/questionnaires/types";

export type FacultyEvaluationViewMode = "card" | "list";

export type FacultyEvaluationListQuery = {
  semesterId: string;
  programId?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type FacultyEvaluationListItem = {
  id: string;
  fullName: string;
  profilePicture: string | null;
  subjects: string[];
};

export type FacultyEvaluationListMeta = {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type FacultyEvaluationListResponse = {
  data: FacultyEvaluationListItem[];
  meta: FacultyEvaluationListMeta;
};

export type FacultyEvaluationRow = {
  id: string;
  fullName: string;
  profilePicture: string | null;
  subjects: string[];
};

export type FacultyEvaluationRoleContext = {
  roleLabel: "Dean" | "Chairperson";
  rolePath: "/dean" | "/chairperson";
};

export type FacultyEvaluationDetailContext = {
  facultyId: string;
  facultyName?: string;
  semesterId: string;
};

export type FacultyEvaluationReadyData = FacultyEvaluationDetailContext & {
  selectedTypeId: string;
  selectedType: QuestionnaireTypeSummary;
  availableTypes: QuestionnaireTypeSummary[];
  activeVersion: { id: string };
  model: Parameters<
    typeof import("@/features/questionnaires/components/form/questionnaire-form-renderer").QuestionnaireFormRenderer
  >[0]["model"];
  defaultValues: Partial<QuestionnaireFormValues> | undefined;
  draftHydrationKey: string;
};

export type FacultyEvaluationDetailResult =
  | {
      status: "loading";
      message: string;
      availableTypes: QuestionnaireTypeSummary[];
      selectedTypeId: string | null;
    }
  | {
      status: "error";
      message: string;
      availableTypes: QuestionnaireTypeSummary[];
      selectedTypeId: string | null;
    }
  | {
      status: "missing-context";
      message: string;
      availableTypes: QuestionnaireTypeSummary[];
      selectedTypeId: string | null;
    }
  | {
      status: "no-types";
      message: string;
      availableTypes: QuestionnaireTypeSummary[];
      selectedTypeId: string | null;
    }
  | {
      status: "no-version";
      message: string;
      availableTypes: QuestionnaireTypeSummary[];
      selectedTypeId: string | null;
      detail: FacultyEvaluationDetailContext;
    }
  | {
      status: "already-submitted";
      submittedAt?: string;
      availableTypes: QuestionnaireTypeSummary[];
      selectedTypeId: string | null;
      detail: FacultyEvaluationDetailContext;
    }
  | { status: "ready"; data: FacultyEvaluationReadyData };
