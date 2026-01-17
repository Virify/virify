import { z } from "zod";
import { step1Schema } from "~~/shared/utils/listing-step1-schema";

// Extend step1Schema to require draftId for updates
const stepDataSchema = step1Schema.extend({
  draftId: z.number().int().positive(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  
  try {
    const body = await readBody(event);
    const { saleListing, rentalListing, draftId, selectedType } = stepDataSchema.parse(body);

    // Prepare data based on selected type
    const updateData: any = {};
    
    if (selectedType === 'sale' && saleListing) {
      updateData.saleListing = {
        upsert: {
          update: {
            tenureType: saleListing.tenureType,
            chain: saleListing.chain,
            sharedOwnership: saleListing.sharedOwnership,
            availabilityStatus: saleListing.availabilityStatus,
          },
          create: {
            tenureType: saleListing.tenureType,
            chain: saleListing.chain,
            sharedOwnership: saleListing.sharedOwnership,
            availabilityStatus: saleListing.availabilityStatus,
          },
        },
      };
      // Remove rental listing if switching to sale
      updateData.rentalListing = { delete: true };
    } else if (selectedType === 'rent' && rentalListing) {
      updateData.rentalListing = {
        upsert: {
          update: {
            furnishedStatus: rentalListing.furnishedStatus,
            isBillsIncluded: rentalListing.isBillsIncluded,
            rentalLength: rentalListing.rentalLength,
            availabilityStatus: rentalListing.availabilityStatus,
          },
          create: {
            furnishedStatus: rentalListing.furnishedStatus,
            isBillsIncluded: rentalListing.isBillsIncluded,
            rentalLength: rentalListing.rentalLength,
            availabilityStatus: rentalListing.availabilityStatus,
          },
        },
      };
      // Remove sale listing if switching to rent
      updateData.saleListing = { delete: true };
    }

    // First check if there's existing listings to delete
    const existingDraft = await prisma.draftListing.findUnique({
      where: { id: draftId, userId: user.id },
      include: { saleListing: true, rentalListing: true },
    });

    if (!existingDraft) {
      throw createError({
        statusCode: 404,
        statusMessage: "Draft listing not found",
      });
    }

    // Handle deletion of opposite listing type
    if (selectedType === 'sale' && existingDraft.rentalListing) {
      await prisma.rentalListing.delete({ where: { draftListingId: draftId } });
      delete updateData.rentalListing;
    } else if (selectedType === 'rent' && existingDraft.saleListing) {
      await prisma.saleListing.delete({ where: { draftListingId: draftId } });
      delete updateData.saleListing;
    } else {
      // No opposite listing to delete
      delete updateData.saleListing?.delete;
      delete updateData.rentalListing?.delete;
    }

    // Get current completedSteps to check if step 1 already exists
    const currentDraft = await prisma.draftListing.findUnique({
      where: { id: draftId },
      select: { completedSteps: true },
    });

    // Add step 1 to completedSteps if not already there
    if (currentDraft && !currentDraft.completedSteps.includes(1)) {
      updateData.completedSteps = { push: 1 };
    }

    return await prisma.draftListing.update({
      where: { id: draftId, userId: user.id },
      data: updateData,
      include: {
        saleListing: true,
        rentalListing: true,
      },
    });
  } catch (error) {
    console.error('[Step1 PATCH] Error:', error);
    return errorResponse(error, event);
  }
});
