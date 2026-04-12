import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/date";

type EvaluationAlreadySubmittedProps = {
  submittedAt?: string;
};

export function EvaluationAlreadySubmitted({ submittedAt }: EvaluationAlreadySubmittedProps) {
  return (
    <Card className="mt-8">
      <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="space-y-3">
          <h2 className="font-playfair text-xl font-semibold">Evaluation already submitted.</h2>
          {submittedAt && (
            <Badge variant="secondary">Submitted {formatDateTime(submittedAt)}</Badge>
          )}
        </div>
        <Button asChild variant="outline">
          <Link href="/student/courses">Back to Courses</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
