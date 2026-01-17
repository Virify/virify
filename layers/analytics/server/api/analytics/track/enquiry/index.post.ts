/**
 * POST /api/analytics/track/enquiry
 * 
 * Track enquiry sent event
 * Uses sendBeacon - fire-and-forget
 * 
 * Note: This tracks the EVENT for analytics.
 * The actual enquiry/conversation is handled by the messaging API.
 */
import * as z from "zod";

const enquirySchema = z.object({
  listingId: z.union([z.string(), z.number()]),
  sessionId: z.string().nullable().optional(), // Optional for anonymous tracking
  timestamp: z.number(),
  source: z.enum(['search', 'direct', 'social', 'email', 'referral']).optional(),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, enquirySchema.parse);
    const { user } = await getUserSession(event);
    
    // Only track for logged-in users (enquiries require auth)
    if (!user?.id) {
      return { success: true };
    }
    
    const listingId = typeof body.listingId === 'string' 
      ? parseInt(body.listingId, 10) 
      : body.listingId;
    
    // Get listing owner for denormalized userId
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { userId: true },
    });
    
    // Update daily stats only if listing has owner
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
          enquiries: { increment: 1 },
        },
        create: {
          listingId,
          userId: listing.userId,
          date: today,
          views: 0,
          impressions: 0,
          clicks: 0,
          favourites: 0,
          enquiries: 1,
          avgDuration: 0,
        },
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error tracking enquiry:', error);
    return { success: false };
  }
});
