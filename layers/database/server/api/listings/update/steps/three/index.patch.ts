import { z } from "zod";
import { step3Schema } from "~~/shared/utils/listing-step3-schema";

/**
 * Step 3: Pricing API Endpoint
 * 
 * Works for BOTH draft listings (draftId) and live listings (listingId)
 */

const stepDataSchema = step3Schema.extend({
  draftId: z.number().int().positive().optional(),
  listingId: z.number().int().positive().optional(),
}).refine(
  (data) => data.draftId !== undefined || data.listingId !== undefined,
  { message: "Either draftId or listingId must be provided" }
);

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  
  try {
    const { draftId, listingId, price, rentalListing, saleListing } = await readValidatedBody(event, stepDataSchema.parse);

    const updateData = {
      price: price,
      rentalListing: rentalListing
        ? {
            update: {
              rentFrequency: rentalListing.rentFrequency,
              deposit: rentalListing.deposit ?? null,
              holdingDeposit: rentalListing.holdingDeposit ?? null,
            },
          }
        : undefined,
      saleListing: saleListing
        ? {
            update: {
              priceType: saleListing.priceType,
            },
          }
        : undefined,
    };

    // LIVE LISTING - update Listing table
    if (listingId) {
      // Read current price before update to archive it if it changed
      const currentListing = await prisma.listing.findUnique({
        where: { id: listingId, userId: user.id },
        select: { price: true },
      });

      // Enforce minimum reduction rule for published listings:
      // - Increases: always allowed (no limit)
      // - Reductions: must be at least 2% (sale) or 5% (rental); smaller reductions are not permitted
      if (currentListing && currentListing.price !== price && price < currentListing.price) {
        const isRental = !!rentalListing;
        const minReductionFraction = isRental ? 0.05 : 0.02;
        const reduction = (currentListing.price - price) / currentListing.price;
        if (reduction < minReductionFraction) {
          throw createError({
            statusCode: 422,
            message: `Price reductions on published listings must be at least ${isRental ? 5 : 2}% — you cannot reduce by a smaller amount`,
          });
        }
      }

      const result = await prisma.listing.update({
        where: { id: listingId, userId: user.id },
        data: {
          ...updateData,
          // If price changed, archive the old price
          ...(currentListing && currentListing.price !== price
            ? {
                ListingPriceHistory: {
                  create: {
                    oldPrice: currentListing.price,
                    newPrice: price,
                    changePercent: ((price - currentListing.price) / currentListing.price) * 100,
                  },
                },
              }
            : {}),
        },
        include: {
          saleListing: true,
          rentalListing: true,
          ListingPriceHistory: {
            orderBy: { createdAt: 'desc' },
            select: { id: true, oldPrice: true, newPrice: true, createdAt: true },
          },
        },
      });

      // Invalidate listing detail cache and my-listings page cache
      const storage = useStorage('cache:listing');
      await Promise.all([
        storage.removeItem(`listing:${listingId}`),
        invalidateMyListingsCache(user.id as number),
      ]);

      return result;
    }

    // DRAFT LISTING - update DraftListing table with completedSteps
    const currentDraft = await prisma.draftListing.findUnique({
      where: { id: draftId },
      select: { completedSteps: true },
    });

    const updatedDraftListing = await prisma.draftListing.update({
      where: { id: draftId!, userId: user.id },
      data: {
        // Add step 3 to completedSteps if not already there
        ...(currentDraft && !currentDraft.completedSteps.includes(3) ? { completedSteps: { push: 3 } } : {}),
        ...updateData,
      },
      include: {
        saleListing: true,
        rentalListing: true,
      },
    });

    await invalidateDraftListingsCache(user.id as number);
    return updatedDraftListing;
  } catch (error) {
    return errorResponse(error, event);
  }
});
