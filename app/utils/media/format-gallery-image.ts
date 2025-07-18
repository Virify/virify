// Utility to format property media for gallery components
// Handles alt text, fallback, and supports both real and fake images

interface MediaItem {
  image: string | { url: string } | null;
  metadata?: string | Record<string, any>;
}

export function formatGalleryImages(media: MediaItem[] | null | undefined, fallbackCount = 20): { src: string; alt: string }[] {
  if (Array.isArray(media) && media.length > 0) {
    return media
      .filter((item) => item.image !== null)
      .map((item, index) => ({
        src:
          typeof item.image === 'string'
            ? item.image
            : (item.image as any)?.url || `https://picsum.photos/800/600?random=${index + 1}`,
        alt: (() => {
          try {
            const metadata = typeof item.metadata === 'string' ? JSON.parse(item.metadata) : item.metadata;
            return metadata?.alt || `Property image ${index + 1}`;
          } catch {
            return `Property image ${index + 1}`;
          }
        })(),
      }));
  }

  // Fallback: generate fake images
  const heights = [400, 600, 500, 700, 450, 550, 650, 480, 580, 520, 750, 420, 680, 460, 620, 540, 720, 490, 590, 510];
  return Array.from({ length: fallbackCount }, (_, index) => ({
    src: `https://picsum.photos/800/${heights[index % heights.length]}?random=${index + 1}`,
    alt: `Property image ${index + 1}`,
  }));
}
