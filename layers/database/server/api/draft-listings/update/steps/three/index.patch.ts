import { z } from "zod";
import { step3Schema } from "~~/shared/utils/listing-step3-schema";

// Extend step3Schema to require draftId for updates
const stepDataSchema = step3Schema.extend({
  draftId: z.number().int().positive(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  
  try {
    const { draftId, price, rentalListing, saleListing } = await readValidatedBody(event, stepDataSchema.parse);

    // Get current completedSteps to check if step 3 already exists
    const currentDraft = await prisma.draftListing.findUnique({
      where: { id: draftId },
      select: { completedSteps: true },
    });

    const updatedDraftListing = await prisma.draftListing.update({
      where: { id: draftId, userId: user.id },
      data: {
        // Add step 3 to completedSteps if not already there
        ...(currentDraft && !currentDraft.completedSteps.includes(3) ? { completedSteps: { push: 3 } } : {}),
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
