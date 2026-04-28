import * as z from "zod";

const searchBodySchema = z.discriminatedUnion("type", [
  traditionalSearchSchema.extend({ type: z.literal("traditional") }),
  ragSearchSchema.extend({ type: z.literal("ai") }),
]);

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, searchBodySchema.parse);

    if (body.type === "traditional") {
      return $fetch("/api/search/traditional", {
        method: "POST",
        body,
      });
    }

    return $fetch("/api/search/ai", {
      method: "POST",
      body,
    });
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
});
