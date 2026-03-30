"use client";

import { Loader2 } from "lucide-react";

export function QuestionnaireTypeManagementLoadingState() {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center px-6 text-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
      <p className="mt-3 text-sm text-muted-foreground">Loading questionnaire types...</p>
    </div>
  );
}
