import * as z from "zod";
import { RentalPriceType, SalePriceType } from "~~/layers/database/server/database/prisma/generated/enums";
import { invalidateListingCache } from "~~/layers/database/server/utils/cache";

const stepDataSchema = z.object({
  listingId: z.number().int().positive(),
  price: z.number().positive(),
  rentalListing: z
    .object({
      deposit: z.number().min(0).nullable().optional(),
      holdingDeposit: z.number().min(0).nullable().optional(),
      rentFrequency: z.enum(Object.values(RentalPriceType)).nullable().optional(),
      rentalLength: z.enum(["SHORT_TERM", "LONG_TERM"]).nullable().optional(),
    })
    .optional(),
  saleListing: z
    .object({
      priceType: z.enum(Object.values(SalePriceType)).nullable().optional(),
    })
    .optional(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  try {
    const { listingId, price, rentalListing, saleListing } = await readValidatedBody(event, stepDataSchema.parse);

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

    const updatedDraftListing = await prisma.listing.update({
      where: { id: listingId, userId: user.id },
      data: {
        price: price,
        rentalListing: rentalListing
          ? {
              update: {
                ...rentalListing,
              },
            }
          : undefined,
        saleListing: saleListing
          ? {
              update: {
                ...saleListing,
              },
            }
          : undefined,
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

    // Invalidate cache after update
    await invalidateListingCache(listingId);

    return updatedDraftListing;
  } catch (error) {
    return errorResponse(error, event);
  }
});
