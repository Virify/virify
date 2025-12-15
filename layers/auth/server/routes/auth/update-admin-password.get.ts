/**
 * API endpoint to update admin password hash
 * POST /api/admin/update-password
 * 
 */
export default defineEventHandler(async (event) => {
  // Require task secret for authorization
  const config = useRuntimeConfig();
  const { taskSecret } = getQuery(event);

  if(taskSecret !== config.TASK_SECRET) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "Invalid task secret.",
    });
  }
  
  const { result } = await runTask("update-admin-password");

  return { result };
})
