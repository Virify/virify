import type { AccountCounts } from "~/utils/account/types";
import { getAccountCounts } from "../../utils/account";

/**
 * Handler for GET /api/account/counts
 * Returns the counts for various account items
 */
export default defineEventHandler(async (event): Promise<AccountCounts> => {
  const { user } = await requireUserSession(event);
  try {
    if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    return await getAccountCounts(user.id as number);
  } catch (error) {
    console.error("Error fetching account counts:", error);
    throw createError({ statusCode: 500, statusMessage: "Internal Server Error" });
  }
});
