"use client";

import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function FacultySubjects({ subjects }: { subjects: readonly string[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const subjectMeasureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const moreMeasureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [visibleCount, setVisibleCount] = useState(subjects.length);

  useEffect(() => {
    if (subjects.length === 0) {
      return;
    }

    const calculateVisibleCount = () => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;

      if (!containerWidth) {
        setVisibleCount(subjects.length);
        return;
      }

      const subjectWidths = subjects.map(
        (_, index) => subjectMeasureRefs.current[index]?.offsetWidth ?? 0
      );
      const moreWidths = subjects
        .slice(1)
        .map((_, index) => moreMeasureRefs.current[index]?.offsetWidth ?? 0);

      let usedWidth = 0;
      let fittedCount = subjects.length;

      for (let index = 0; index < subjects.length; index += 1) {
        const nextChipWidth = subjectWidths[index] ?? 0;
        const nextUsedWidth = usedWidth + (index > 0 ? 8 : 0) + nextChipWidth;
        const hiddenCount = subjects.length - (index + 1);
        const reservedMoreWidth = hiddenCount > 0 ? (moreWidths[hiddenCount - 1] ?? 0) + 8 : 0;

        if (nextUsedWidth + reservedMoreWidth > containerWidth) {
          fittedCount = index;
          break;
        }

        usedWidth = nextUsedWidth;
      }

      setVisibleCount(Math.max(fittedCount, 0));
    };

    calculateVisibleCount();

    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleCount();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [subjects]);

  const visibleSubjects = subjects.slice(0, visibleCount);
  const hiddenSubjects = subjects.slice(visibleCount);
  const hiddenSubjectCount = hiddenSubjects.length;

  if (subjects.length === 0) {
    return <span className="font-sans text-xs text-muted-foreground">No subjects assigned</span>;
  }

  return (
    <TooltipProvider>
      <>
        <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 -z-10 opacity-0">
          <div className="flex gap-2">
            {subjects.map((subject, index) => (
              <Badge
                key={`measure-${subject}`}
                ref={(node) => {
                  subjectMeasureRefs.current[index] = node;
                }}
                variant="outline"
                className="analytics-subject-chip"
              >
                {subject}
              </Badge>
            ))}
            {subjects.slice(1).map((_, index) => {
              const count = index + 1;

              return (
                <Badge
                  key={`measure-more-${count}`}
                  ref={(node) => {
                    moreMeasureRefs.current[index] = node;
                  }}
                  variant="outline"
                  className="analytics-subject-chip-overflow"
                >
                  + {count} more
                </Badge>
              );
            })}
          </div>
        </div>
        <div
          ref={containerRef}
          className="flex w-full min-w-0 flex-nowrap items-center gap-2 overflow-hidden"
        >
          {visibleSubjects.map((subject) => (
            <Badge
              key={subject}
              variant="outline"
              className="analytics-subject-chip shrink-0"
              title={subject}
            >
              <span className="truncate">{subject}</span>
            </Badge>
          ))}
          {hiddenSubjectCount > 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="analytics-subject-chip-overflow shrink-0">
                  + {hiddenSubjectCount} more
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-56 font-sans text-xs">
                <div className="flex flex-col gap-1">
                  {hiddenSubjects.map((subject) => (
                    <span key={subject}>{subject}</span>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>
      </>
    </TooltipProvider>
  );
}
