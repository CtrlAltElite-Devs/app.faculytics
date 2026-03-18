import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type QuestionnairePreviewStateCardProps = {
  title: string;
  description: string;
  backHref: string;
  backLabel: string;
};

export function QuestionnairePreviewStateCard({
  title,
  description,
  backHref,
  backLabel,
}: QuestionnairePreviewStateCardProps) {
  return (
    <div className="flex min-h-[55vh] items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-playfair text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4 text-center">
          <p className="text-sm text-muted-foreground">{description}</p>
          <Button asChild variant="outline">
            <Link href={backHref}>{backLabel}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
