/**
 * API endpoint to update admin password hash
 * Protected by TASK_SECRET in request body
 * Cloudflare Access (staging) validates service token headers at edge as additional layer
 * POST /auth/update-admin-password
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { taskSecret } = await readBody(event);

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
