"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { QuestionnaireBuilderShell } from "@/components/faculytics/questionnaires/questionnaire-builder-shell";
import { QuestionnaireEmptyState } from "@/components/faculytics/questionnaires/questionnaire-empty-state";
import { QuestionnaireErrorState } from "@/components/faculytics/questionnaires/questionnaire-error-state";
import { QuestionnaireLoadingState } from "@/components/faculytics/questionnaires/questionnaire-loading-state";
import { Button } from "@/components/ui/button";
import { useQuestionnaireTypes } from "@/hooks/questionnaires/use-questionnaire-types";
import {
  useQuestionnaireVersion,
  useQuestionnaireVersions,
} from "@/hooks/questionnaires/use-questionnaire-versions";
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
  const requestedVersionId = searchParams.get("versionId");
  const questionnaireTypesQuery = useQuestionnaireTypes();
  const hydrated = useQuestionnaireBuilderStore((state) => state.hydrated);
  const activeType = useQuestionnaireBuilderStore((state) => state.activeType);
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
  const defaultDraftVersionId =
    questionnaireVersionsQuery.data?.versions.find((version) => version.status === "DRAFT")?.id ?? null;
  const resolvedVersionId = requestedVersionId ?? defaultDraftVersionId;
  const questionnaireVersionQuery = useQuestionnaireVersion(resolvedVersionId, {
    enabled:
      questionnaireTypesQuery.isSuccess &&
      !requestedTypeUnavailable &&
      Boolean(resolvedVersionId),
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

    loadDraftFromServer({
      ...questionnaireVersionsQuery.data,
      draftVersion: questionnaireVersionQuery.data ?? null,
    });
  }, [loadDraftFromServer, questionnaireVersionQuery.data, questionnaireVersionsQuery.data]);

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

  return (
    <section className="space-y-6 px-4 py-5 sm:px-6 md:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-playfair text-2xl font-semibold">Questionnaire Builder</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Build a quantitative questionnaire, add an optional final comment section, and
            save it as a draft version.
          </p>
        </div>
        <Button asChild variant="outline" className="sm:self-start">
          <Link href={`/superadmin/questionnaires?type=${activePageType}`}>
            Back to questionnaires
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <QuestionnaireLoadingState />
      ) : isError ? (
        <QuestionnaireErrorState
          onRetry={() => {
            void questionnaireTypesQuery.refetch();
            void questionnaireVersionsQuery.refetch();
            if (resolvedVersionId) {
              void questionnaireVersionQuery.refetch();
            }
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
          activeType={activePageType}
          isHydrated={hydrated}
        />
      )}
    </section>
  );
}
