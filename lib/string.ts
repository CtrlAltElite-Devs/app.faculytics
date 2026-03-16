const HTML_ENTITY_MAP: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
};

export function decodeHtmlEntities(value: string): string {
  return value.replace(/&(?:amp|lt|gt|quot|#39|apos);/gi, (entity) => {
    const normalizedEntity = entity.toLowerCase();

    return HTML_ENTITY_MAP[normalizedEntity] ?? entity;
  });
}
