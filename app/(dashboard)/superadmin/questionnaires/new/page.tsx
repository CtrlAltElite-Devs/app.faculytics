"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { QuestionnaireBuilderShell } from "@/components/faculytics/questionnaires/questionnaire-builder-shell";
import { QuestionnaireEmptyState } from "@/components/faculytics/questionnaires/questionnaire-empty-state";
import { QuestionnaireErrorState } from "@/components/faculytics/questionnaires/questionnaire-error-state";
import { QuestionnaireLoadingState } from "@/components/faculytics/questionnaires/questionnaire-loading-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { hasMeaningfulDraftContent } from "@/lib/questionnaires/builder-validator";
import { useQuestionnaireTypes } from "@/hooks/questionnaires/use-questionnaire-types";
import { useQuestionnaireVersions } from "@/hooks/questionnaires/use-questionnaire-versions";
import { useQuestionnaireBuilderStore } from "@/stores/questionnaire-builder-store";
import {
  DEFAULT_QUESTIONNAIRE_TYPE,
  QUESTIONNAIRE_TYPES,
  type QuestionnaireType,
} from "@/types/questionnaires";

function resolveRequestedType(value: string | null): QuestionnaireType {
  if (value && QUESTIONNAIRE_TYPES.includes(value as QuestionnaireType)) {
    return value as QuestionnaireType;
  }

  return DEFAULT_QUESTIONNAIRE_TYPE;
}

export default function QuestionnaireBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedType = resolveRequestedType(searchParams.get("type"));
  const [pendingType, setPendingType] = useState<QuestionnaireType | null>(null);
  const questionnaireTypesQuery = useQuestionnaireTypes();
  const hydrated = useQuestionnaireBuilderStore((state) => state.hydrated);
  const activeType = useQuestionnaireBuilderStore((state) => state.activeType);
  const activeDraft = useQuestionnaireBuilderStore((state) =>
    state.activeType ? state.drafts[state.activeType] ?? null : null
  );
  const loadDraftFromServer = useQuestionnaireBuilderStore((state) => state.loadDraftFromServer);
  const clearDraftForType = useQuestionnaireBuilderStore((state) => state.clearDraftForType);
  const setActiveType = useQuestionnaireBuilderStore((state) => state.setActiveType);

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
  const questionnaireVersionsQuery = useQuestionnaireVersions(requestedType, {
    enabled: questionnaireTypesQuery.isSuccess && !requestedTypeUnavailable,
  });

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

    loadDraftFromServer(questionnaireVersionsQuery.data);
  }, [loadDraftFromServer, questionnaireVersionsQuery.data]);

  useEffect(() => {
    if (!requestedTypeUnavailable) {
      return;
    }

    clearDraftForType(requestedType);

    if (activeType === requestedType) {
      setActiveType(null);
    }
  }, [activeType, clearDraftForType, requestedType, requestedTypeUnavailable, setActiveType]);

  const handleTypeChange = (nextType: QuestionnaireType) => {
    if (nextType === activePageType) {
      return;
    }

    const hasUnsavedChanges =
      activeType === activePageType && hasMeaningfulDraftContent(activeDraft);

    if (hasUnsavedChanges) {
      setPendingType(nextType);
      return;
    }

    router.replace(`/superadmin/questionnaires/new?type=${nextType}`);
  };

  const isLoading = questionnaireTypesQuery.isLoading || questionnaireVersionsQuery.isLoading;
  const isError = questionnaireTypesQuery.isError || questionnaireVersionsQuery.isError;

  return (
    <>
      <section className="space-y-6 px-4 py-5 sm:px-6 md:p-8">
        <div>
          <h1 className="font-playfair text-2xl font-semibold">Questionnaire Builder</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Build a quantitative questionnaire, add an optional final comment section, and
            save it as a draft version.
          </p>
        </div>

        {isLoading ? (
          <QuestionnaireLoadingState />
        ) : isError ? (
          <QuestionnaireErrorState
            onRetry={() => {
              void questionnaireTypesQuery.refetch();
              void questionnaireVersionsQuery.refetch();
            }}
          />
        ) : availableTypes.length === 0 ? (
          <QuestionnaireEmptyState description="No questionnaire types are available right now." />
        ) : requestedTypeUnavailable ? (
          <QuestionnaireEmptyState
            description="That questionnaire type is no longer available. The stale local draft for it was discarded."
            actionLabel="Open available type"
            onAction={() => {
              if (availableTypes[0]) {
                router.replace(`/superadmin/questionnaires/new?type=${availableTypes[0]}`);
              }
            }}
          />
        ) : !questionnaireVersionsQuery.data ? (
          <QuestionnaireLoadingState />
        ) : (
          <QuestionnaireBuilderShell
            availableTypes={availableTypes}
            activeType={activePageType}
            onTypeChange={handleTypeChange}
            serverContext={questionnaireVersionsQuery.data}
            isHydrated={hydrated}
          />
        )}
      </section>

      <Dialog open={Boolean(pendingType)} onOpenChange={(open) => !open && setPendingType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch questionnaire type?</DialogTitle>
            <DialogDescription>
              The current draft has unsaved changes. Switching types will keep this draft in local
              storage, but the builder will load a different type context.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPendingType(null)}>
              Stay here
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (pendingType) {
                  router.replace(`/superadmin/questionnaires/new?type=${pendingType}`);
                }
                setPendingType(null);
              }}
            >
              Switch type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
