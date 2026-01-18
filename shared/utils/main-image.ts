/**
 * Main Image Helper Utilities
 * 
 * The main image is the first image in the property.media array (sortOrder: 0)
 * that is a "general" image (not assigned to a specific room).
 * 
 * If no general images exist, falls back to the first image in the array.
 */

interface MediaItem {
  image?: string | null
  metadata?: string | null
  bedroomId?: number | null
  bathroomId?: number | null
  kitchenId?: number | null
  receptionId?: number | null
  otherRoomId?: number | null
  gardenId?: number | null
  yardId?: number | null
  landId?: number | null
  outdoorSpaceId?: number | null
}

interface PropertyWithMedia {
  media?: MediaItem[] | null
}

/**
 * Check if a media item is a "general" property image (not assigned to any room)
 */
export function isGeneralImage(media: MediaItem): boolean {
  return (
    !media.bedroomId &&
    !media.bathroomId &&
    !media.kitchenId &&
    !media.receptionId &&
    !media.otherRoomId &&
    !media.gardenId &&
    !media.yardId &&
    !media.landId &&
    !media.outdoorSpaceId
  )
}

/**
 * Get the main image cloudflare ID from a property
 * Returns the first general image, or first image if no general images exist
 */
export function getMainImage(property: PropertyWithMedia | null | undefined): string | null {
  if (!property?.media || property.media.length === 0) return null
  
  // Find first general image (assumes array is sorted by sortOrder)
  const generalImage = property.media.find(m => m.image && isGeneralImage(m))
  if (generalImage?.image) return generalImage.image
  
  // Fallback to first image with an image field
  const firstImage = property.media.find(m => m.image)
  return firstImage?.image ?? null
}

/**
 * Get the main image from a property for use in Cloudflare URLs
 * Returns null if no images exist
 */
export function getMainImageUrl(
  property: PropertyWithMedia | null | undefined,
  cfAccountHash: string,
  variant: string = 'thumbnail'
): string | null {
  const imageId = getMainImage(property)
  if (!imageId) return null
  
  return `https://imagedelivery.net/${cfAccountHash}/${imageId}/${variant}`
}
