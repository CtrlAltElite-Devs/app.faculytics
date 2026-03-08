import Image from "next/image";
import { UserRound } from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export type CourseCardProps = {
  shortname: string;
  fullname: string;
  teacherName: string;
  imageSrc?: string;
};

export default function CourseCard({
  shortname,
  fullname,
  teacherName,
  imageSrc,
}: CourseCardProps) {
  const titleSizeClass =
    fullname.length > 64 ? "text-base" : fullname.length > 40 ? "text-lg" : "text-xl";
  const resolvedImageSrc = imageSrc?.trim() ? imageSrc : "/course-placeholder.svg";

  return (
    <Card className="overflow-hidden py-0 gap-0 h-full">
      <div className="relative aspect-video w-full">
        <Image
          src={resolvedImageSrc}
          alt={`${fullname} course image`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
      </div>
      <CardContent className="flex h-full flex-col p-4 sm:p-5">
        <div className="inline-flex w-fit self-start items-center rounded-md bg-brand-blue/50 px-3 py-1 text-sm font-medium text-brand-blue">
          {shortname}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <h2 className={`font-playfair leading-snug text-foreground ${titleSizeClass} `}>
            {fullname}
          </h2>
        </div>
        <p className="my-2 flex items-center gap-2 text-sm text-muted-foreground">
          <UserRound className="size-4" />
          {teacherName}
        </p>
        <Button className="mt-auto w-full bg-brand-blue/80 hover:bg-brand-blue/60 cursor-pointer">
          Give Feedback
        </Button>
      </CardContent>
    </Card>
  );
}
