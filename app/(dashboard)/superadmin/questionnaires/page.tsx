"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useQuestionnaireTypes } from "@/features/questionnaires/hooks/use-questionnaire-types";
import { useQuestionnaireVersions } from "@/features/questionnaires/hooks/use-questionnaire-versions";
import {
  DEFAULT_QUESTIONNAIRE_TYPE,
  QUESTIONNAIRE_TYPES,
  type QuestionnaireVersionItem,
  type QuestionnaireType,
} from "@/features/questionnaires/types";

import { QuestionnaireListScreen } from "./_components/questionnaire-list-screen";
import { QuestionnairePageHeader } from "./_components/questionnaire-page-header";

function resolveSelectedType(value: string | null): QuestionnaireType {
  if (value && QUESTIONNAIRE_TYPES.includes(value as QuestionnaireType)) {
    return value as QuestionnaireType;
  }

  return DEFAULT_QUESTIONNAIRE_TYPE;
}

export default function SuperAdminQuestionnairesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedType = resolveSelectedType(searchParams.get("type"));

  const questionnaireTypesQuery = useQuestionnaireTypes();
  const typeSummaries = questionnaireTypesQuery.data ?? [];
  const fetchedTypes = typeSummaries.map((summary) => summary.type);
  const availableTypes =
    fetchedTypes.length > 0
      ? QUESTIONNAIRE_TYPES.filter((type) => fetchedTypes.includes(type))
      : [...QUESTIONNAIRE_TYPES];
  const activeType = availableTypes.includes(selectedType)
    ? selectedType
    : (availableTypes[0] ?? DEFAULT_QUESTIONNAIRE_TYPE);
  const questionnaireVersionsQuery = useQuestionnaireVersions(activeType, {
    enabled: questionnaireTypesQuery.isSuccess,
  });

  useEffect(() => {
    const builderStatus = searchParams.get("builder");

    if (!builderStatus) {
      return;
    }

    if (builderStatus === "saved") {
      toast.success("Questionnaire draft saved successfully.");
    }

    if (builderStatus === "conflict") {
      toast.error("A draft version already exists for that questionnaire type.");
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("builder");

    router.replace(
      params.toString().length > 0
        ? `/superadmin/questionnaires?${params.toString()}`
        : "/superadmin/questionnaires"
    );
  }, [router, searchParams]);

  const handleTypeChange = (nextType: QuestionnaireType) => {
    router.replace(`/superadmin/questionnaires?type=${nextType}`);
  };

  const handleEditDraft = (row: QuestionnaireVersionItem) => {
    router.push(`/superadmin/questionnaires/new?type=${activeType}&versionId=${row.id}`);
  };

  const handleViewVersion = (row: QuestionnaireVersionItem) => {
    router.push(`/superadmin/questionnaires/preview?versionId=${row.id}`);
  };

  const selectedSummary = typeSummaries.find((summary) => summary.type === activeType);
  const versionRows = questionnaireVersionsQuery.data?.versions ?? [];

  const isLoading = questionnaireTypesQuery.isLoading || questionnaireVersionsQuery.isLoading;
  const isError = questionnaireTypesQuery.isError || questionnaireVersionsQuery.isError;
  const hasQuestionnaire = Boolean(selectedSummary?.questionnaireId);
  const hasDraftVersion = versionRows.some((row) => row.status === "DRAFT");

  return (
    <section className="space-y-6 px-4 py-5 sm:px-6 md:p-8">
      <QuestionnairePageHeader
        title="Questionnaires"
        description="Browse questionnaire types, search versions, and filter by lifecycle status."
      />

      <QuestionnaireListScreen
        availableTypes={availableTypes}
        activeType={activeType}
        hasDraftVersion={hasDraftVersion}
        hasQuestionnaire={hasQuestionnaire}
        rows={versionRows}
        onTypeChange={handleTypeChange}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => {
          void questionnaireTypesQuery.refetch();
          void questionnaireVersionsQuery.refetch();
        }}
        onEditDraft={handleEditDraft}
        onViewVersion={handleViewVersion}
      />
    </section>
  );
}
