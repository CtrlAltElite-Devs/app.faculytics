"use client";

import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const chipGap = 8;

const subjectChipClassName =
  "max-w-32 rounded-full border-brand-blue/30 bg-brand-blue/10 px-2.5 py-1 font-sans text-[11px] text-brand-blue";

const overflowChipClassName =
  "cursor-default rounded-full border-brand-blue/20 bg-brand-blue/8 px-2.5 py-1 font-sans text-[11px] text-brand-blue";

export function FacultySubjects({ subjects }: { subjects: readonly string[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const subjectMeasureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const moreMeasureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [visibleCount, setVisibleCount] = useState(subjects.length);

  useEffect(() => {
    const calculateVisibleCount = () => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;

      if (!containerWidth) {
        setVisibleCount(subjects.length);
        return;
      }

      const subjectWidths = subjects.map(
        (_, index) => subjectMeasureRefs.current[index]?.offsetWidth ?? 0,
      );
      const moreWidths = subjects.slice(1).map(
        (_, index) => moreMeasureRefs.current[index]?.offsetWidth ?? 0,
      );

      let usedWidth = 0;
      let fittedCount = subjects.length;

      for (let index = 0; index < subjects.length; index += 1) {
        const nextChipWidth = subjectWidths[index] ?? 0;
        const nextUsedWidth = usedWidth + (index > 0 ? chipGap : 0) + nextChipWidth;
        const hiddenCount = subjects.length - (index + 1);
        const reservedMoreWidth = hiddenCount > 0 ? (moreWidths[hiddenCount - 1] ?? 0) + chipGap : 0;

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

  return (
    <TooltipProvider>
      <>
        <div aria-hidden="true" className="pointer-events-none absolute -z-10 opacity-0">
          <div className="flex gap-2">
            {subjects.map((subject, index) => (
              <Badge
                key={`measure-${subject}`}
                ref={(node) => {
                  subjectMeasureRefs.current[index] = node;
                }}
                variant="outline"
                className={subjectChipClassName}
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
                  className={overflowChipClassName}
                >
                  + {count} more
                </Badge>
              );
            })}
          </div>
        </div>
        <div ref={containerRef} className="flex flex-nowrap items-center gap-2 overflow-hidden">
          {visibleSubjects.map((subject) => (
            <Badge
              key={subject}
              variant="outline"
              className={subjectChipClassName}
            >
              <span className="truncate">{subject}</span>
            </Badge>
          ))}
          {hiddenSubjectCount > 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className={overflowChipClassName}
                >
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
