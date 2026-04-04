import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Layers3 } from "lucide-react";

import { decodeHtmlEntities, resolveCourseImageSrc } from "@/lib/string";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type CourseCardProps = {
  shortname: string;
  fullname: string;
  teacherName: string;
  teacherImageSrc?: string;
  sectionName?: string;
  feedbackHref: string;
  onGiveFeedback?: () => void;
  imageSrc?: string;
  submitted?: boolean;
};

export default function CourseCard({
  shortname,
  fullname,
  teacherName,
  teacherImageSrc,
  sectionName,
  feedbackHref,
  onGiveFeedback,
  imageSrc,
  submitted,
}: CourseCardProps) {
  const decodedShortname = decodeHtmlEntities(shortname);
  const decodedFullname = decodeHtmlEntities(fullname);
  const decodedTeacherName = decodeHtmlEntities(teacherName);
  const decodedSectionName = sectionName ? decodeHtmlEntities(sectionName) : null;
  const titleSizeClass =
    decodedFullname.length > 64 ? "text-base" : decodedFullname.length > 40 ? "text-lg" : "text-xl";
  const resolvedImageSrc = resolveCourseImageSrc(imageSrc);
  const teacherInitials = decodedTeacherName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="overflow-hidden py-0 gap-0 h-full">
      <div className="relative aspect-[3/1] w-full">
        <Image
          src={resolvedImageSrc}
          alt={`${decodedFullname} course image`}
          fill
          loading="eager"
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
      </div>
      <CardContent className="flex h-full flex-col gap-3 p-3 sm:gap-4 sm:p-4">
        <Badge className="course-code-badge self-start">{decodedShortname}</Badge>
        <div className="flex items-center gap-2">
          <h2 className={`font-playfair leading-snug text-foreground ${titleSizeClass} `}>
            {decodedFullname}
          </h2>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <Avatar className="size-7">
              {teacherImageSrc ? (
                <AvatarImage src={teacherImageSrc} alt={decodedTeacherName} />
              ) : null}
              <AvatarFallback className="text-[10px]">{teacherInitials || "T"}</AvatarFallback>
            </Avatar>
            <p className="line-clamp-1">{decodedTeacherName}</p>
          </div>
          {decodedSectionName && (
            <div className="flex items-center gap-2.5">
              <Layers3 className="size-6 shrink-0" />
              <p className="line-clamp-1">{decodedSectionName}</p>
            </div>
          )}
        </div>
        {submitted ? (
          <Button variant="outline" className="mt-auto w-full" disabled>
            <CheckCircle2 className="size-4" />
            Submitted
          </Button>
        ) : (
          <Button asChild variant="brand" className="mt-auto w-full">
            <Link href={feedbackHref} onClick={onGiveFeedback}>
              Give Feedback
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
