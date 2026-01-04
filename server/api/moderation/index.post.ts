import OpenAI from 'openai'

const config = useRuntimeConfig()

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY as string,
})

/**
 * Check text content using OpenAI's free Moderation API
 * Returns whether the content is flagged and which categories
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { text } = body

  if (!text || typeof text !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'Text is required'
    })
  }

  // Limit text length
  const sanitizedText = text.slice(0, 1000)

  try {
    const response = await openai.moderations.create({
      input: sanitizedText,
    })

    const result = response.results[0]

    return {
      flagged: result.flagged,
      categories: result.flagged ? Object.entries(result.categories)
        .filter(([_, flagged]) => flagged)
        .map(([category]) => category) : [],
    }
  } catch (error) {
    console.error('[Moderation API] Error:', error)
    // Fail open - don't block searches if moderation fails
    return {
      flagged: false,
      categories: [],
      error: true
    }
  }
})
