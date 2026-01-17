/**
 * Handler for GET /api/user/draft-listings/
 * Returns paginated draft listings for the authenticated user
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
  const sort = (query.sort as string) === 'old' ? 'asc' : 'desc';
  const search = (query.search as string) || '';

  try {
    // Build where clause
    const where: any = { userId: user.id };
    
    // Apply search if provided
    if (search.trim()) {
      where.OR = [
        { property: { address: { fullAddress: { contains: search, mode: 'insensitive' } } } },
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
              media: { select: { image: true, metadata: true } },
              address: true,
              type: { select: { name: true } },
              classification: { select: { name: true } },
              accessibilityFeatures: { select: { features: true } },
              additionalFeatures: { select: { petFriendly: true } },
              parking: { select: { features: true } },
              outdoorSpace: { select: { garden: true, yard: true, land: true } },
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
        take,
        skip,
        orderBy: { updatedAt: sort },
      }),
    ]);

    return { drafts, total };
  } catch (error) {
    console.error("Error fetching draft listings:", error);
    throw createError({ statusCode: 500, statusMessage: "Internal Server Error" });
  }
});
