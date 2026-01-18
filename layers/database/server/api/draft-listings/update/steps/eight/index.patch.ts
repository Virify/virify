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
 * This endpoint handles saving energy and running costs data for a draft listing:
 * - Energy Performance (EPC rating, heating, utilities)
 * - Running Costs (council tax, service charges, ground rent)
 */

// Extend step8Schema to require draftId for updates
const stepDataSchema = step8Schema.extend({
  draftId: z.number().int().positive(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  
  try {
    const body = await readBody(event);
    const { draftId, property } = stepDataSchema.parse(body);

    const { energyAndUtilities, runningCosts } = property;

    // Get current completedSteps to check if step 8 already exists
    const currentDraft = await prisma.draftListing.findUnique({
      where: { id: draftId },
      select: { completedSteps: true },
    });

    const result = await prisma.draftListing.update({
      where: { id: draftId, userId: user.id },
      data: {
        // Add step 8 to completedSteps if not already there
        ...(currentDraft && !currentDraft.completedSteps.includes(8) ? { completedSteps: { push: 8 } } : {}),
        property: {
          update: {
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
          },
        },
      },
      include: {
        property: {
          include: {
            energyAndUtilities: true,
            runningCosts: true,
          },
        },
      },
    });

    return result;
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
});
