import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RATING_SCALE_ITEMS = [
  {
    label: "1 - Strongly Disagree",
    description: "Performance does not conform with University of Cebu standards.",
  },
  {
    label: "2 - Disagree",
    description: "Performance is below University of Cebu standards.",
  },
  {
    label: "3 - Neutral",
    description: "Performance is within standards in many instances.",
  },
  {
    label: "4 - Agree",
    description: "Performance is within standards in most cases.",
  },
  {
    label: "5 - Strongly Agree",
    description: "Performance exceeds University of Cebu standards consistently.",
  },
] as const;

export function QuestionnaireRatingScaleInstructions() {
  return (
    <Card className="border-brand-yellow/90 bg-brand-yellow/30">
      <CardHeader>
        <CardTitle className="font-playfair text-lg">Rating scale</CardTitle>
        <CardDescription className="text-primary">
          Use this scale when reviewing each quantitative statement.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-5">
        {RATING_SCALE_ITEMS.map((item) => (
          <div key={item.label}>
            <p className="font-medium">{item.label}</p>
            <p className="mt-1 text-primary">{item.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
