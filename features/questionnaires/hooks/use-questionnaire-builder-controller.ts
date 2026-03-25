"use client";

import { useEffect, useState } from "react";

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
import type { QuestionnaireType } from "@/features/questionnaires/types";

type UseQuestionnaireBuilderControllerOptions = {
  activeType: QuestionnaireType;
};

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
  const liveValidation = draft ? validateQuestionnaireBuilderDraft(draft) : null;
  const validation = hasAttemptedSave ? liveValidation : null;

  const previewModel = draft ? buildQuestionnairePreviewModel(draft) : null;
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
      const result = validateQuestionnaireBuilderDraft(draft);

      if (!result.isValid) return;
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
