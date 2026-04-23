import * as z from "zod";

const hashSchema = z.object({
  hash: z.string(),
});

export default defineEventHandler(async (event) => {
  const storage = useStorage();
  const { hash } = await readValidatedBody(event, hashSchema.parse);

  // TODO Fetch from redis using hashKey
  const hashedSearch = await storage.getItem(`search:${hash}`, { parse: true });

  if (!hashedSearch) {
    return {};
  }

  /**
   * Re-post if hash with spread params
   */
  const results = await $fetch("/api/search", {
    method: "POST",
    body: {
      ...(hashedSearch as Object),
      hash,
    },
  });

  return results;
});
