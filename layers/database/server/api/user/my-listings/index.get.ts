export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse()

  try {
    const session = await requireUserSession(event)
    const userId = session?.user?.id
    if (!userId) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
    }

    const query = getQuery(event) as {
      status?: string
      search?: string
      take?: string | number
      page?: string | number
      sort?: string
      saleRent?: string
    }

    const take = query.take ? Number(query.take) : 20
    const page = query.page ? Number(query.page) : 1
    const skip = (page - 1) * take
    const status = query.status ?? "all"
    const search = query.search ?? ""
    const sort = query.sort ?? 'new'
    const saleRent = query.saleRent ?? 'all'

    // Skip cache when a free-text search term is provided — unique per keystroke
    if (!search) {
      const cacheKey = `my-listings:${userId}:${status}:${sort}:${page}:${take}:${saleRent}`;
      const storage = useStorage('cache');
      const cached = await storage.getItem(cacheKey);
      if (cached) return cached;

      const result = await getUserOwnedListingsWithAnalytics(userId as number, {
        status: status as any,
        search,
        take,
        skip,
        sort: sort as any,
        saleRent: saleRent as any,
      })

      storage.setItem(cacheKey, result, { ttl: 30 * 60 }).catch(() => {})
      return result
    }

    const { listings, total } = await getUserOwnedListingsWithAnalytics(userId as number, {
      status: status as any,
      search,
      take,
      skip,
      sort: sort as any,
      saleRent: saleRent as any,
    })

    return { listings, total }
  } catch (error) {
    return errorResponse(error, event)
  }
})
