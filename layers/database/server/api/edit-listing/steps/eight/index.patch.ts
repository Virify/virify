import { z } from "zod";
import { step8Schema } from "~~/shared/utils/listing-step8-schema";
import {
  EPCRating,
  HeatingType,
  BoilerType,
  HotWaterSource,
  RenewableEnergy,
  ConnectedUtilities,
} from "~~/layers/database/server/database/prisma/generated/enums";

/**
 * Step 8: Energy & Costs API Endpoint (Unified)
 * 
 * This endpoint handles saving energy and running costs data for BOTH:
 * - Draft listings (pass draftId)
 * - Live/published listings (pass listingId)
 * 
 * Data saved:
 * - Energy Performance (EPC rating, heating, utilities)
 * - Running Costs (council tax, service charges, ground rent)
 */

// Schema accepts either draftId OR listingId (exactly one required)
const stepDataSchema = step8Schema.extend({
  draftId: z.number().int().positive().optional(),
  listingId: z.number().int().positive().optional(),
}).refine(
  (data) => (data.draftId !== undefined) !== (data.listingId !== undefined),
  { message: "Exactly one of draftId or listingId must be provided" }
);

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  
  try {
    const body = await readBody(event);
    const { draftId, listingId, property } = stepDataSchema.parse(body);

    const { energyAndUtilities, runningCosts } = property;

    // Build the property update data (same for both draft and live)
    const propertyUpdateData = {
      // Energy And Utilities
      energyAndUtilities: {
        upsert: {
          create: {
            description: energyAndUtilities.description ?? null,
            epcRating: energyAndUtilities.epcRating as EPCRating,
            epcCertificateUrl: energyAndUtilities.epcCertificateUrl ?? null,
            primaryHeatingType: energyAndUtilities.primaryHeatingType as HeatingType[] ?? [],
            secondaryHeatingType: energyAndUtilities.secondaryHeatingType as HeatingType[] ?? [],
            boilerType: energyAndUtilities.boilerType as BoilerType ?? null,
            hotWaterSource: energyAndUtilities.hotWaterSource as HotWaterSource ?? null,
            renewables: energyAndUtilities.renewables as RenewableEnergy[] ?? [],
            connectedUtilities: energyAndUtilities.connectedUtilities as ConnectedUtilities[] ?? [],
          },
          update: {
            description: energyAndUtilities.description ?? null,
            epcRating: energyAndUtilities.epcRating as EPCRating,
            epcCertificateUrl: energyAndUtilities.epcCertificateUrl ?? null,
            primaryHeatingType: energyAndUtilities.primaryHeatingType as HeatingType[] ?? [],
            secondaryHeatingType: energyAndUtilities.secondaryHeatingType as HeatingType[] ?? [],
            boilerType: energyAndUtilities.boilerType as BoilerType ?? null,
            hotWaterSource: energyAndUtilities.hotWaterSource as HotWaterSource ?? null,
            renewables: energyAndUtilities.renewables as RenewableEnergy[] ?? [],
            connectedUtilities: energyAndUtilities.connectedUtilities as ConnectedUtilities[] ?? [],
          },
        },
      },
      
      // Running Costs
      runningCosts: {
        upsert: {
          create: {
            description: runningCosts.description ?? null,
            councilTaxBand: runningCosts.councilTaxBand,
            serviceCharges: runningCosts.serviceCharges ?? null,
            groundRent: runningCosts.groundRent ?? null,
          },
          update: {
            description: runningCosts.description ?? null,
            councilTaxBand: runningCosts.councilTaxBand,
            serviceCharges: runningCosts.serviceCharges ?? null,
            groundRent: runningCosts.groundRent ?? null,
          },
        },
      },
    };

    const includeData = {
      property: {
        include: {
          energyAndUtilities: true,
          runningCosts: true,
        },
      },
    };

    if (draftId) {
      // DRAFT LISTING flow
      const currentDraft = await prisma.draftListing.findUnique({
        where: { id: draftId, userId: user.id },
        select: { completedSteps: true },
      });

      if (!currentDraft) {
        throw createError({ statusCode: 404, statusMessage: 'Draft listing not found' });
      }

      const result = await prisma.draftListing.update({
        where: { id: draftId, userId: user.id },
        data: {
          // Add step 8 to completedSteps if not already there
          ...(!currentDraft.completedSteps.includes(8) ? { completedSteps: { push: 8 } } : {}),
          property: { update: propertyUpdateData },
        },
        include: includeData,
      });

      return result;
    } else {
      // LIVE LISTING flow
      const existingListing = await prisma.listing.findUnique({
        where: { id: listingId!, userId: user.id },
        select: { id: true },
      });

      if (!existingListing) {
        throw createError({ statusCode: 404, statusMessage: 'Listing not found' });
      }

      const result = await prisma.listing.update({
        where: { id: listingId!, userId: user.id },
        data: {
          property: { update: propertyUpdateData },
        },
        include: includeData,
      });

      return result;
    }
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
});
