import * as z from "zod";

const hashSchema = z.object({
  hash: z.string(),
});

export default defineEventHandler(async (event) => {
  const storage = useStorage();
  const { hash } = await readValidatedBody(event, hashSchema.parse);

  const storedBody = await storage.getItem(`search:${hash}`);

  if (!storedBody) {
    throw createError({
      statusCode: 404,
      statusMessage: "Search not found or has expired. Please search again.",
    });
  }

  // Re-run the original search body exactly as it was submitted.
  // Pass `hash` so the handler knows not to generate and store a new one.
  const results = await $fetch("/api/search", {
    method: "POST",
    body: {
      ...(storedBody as object),
      hash,
    },
  });

  // Get location, radius from hash result
  const { location, radius } = asObject(storedBody)

  // Return result
  return {
    location,
    radius,
    ...asObject(results)
  };
});
