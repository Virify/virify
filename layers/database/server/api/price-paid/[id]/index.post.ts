import * as z from "zod";

const listingPpdSchema = z.object({
  listingId: z.number(),
  address: z.object({
    number: z.string().nullable().optional(),
    flat: z.string().nullable().optional(),
    fullAddress: z.string().nullable().optional(),
    street: z.string(),
    city: z.string(),
    postcode: z.string(),
    county: z.string().nullable().optional(),
  }),
});

export default defineEventHandler(async (event) => {
  try {
    const { listingId, address } = await readValidatedBody(event, listingPpdSchema.parse);

    return await getPricePaidListingResponse({
      listingId,
      address,
    });
  } catch (error) {
    if (isHttpError(error)) {
      throw error;
    }

    console.error("Error fetching price paid data:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch price paid data",
    });
  }
});

function isHttpError(error: unknown): error is Error & { statusCode: number } {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  );
}
