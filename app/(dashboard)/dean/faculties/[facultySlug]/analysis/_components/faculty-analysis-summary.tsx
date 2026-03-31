"use client";

import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";

import type { DeanFacultyAnalysisRecord } from "@/features/dean";
import {
  useFeedbackTableState,
  rowsPerPageOptions,
  sentimentFilterOptions,
} from "@/features/dean/hooks/use-feedback-table-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function FacultyMetricCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <Card className="gap-4 rounded-2xl border-border/70 shadow-sm">
      <CardHeader className="pb-0">
        <div className="space-y-2">
          <CardDescription className="font-sans text-sm">{title}</CardDescription>
          <CardTitle className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
            {value}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="font-sans text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function FacultyAnalysisSummary({ faculty }: { faculty: DeanFacultyAnalysisRecord }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex flex-1 flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
          <div className="flex items-center gap-4 lg:w-[30%] lg:flex-none">
            <Avatar className="size-14 border border-border/70">
              <AvatarFallback className="bg-slate-100 font-sans text-base font-semibold text-slate-700">
                {faculty.facultyInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-playfair text-xl font-semibold tracking-tight sm:text-2xl">
                {faculty.facultyName}
              </h1>
              <p className="mt-2 font-sans text-sm text-muted-foreground">CCS Department Faculty</p>
            </div>
          </div>
          <div className="space-y-3 lg:w-[70%] lg:flex-none">
            <p className="font-sans text-sm font-semibold text-muted-foreground">SUBJECT HANDLED</p>
            <div className="flex flex-wrap gap-2">
              {faculty.subjects.map((subject) => (
                <Badge
                  key={subject}
                  variant="outline"
                  className="rounded-full border-brand-blue/30 bg-brand-blue/10 px-3 py-1 font-sans text-xs text-brand-blue"
                >
                  {subject}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FacultyMetricCard
          title="Average Rating"
          value={faculty.averageRating.toFixed(1)}
          description="Overall student rating across the selected faculty's handled subjects."
        />
        <FacultyMetricCard
          title="Total Student Responses"
          value={new Intl.NumberFormat("en-US").format(faculty.responses)}
          description="Submitted evaluation responses included in this faculty analysis."
        />
        <FacultyMetricCard
          title="Positive Rate"
          value={faculty.overallPositiveRate}
          description="Share of responses indicating positive sentiment toward the faculty."
        />
      </div>
    </div>
  );
}

export function FacultyAnalysisRemarksList({ faculty }: { faculty: DeanFacultyAnalysisRecord }) {
  const {
    searchQuery,
    setSearchQuery,
    selectedSentiment,
    setSelectedSentiment,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    totalRows,
    totalPages,
    paginatedFeedback,
    paginationItems,
  } = useFeedbackTableState(faculty);

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl font-semibold tracking-tight sm:text-2xl">
          Remarks List
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search remarks"
              className="w-full pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="min-w-36 justify-between font-sans"
              >
                <span>{selectedSentiment}</span>
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-36">
              <DropdownMenuRadioGroup
                value={selectedSentiment}
                onValueChange={(value) => {
                  setSelectedSentiment(value as (typeof sentimentFilterOptions)[number]);
                  setCurrentPage(1);
                }}
              >
                {sentimentFilterOptions.map((option) => (
                  <DropdownMenuRadioItem key={option} value={option} className="font-sans text-sm">
                    {option}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="data-table-wrapper">
          <Table className="w-full table-fixed [&_td]:whitespace-normal [&_th]:whitespace-normal">
            <TableHeader className="data-table-header">
              <TableRow>
                <TableHead className="data-table-head w-[18%]">Date</TableHead>
                <TableHead className="data-table-head w-[62%]">Feedback</TableHead>
                <TableHead className="data-table-head w-[20%]">Sentiment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr:last-child]:border-b-0">
              {paginatedFeedback.map((record) => (
                <TableRow key={`${record.date}-${record.feedback}`} className="data-table-row">
                  <TableCell className="data-table-cell">{record.date}</TableCell>
                  <TableCell className="data-table-cell">{record.feedback}</TableCell>
                  <TableCell className="data-table-cell">
                    <Badge
                      variant={record.sentiment === "Negative" ? "destructive" : "ghost"}
                      className={
                        record.sentiment === "Positive"
                          ? "badge-status-active"
                          : record.sentiment === "Neutral"
                            ? "badge-status-deprecated"
                            : undefined
                      }
                    >
                      {record.sentiment}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col gap-3 pt-1 font-sans text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="text-xs sm:text-sm">
            Showing {paginatedFeedback.length} of {totalRows} feedback records
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-6">
            <div className="flex items-center gap-3">
              <span>Rows per page</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="min-w-16 justify-between font-sans"
                  >
                    <span>{rowsPerPage}</span>
                    <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-16">
                  <DropdownMenuRadioGroup
                    value={String(rowsPerPage)}
                    onValueChange={(value) => {
                      setRowsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    {rowsPerPageOptions.map((option) => (
                      <DropdownMenuRadioItem
                        key={option}
                        value={String(option)}
                        className="font-sans text-sm"
                      >
                        {option}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                  className="border-border/70 font-sans"
                >
                  <ChevronLeft className="size-4" />
                  <span className="text-white">Previous</span>
                </Button>
                <div className="flex items-center gap-1">
                  {paginationItems.map((item, index) =>
                    item === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 font-sans text-sm text-muted-foreground"
                      >
                        ...
                      </span>
                    ) : (
                      <Button
                        key={item}
                        type="button"
                        variant={item === currentPage ? "brand" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(item)}
                        className="min-w-9 border-border/70 px-3 font-sans"
                      >
                        {item}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                  className="border-border/70 font-sans"
                >
                  <span className="text-white">Next</span>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
