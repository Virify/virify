/**
 * POST /api/analytics/track/view
 * 
 * Track a listing view (user visits listing detail page)
 * Uses sendBeacon - fire-and-forget, no response needed
 */
import * as z from "zod";

const viewSchema = z.object({
  listingId: z.union([z.string(), z.number()]),
  sessionId: z.string().nullable().optional(), // Optional for anonymous tracking
  timestamp: z.number(),
  source: z.enum(['search', 'direct', 'social', 'email', 'referral']).optional(),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, viewSchema.parse);
    const { user } = await getUserSession(event);
    
    const listingId = typeof body.listingId === 'string' 
      ? parseInt(body.listingId, 10) 
      : body.listingId;
    
    // Get client IP
    const ip = getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() 
      || getHeader(event, 'x-real-ip')
      || null;
    
    // Record the view
    await prisma.listingView.create({
      data: {
        listingId,
        userId: user?.id || null,
        sessionId: body.sessionId,
        source: body.source || 'direct',
        userAgent: body.userAgent,
        referrer: body.referrer,
        ip,
      },
    });
    
    // Update daily stats (upsert for today)
    // Need to get listing owner for denormalized userId
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
          views: { increment: 1 },
        },
        create: {
          listingId,
          userId: listing.userId,
          date: today,
          views: 1,
          impressions: 0,
          clicks: 0,
          favourites: 0,
          enquiries: 0,
          avgDuration: 0,
        },
      });
    }
    
    return { success: true };
  } catch (error) {
    // Log but don't fail - sendBeacon doesn't care about response
    console.error('Error tracking view:', error);
    return { success: false };
  }
});
