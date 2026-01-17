/**
 * POST /api/analytics/track/share
 * 
 * Track share action (user shares a listing)
 * Uses sendBeacon - fire-and-forget
 */
import * as z from "zod";

const shareSchema = z.object({
  listingId: z.union([z.string(), z.number()]),
  sessionId: z.string(),
  timestamp: z.number(),
  platform: z.string(), // e.g., 'twitter', 'facebook', 'whatsapp', 'copy', 'email'
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, shareSchema.parse);
    const { user } = await getUserSession(event);
    
    const listingId = typeof body.listingId === 'string' 
      ? parseInt(body.listingId, 10) 
      : body.listingId;
    
    // Verify listing exists (ListingShare model needs migration first)
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true },
    });
    
    if (!listing) {
      return { success: false };
    }
    
    // Note: ListingShare table recording is skipped until migration runs
    // For now we just validate the request
    // TODO: After migration, uncomment:
    // await prisma.listingShare.create({
    //   data: {
    //     listingId,
    //     userId: user?.id || null,
    //     sessionId: body.sessionId,
    //     platform: body.platform,
    //     ip,
    //   },
    // });
    
    return { success: true };
  } catch (error) {
    console.error('Error tracking share:', error);
    return { success: false };
  }
});
