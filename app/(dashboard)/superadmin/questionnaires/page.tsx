"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import {
  DEFAULT_QUESTIONNAIRE_TYPE,
  QUESTIONNAIRE_TYPES,
} from "@/features/questionnaires/constants";
import { resolveQuestionnaireActionErrorMessage } from "@/features/questionnaires/lib/action-errors";
import { useDeprecateQuestionnaireVersion } from "@/features/questionnaires/hooks/use-deprecate-questionnaire-version";
import { usePublishQuestionnaireVersion } from "@/features/questionnaires/hooks/use-publish-questionnaire-version";
import { useQuestionnaireTypes } from "@/features/questionnaires/hooks/use-questionnaire-types";
import { useQuestionnaireVersions } from "@/features/questionnaires/hooks/use-questionnaire-versions";
import {
  resolveQuestionnaireType,
  type QuestionnaireVersionItem,
  type QuestionnaireType,
  type VersionLifecycleAction,
} from "@/features/questionnaires/types";

import { QuestionnaireListScreen } from "./_components/questionnaire-list-screen";
import { QuestionnairePageHeader } from "./_components/questionnaire-page-header";

export default function SuperAdminQuestionnairesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [versionAction, setVersionAction] = useState<VersionLifecycleAction>(null);
  const selectedType = resolveQuestionnaireType(searchParams.get("type"));

  const questionnaireTypesQuery = useQuestionnaireTypes();
  const publishVersionMutation = usePublishQuestionnaireVersion();
  const deprecateVersionMutation = useDeprecateQuestionnaireVersion();
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

  const selectedSummary = typeSummaries.find((summary) => summary.type === activeType);
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
            description: "This will mark the selected version as deprecated and remove it from active use.",
            confirmLabel: "Deprecate version",
            confirmVariant: "destructive" as const,
          }
        : null;

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
        onPublishVersion={(row) => setVersionAction({ type: "publish", row })}
        onDeprecateVersion={(row) => setVersionAction({ type: "deprecate", row })}
        disableActions={isVersionActionPending}
      />

      <ConfirmationDialog
        open={versionAction !== null}
        onOpenChange={(open) => {
          if (!open && !isVersionActionPending) {
            setVersionAction(null);
          }
        }}
        title={actionDialogConfig?.title ?? ""}
        description={actionDialogConfig?.description ?? ""}
        cancelLabel="Cancel"
        confirmLabel={actionDialogConfig?.confirmLabel ?? ""}
        confirmVariant={actionDialogConfig?.confirmVariant}
        isPending={isVersionActionPending}
        onConfirm={() => {
          void handleConfirmVersionAction();
        }}
      />
    </section>
  );
}
