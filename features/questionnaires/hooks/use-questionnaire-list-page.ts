import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { resolveQuestionnaireActionErrorMessage } from "@/features/questionnaires/lib/action-errors";
import { normalizeTypeSearchParam } from "@/features/questionnaires/lib/questionnaire-type-routing";
import { useDeprecateQuestionnaireVersion } from "@/features/questionnaires/hooks/use-deprecate-questionnaire-version";
import { usePublishQuestionnaireVersion } from "@/features/questionnaires/hooks/use-publish-questionnaire-version";
import { useQuestionnaireTypeResolution } from "@/features/questionnaires/hooks/use-questionnaire-type-resolution";
import { useQuestionnaireVersions } from "@/features/questionnaires/hooks/use-questionnaire-versions";
import {
  type QuestionnaireTypeCode,
  type QuestionnaireVersionItem,
  type VersionLifecycleAction,
} from "@/features/questionnaires/types";

export function useQuestionnaireListPage() {
  const router = useRouter();
  const [versionAction, setVersionAction] = useState<VersionLifecycleAction>(null);
  const {
    searchParams,
    questionnaireTypesQuery,
    availableTypeOptions,
    activeType,
    activeTypeSummary,
    activeTypeId,
  } = useQuestionnaireTypeResolution();
  const publishVersionMutation = usePublishQuestionnaireVersion();
  const deprecateVersionMutation = useDeprecateQuestionnaireVersion();

  const questionnaireVersionsQuery = useQuestionnaireVersions(activeTypeId, {
    enabled: questionnaireTypesQuery.isSuccess && activeTypeId !== null,
  });

  useEffect(() => {
    normalizeTypeSearchParam({
      isResolved: questionnaireTypesQuery.isSuccess,
      currentTypeParam: searchParams.get("type"),
      normalizedType: activeType,
      pathname: "/superadmin/questionnaires",
      searchParams,
      router,
    });
  }, [activeType, questionnaireTypesQuery.isSuccess, router, searchParams]);

  useEffect(() => {
    const builderStatus = searchParams.get("builder");

    if (!builderStatus) {
      return;
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

  const handleTypeChange = (nextType: QuestionnaireTypeCode) => {
    router.replace(`/superadmin/questionnaires?type=${nextType}`);
  };

  const handleEditDraft = (row: QuestionnaireVersionItem) => {
    router.push(`/superadmin/questionnaires/new?type=${activeType}&versionId=${row.id}`);
  };

  const handleViewVersion = (row: QuestionnaireVersionItem) => {
    router.push(`/superadmin/questionnaires/preview?versionId=${row.id}`);
  };

  const isVersionActionPending =
    publishVersionMutation.isPending || deprecateVersionMutation.isPending;

  const handleConfirmVersionAction = async () => {
    if (!versionAction) {
      return;
    }

    try {
      if (versionAction.type === "publish") {
        await publishVersionMutation.mutateAsync(versionAction.row.id);
        toast.success(`Version v${versionAction.row.versionNumber} published.`);
      } else {
        await deprecateVersionMutation.mutateAsync(versionAction.row.id);
        toast.success(`Version v${versionAction.row.versionNumber} deprecated.`);
      }

      setVersionAction(null);
    } catch (error) {
      toast.error(
        resolveQuestionnaireActionErrorMessage(
          error,
          versionAction.type === "publish"
            ? "Unable to publish that questionnaire version right now."
            : "Unable to deprecate that questionnaire version right now."
        )
      );
    }
  };

  const versionRows = questionnaireVersionsQuery.data?.versions ?? [];
  const actionDialogConfig =
    versionAction?.type === "publish"
      ? {
          title: `Publish version v${versionAction.row.versionNumber}?`,
          description:
            "This will make the selected version active and deprecate the current active version, if one exists.",
          confirmLabel: "Publish version",
          confirmVariant: "brand" as const,
        }
      : versionAction?.type === "deprecate"
        ? {
            title: `Deprecate version v${versionAction.row.versionNumber}?`,
            description:
              "This will mark the selected version as deprecated and remove it from active use.",
            confirmLabel: "Deprecate version",
            confirmVariant: "destructive" as const,
          }
        : null;

  const isLoading = questionnaireTypesQuery.isLoading || questionnaireVersionsQuery.isLoading;
  const isError = questionnaireTypesQuery.isError || questionnaireVersionsQuery.isError;
  const hasQuestionnaire = Boolean(activeTypeSummary?.questionnaireId);
  const hasDraftVersion = versionRows.some((row) => row.status === "DRAFT");

  return {
    availableTypeOptions,
    activeType,
    activeTypeSummary,
    hasDraftVersion,
    hasQuestionnaire,
    versionRows,
    isLoading,
    isError,
    versionAction,
    setVersionAction,
    isVersionActionPending,
    actionDialogConfig,
    handleTypeChange,
    handleEditDraft,
    handleViewVersion,
    handleConfirmVersionAction,
    handleRetry: () => {
      void questionnaireTypesQuery.refetch();
      void questionnaireVersionsQuery.refetch();
    },
  };
}
