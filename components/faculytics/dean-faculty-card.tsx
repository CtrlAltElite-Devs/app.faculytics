"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type DeanFacultyCardProps = {
  name: string;
  imageSrc: string;
  subjects: string[];
  analysisHref: string;
};

const subjectBadgeClass =
  "rounded-full border-brand-blue/20 bg-brand-blue/10 px-2.5 py-0.5 text-[11px] font-medium text-brand-blue dark:border-brand-blue/30 dark:bg-brand-blue/15";
const overflowBadgeClass =
  "inline-flex items-center rounded-full border border-brand-blue/20 bg-brand-blue/10 px-2.5 py-0.5 text-[11px] font-medium text-brand-blue transition hover:bg-brand-blue/15";
const badgeGap = 8;

export function DeanFacultyCard({
  name,
  imageSrc,
  subjects,
  analysisHref,
}: DeanFacultyCardProps) {
  const [showOverflow, setShowOverflow] = useState(false);
  const [visibleCount, setVisibleCount] = useState(subjects.length);
  const badgeRowRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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
    <Card className="h-full rounded-2xl py-0">
      <CardContent className="flex h-full flex-col gap-5 p-6">
        <div className="flex items-center gap-4">
          <Avatar size="lg" className="size-16 border border-border/60">
            <AvatarImage src={imageSrc} alt={name} />
            <AvatarFallback>{initials || "F"}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="font-playfair text-2xl font-semibold leading-tight">{name}</h3>
          </div>
        </div>

        <div className="mt-2 space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Subjects</p>
          <div ref={badgeRowRef} className="relative flex items-center gap-2 overflow-hidden">
            {subjects.slice(0, visibleCount).map((subject) => (
              <Badge key={subject} variant="outline" className={subjectBadgeClass}>
                {subject}
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
                  <div className="absolute left-0 top-full z-20 mt-2 w-64 rounded-xl border bg-popover p-3 shadow-lg">
                    <div className="flex flex-wrap gap-2">
                      {hiddenSubjects.map((subject) => (
                        <Badge key={subject} variant="outline" className={subjectBadgeClass}>
                          {subject}
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
                {subject}
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

        <Button asChild className="mt-auto w-full bg-brand-blue text-white hover:bg-brand-blue/90">
          <Link href={analysisHref}>View Analysis</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
