import type { DeanKeyTheme } from "@/features/faculty-analytics/lib/dean-analytics-view-model";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DeanKeyThemesCardProps = {
  themes: readonly DeanKeyTheme[];
};

export function DeanKeyThemesCard({ themes }: DeanKeyThemesCardProps) {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardDescription className="font-sans text-sm">Key Themes</CardDescription>
        <CardTitle className="font-playfair text-xl font-semibold sm:text-2xl">
          Common feedback themes across faculty comments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {themes.map((theme) => (
          <div
            key={theme.label}
            className="flex items-start justify-between gap-4 border-b border-border/60 pb-4 last:border-b-0 last:pb-0"
          >
            <div className="min-w-0 space-y-1">
              <p className="font-sans text-sm font-medium text-foreground">{theme.label}</p>
              <p className="font-sans text-sm text-muted-foreground">{theme.context}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-sans text-sm font-medium text-foreground">{theme.mentions}</p>
              <p className="font-sans text-xs uppercase tracking-wide text-muted-foreground">
                {theme.sentiment}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
