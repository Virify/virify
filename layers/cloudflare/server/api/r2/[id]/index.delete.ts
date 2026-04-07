import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getR2BucketName } from '../../../utils/r2Client';

/**
 * DELETE /api/r2/[id]
 * Delete a UserMedia record by its DB id.
 * Verifies ownership before deleting from R2 and the database.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const rawId = getRouterParam(event, 'id');
  const mediaId = rawId ? parseInt(rawId, 10) : NaN;

  if (isNaN(mediaId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid media ID' });
  }

  // Look up the record and verify ownership
  const userMedia = await prisma.userMedia.findFirst({
    where: { id: mediaId, userId: user.id },
    select: { id: true, key: true },
  });

  if (!userMedia) {
    throw createError({ statusCode: 404, statusMessage: 'Media not found or access denied' });
  }

  const r2 = createR2Client();
  const bucket = getR2BucketName();

  // Delete from R2
  try {
    await r2.send(new DeleteObjectCommand({
      Bucket: bucket,
      Key: userMedia.key,
    }));
  } catch (error) {
    // Log but continue — object may already be gone; DB record should still be cleaned up
    console.warn(`R2 delete failed for key "${userMedia.key}":`, error);
  }

  // Delete DB record
  await prisma.userMedia.delete({ where: { id: mediaId } });

  return { success: true };
});
