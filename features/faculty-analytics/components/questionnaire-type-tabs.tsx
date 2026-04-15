"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FacultyQuestionnaireTypeOptionDto } from "@/features/faculty-analytics/types";

type QuestionnaireTypeTabsProps = {
  types: FacultyQuestionnaireTypeOptionDto[];
  selectedCode: string | null;
  onSelect: (code: string) => void;
  isLoading?: boolean;
};

export function QuestionnaireTypeTabs({
  types,
  selectedCode,
  onSelect,
  isLoading,
}: QuestionnaireTypeTabsProps) {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
    );
  }

  if (types.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        No questionnaire types with submissions for this scope.
      </p>
    );
  }

  const value = selectedCode ?? types[0].code;

  return (
    <Tabs value={value} onValueChange={(next) => onSelect(next)} className="w-full sm:w-auto">
      <TabsList className="flex h-auto w-full flex-wrap gap-1 sm:w-auto">
        {types.map((type) => (
          <TabsTrigger key={type.code} value={type.code} className="font-sans text-xs">
            {type.name}
            <span className="ml-1.5 text-[10px] tabular-nums text-muted-foreground">
              · {type.submissionCount}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
