"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buildFacultyEvaluationHref } from "@/features/faculty-evaluation/lib/faculty-evaluation-routes";
import type { FacultyEvaluationRoleContext } from "@/features/faculty-evaluation/types";
import type { QuestionnaireTypeSummary } from "@/features/questionnaires/types";

type EvaluateActionMenuProps = {
  facultyId: string;
  facultyName: string;
  semesterId: string;
  semesterLabel: string;
  role: FacultyEvaluationRoleContext;
  questionnaireTypes: QuestionnaireTypeSummary[];
  disabled?: boolean;
  className?: string;
};

export function EvaluateActionMenu({
  facultyId,
  facultyName,
  semesterId,
  semesterLabel,
  role,
  questionnaireTypes,
  disabled = false,
  className,
}: EvaluateActionMenuProps) {
  const router = useRouter();

  const handleSelect = (typeId: string) => {
    const href = buildFacultyEvaluationHref({
      role,
      facultyId,
      facultyName,
      semesterId,
      semesterLabel,
      typeId,
    });

    router.push(href);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={className}
          disabled={disabled || questionnaireTypes.length === 0}
        >
          Evaluate
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        {questionnaireTypes.map((type) => (
          <DropdownMenuItem
            key={type.id}
            className="font-sans text-sm"
            onSelect={() => handleSelect(type.id)}
          >
            {type.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
