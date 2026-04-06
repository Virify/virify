import OpenAI from 'openai'

const config = useRuntimeConfig()

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY as string,
})

/**
 * Check text and/or image content using OpenAI's free Moderation API
 * Returns whether the content is flagged and which categories
 */
export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const body = await readBody(event)
  const { text, images } = body

  if (!text && (!images || images.length === 0)) {
    throw createError({
      statusCode: 400,
      message: 'At least one of text or images is required'
    })
  }

  if (text && typeof text !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'text must be a string'
    })
  }

  if (images && (!Array.isArray(images) || images.some((url: unknown) => typeof url !== 'string'))) {
    throw createError({
      statusCode: 400,
      message: 'images must be an array of URL strings'
    })
  }

  type ModerationInput = OpenAI.ModerationMultiModalInput

  const input: ModerationInput[] = []

  if (text) {
    input.push({ type: 'text', text: text.slice(0, 1000) })
  }

  for (const url of (images ?? [])) {
    input.push({ type: 'image_url', image_url: { url } })
  }

  try {
    const response = await openai.moderations.create({
      model: 'omni-moderation-latest',
      input,
    })

    const result = response.results[0]

    return {
      flagged: result.flagged,
      categories: result.flagged ? Object.entries(result.categories)
        .filter(([_, flagged]) => flagged)
        .map(([category]) => category) : [],
    }
  } catch (error) {
    // Fail open - don't block content if moderation fails
    return {
      flagged: false,
      categories: [],
      error: true
    }
  }
})
