/**
 * Composable for content moderation using OpenAI's Moderation API
 */
export function useModeration() {
  const isChecking = ref(false)

  /**
   * Check if text content is appropriate
   * Returns true if safe, false if flagged
   */
  async function checkContent(text: string): Promise<{ safe: boolean; reason?: string }> {
    if (!text || text.trim().length === 0) {
      return { safe: true }
    }

    isChecking.value = true

    try {
      const response = await $fetch('/api/moderation', {
        method: 'POST',
        body: { text }
      })

      if (response.flagged) {
        return {
          safe: false,
          reason: 'Your search contains inappropriate content. Please try a different search.'
        }
      }

      return { safe: true }
    } catch (error) {
      // Fail open - if moderation fails, allow the search
      console.error('[Moderation] Check failed:', error)
      return { safe: true }
    } finally {
      isChecking.value = false
    }
  }

  return {
    checkContent,
    isChecking: readonly(isChecking)
  }
}
