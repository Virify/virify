import { Filter } from 'bad-words'

const profanityFilter = new Filter()

/**
 * Composable for content moderation using OpenAI's Moderation API
 */
export function useModeration() {
  const isChecking = ref(false)
  const { getImageUrls, deleteImages } = useCloudflare()

  async function moderate(body: { text?: string; images?: string[] }): Promise<{ safe: boolean; reason?: string }> {
    isChecking.value = true
    try {
      const response = await useRequestFetch()('/api/moderation', {
        method: 'POST',
        body,
      })

      if (response.flagged) {
        return { safe: false }
      }

      return { safe: true }
    } catch (error) {
      // Fail open - if moderation fails, allow the content
      return { safe: true }
    } finally {
      isChecking.value = false
    }
  }

  /**
   * Fast synchronous profanity check using the bad-words library.
   * Runs before any API call to catch obvious cases without a round-trip.
   */
  function checkProfanity(text: string): { safe: boolean; reason?: string } {
    if (!text || text.trim().length === 0) return { safe: true }

    if (profanityFilter.isProfane(text)) {
      return { safe: false, reason: 'Your search contains inappropriate content. Please try a different search.' }
    }

    return { safe: true }
  }

  /**
   * Check if text content is appropriate (e.g. search queries, descriptions).
   * Runs a local profanity check first, then falls through to OpenAI moderation.
   */
  async function checkText(text: string): Promise<{ safe: boolean; reason?: string }> {
    if (!text || text.trim().length === 0) return { safe: true }

    const profanityResult = checkProfanity(text)
    if (!profanityResult.safe) return profanityResult

    const result = await moderate({ text })
    return result.safe ? result : {
      safe: false,
      reason: 'Your search contains inappropriate content. Please try a different search.',
    }
  }

  /**
   * Check if image content is appropriate (e.g. listing photos)
   * Automatically deletes flagged images from Cloudflare
   * @param imageIds - Cloudflare image IDs
   * @param variant - Image variant to fetch (defaults to 'public')
   */
  async function checkImages(imageIds: string[], variant = 'public'): Promise<{ safe: boolean; reason?: string }> {
    if (!imageIds || imageIds.length === 0) return { safe: true }

    const images = getImageUrls(imageIds, variant)
    const result = await moderate({ images })

    if (!result.safe) {
      await deleteImages(imageIds)
      return {
        safe: false,
        reason: 'One or more images contain inappropriate content and cannot be uploaded.',
      }
    }

    return { safe: true }
  }

  /**
   * Check both text and images together
   * Automatically deletes flagged images from Cloudflare
   * @param text - Text content to check
   * @param imageIds - Cloudflare image IDs
   * @param variant - Image variant to fetch (defaults to 'public')
   */
  async function checkContent(text: string, imageIds: string[], variant = 'public'): Promise<{ safe: boolean; reason?: string }> {
    const images = getImageUrls(imageIds, variant)
    const result = await moderate({ text, images })

    if (!result.safe) {
      await deleteImages(imageIds)
      return {
        safe: false,
        reason: 'Content contains inappropriate material.',
      }
    }

    return { safe: true }
  }

  return {
    checkProfanity,
    checkText,
    checkImages,
    checkContent,
    isChecking: readonly(isChecking),
  }
}
