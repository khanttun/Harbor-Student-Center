export type MemoryImageSource = {
  image_url?: string | null;
  image_urls?: string[] | string | null;
};

function normalizeImageUrlsField(
  imageUrls: string[] | string | null | undefined,
): string[] {
  if (!imageUrls) {
    return [];
  }

  if (Array.isArray(imageUrls)) {
    return imageUrls.filter((url): url is string => typeof url === "string" && url.trim().length > 0);
  }

  if (typeof imageUrls === "string") {
    const trimmed = imageUrls.trim();
    if (!trimmed) {
      return [];
    }

    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed) as unknown;
        if (Array.isArray(parsed)) {
          return parsed.filter((url): url is string => typeof url === "string" && url.trim().length > 0);
        }
      } catch {
        return [trimmed];
      }
    }

    return [trimmed];
  }

  return [];
}

export function getMemoryImages(memory: MemoryImageSource): string[] {
  const fromArray = normalizeImageUrlsField(memory.image_urls);
  if (fromArray.length > 0) {
    return fromArray;
  }

  if (memory.image_url?.trim()) {
    return [memory.image_url.trim()];
  }

  return [];
}

export function getMemoryCoverImage(memory: MemoryImageSource): string | null {
  return getMemoryImages(memory)[0] ?? null;
}

export function toMemoryImagePayload(urls: string[]) {
  const cleaned = urls.filter((url) => url.trim().length > 0);
  return {
    image_urls: cleaned,
    image_url: cleaned[0] ?? null,
  };
}
