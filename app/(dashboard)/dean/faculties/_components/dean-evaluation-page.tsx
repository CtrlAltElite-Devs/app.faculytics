"use client";

import { BookOpenCheck, ChevronLeft, ChevronRight, ClipboardCheck, Layers3 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { deanAnalyticsSampleData } from "@/features/dean";
import { FacultySubjects } from "@/features/dean/components/faculty-subjects";
import { paginateArray } from "@/lib/pagination";
import { useIsMobile } from "@/lib/use-mobile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const rowsPerPage = 6;
const evaluationTracks = ["In-classroom", "Out-of-classroom"] as const;

const deanEvaluationRows = deanAnalyticsSampleData.facultyAnalysis.map((faculty, index) => ({
  facultySlug: faculty.facultySlug,
  facultyName: faculty.facultyName,
  facultyInitials: faculty.facultyInitials,
  subjects: faculty.subjects,
  unit: index % 2 === 0 ? "College of Computing Studies" : "School of Information Systems",
  status: index % 3 === 0 ? "Priority this cycle" : "Ready for evaluation",
}));

const evaluationSummary = [
  {
    label: "Faculty in scope",
    value: String(deanEvaluationRows.length),
    description: "Faculty members currently visible under the dean's evaluation area.",
    icon: Layers3,
  },
  {
    label: "Questionnaire tracks",
    value: String(evaluationTracks.length),
    description: "Current backend-ready evaluation flows: in-classroom and out-of-classroom.",
    icon: ClipboardCheck,
  },
  {
    label: "Prepared profiles",
    value: `${deanEvaluationRows.length}/${deanEvaluationRows.length}`,
    description: "Listing surface is ready for future questionnaire launch and review actions.",
    icon: BookOpenCheck,
  },
] as const;

export function DeanEvaluationPage() {
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);

  const totalRows = deanEvaluationRows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedRows = paginateArray(deanEvaluationRows, currentPage, rowsPerPage);

  return (
    <section className="space-y-6 md:p-8">
      <header className="space-y-4">
        <div className="space-y-2">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-brand-blue">
            Dean evaluation
          </p>
          <div className="space-y-3">
            <h1 className="font-playfair text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Evaluate faculty within your assigned scope
            </h1>
            <p className="max-w-3xl font-sans text-sm leading-6 text-muted-foreground sm:text-base">
              Review the faculty members currently available to the dean, confirm which
              evaluation tracks apply, and prepare the entry points for the full questionnaire
              flow.
            </p>
          </div>
        </div>
        <Card className="panel-surface border-brand-blue/15 py-4 shadow-none">
          <CardContent className="flex flex-col gap-3 px-5 font-sans text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="font-semibold text-foreground">Evaluation entry surface is ready</p>
              <p>
                This screen is intentionally UI-first. Questionnaire rendering and submission
                actions will plug into these rows in a follow-up step.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {evaluationTracks.map((track) => (
                <Badge
                  key={track}
                  variant="outline"
                  className="border-brand-blue/20 bg-brand-blue/5 px-3 py-1 text-brand-blue"
                >
                  {track}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {evaluationSummary.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.label} className="panel-surface gap-4 border-border/70 py-5 shadow-none">
              <CardContent className="space-y-3 px-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-sans text-sm font-medium text-muted-foreground">{item.label}</p>
                  <div className="rounded-full border border-brand-blue/15 bg-brand-blue/10 p-2 text-brand-blue">
                    <Icon className="size-4" />
                  </div>
                </div>
                <p className="font-playfair text-3xl font-semibold tracking-tight text-foreground">
                  {item.value}
                </p>
                <p className="font-sans text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-playfair text-2xl font-semibold tracking-tight text-foreground">
            Faculty evaluation queue
          </h2>
          <p className="font-sans text-sm text-muted-foreground">
            Each row represents a faculty member visible to the dean and ready to be wired into
            the questionnaire flow.
          </p>
        </div>

        <div className="data-table-wrapper">
          {isMobile ? (
            <div className="divide-y divide-border/70">
              {paginatedRows.map((faculty) => (
                <article key={faculty.facultySlug} className="space-y-4 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar size="default" className="border border-border/70">
                      <AvatarFallback className="bg-slate-100 font-sans text-xs font-semibold text-slate-700">
                        {faculty.facultyInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 space-y-1">
                      <p className="truncate font-sans text-sm font-semibold text-foreground">
                        {faculty.facultyName}
                      </p>
                      <p className="text-xs text-muted-foreground">{faculty.unit}</p>
                    </div>
                  </div>

                  <div className="space-y-3 font-sans text-sm">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Teaching coverage
                      </p>
                      <FacultySubjects subjects={faculty.subjects} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Evaluation tracks
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {evaluationTracks.map((track) => (
                            <Badge key={track} variant="outline" className="px-2.5 py-1">
                              {track}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Status
                        </p>
                        <Badge
                          variant="outline"
                          className="border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700"
                        >
                          {faculty.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={`/dean/${faculty.facultySlug}/analysis`}>
                          View profile
                        </Link>
                      </Button>
                      <Button variant="brand" size="sm" className="flex-1" disabled>
                        Evaluation flow soon
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <Table className="w-full table-fixed [&_td]:whitespace-normal [&_th]:whitespace-normal">
              <TableHeader className="data-table-header">
                <TableRow>
                  <TableHead className="data-table-head w-[24%]">Faculty</TableHead>
                  <TableHead className="data-table-head w-[22%]">Unit</TableHead>
                  <TableHead className="data-table-head w-[24%]">Teaching coverage</TableHead>
                  <TableHead className="data-table-head w-[16%]">Evaluation tracks</TableHead>
                  <TableHead className="data-table-head w-[14%] text-right">Next step</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr:last-child]:border-b-0">
                {paginatedRows.map((faculty) => (
                  <TableRow key={faculty.facultySlug} className="data-table-row">
                    <TableCell className="data-table-cell">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar size="default" className="border border-border/70">
                          <AvatarFallback className="bg-slate-100 font-sans text-xs font-semibold text-slate-700">
                            {faculty.facultyInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 space-y-1">
                          <p className="truncate font-sans text-sm font-semibold text-foreground">
                            {faculty.facultyName}
                          </p>
                          <Badge
                            variant="outline"
                            className="border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700"
                          >
                            {faculty.status}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="data-table-cell">
                      <p className="font-medium text-foreground">{faculty.unit}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Scoped to the dean&apos;s current evaluation view.
                      </p>
                    </TableCell>
                    <TableCell className="data-table-cell">
                      <FacultySubjects subjects={faculty.subjects} />
                    </TableCell>
                    <TableCell className="data-table-cell">
                      <div className="flex flex-wrap gap-2">
                        {evaluationTracks.map((track) => (
                          <Badge key={track} variant="outline" className="px-2.5 py-1">
                            {track}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="data-table-cell">
                      <div className="flex flex-col items-end gap-2">
                        <Button asChild variant="ghost" size="sm" className="text-brand-blue">
                          <Link href={`/dean/${faculty.facultySlug}/analysis`}>
                            View profile
                          </Link>
                        </Button>
                        <Button variant="brand" size="sm" disabled>
                          Evaluation flow soon
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex flex-col gap-3 pt-2 font-sans text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {paginatedRows.length} of {totalRows} faculty records
          </p>
          <div className="flex items-center gap-3 self-end">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                className="border-border/70"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                className="border-border/70"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
