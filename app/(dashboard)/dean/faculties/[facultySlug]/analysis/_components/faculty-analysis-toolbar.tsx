"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FacultyAnalysisToolbar() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
      <Tabs defaultValue="first-semester" className="gap-0">
        <TabsList className="rounded-md border border-border/70 bg-background p-px">
          <TabsTrigger
            value="first-semester"
            className="font-sans text-sm text-slate-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:text-muted-foreground dark:data-[state=active]:bg-muted dark:data-[state=active]:text-foreground"
          >
            First Semester
          </TabsTrigger>
          <TabsTrigger
            value="second-semester"
            className="font-sans text-sm text-slate-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:text-muted-foreground dark:data-[state=active]:bg-muted dark:data-[state=active]:text-foreground"
          >
            Second Semester
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Button type="button" variant="outline" size="sm" className="font-sans">
        Import File
      </Button>
      <Button type="button" variant="brand" size="sm" className="font-sans">
        Export Report
      </Button>
    </div>
  );
}
