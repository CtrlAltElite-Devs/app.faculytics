"use client";

import { useEffect, useReducer } from "react";

import { MAX_SECTION_NESTING_LEVEL } from "@/features/questionnaires/constants/builder";
import { useSaveQuestionnaireBuilder } from "@/features/questionnaires/hooks/use-save-questionnaire-builder";
import { buildQuestionnairePreviewModel } from "@/features/questionnaires/lib/builder-serializer";
import {
  canConvertSectionToParent,
  findSectionById,
  getSectionLevel,
  validateQuestionnaireBuilderDraft,
} from "@/features/questionnaires/lib/builder-validator";
import { useQuestionnaireBuilderStore } from "@/features/questionnaires/store/questionnaire-builder-store";
import type {
  QuestionnaireBuilderQuestionNode,
  QuestionnaireBuilderSectionUpdates,
  QuestionnaireType,
} from "@/features/questionnaires/types";

type UseQuestionnaireBuilderControllerOptions = {
  activeType: QuestionnaireType;
};

type BuilderUiState = {
  saveDialogOpen: boolean;
  discardDialogOpen: boolean;
  pendingParentId: string | null;
  pendingScrollToSection: boolean;
};

type BuilderUiAction =
  | { type: "set-save-dialog-open"; open: boolean }
  | { type: "set-discard-dialog-open"; open: boolean }
  | { type: "set-pending-parent-id"; sectionId: string | null }
  | { type: "request-scroll-to-section" }
  | { type: "clear-pending-scroll-to-section" };

const initialBuilderUiState: BuilderUiState = {
  saveDialogOpen: false,
  discardDialogOpen: false,
  pendingParentId: null,
  pendingScrollToSection: false,
};

function builderUiReducer(state: BuilderUiState, action: BuilderUiAction): BuilderUiState {
  switch (action.type) {
    case "set-save-dialog-open":
      return {
        ...state,
        saveDialogOpen: action.open,
      };
    case "set-discard-dialog-open":
      return {
        ...state,
        discardDialogOpen: action.open,
      };
    case "set-pending-parent-id":
      return {
        ...state,
        pendingParentId: action.sectionId,
      };
    case "request-scroll-to-section":
      return {
        ...state,
        pendingScrollToSection: true,
      };
    case "clear-pending-scroll-to-section":
      return {
        ...state,
        pendingScrollToSection: false,
      };
    default:
      return state;
  }
}

export function useQuestionnaireBuilderController({
  activeType,
}: UseQuestionnaireBuilderControllerOptions) {
  const draft = useQuestionnaireBuilderStore((state) => state.drafts[activeType] ?? null);
  const updateTitle = useQuestionnaireBuilderStore((state) => state.updateTitle);
  const selectSection = useQuestionnaireBuilderStore((state) => state.selectSection);
  const addRootSection = useQuestionnaireBuilderStore((state) => state.addRootSection);
  const addChildSection = useQuestionnaireBuilderStore((state) => state.addChildSection);
  const updateSection = useQuestionnaireBuilderStore((state) => state.updateSection);
  const removeSection = useQuestionnaireBuilderStore((state) => state.removeSection);
  const moveSection = useQuestionnaireBuilderStore((state) => state.moveSection);
  const addQuestion = useQuestionnaireBuilderStore((state) => state.addQuestion);
  const updateQuestion = useQuestionnaireBuilderStore((state) => state.updateQuestion);
  const removeQuestion = useQuestionnaireBuilderStore((state) => state.removeQuestion);
  const updateQualitative = useQuestionnaireBuilderStore((state) => state.updateQualitative);
  const resetActiveDraft = useQuestionnaireBuilderStore((state) => state.resetActiveDraft);
  const hasUnsavedChanges = useQuestionnaireBuilderStore((state) => state.hasUnsavedChanges);
  const { save, isPending } = useSaveQuestionnaireBuilder();
  const [uiState, dispatch] = useReducer(builderUiReducer, initialBuilderUiState);

  const { saveDialogOpen, discardDialogOpen, pendingParentId, pendingScrollToSection } = uiState;

  const setSaveDialogOpen = (open: boolean) => {
    dispatch({ type: "set-save-dialog-open", open });
  };

  const setDiscardDialogOpen = (open: boolean) => {
    dispatch({ type: "set-discard-dialog-open", open });
  };

  const setPendingParentId = (sectionId: string | null) => {
    dispatch({ type: "set-pending-parent-id", sectionId });
  };

  useEffect(() => {
    if (!draft || draft.selectedSectionId || draft.sections.length === 0) {
      return;
    }

    selectSection(draft.sections[0]?.id ?? null);
  }, [draft, selectSection]);

  useEffect(() => {
    if (!draft?.selectedSectionId || !pendingScrollToSection) {
      return;
    }

    const targetId =
      draft.selectedSectionId === "qualitative"
        ? "qualitative-editor"
        : `section-editor-${draft.selectedSectionId}`;

    requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      dispatch({ type: "clear-pending-scroll-to-section" });
    });
  }, [draft?.selectedSectionId, pendingScrollToSection]);

  const validation = draft ? validateQuestionnaireBuilderDraft(draft) : null;
  const previewModel = draft ? buildQuestionnairePreviewModel(draft) : null;
  const isDirty = hasUnsavedChanges();
  const isSaved = !isDirty && Boolean(draft?.metadata.versionId);
  const pendingConversionState = canConvertSectionToParent(
    pendingParentId && draft ? findSectionById(draft.sections, pendingParentId) : null
  );

  const requestAddChild = (sectionId: string) => {
    if (!draft) {
      return;
    }

    const section = findSectionById(draft.sections, sectionId);
    const sectionLevel = getSectionLevel(draft.sections, sectionId);
    const conversionState = canConvertSectionToParent(section);

    if (sectionLevel === null || sectionLevel >= MAX_SECTION_NESTING_LEVEL) {
      return;
    }

    if (conversionState.requiresConfirmation) {
      dispatch({ type: "set-pending-parent-id", sectionId });
      return;
    }

    dispatch({ type: "request-scroll-to-section" });
    addChildSection(sectionId);
  };

  const handleAddRootSection = () => {
    dispatch({ type: "request-scroll-to-section" });
    addRootSection();
  };

  const handleUpdateSection = (sectionId: string, updates: QuestionnaireBuilderSectionUpdates) => {
    updateSection(sectionId, updates);
  };

  const handleUpdateQuestion = (
    sectionId: string,
    questionId: string,
    updates: Partial<Pick<QuestionnaireBuilderQuestionNode, "prompt" | "type">>
  ) => {
    updateQuestion(sectionId, questionId, updates);
  };

  const handleSelectSection = (sectionId: string) => {
    selectSection(sectionId);
    const targetId =
      sectionId === "qualitative" ? "qualitative-editor" : `section-editor-${sectionId}`;

    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSave = async () => {
    const result = await save();

    if (result?.status === "saved") {
      dispatch({ type: "set-save-dialog-open", open: true });
    }
  };

  const handleDiscardDraft = () => {
    resetActiveDraft();
    dispatch({ type: "set-discard-dialog-open", open: false });
  };

  const handleConfirmParentConversion = () => {
    if (pendingParentId) {
      dispatch({ type: "request-scroll-to-section" });
      addChildSection(pendingParentId);
    }

    dispatch({ type: "set-pending-parent-id", sectionId: null });
  };

  return {
    draft,
    updateTitle,
    moveSection,
    removeSection,
    addQuestion,
    removeQuestion,
    updateQualitative,
    validation,
    previewModel,
    isDirty,
    isSaved,
    isPending,
    saveDialogOpen,
    setSaveDialogOpen,
    discardDialogOpen,
    setDiscardDialogOpen,
    pendingParentId,
    setPendingParentId,
    pendingConversionState,
    requestAddChild,
    handleAddRootSection,
    handleUpdateSection,
    handleUpdateQuestion,
    handleSelectSection,
    handleSave,
    handleDiscardDraft,
    handleConfirmParentConversion,
  };
}
