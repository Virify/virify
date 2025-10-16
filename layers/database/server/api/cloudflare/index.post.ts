/**
 * POST /api/cloudflare
 * Get a one-time direct upload URL from Cloudflare Images
 * 
 * This endpoint returns a secure, one-time upload URL that allows the client
 * to upload images directly to Cloudflare, bypassing our server.
 * 
 * Benefits:
 * - Faster uploads (no server bottleneck)
 * - Less server bandwidth usage
 * - Supports parallel uploads
 * - Still secure (URL expires in 30 minutes, one-time use only)
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);

  try {
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      });
    }

    const config = useRuntimeConfig();

    // Request a direct upload URL from Cloudflare
    // Note: This endpoint doesn't accept a body - it just returns a URL
    const cloudflareUrl = `https://api.cloudflare.com/client/v4/accounts/${config.CF_ACCOUNT_ID}/images/v2/direct_upload`;
    
    const response = await fetch(cloudflareUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.CF_IMAGES_API_KEY}`,
      },
    });

    const data = await response.json();

    if (!data.success) {
      throw createError({
        statusCode: 500,
        statusMessage: data.errors?.[0]?.message || 'Failed to get upload URL from Cloudflare',
      });
    }

    // Return the upload URL to the client
    // The client will upload directly to this URL
    return {
      success: true,
      uploadUrl: data.result.uploadURL,
    };
  } catch (error) {
    return errorResponse(error, event);
  }
});
