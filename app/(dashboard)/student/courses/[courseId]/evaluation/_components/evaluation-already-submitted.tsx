import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/date";

type EvaluationAlreadySubmittedProps = {
  submittedAt?: string;
};

export function EvaluationAlreadySubmitted({
  submittedAt,
}: EvaluationAlreadySubmittedProps) {
  return (
    <Card className="mt-8">
      <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle2 className="size-12 text-primary" />
        <div>
          <h2 className="font-playfair text-xl font-semibold">
            Evaluation Already Submitted
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You have already submitted your evaluation for this course.
          </p>
          {submittedAt && (
            <p className="mt-2 text-sm text-muted-foreground">
              Submitted on {formatDate(submittedAt)}.
            </p>
          )}
        </div>
        <Button asChild variant="outline">
          <Link href="/student/courses">Back to Courses</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
