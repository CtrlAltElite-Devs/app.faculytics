"use client";

import { useParams } from "next/navigation";

import { useEvaluationData } from "@/features/questionnaires/hooks/use-evaluation-data";

import { EvaluationAlreadySubmitted } from "./_components/evaluation-already-submitted";
import { EvaluationForm } from "./_components/evaluation-form";
import { EvaluationNoFaculty } from "./_components/evaluation-no-faculty";
import { EvaluationPageShell } from "./_components/evaluation-page-shell";
import {
  EvaluationError,
  EvaluationLoading,
} from "./_components/evaluation-states";

export default function FacultyEvaluationPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const result = useEvaluationData(courseId);

  if (result.status === "loading") {
    const ctx = result.context;
    return (
      <EvaluationPageShell
        courseName={ctx?.courseName}
        courseShortname={ctx?.courseShortname}
        facultyName={ctx?.facultyName}
      >
        <EvaluationLoading message={result.message} />
      </EvaluationPageShell>
    );
  }

  if (result.status === "error") {
    return (
      <EvaluationPageShell>
        <EvaluationError message={result.message} />
      </EvaluationPageShell>
    );
  }

  if (result.status === "no-faculty") {
    return (
      <EvaluationPageShell>
        <EvaluationNoFaculty />
      </EvaluationPageShell>
    );
  }

  if (result.status === "no-semester") {
    return (
      <EvaluationPageShell>
        <EvaluationError message="Unable to determine the current semester for this course." />
      </EvaluationPageShell>
    );
  }

  if (result.status === "no-version") {
    const { courseName, courseShortname, facultyName } = result.context;
    return (
      <EvaluationPageShell courseName={courseName} courseShortname={courseShortname} facultyName={facultyName}>
        <EvaluationError message="No active questionnaire is available for evaluation at this time." />
      </EvaluationPageShell>
    );
  }

  if (result.status === "already-submitted") {
    const { context, submittedAt } = result;
    return (
      <EvaluationPageShell courseName={context.courseName} courseShortname={context.courseShortname} facultyName={context.facultyName}>
        <EvaluationAlreadySubmitted submittedAt={submittedAt} />
      </EvaluationPageShell>
    );
  }

  return <EvaluationForm courseId={courseId} {...result.data} />;
}
