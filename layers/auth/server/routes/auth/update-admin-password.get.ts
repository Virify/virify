/**
 * API endpoint to update admin password hash
 * Protected by TASK_SECRET query parameter
 * Cloudflare Access (staging) validates service token headers at edge as additional layer
 * GET /auth/update-admin-password?taskSecret=<secret>
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { taskSecret } = getQuery(event);

  // Verify task secret for authentication
  if (!taskSecret || taskSecret !== config.TASK_SECRET) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "Invalid or missing task secret.",
    });
  }
  
  const { result } = await runTask("update-admin-password");

  return { result };
})
