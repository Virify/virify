import { getUserViewings } from "~~/layers/database/server/utils/viewing";
import type { ViewingStatus } from "~~/shared/types/viewing";

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);

  try {
    if (!user.id) throw createError({ statusCode: 401 });

    const query = getQuery(event);
    const role = (query.role as "requester" | "owner" | "all") || "all";
    const status = query.status as ViewingStatus | undefined;
    const sort = (query.sort as "newest" | "oldest") || "newest";

    const cacheKey = `viewings:${user.id}:${role}:${status ?? "all"}:${sort}`;
    const storage = useStorage("cache");
    const cached = await storage.getItem(cacheKey);
    if (cached) return cached;

    const viewings = await getUserViewings(user.id as number, role, status, sort);
    storage.setItem(cacheKey, viewings, { ttl: 5 * 60 }).catch(() => {});
    return viewings;
  } catch (error) {
    console.error("Error fetching viewings:", error);
    return errorResponse(error, event);
  }
});
