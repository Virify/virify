import * as z from "zod";

// zod schema for validating query parameters
const querySchema = z.object({
  location: z.string().optional(),
});

/**
 * Auto-completes addresses based on the provided location query.
 */
export default defineEventHandler(async (event): Promise<string[]> => {
  const { errorResponse } = useResponse();
  try {
    const { location } = await getValidatedQuery(event, (query) => querySchema.parse(query));
    return await autocompleteAddresses(location as string);
  } catch (error) {
    errorResponse(error, event);
    return [];
  }
});
