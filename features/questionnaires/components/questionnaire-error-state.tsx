import { Button } from "@/components/ui/button";

type QuestionnaireErrorStateProps = {
  onRetry: () => void;
};

export function QuestionnaireErrorState({ onRetry }: QuestionnaireErrorStateProps) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center px-6 text-center">
      <p className="max-w-xl text-sm text-muted-foreground">
        Questionnaire data could not be loaded right now.
      </p>
      <Button type="button" variant="outline" className="mt-5" onClick={onRetry}>
        Reload
      </Button>
    </div>
  );
}
