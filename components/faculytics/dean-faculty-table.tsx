"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FacultyRow = {
  name: string;
  imageSrc: string;
  subjects: string[];
  positiveRate: string;
  responses: string;
  analysisHref: string;
};

type DeanFacultyTableProps = {
  rows: FacultyRow[];
};

const subjectBadgeClass =
  "max-w-[120px] rounded-full border-brand-blue/20 bg-brand-blue/10 px-2.5 py-0.5 text-[11px] font-medium text-brand-blue dark:border-brand-blue/30 dark:bg-brand-blue/15";
const overflowBadgeClass =
  "inline-flex shrink-0 items-center rounded-full border border-brand-blue/20 bg-brand-blue/10 px-2.5 py-0.5 text-[11px] font-medium text-brand-blue transition hover:bg-brand-blue/15";
const badgeGap = 8;

function SubjectOverflowCell({ subjects }: { subjects: string[] }) {
  const [showOverflow, setShowOverflow] = useState(false);
  const [visibleCount, setVisibleCount] = useState(subjects.length);
  const badgeRowRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const hiddenSubjects = subjects.slice(visibleCount);

  useEffect(() => {
    const badgeRow = badgeRowRef.current;
    const measureContainer = measureRef.current;

    if (!badgeRow || !measureContainer) return;

    const recalculateVisibleBadges = () => {
      const subjectWidths = subjects.map((_, index) => {
        const element = measureContainer.querySelector<HTMLElement>(`[data-subject-index="${index}"]`);
        return element?.offsetWidth ?? 0;
      });

      const overflowWidths = Array.from({ length: subjects.length }, (_, index) => {
        const remaining = index + 1;
        const element = measureContainer.querySelector<HTMLElement>(
          `[data-overflow-count="${remaining}"]`
        );
        return element?.offsetWidth ?? 0;
      });

      const availableWidth = badgeRow.offsetWidth;

      for (let candidate = subjects.length; candidate >= 0; candidate -= 1) {
        const visibleWidths = subjectWidths.slice(0, candidate);
        const visibleWidth =
          visibleWidths.reduce((total, width) => total + width, 0) +
          Math.max(visibleWidths.length - 1, 0) * badgeGap;
        const remaining = subjects.length - candidate;
        const overflowWidth =
          remaining > 0 ? overflowWidths[remaining - 1] + (candidate > 0 ? badgeGap : 0) : 0;

        if (visibleWidth + overflowWidth <= availableWidth) {
          setVisibleCount(candidate);
          return;
        }
      }

      setVisibleCount(0);
    };

    recalculateVisibleBadges();

    const observer = new ResizeObserver(recalculateVisibleBadges);
    observer.observe(badgeRow);

    return () => observer.disconnect();
  }, [subjects]);

  return (
    <div className="relative w-full min-w-0 max-w-full">
      <div ref={badgeRowRef} className="relative flex items-center gap-2 overflow-hidden">
        {subjects.slice(0, visibleCount).map((subject) => (
          <Badge key={subject} variant="outline" className={subjectBadgeClass}>
            <span className="block truncate">{subject}</span>
          </Badge>
        ))}

        {hiddenSubjects.length > 0 ? (
          <div
            className="relative shrink-0"
            onMouseEnter={() => setShowOverflow(true)}
            onMouseLeave={() => setShowOverflow(false)}
          >
            <button
              type="button"
              onClick={() => setShowOverflow((current) => !current)}
              className={overflowBadgeClass}
            >
              +{hiddenSubjects.length} more
            </button>

            {showOverflow ? (
              <div className="absolute left-0 top-full z-20 mt-2 w-72 rounded-xl border bg-popover p-3 shadow-lg">
                <div className="flex flex-wrap gap-2">
                  {hiddenSubjects.map((subject) => (
                    <Badge key={subject} variant="outline" className={subjectBadgeClass}>
                      <span className="block truncate">{subject}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div ref={measureRef} className="invisible absolute left-0 top-0 -z-10 flex items-center gap-2">
        {subjects.map((subject, index) => (
          <Badge
            key={`${subject}-measure`}
            variant="outline"
            className={subjectBadgeClass}
            data-subject-index={index}
          >
            <span className="block truncate">{subject}</span>
          </Badge>
        ))}
        {subjects.map((_, index) => {
          const remaining = index + 1;

          return (
            <button
              key={`overflow-measure-${remaining}`}
              type="button"
              className={overflowBadgeClass}
              data-overflow-count={remaining}
            >
              +{remaining} more
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DeanFacultyTable({ rows }: DeanFacultyTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[24%] px-4 py-4">Faculty</TableHead>
            <TableHead className="w-[34%] px-4 py-4">Subjects</TableHead>
            <TableHead className="w-[16%] px-4 py-4">Overall Positive Rate</TableHead>
            <TableHead className="w-[10%] px-4 py-4">Responses</TableHead>
            <TableHead className="w-[16%] px-4 py-4 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const initials = row.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <TableRow key={row.name}>
                <TableCell className="px-4 py-4 whitespace-normal">
                  <div className="flex items-center gap-3">
                    <Avatar size="lg" className="size-12 border border-border/60">
                      <AvatarImage src={row.imageSrc} alt={row.name} />
                      <AvatarFallback>{initials || "F"}</AvatarFallback>
                    </Avatar>
                    <p className="text-base font-semibold text-foreground">{row.name}</p>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4 whitespace-normal">
                  <SubjectOverflowCell subjects={row.subjects} />
                </TableCell>
                <TableCell className="px-4 py-4 font-medium">{row.positiveRate}</TableCell>
                <TableCell className="px-4 py-4 font-medium">{row.responses}</TableCell>
                <TableCell className="px-4 py-4 text-right">
                  <Button
                    asChild
                    size="sm"
                    className="bg-brand-blue text-white hover:bg-brand-blue/90"
                  >
                    <Link href={row.analysisHref}>View Analysis</Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
