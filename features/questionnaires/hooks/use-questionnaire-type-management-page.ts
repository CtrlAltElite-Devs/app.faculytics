import { useState } from "react";
import { toast } from "sonner";

import { useDeleteQuestionnaireTypeManagement } from "@/features/questionnaires/hooks/use-delete-questionnaire-type-management";
import { useQuestionnaireTypeManagementList } from "@/features/questionnaires/hooks/use-questionnaire-type-management";
import { resolveDeleteQuestionnaireTypeManagementErrorMessage } from "@/features/questionnaires/lib/questionnaire-type-management-errors";
import type { QuestionnaireTypeManagementEntity } from "@/features/questionnaires/types";

export function useQuestionnaireTypeManagementPage() {
  const listQuery = useQuestionnaireTypeManagementList();
  const deleteMutation = useDeleteQuestionnaireTypeManagement();
  const [createOpen, setCreateOpen] = useState(false);
  const [editQuestionnaireType, setEditQuestionnaireType] =
    useState<QuestionnaireTypeManagementEntity | null>(null);
  const [deleteQuestionnaireType, setDeleteQuestionnaireType] =
    useState<QuestionnaireTypeManagementEntity | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteQuestionnaireType) {
      return;
    }

    try {
      const response = await deleteMutation.mutateAsync(deleteQuestionnaireType.id);
      toast.success(response.message);
      setDeleteQuestionnaireType(null);
    } catch (error) {
      toast.error(
        resolveDeleteQuestionnaireTypeManagementErrorMessage(
          error,
          "Unable to delete questionnaire type."
        )
      );
    }
  };

  return {
    rows: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    createOpen,
    setCreateOpen,
    editQuestionnaireType,
    setEditQuestionnaireType,
    deleteQuestionnaireType,
    setDeleteQuestionnaireType,
    isDeletePending: deleteMutation.isPending,
    onConfirmDelete: handleConfirmDelete,
    onRetry: () => {
      void listQuery.refetch();
    },
  };
}
