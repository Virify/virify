import * as z from "zod";
import { FurnishedStatus, RentalPriceType, SalePriceType, TenureType } from "~~/layers/database/server/database/prisma/generated/enums";
import { invalidateListingCache } from "~~/layers/database/server/utils/cache";

const saleListingSchema = z.object({
  tenureType: z.enum(Object.values(TenureType)).nullable().optional(),
  chain: z.boolean().optional(),
  sharedOwnership: z.boolean().optional(),
  priceType: z.enum(Object.values(SalePriceType)).nullable().optional(),
});

const rentalListingSchema = z.object({
  deposit: z.number().nullable().optional(),
  holdingDeposit: z.number().nullable().optional(),
  rentFrequency: z.enum(Object.values(RentalPriceType)).nullable().optional(),
  isBillsIncluded: z.boolean(),
  rentalLength: z.enum(["SHORT_TERM", "LONG_TERM"]).nullable().optional(),
  furnishedStatus: z.enum(Object.values(FurnishedStatus)).nullable().optional(),
});

const stepDataSchema = z.object({
  listingId: z.number().int().positive(),
  saleListing: saleListingSchema.optional(),
  rentalListing: rentalListingSchema.optional(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  try {
    const { saleListing, rentalListing, listingId } = await readValidatedBody(event, stepDataSchema.parse);

    const rentalListingData = rentalListing
      ? {
          ...rentalListing,
          rentFrequency: rentalListing.rentFrequency ? (rentalListing.rentFrequency as RentalPriceType) : undefined,
        }
      : undefined;

    const result = await prisma.listing.update({
      where: { id: listingId, userId: user.id },
      data: {
        id: listingId,
        saleListing: saleListing
          ? {
              upsert: {
                update: saleListing,
                create: saleListing,
              },
            }
          : undefined,
        rentalListing: rentalListingData
          ? {
              upsert: {
                update: rentalListingData,
                create: rentalListingData,
              },
            }
          : undefined,
      },
      include: {
        saleListing: true,
        rentalListing: true,
      },
    });

    // Invalidate cache after update
    await invalidateListingCache(listingId);

    return result;
  } catch (error) {
    return errorResponse(error, event);
  }
});
