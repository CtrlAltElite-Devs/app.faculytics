"use client";

import { useEffect, useState } from "react";

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
  QuestionnaireBuilderSectionNode,
  QuestionnaireBuilderSectionUpdates,
  QuestionnaireType,
} from "@/features/questionnaires/types";

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

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const [pendingParentId, setPendingParentId] = useState<string | null>(null);
  const [pendingScrollToSection, setPendingScrollToSection] = useState(false);

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
      setPendingScrollToSection(false);
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
      setPendingParentId(sectionId);
      return;
    }

    setPendingScrollToSection(true);
    addChildSection(sectionId);
  };

  const handleAddRootSection = () => {
    setPendingScrollToSection(true);
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
      setSaveDialogOpen(true);
    }
  };

  const handleDiscardDraft = () => {
    resetActiveDraft();
    setDiscardDialogOpen(false);
  };

  const handleConfirmParentConversion = () => {
    if (pendingParentId) {
      setPendingScrollToSection(true);
      addChildSection(pendingParentId);
    }

    setPendingParentId(null);
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
