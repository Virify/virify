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
      const result = await prisma.listing.update({
        where: { id: listingId, userId: user.id },
        data: updateData,
        include: {
          saleListing: true,
          rentalListing: true,
        },
      });

      // Invalidate listing cache so modal shows fresh data
      const storage = useStorage('cache:listing');
      await storage.removeItem(`listing:${listingId}`);

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

    return updatedDraftListing;
  } catch (error) {
    return errorResponse(error, event);
  }
});
