/**
 * GET /api/mortgage/admin/fetch-rates
 * 
 * Admin-only endpoint to manually trigger the mortgage rate fetch task.
 * Useful for running after database seeding or when rates need to be refreshed.
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

  console.log(`[Admin] User ${user.email} triggered mortgage rate fetch task`);

  try {
    // Run the mortgage:fetch-rates task
    const { result } = await runTask("mortgage:fetch-rates", {});

    return {
      success: true,
      message: "Mortgage rates fetch task completed",
      result,
    };
  } catch (error) {
    console.error("[Admin] Error running mortgage:fetch-rates task:", error);
    
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to run mortgage rate fetch task",
    });
  }
});
