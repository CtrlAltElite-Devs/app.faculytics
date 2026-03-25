import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type QuestionnairePreviewStateCardProps = {
  title: string;
  description: string;
};

export function QuestionnairePreviewStateCard({
  title,
  description,
}: QuestionnairePreviewStateCardProps) {
  return (
    <div className="flex min-h-[45vh] items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="font-playfair text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
