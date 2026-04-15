export function slugifyThemeLabel(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function themeRowAnchorId(label: string): string {
  return `theme-row-${slugifyThemeLabel(label)}`;
}

export function recommendationAnchorId(label: string): string {
  return `rec-action-${slugifyThemeLabel(label)}`;
}
