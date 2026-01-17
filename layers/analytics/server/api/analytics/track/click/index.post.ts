/**
 * POST /api/analytics/track/click
 * 
 * Track listing click (user clicks a listing card in search results)
 * Uses sendBeacon - fire-and-forget
 */
import * as z from "zod";

const clickSchema = z.object({
  listingId: z.union([z.string(), z.number()]),
  sessionId: z.string(),
  timestamp: z.number(),
  source: z.enum(['search', 'direct', 'social', 'email', 'referral']).optional(),
  position: z.number().optional(), // Position in search results
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, clickSchema.parse);
    const { user } = await getUserSession(event);
    
    const listingId = typeof body.listingId === 'string' 
      ? parseInt(body.listingId, 10) 
      : body.listingId;
    
    // Get client IP
    const ip = getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() 
      || getHeader(event, 'x-real-ip')
      || null;
    
    // Get listing for owner lookup and record click
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { userId: true },
    });
    
    // Record the click (skip if listing doesn't exist)
    if (!listing) {
      return { success: false };
    }
    
    // Use raw SQL or a different approach since ListingClick model needs migration
    // For now, just update the daily stats
    
    // Update daily stats
    if (listing.userId) {
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
          clicks: { increment: 1 },
        },
        create: {
          listingId,
          userId: listing.userId,
          date: today,
          views: 0,
          impressions: 0,
          clicks: 1,
          favourites: 0,
          enquiries: 0,
          avgDuration: 0,
        },
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error tracking click:', error);
    return { success: false };
  }
});
