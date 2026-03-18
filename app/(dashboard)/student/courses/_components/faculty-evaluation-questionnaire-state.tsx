import { Loader2 } from "lucide-react";

type FacultyEvaluationQuestionnaireStateProps = {
  contextState: "ready" | "loading" | "error" | "missing";
};

export function FacultyEvaluationQuestionnaireState({
  contextState,
}: FacultyEvaluationQuestionnaireStateProps) {
  if (contextState === "loading") {
    return (
      <div className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        <p className="text-sm">Loading course context...</p>
      </div>
    );
  }

  if (contextState === "error") {
    return (
      <div className="rounded-lg border border-dashed p-6 text-sm text-destructive">
        Unable to load course context right now.
      </div>
    );
  }

  if (contextState === "missing") {
    return (
      <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        This course is not in your current enrollments.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
      Questionnaire is not configured yet. This form will appear once the active questionnaire is
      published.
    </div>
  );
}
