"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useQuestionnaireTypes } from "@/features/questionnaires/hooks/use-questionnaire-types";
import {
  useQuestionnaireVersion,
  useQuestionnaireVersions,
} from "@/features/questionnaires/hooks/use-questionnaire-versions";
import { useQuestionnaireBuilderStore } from "@/features/questionnaires/store/questionnaire-builder-store";
import {
  QUESTIONNAIRE_TYPES,
  DEFAULT_QUESTIONNAIRE_TYPE,
  resolveQuestionnaireType,
} from "@/features/questionnaires/types";

import { QuestionnaireBuilderDiscardDialog } from "./_components/questionnaire-builder-discard-dialog";
import { QuestionnaireBuilderPageHeader } from "./_components/questionnaire-builder-page-header";
import { QuestionnaireBuilderScreen } from "./_components/questionnaire-builder-screen";

export default function QuestionnaireBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const requestedType = resolveQuestionnaireType(searchParams.get("type"));
  const requestedVersionId = searchParams.get("versionId");
  const questionnaireTypesQuery = useQuestionnaireTypes();
  const hydrated = useQuestionnaireBuilderStore((state) => state.hydrated);
  const activeType = useQuestionnaireBuilderStore((state) => state.activeType);
  const loadDraftFromServer = useQuestionnaireBuilderStore((state) => state.loadDraftFromServer);
  const clearDraftForType = useQuestionnaireBuilderStore((state) => state.clearDraftForType);
  const setActiveType = useQuestionnaireBuilderStore((state) => state.setActiveType);
  const hasUnsavedChanges = useQuestionnaireBuilderStore((state) => state.hasUnsavedChanges);
  const resetActiveDraft = useQuestionnaireBuilderStore((state) => state.resetActiveDraft);

  const typeSummaries = questionnaireTypesQuery.data ?? [];
  const fetchedTypes = typeSummaries.map((summary) => summary.type);
  const availableTypes =
    fetchedTypes.length > 0
      ? QUESTIONNAIRE_TYPES.filter((type) => fetchedTypes.includes(type))
      : [...QUESTIONNAIRE_TYPES];
  const requestedTypeUnavailable =
    questionnaireTypesQuery.isSuccess &&
    fetchedTypes.length > 0 &&
    !fetchedTypes.includes(requestedType);
  const activePageType = availableTypes.includes(requestedType)
    ? requestedType
    : (availableTypes[0] ?? DEFAULT_QUESTIONNAIRE_TYPE);
  const currentDraft = useQuestionnaireBuilderStore((state) => state.drafts[activePageType] ?? null);
  const questionnaireVersionsQuery = useQuestionnaireVersions(requestedType, {
    enabled: questionnaireTypesQuery.isSuccess && !requestedTypeUnavailable,
  });
  const defaultDraftVersionId =
    questionnaireVersionsQuery.data?.versions.find((version) => version.status === "DRAFT")?.id ?? null;
  const resolvedVersionId = requestedVersionId ?? defaultDraftVersionId;
  const questionnaireVersionQuery = useQuestionnaireVersion(resolvedVersionId, {
    enabled:
      questionnaireTypesQuery.isSuccess &&
      !requestedTypeUnavailable &&
      Boolean(resolvedVersionId),
  });
  const shouldDelayDraftHydration = Boolean(resolvedVersionId) && questionnaireVersionQuery.isLoading;
  const draftVersion = questionnaireVersionQuery.data ?? null;

  useEffect(() => {
    if (searchParams.get("type") === activePageType) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("type", activePageType);
    router.replace(`/superadmin/questionnaires/new?${params.toString()}`);
  }, [activePageType, router, searchParams]);

  useEffect(() => {
    if (!questionnaireVersionsQuery.data) {
      return;
    }

    if (shouldDelayDraftHydration) {
      return;
    }

    loadDraftFromServer({
      ...questionnaireVersionsQuery.data,
      draftVersion,
    });
  }, [draftVersion, loadDraftFromServer, questionnaireVersionsQuery.data, shouldDelayDraftHydration]);

  useEffect(() => {
    if (!requestedTypeUnavailable) {
      return;
    }

    clearDraftForType(requestedType);

    if (activeType === requestedType) {
      setActiveType(null);
    }
  }, [activeType, clearDraftForType, requestedType, requestedTypeUnavailable, setActiveType]);

  const isLoading =
    questionnaireTypesQuery.isLoading ||
    questionnaireVersionsQuery.isLoading ||
    questionnaireVersionQuery.isLoading;
  const isError =
    questionnaireTypesQuery.isError ||
    questionnaireVersionsQuery.isError ||
    questionnaireVersionQuery.isError;
  const questionnaireListHref = `/superadmin/questionnaires?type=${activePageType}`;
  const emptyState = availableTypes.length === 0
    ? { description: "No questionnaire types are available right now." }
    : requestedTypeUnavailable
      ? {
          description: "That questionnaire type is no longer available. The stale local draft for it was discarded.",
          actionLabel: "Open available type",
          onAction: () => {
            if (availableTypes[0]) {
              router.replace(`/superadmin/questionnaires/new?type=${availableTypes[0]}`);
            }
          },
        }
      : null;
  const hasLocalBuilderDraft = hydrated && Boolean(currentDraft);
  const showBuilderLoading =
    !hasLocalBuilderDraft &&
    (isLoading || (!requestedTypeUnavailable && availableTypes.length > 0 && !questionnaireVersionsQuery.data));
  const showBuilderError = !hasLocalBuilderDraft && isError;

  const handleBackToQuestionnaires = () => {
    if (!hasUnsavedChanges()) {
      router.push(questionnaireListHref);
      return;
    }

    setDiscardDialogOpen(true);
  };

  return (
    <section className="space-y-6 px-0 py-5 sm:px-6 md:p-8">
      <QuestionnaireBuilderPageHeader onBack={handleBackToQuestionnaires} />

      <QuestionnaireBuilderScreen
        activeType={activePageType}
        isHydrated={hydrated}
        isLoading={showBuilderLoading}
        isError={showBuilderError}
        emptyState={emptyState}
        onRetry={() => {
          void questionnaireTypesQuery.refetch();
          void questionnaireVersionsQuery.refetch();
          if (resolvedVersionId) {
            void questionnaireVersionQuery.refetch();
          }
        }}
      />

      <QuestionnaireBuilderDiscardDialog
        open={discardDialogOpen}
        onOpenChange={setDiscardDialogOpen}
        onConfirm={() => {
          resetActiveDraft();
          setDiscardDialogOpen(false);
          router.push(questionnaireListHref);
        }}
      />
    </section>
  );
}
