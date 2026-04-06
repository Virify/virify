/**
 * POST /api/analytics/track/impressions
 * 
 * Track listing impressions (listings appearing in search results)
 * Batched - accepts multiple listing IDs at once
 * Uses sendBeacon - fire-and-forget
 */
import * as z from "zod";

const impressionsSchema = z.object({
  listingIds: z.array(z.number()).max(100),
  sessionId: z.string().nullable().optional(), // Optional for anonymous tracking
  timestamp: z.number(),
  source: z.string().optional(),
  searchQuery: z.string().optional(),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, impressionsSchema.parse);
    const { user } = await getUserSession(event);
    
    if (body.listingIds.length === 0) {
      return { success: true, count: 0 };
    }
    
    // Get client IP
    const ip = getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() 
      || getHeader(event, 'x-real-ip')
      || null;
    
    // Batch create impressions
    await prisma.listingImpression.createMany({
      data: body.listingIds.map((listingId, index) => ({
        listingId,
        userId: user?.id || null,
        sessionId: body.sessionId,
        source: body.source,
        searchQuery: body.searchQuery,
        userAgent: body.userAgent,
        ip,
        position: index + 1, // Use array index as position
      })),
      skipDuplicates: true,
    });
    
    // Get listing owners for denormalized userId in stats
    const listings = await prisma.listing.findMany({
      where: { id: { in: body.listingIds } },
      select: { id: true, userId: true },
    });
    
    const listingOwnerMap = new Map(
      listings.filter(l => l.userId).map(l => [l.id, l.userId!])
    );
    
    // Update daily stats for all listings that have owners
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Use transaction for batch upserts
    const listingsWithOwners = body.listingIds.filter(id => listingOwnerMap.has(id));
    if (listingsWithOwners.length > 0) {
      await prisma.$transaction(
        listingsWithOwners.map(listingId => 
          prisma.dailyListingStats.upsert({
            where: {
              listingId_date: {
                listingId,
                date: today,
              },
            },
            update: {
              impressions: { increment: 1 },
            },
            create: {
              listingId,
              userId: listingOwnerMap.get(listingId)!,
              date: today,
              views: 0,
              impressions: 1,
              clicks: 0,
              favourites: 0,
              enquiries: 0,
              avgDuration: 0,
            },
          })
        )
      );
    }
    
    return { success: true, count: body.listingIds.length };
  } catch (error) {
    console.error('Error tracking impressions:', error);
    return { success: false };
  }
});
