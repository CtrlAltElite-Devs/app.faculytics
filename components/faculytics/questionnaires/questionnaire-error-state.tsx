import { Button } from "@/components/ui/button";

type QuestionnaireErrorStateProps = {
  onRetry: () => void;
};

export function QuestionnaireErrorState({
  onRetry,
}: QuestionnaireErrorStateProps) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center px-6 text-center">
      <h2 className="font-playfair text-xl font-semibold">Unable to load questionnaires</h2>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        The dashboard data request failed. Retry the request to load questionnaire types and versions.
      </p>
      <Button type="button" variant="outline" className="mt-5" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
