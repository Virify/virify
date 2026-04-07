/**
 * POST /api/admin/cache/bust
 *
 * Admin-only endpoint to bust all server-side caches.
 * Clears listing, per-user aggregates, and general caches.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!isAdmin(user)) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "You must be an admin to access this endpoint.",
    });
  }

  console.log(`[Admin] User ${user.email} triggered cache bust`);

  try {
    const { result } = await runTask("cache:bust", {});

    return {
      success: true,
      message: "All caches cleared",
      result,
    };
  } catch (error) {
    console.error("[Admin] Error running cache:bust task:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to bust caches",
    });
  }
});
