/**
 * DELETE /api/cloudflare/[id]
 * Delete an image from Cloudflare Images
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

    const imageId = getRouterParam(event, 'id');

    if (!imageId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Image ID is required',
      });
    }

    const config = useRuntimeConfig();

    // Delete from Cloudflare Images API
    const cloudflareUrl = `https://api.cloudflare.com/client/v4/accounts/${config.CF_ACCOUNT_ID}/images/v1/${imageId}`;
    
    const response = await fetch(cloudflareUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${config.CF_IMAGES_API_KEY}`,
      },
    });

    const data = await response.json();

    if (!data.success) {
      // Check if error is "Image not found" - this is OK, image already deleted
      const errorMessage = data.errors?.[0]?.message || '';
      const isNotFound = errorMessage.toLowerCase().includes('not found') || response.status === 404;
      
      if (isNotFound) {
        console.log(`Image ${imageId} already deleted from Cloudflare`);
        return { success: true };
      }
      
      console.error('Cloudflare delete error:', data.errors);
      throw createError({
        statusCode: 500,
        statusMessage: errorMessage || 'Failed to delete from Cloudflare',
      });
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Delete error:', error);
    return errorResponse(error, event);
  }
});
