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
    }

    const take = query.take ? Number(query.take) : 50
    const page = query.page ? Number(query.page) : 1
    const skip = (page - 1) * take
    const status = query.status ?? "all"
    const search = query.search ?? ""
    const sort = query.sort ?? 'new'

    return await getUserOwnedListingsWithAnalytics(userId as number, { 
      status: status as any, 
      search, 
      take, 
      skip, 
      sort: sort as any 
    })
  } catch (error) {
    return errorResponse(error, event)
  }
})
