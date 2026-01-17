/**
 * POST /api/analytics/track/favourite
 * 
 * Track favourite action (user adds/removes favourite)
 * Uses sendBeacon - fire-and-forget
 * 
 * Note: This tracks the EVENT for analytics, not the actual favourite.
 * The favourite itself is handled by the favourites API.
 */
import * as z from "zod";

const favouriteSchema = z.object({
  listingId: z.union([z.string(), z.number()]),
  sessionId: z.string(),
  timestamp: z.number(),
  action: z.enum(['add', 'remove']),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, favouriteSchema.parse);
    const { user } = await getUserSession(event);
    
    // Only track for logged-in users (favourites require auth anyway)
    if (!user?.id) {
      return { success: true };
    }
    
    const listingId = typeof body.listingId === 'string' 
      ? parseInt(body.listingId, 10) 
      : body.listingId;
    
    // Only update daily stats on 'add' action
    if (body.action === 'add') {
      // Get listing owner for denormalized userId
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: { userId: true },
      });
      
      if (listing?.userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        await prisma.dailyListingStats.upsert({
          where: {
            listingId_date: {
              listingId,
              date: today,
            },
          },
          update: {
            favourites: { increment: 1 },
          },
          create: {
            listingId,
            userId: listing.userId,
            date: today,
            views: 0,
            impressions: 0,
            clicks: 0,
            favourites: 1,
            enquiries: 0,
            avgDuration: 0,
          },
        });
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error tracking favourite:', error);
    return { success: false };
  }
});
