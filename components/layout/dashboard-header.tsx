"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import { RoleSwitcher } from "@/components/layout/role-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const idLikeSegmentPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const crumbs = segments
    .map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      const isIdLikeSegment = idLikeSegmentPattern.test(segment) || segment.length > 24;
      if (isIdLikeSegment) return null;

      const label = segment
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

      return { href, label };
    })
    .filter((crumb): crumb is { href: string; label: string } => Boolean(crumb));

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <div className="flex min-w-0 flex-1 items-center justify-between gap-2 sm:gap-4">
        <Breadcrumb className="min-w-0 flex-1">
          <BreadcrumbList>
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;

              return (
                <Fragment key={crumb.href}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-2">
          <RoleSwitcher className="hidden min-w-32 justify-between md:inline-flex" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
