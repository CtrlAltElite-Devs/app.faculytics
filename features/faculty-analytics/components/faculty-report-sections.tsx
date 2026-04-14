"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScopedAnalyticsEmptyState } from "@/features/faculty-analytics/components/scoped-analytics-empty-state";
import {
  formatFacultyReportScore,
  getFacultyReportInterpretationBadgeClass,
} from "@/features/faculty-analytics/lib/faculty-report-detail";
import type { FacultyReportSectionDto } from "@/features/faculty-analytics/types";

type FacultyReportSectionsProps = {
  sections: FacultyReportSectionDto[];
};

function FacultyReportSectionTable({ section }: { section: FacultyReportSectionDto }) {
  return (
    <article className="overflow-hidden">
      <div className="px-2 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-sans text-sm text-muted-foreground">Section {section.order}</p>
            <h2 className="mt-1 font-playfair text-xl font-semibold text-foreground">
              {section.title}
            </h2>
          </div>
          <div className="text-left font-sans text-sm text-muted-foreground sm:text-right">
            <div>Weight: {section.weight}%</div>
            <div>Average: {formatFacultyReportScore(section.sectionAverage)}</div>
            <Badge
              variant="ghost"
              className={getFacultyReportInterpretationBadgeClass(section.sectionInterpretation)}
            >
              {section.sectionInterpretation}
            </Badge>
          </div>
        </div>
      </div>
      <div className="data-table-wrapper">
        <Table className="w-full table-fixed [&_td]:py-3.5 [&_td]:whitespace-normal [&_th]:whitespace-normal">
          <TableHeader className="data-table-header">
            <TableRow>
              <TableHead className="data-table-head w-[62%] px-3 text-xs">Question</TableHead>
              <TableHead className="data-table-head w-[16%] px-3 text-xs text-right">
                Average
              </TableHead>
              <TableHead className="data-table-head w-[22%] px-3 text-xs">Interpretation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {section.questions.map((question) => (
              <TableRow key={question.questionId} className="data-table-row">
                <TableCell className="data-table-cell px-3 font-sans text-sm">
                  {question.text}
                </TableCell>
                <TableCell className="data-table-cell px-3 text-right font-sans text-sm">
                  {formatFacultyReportScore(question.average)}
                </TableCell>
                <TableCell className="data-table-cell px-3 font-sans text-sm">
                  <Badge
                    variant="ghost"
                    className={getFacultyReportInterpretationBadgeClass(question.interpretation)}
                  >
                    {question.interpretation}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </article>
  );
}

export function FacultyReportSections({ sections }: FacultyReportSectionsProps) {
  if (sections.length === 0) {
    return (
      <ScopedAnalyticsEmptyState description="No report sections are available for the selected faculty, semester, and questionnaire type." />
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <FacultyReportSectionTable key={section.sectionId} section={section} />
      ))}
    </div>
  );
}
