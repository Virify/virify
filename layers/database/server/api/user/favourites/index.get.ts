import * as z from "zod";

const favouritesQuerySchema = z.object({
  filter: z.enum(['all', 'sale', 'rent']).optional().default('all'),
  sort: z.enum(['newest', 'oldest']).optional().default('newest'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

/**
 * Get user saved listings (favourites)
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  try {
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const query = await getValidatedQuery(event, favouritesQuerySchema.parse);
    const skip = (query.page - 1) * query.limit;

    const result = await getUserFavourites(userId as number, {
      skip,
      take: query.limit,
      sort: query.sort,
      filter: query.filter,
    });

    return result;
  } catch (error) {
    console.log(error)
    errorResponse(error, event);
  }
});
