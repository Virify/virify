import OpenAI from "openai";

const config = useRuntimeConfig();

export const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY as string,
});

export const model = "gpt-4o-mini";

/**
 * Checks if the required AI configuration is present.
 */
export function checkAiConfiguration() {
  if (!process.env.OPENAI_API_KEY) {
    throw createError({
      statusCode: 500,
      statusMessage: "AI search is not configured. Please contact support.",
    });
  }
}