export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();

  try {
    const session = await requireUserSession(event);
    const userId = session?.user?.id;
    const userRole = session?.user?.role;
    if (!userId) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const query = getQuery(event) as {
      status?: string;
      search?: string;
      take?: string | number;
      page?: string | number;
      sort?: string;
      saleRent?: string;
      availability?: string;
      owner?: string;
    };

    const take = query.take ? Number(query.take) : 20;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * take;
    const status = query.status ?? "all";
    const search = query.search ?? "";
    const sort = query.sort ?? "new";
    const saleRent = query.saleRent ?? "all";
    const availability = query.availability ?? "all";
    const owner = query.owner ?? "all";

    // Resolve which userId to query:
    // - non-admin: always their own
    // - admin + owner=own: only their own
    // - admin + owner=other: everyone else's (exclude self)
    // - admin + owner=all: everyone (undefined = no constraint)
    let listingUserId: number | undefined;
    let excludeUserId: number | undefined;
    if (userRole === "ADMIN") {
      if (owner === "own") {
        listingUserId = userId as number;
      } else if (owner === "other") {
        excludeUserId = userId as number;
      }
      // owner=all → listingUserId stays undefined
    } else {
      listingUserId = userId as number;
    }

    // Skip cache when a free-text search term is provided — unique per keystroke
    if (!search) {
      const cacheKey = `my-listings:${listingUserId ?? `admin-${owner}`}:${status}:${sort}:${page}:${take}:${saleRent}:${availability}`;
      const storage = useStorage("cache");
      const cached = await storage.getItem(cacheKey);
      if (cached) return cached;

      const result = await getUserOwnedListingsWithAnalytics(listingUserId, {
        status: status as any,
        search,
        take,
        skip,
        sort: sort as any,
        saleRent: saleRent as any,
        availability: availability as any,
        excludeUserId,
      });

      storage.setItem(cacheKey, result, { ttl: 30 * 60 }).catch(() => {});
      return result;
    }

    const { listings, total } = await getUserOwnedListingsWithAnalytics(listingUserId, {
      status: status as any,
      search,
      take,
      skip,
      sort: sort as any,
      saleRent: saleRent as any,
      availability: availability as any,
      excludeUserId,
    });

    return { listings, total };
  } catch (error) {
    return errorResponse(error, event);
  }
});
