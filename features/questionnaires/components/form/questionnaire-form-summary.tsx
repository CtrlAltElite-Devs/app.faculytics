import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LIKERT_LABELS, YES_NO_REVERSE_MAP } from "@/features/questionnaires/constants/builder";
import type {
  BuilderQuestionType,
  QuestionnaireBuilderPreviewModel,
  QuestionnaireBuilderPreviewQuestion,
  QuestionnaireBuilderPreviewSection,
  QuestionnaireFormAnswers,
  QuestionnaireFormValues,
} from "@/features/questionnaires/types";

type QuestionnaireFormSummaryProps = {
  model: QuestionnaireBuilderPreviewModel;
  values: QuestionnaireFormValues;
};

function formatAnswer(
  question: QuestionnaireBuilderPreviewQuestion,
  answers: QuestionnaireFormAnswers
): { text: string; answered: boolean } {
  const value = answers[question.id];
  if (value === undefined) {
    return { text: "Not answered", answered: false };
  }
  if (question.type === "LIKERT_1_5") {
    const label = LIKERT_LABELS[String(value)];
    return { text: label ? `${value} – ${label}` : String(value), answered: true };
  }
  if (question.type === "YES_NO") {
    return { text: YES_NO_REVERSE_MAP[value] ?? String(value), answered: true };
  }
  return { text: String(value), answered: true };
}

function SectionSummary({
  section,
  answers,
  isChild = false,
}: {
  section: QuestionnaireBuilderPreviewSection;
  answers: QuestionnaireFormAnswers;
  isChild?: boolean;
}) {
  const isLeaf = section.questions.length > 0;
  const isInternal = section.children.length > 0;

  return (
    <div
      className={
        isChild ? "space-y-3 pl-3 sm:pl-6" : "space-y-3 rounded-2xl border bg-background p-4 sm:p-5"
      }
    >
      <h3 className="font-playfair text-lg leading-tight font-semibold tracking-tight text-foreground sm:text-xl">
        {section.title}
      </h3>

      {isLeaf && (
        <SectionAnswerTable
          questions={section.questions}
          questionType={section.questions[0]?.type ?? "LIKERT_1_5"}
          answers={answers}
        />
      )}

      {isInternal && (
        <div className="space-y-3">
          {section.children.map((child) => (
            <SectionSummary key={child.id} section={child} answers={answers} isChild />
          ))}
        </div>
      )}
    </div>
  );
}

function SectionAnswerTable({
  questions,
  questionType,
  answers,
}: {
  questions: QuestionnaireBuilderPreviewQuestion[];
  questionType: BuilderQuestionType;
  answers: QuestionnaireFormAnswers;
}) {
  const answerColumnLabel = questionType === "YES_NO" ? "Response" : "Rating";

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[65%]">Question</TableHead>
            <TableHead>{answerColumnLabel}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question) => {
            const { text, answered } = formatAnswer(question, answers);
            return (
              <TableRow key={question.id}>
                <TableCell className="align-top text-sm font-normal whitespace-normal">
                  {question.prompt || "Untitled question"}
                </TableCell>
                <TableCell
                  className={
                    "align-top text-sm font-medium tabular-nums " +
                    (answered ? "" : "text-muted-foreground italic")
                  }
                >
                  {text}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export function QuestionnaireFormSummary({ model, values }: QuestionnaireFormSummaryProps) {
  const trimmedComment = values.qualitativeComment.trim();

  return (
    <div className="space-y-5">
      {model.sections.map((section) => (
        <SectionSummary key={section.id} section={section} answers={values.answers} />
      ))}

      {model.qualitative.enabled && (
        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="font-playfair text-lg">Comments</CardTitle>
          </CardHeader>
          <CardContent>
            {trimmedComment ? (
              <p className="text-sm whitespace-pre-wrap text-foreground">{trimmedComment}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">No comment provided</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
