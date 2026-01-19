import { z } from "zod";
import { step1Schema } from "~~/shared/utils/listing-step1-schema";

/**
 * Step 1: Listing Type API Endpoint
 * 
 * Works for BOTH draft listings (draftId) and live listings (listingId)
 */

const stepDataSchema = step1Schema.extend({
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
    const body = await readBody(event);
    const { saleListing, rentalListing, draftId, listingId, selectedType } = stepDataSchema.parse(body);

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

    // LIVE LISTING - update Listing table
    if (listingId) {
      const existingListing = await prisma.listing.findUnique({
        where: { id: listingId, userId: user.id },
        include: { saleListing: true, rentalListing: true },
      });

      if (!existingListing) {
        throw createError({
          statusCode: 404,
          statusMessage: "Listing not found",
        });
      }

      // Handle deletion of opposite listing type
      if (selectedType === 'sale' && existingListing.rentalListing) {
        await prisma.rentalListing.delete({ where: { listingId: listingId } });
        delete updateData.rentalListing;
      } else if (selectedType === 'rent' && existingListing.saleListing) {
        await prisma.saleListing.delete({ where: { listingId: listingId } });
        delete updateData.saleListing;
      } else {
        delete updateData.saleListing?.delete;
        delete updateData.rentalListing?.delete;
      }

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
      where: { id: draftId!, userId: user.id },
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
