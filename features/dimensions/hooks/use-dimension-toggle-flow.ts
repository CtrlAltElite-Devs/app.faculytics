"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useToggleDimensionStatus } from "@/features/dimensions/hooks/use-toggle-dimension-status";
import type { Dimension } from "@/features/dimensions/types";

type DimensionAction = { type: "toggle"; dimension: Dimension } | null;

export function useDimensionToggleFlow() {
  const [dimensionAction, setDimensionAction] = useState<DimensionAction>(null);
  const toggleStatusMutation = useToggleDimensionStatus();

  const handleConfirmToggle = async () => {
    if (!dimensionAction) {
      return;
    }

    const { dimension } = dimensionAction;
    const action = dimension.active ? "deactivated" : "activated";

    try {
      await toggleStatusMutation.mutateAsync({
        id: dimension.id,
        active: dimension.active,
      });
      toast.success(`Dimension ${action}.`);
      setDimensionAction(null);
    } catch {
      toast.error(`Unable to ${dimension.active ? "deactivate" : "activate"} dimension.`);
    }
  };

  const toggleDialogConfig = dimensionAction
    ? dimensionAction.dimension.active
      ? {
          title: `Deactivate "${dimensionAction.dimension.displayName}"?`,
          description: "This dimension will no longer be selectable in the questionnaire builder.",
          confirmLabel: "Deactivate",
          confirmVariant: "destructive" as const,
        }
      : {
          title: `Activate "${dimensionAction.dimension.displayName}"?`,
          description: "This dimension will become selectable again in the questionnaire builder.",
          confirmLabel: "Activate",
          confirmVariant: "brand" as const,
        }
    : null;

  return {
    dimensionAction,
    toggleDialogConfig,
    isTogglePending: toggleStatusMutation.isPending,
    setDimensionAction,
    onConfirmToggle: handleConfirmToggle,
  };
}
