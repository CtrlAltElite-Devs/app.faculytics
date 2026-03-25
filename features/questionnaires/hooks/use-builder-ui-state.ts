import { useReducer } from "react";

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

export function useBuilderUiState() {
  const [uiState, dispatch] = useReducer(builderUiReducer, initialBuilderUiState);

  const { saveDialogOpen, discardDialogOpen, pendingParentId, pendingScrollToSection } = uiState;

  return {
    saveDialogOpen,
    discardDialogOpen,
    pendingParentId,
    pendingScrollToSection,
    setSaveDialogOpen: (open: boolean) => dispatch({ type: "set-save-dialog-open", open }),
    setDiscardDialogOpen: (open: boolean) => dispatch({ type: "set-discard-dialog-open", open }),
    setPendingParentId: (sectionId: string | null) => dispatch({ type: "set-pending-parent-id", sectionId }),
    requestScrollToSection: () => dispatch({ type: "request-scroll-to-section" }),
    clearPendingScrollToSection: () => dispatch({ type: "clear-pending-scroll-to-section" }),
  };
}

export type { BuilderUiState, BuilderUiAction };
