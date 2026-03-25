import Link from "next/link";
import { UserX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EvaluationNoFaculty() {
  return (
    <Card className="mt-8">
      <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
        <UserX className="size-12 text-muted-foreground" />
        <div>
          <h2 className="font-playfair text-xl font-semibold">No Instructor Assigned</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No instructor is assigned to this course. Evaluation is not available.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/student/courses">Back to Courses</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
