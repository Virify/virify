/**
 * API endpoint to update admin password hash
 * Authenticated via Cloudflare Service Token headers
 * GET /auth/update-admin-password
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  // Check for Cloudflare Service Token headers
  const cfClientId = getHeader(event, 'CF-Access-Client-Id');
  const cfClientSecret = getHeader(event, 'CF-Access-Client-Secret');

  // Verify service token credentials match environment variables
  if (!cfClientId || !cfClientSecret) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Missing Cloudflare Service Token headers.",
    });
  }

  if (cfClientId !== config.CF_SERVICE_TOKEN_ID || cfClientSecret !== config.CF_SERVICE_TOKEN_SECRET) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "Invalid Cloudflare Service Token.",
    });
  }
  
  const { result } = await runTask("update-admin-password");

  return { result };
})
