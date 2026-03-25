export function buildOverallRecommendation(items: string[]): string {
  const uniqueItems = Array.from(new Set(items));

  if (uniqueItems.length === 0) {
    return "No recommendation available for this section.";
  }

  return uniqueItems.join(" ");
}
