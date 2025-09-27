import * as z from "zod";
import { FurnishedStatus, RentalAvailabilityStatus, RentalPriceType, SaleAvailabilityStatus, SalePriceType, TenureType } from "~~/layers/database/server/database/prisma/generated/enums";

const saleListingSchema = z.object({
  tenureType: z.enum(Object.values(TenureType)).nullable().optional(),
  chain: z.boolean().optional(),
  sharedOwnership: z.boolean().optional(),
  priceType: z.enum(Object.values(SalePriceType)).nullable().optional(),
  availabilityStatus: z.enum(Object.values(SaleAvailabilityStatus)),
});

const rentalListingSchema = z.object({
  deposit: z.number().nullable().optional(),
  holdingDeposit: z.number().nullable().optional(),
  rentFrequency: z.enum(Object.values(RentalPriceType)).nullable().optional(),
  isBillsIncluded: z.boolean(),
  rentalLength: z.number().int().nullable().optional(),
  furnishedStatus: z.enum(Object.values(FurnishedStatus)).nullable().optional(),
  availabilityStatus: z.enum(Object.values(RentalAvailabilityStatus)),
});

const stepDataSchema = z.object({
  draftId: z.number().int().positive(),
  saleListing: saleListingSchema.optional(),
  rentalListing: rentalListingSchema.optional(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  try {
    const { saleListing, rentalListing, draftId } = await readValidatedBody(event, stepDataSchema.parse);

    const rentalListingData = rentalListing
      ? {
          ...rentalListing,
          rentFrequency: rentalListing.rentFrequency ? (rentalListing.rentFrequency as RentalPriceType) : undefined,
        }
      : undefined;

    return await prisma.draftListing.update({
      where: { id: draftId, userId: user.id },
      data: {
        id: draftId,
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
  } catch (error) {
    return errorResponse(error, event);
  }
});
