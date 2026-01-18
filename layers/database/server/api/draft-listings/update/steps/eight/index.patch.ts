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
 * Step 8: Energy & Costs API Endpoint
 * 
 * Works for BOTH draft listings (draftId) and live listings (listingId)
 */

const stepDataSchema = step8Schema.extend({
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
    const { draftId, listingId, property } = stepDataSchema.parse(body);
    const { energyAndUtilities, runningCosts } = property;

    const propertyUpdate = {
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

    // DRAFT or LIVE - same update, different table
    if (listingId) {
      const result = await prisma.listing.update({
        where: { id: listingId, userId: user.id },
        data: { property: { update: propertyUpdate } },
        include: { property: { include: { energyAndUtilities: true, runningCosts: true } } },
      });

      // Invalidate listing cache so modal shows fresh data
      const storage = useStorage('cache:listing');
      await storage.removeItem(`listing:${listingId}`);

      return result;
    }

    // Draft - also update completedSteps
    const current = await prisma.draftListing.findUnique({
      where: { id: draftId },
      select: { completedSteps: true },
    });

    return await prisma.draftListing.update({
      where: { id: draftId!, userId: user.id },
      data: {
        ...(current && !current.completedSteps.includes(8) ? { completedSteps: { push: 8 } } : {}),
        property: { update: propertyUpdate },
      },
      include: { property: { include: { energyAndUtilities: true, runningCosts: true } } },
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
});
