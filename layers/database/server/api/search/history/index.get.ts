import * as z from 'zod'
import mockDb from './mock-db'

const historySchema = z.object({
  hash: z.string()
})

export default defineEventHandler(async (event) => {
  const { hash } = await getValidatedQuery(event, historySchema.parse)

  try {
    const historyState = mockDb[hash]

    return historyState ? JSON.parse(historyState) : null
  }
  catch (err) {
    console.error({ error: (err as Error)?.message || 'Unknown error' })

    return null
  }
})