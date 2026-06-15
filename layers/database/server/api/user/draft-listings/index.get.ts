import { getOwnershipFilter } from "~~/server/utils/ownership";

/**
 * Handler for GET /api/user/draft-listings/
 * Returns paginated draft listings for the authenticated user.
 * Cached per user+params (2 min). Busted on draft create/delete/publish.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const take = Math.min(Number(query.take) || 20, 100); // Cap at 100
  const skip = (page - 1) * take;
  const sort = (query.sort as string) === "old" ? "asc" : "desc";
  const search = (query.search as string) || "";

  try {
    // Skip cache for free-text search (too many unique keys)
    // Also skip cache for ADMIN to prevent caching global data under their session key
    if (!search.trim() && user.role !== "ADMIN") {
      const cacheKey = `draft-listings:${user.id}:${sort}:${page}:${take}`;
      const storage = useStorage("cache");
      const cached = await storage.getItem(cacheKey);
      if (cached) return cached;
    }

    // Build where clause
    const where: any = { ...getOwnershipFilter(user) };

    // Apply search if provided
    if (search.trim()) {
      where.OR = [
        {
          property: {
            address: { fullAddress: { contains: search, mode: "insensitive" } },
          },
        },
      ];

      const numericSearch = Number(search);
      if (!Number.isNaN(numericSearch)) {
        where.OR.push({ price: numericSearch });
      }
    }

    // Fetch count and drafts in parallel
    const [total, drafts] = await Promise.all([
      prisma.draftListing.count({ where }),
      prisma.draftListing.findMany({
        where,
        include: {
          rentalListing: true,
          saleListing: true,
          property: {
            include: {
              media: {
                select: {
                  image: true,
                  metadata: true,
                  sortOrder: true,
                  bedroomId: true,
                  bathroomId: true,
                  receptionId: true,
                  otherRoomId: true,
                  kitchenId: true,
                  gardenId: true,
                  outdoorSpaceId: true,
                  landId: true,
                  yardId: true,
                },
                orderBy: { sortOrder: "asc" as const },
              },
              address: true,
              type: { select: { name: true } },
              classification: { select: { name: true } },
              accessibilityFeatures: { select: { features: true } },
              additionalFeatures: { select: { petFriendly: true } },
              parking: { select: { features: true } },
              outdoorSpace: {
                select: { garden: true, yard: true, land: true },
              },
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          sharedUsers: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
            },
          },
        },
        take,
        skip,
        orderBy: { updatedAt: sort },
      }),
    ]);

    const result = { drafts, total };
    if (!search.trim() && user.role !== "ADMIN") {
      const cacheKey = `draft-listings:${user.id}:${sort}:${page}:${take}`;
      useStorage("cache")
        .setItem(cacheKey, result, { ttl: 30 * 60 })
        .catch(() => {});
    }
    return result;
  } catch (error) {
    console.error("Error fetching draft listings:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
