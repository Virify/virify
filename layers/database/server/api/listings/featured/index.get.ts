import * as z from "zod";

const querySchema = z.object({
  pageSize: z.coerce.number().min(1).max(100).optional(),
  page: z.coerce.number().min(1).max(100).optional(),
});

export default defineCachedEventHandler(
  async (event): Promise<ListingCardType[] | undefined> => {
    const { errorResponse } = useResponse();

    try {
      const { page, pageSize } = await getValidatedQuery(event, querySchema.parse);

      const pagination = caluclatePagination(page, pageSize);

      const listings = await getAllFeaturedListings(pagination?.take, pagination?.skip);

      if (!listings) {
        throw createError({
          statusCode: 404,
          statusMessage: "listings not found",
        });
      }
      return listings;
    } catch (error) {
      console.error("Error fetching all listings:", error);
      errorResponse(error, event);
    }
  },
  {
    maxAge: 60 * 5, // 5 minutes — featured listings change infrequently
    getKey: (event) => {
      const { page, pageSize } = getQuery(event);
      return `featured:${page ?? 1}:${pageSize ?? 20}`;
    },
  }
);