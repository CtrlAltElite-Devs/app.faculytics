"use client";

import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { MAX_SECTION_NESTING_LEVEL } from "@/features/questionnaires/constants/builder";
import { useBuilderUiState } from "@/features/questionnaires/hooks/use-builder-ui-state";
import { useSaveQuestionnaireBuilder } from "@/features/questionnaires/hooks/use-save-questionnaire-builder";
import { buildQuestionnairePreviewModel } from "@/features/questionnaires/lib/builder-serializer";
import {
  canConvertSectionToParent,
  findSectionById,
  getSectionLevel,
  validateQuestionnaireBuilderDraft,
} from "@/features/questionnaires/lib/builder-validator";
import { useQuestionnaireBuilderStore } from "@/features/questionnaires/store/questionnaire-builder-store";
import type { QuestionnaireTypeCode } from "@/features/questionnaires/types";

type UseQuestionnaireBuilderControllerOptions = {
  activeType: QuestionnaireTypeCode;
};

export function useQuestionnaireBuilderController({
  activeType,
}: UseQuestionnaireBuilderControllerOptions) {
  const {
    draft,
    updateTitle,
    selectSection,
    addRootSection,
    addChildSection,
    updateSection,
    removeSection,
    moveSection,
    addQuestion,
    updateQuestion,
    removeQuestion,
    updateQualitative,
    resetActiveDraft,
    hasUnsavedChanges,
  } = useQuestionnaireBuilderStore(
    useShallow((state) => ({
      draft: state.drafts[activeType] ?? null,
      updateTitle: state.updateTitle,
      selectSection: state.selectSection,
      addRootSection: state.addRootSection,
      addChildSection: state.addChildSection,
      updateSection: state.updateSection,
      removeSection: state.removeSection,
      moveSection: state.moveSection,
      addQuestion: state.addQuestion,
      updateQuestion: state.updateQuestion,
      removeQuestion: state.removeQuestion,
      updateQualitative: state.updateQualitative,
      resetActiveDraft: state.resetActiveDraft,
      hasUnsavedChanges: state.hasUnsavedChanges,
    }))
  );
  const { save, isPending } = useSaveQuestionnaireBuilder();
  const ui = useBuilderUiState();

  // Errors only appear after the first save attempt, then re-validate live so
  // errors clear as the user fixes them (same as RHF onSubmit + reValidateMode: onChange).
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);

  useEffect(() => {
    if (!draft || draft.selectedSectionId || draft.sections.length === 0) {
      return;
    }

    selectSection(draft.sections[0]?.id ?? null);
  }, [draft, selectSection]);

  const { pendingScrollToSection, clearPendingScrollToSection } = ui;
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
      clearPendingScrollToSection();
    });
  }, [draft?.selectedSectionId, pendingScrollToSection, clearPendingScrollToSection]);

  // Always compute live — used for totalLeafWeight, and for error display after first save attempt.
  const liveValidation = useMemo(
    () => (draft ? validateQuestionnaireBuilderDraft(draft) : null),
    [draft]
  );
  const validation = hasAttemptedSave ? liveValidation : null;

  const previewModel = useMemo(
    () => (draft ? buildQuestionnairePreviewModel(draft) : null),
    [draft]
  );
  const isDirty = hasUnsavedChanges();
  const isSaved = !isDirty && Boolean(draft?.metadata.versionId);
  const pendingConversionState = canConvertSectionToParent(
    ui.pendingParentId && draft ? findSectionById(draft.sections, ui.pendingParentId) : null
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
      ui.setPendingParentId(sectionId);
      return;
    }

    ui.requestScrollToSection();
    addChildSection(sectionId);
  };

  const handleAddRootSection = () => {
    ui.requestScrollToSection();
    addRootSection();
  };

  const handleSelectSection = (sectionId: string) => {
    selectSection(sectionId);
    const targetId =
      sectionId === "qualitative" ? "qualitative-editor" : `section-editor-${sectionId}`;

    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSave = async () => {
    if (draft) {
      setHasAttemptedSave(true);
      const result = liveValidation;

      if (result && !result.isValid) return;
    }

    const result = await save();

    if (result?.status === "saved") {
      setHasAttemptedSave(false);
      ui.setSaveDialogOpen(true);
    }
  };

  const handleDiscardDraft = () => {
    resetActiveDraft();
    setHasAttemptedSave(false);
    ui.setDiscardDialogOpen(false);
  };

  const handleConfirmParentConversion = () => {
    if (ui.pendingParentId) {
      ui.requestScrollToSection();
      addChildSection(ui.pendingParentId);
    }

    ui.setPendingParentId(null);
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
    totalLeafWeight: liveValidation?.totalLeafWeight ?? 0,
    previewModel,
    isDirty,
    isSaved,
    isPending,
    saveDialogOpen: ui.saveDialogOpen,
    setSaveDialogOpen: ui.setSaveDialogOpen,
    discardDialogOpen: ui.discardDialogOpen,
    setDiscardDialogOpen: ui.setDiscardDialogOpen,
    pendingParentId: ui.pendingParentId,
    setPendingParentId: ui.setPendingParentId,
    pendingConversionState,
    requestAddChild,
    handleAddRootSection,
    handleUpdateSection: updateSection,
    handleUpdateQuestion: updateQuestion,
    handleSelectSection,
    handleSave,
    handleDiscardDraft,
    handleConfirmParentConversion,
  };
}
