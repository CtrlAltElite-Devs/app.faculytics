import { Button } from "@/components/ui/button";

type QuestionnaireBuilderPageHeaderProps = {
  onBack: () => void;
};

export function QuestionnaireBuilderPageHeader({ onBack }: QuestionnaireBuilderPageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-playfair text-2xl font-semibold">Questionnaire Builder</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Build a quantitative questionnaire, add an optional final comment section, and save it as
          a draft version.
        </p>
      </div>
      <Button type="button" variant="outline" className="sm:self-start" onClick={onBack}>
        Back to questionnaires
      </Button>
    </div>
  );
}
