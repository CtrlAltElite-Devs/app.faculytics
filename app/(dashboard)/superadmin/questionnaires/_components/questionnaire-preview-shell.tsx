import Link from "next/link";

import { Button } from "@/components/ui/button";

type QuestionnairePreviewShellProps = {
  title: string;
  description: string;
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
};

export function QuestionnairePreviewShell({
  title,
  description,
  backHref,
  backLabel,
  children,
}: QuestionnairePreviewShellProps) {
  return (
    <section className="px-4 py-5 sm:px-6 md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-playfair text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              {description}
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0 self-start">
            <Link href={backHref}>{backLabel}</Link>
          </Button>
        </div>

        {children}
      </div>
    </section>
  );
}
