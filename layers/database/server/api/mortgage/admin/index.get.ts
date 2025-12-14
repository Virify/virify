/**
 * GET /api/mortgage/admin
 *
 * Admin-only endpoint to get mortgage rates (admin view).
 *
 * Requires: User to be logged in with ADMIN role
 */
export default defineEventHandler(async (event) => {
  // Require authenticated session
  const { user } = await requireUserSession(event);

  // Check user is admin
  if (!isAdmin(user)) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "You must be an admin to access this endpoint.",
    });
  }

  try {
    const rates = await prisma.mortgageRate.findMany({
      where: {
        validUntil: null,
      }
    });

    return {
      success: true,
      rates,
    };
  } catch (error) {
    console.error("[Admin] Error fetching mortgage rates:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to fetch mortgage rates",
    });
  }
});
