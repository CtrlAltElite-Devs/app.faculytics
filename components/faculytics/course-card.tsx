import Image from "next/image";
import Link from "next/link";

import { decodeHtmlEntities, resolveCourseImageSrc } from "@/lib/string";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export type CourseCardProps = {
  shortname: string;
  fullname: string;
  teacherName: string;
  teacherImageSrc?: string;
  feedbackHref: string;
  onGiveFeedback?: () => void;
  imageSrc?: string;
};

export default function CourseCard({
  shortname,
  fullname,
  teacherName,
  teacherImageSrc,
  feedbackHref,
  onGiveFeedback,
  imageSrc,
}: CourseCardProps) {
  const decodedShortname = decodeHtmlEntities(shortname);
  const decodedFullname = decodeHtmlEntities(fullname);
  const decodedTeacherName = decodeHtmlEntities(teacherName);
  const titleSizeClass =
    decodedFullname.length > 64
      ? "text-base"
      : decodedFullname.length > 40
        ? "text-lg"
        : "text-xl";
  const resolvedImageSrc = resolveCourseImageSrc(imageSrc);
  const teacherInitials = decodedTeacherName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="overflow-hidden py-0 gap-0 h-full">
      <div className="relative aspect-video w-full">
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
        <Badge className="self-start rounded-md bg-brand-blue/25 px-2 py-1 text-sm font-medium text-brand-blue hover:bg-brand-blue/25">
          {decodedShortname}
        </Badge>
        <div className="flex items-center gap-2">
          <h2 className={`font-playfair leading-snug text-foreground ${titleSizeClass} `}>
            {decodedFullname}
          </h2>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <Avatar className="size-7">
            {teacherImageSrc ? <AvatarImage src={teacherImageSrc} alt={decodedTeacherName} /> : null}
            <AvatarFallback className="text-[10px]">{teacherInitials || "T"}</AvatarFallback>
          </Avatar>
          <p className="line-clamp-1">{decodedTeacherName}</p>
        </div>
        <Button
          asChild
          className="mt-auto w-full bg-brand-blue hover:bg-brand-blue/90 cursor-pointer"
        >
          <Link href={feedbackHref} onClick={onGiveFeedback}>
            Give Feedback
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
