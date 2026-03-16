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

export function resolveCourseImageSrc(imageSrc?: string): string {
  const trimmedImageSrc = imageSrc?.trim();

  if (!trimmedImageSrc) {
    return "/course-placeholder.svg";
  }

  if (/\/course\/generated\/course\.svg(?:\?|$)/i.test(trimmedImageSrc)) {
    return "/course-placeholder.svg";
  }

  return trimmedImageSrc;
}

