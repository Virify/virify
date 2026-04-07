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

    // Verify the image belongs to the requesting user before deleting.
    // Images can be either property media or the user's own avatar.
    const [ownedMedia, userWithAvatar] = await Promise.all([
      prisma.media.findFirst({
        where: { image: imageId, property: { userId: user.id } },
        select: { id: true },
      }),
      prisma.user.findFirst({
        where: { id: user.id, avatar: { contains: imageId } },
        select: { id: true },
      }),
    ]);

    if (!ownedMedia && !userWithAvatar) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
      });
    }

    const config = useRuntimeConfig();

    const cloudflareUrl = `https://api.cloudflare.com/client/v4/accounts/${config.CF_ACCOUNT_ID}/images/v1/${imageId}`;

    const response = await fetch(cloudflareUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${config.CF_IMAGES_API_KEY}`,
      },
    });

    const data = await response.json();

    if (!data.success) {
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

    return { success: true };
  } catch (error) {
    return errorResponse(error, event);
  }
});
