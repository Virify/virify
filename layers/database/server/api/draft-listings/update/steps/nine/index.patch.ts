import * as z from "zod";
import { 
  EPCRating, 
  HeatingType, 
  BoilerType, 
  HotWaterSource, 
  RenewableEnergy, 
  ConnectedUtilities 
} from "~~/layers/database/server/database/prisma/generated/enums";

// Validate payload for Step Nine - Energy & Costs
const stepNineSchema = z.object({
  draftId: z.number().int().positive(),
  property: z.object({
    energyAndUtilities: z.object({
      description: z.string().max(5000).nullable().optional(),
      epcRating: z.enum(Object.values(EPCRating)),
      epcCertificateUrl: z.string().url().nullable().optional(),
      primaryHeatingType: z.array(z.enum(Object.values(HeatingType))).default([]),
      secondaryHeatingType: z.array(z.enum(Object.values(HeatingType))).default([]),
      boilerType: z.enum(Object.values(BoilerType)).nullable().optional(),
      hotWaterSource: z.enum(Object.values(HotWaterSource)).nullable().optional(),
      renewables: z.array(z.enum(Object.values(RenewableEnergy))).default([]),
      connectedUtilities: z.array(z.enum(Object.values(ConnectedUtilities))).default([]),
    }),
    runningCosts: z.object({
      description: z.string().max(5000).nullable().optional(),
      councilTaxBand: z.string(),
      serviceCharges: z.coerce.number().min(0).nullable().optional(),
      groundRent: z.coerce.number().min(0).nullable().optional(),
    }),
  }),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  try {
    const { draftId, property } = await readValidatedBody(event, stepNineSchema.parse);

    // Get current completedSteps to check if step 9 already exists
    const currentDraft = await prisma.draftListing.findUnique({
      where: { id: draftId },
      select: { completedSteps: true },
    });

    return await prisma.draftListing.update({
      where: { id: draftId, userId: user.id },
      data: {
        // Add step 9 to completedSteps if not already there
        ...(currentDraft && !currentDraft.completedSteps.includes(9) ? { completedSteps: { push: 9 } } : {}),
        property: {
          update: {
            // Energy And Utilities (required)
            energyAndUtilities: {
              upsert: {
                create: {
                  description: property.energyAndUtilities.description ?? null,
                  epcRating: property.energyAndUtilities.epcRating,
                  epcCertificateUrl: property.energyAndUtilities.epcCertificateUrl ?? null,
                  primaryHeatingType: property.energyAndUtilities.primaryHeatingType,
                  secondaryHeatingType: property.energyAndUtilities.secondaryHeatingType,
                  boilerType: property.energyAndUtilities.boilerType ?? null,
                  hotWaterSource: property.energyAndUtilities.hotWaterSource ?? null,
                  renewables: property.energyAndUtilities.renewables,
                  connectedUtilities: property.energyAndUtilities.connectedUtilities,
                },
                update: {
                  description: property.energyAndUtilities.description ?? null,
                  epcRating: property.energyAndUtilities.epcRating,
                  epcCertificateUrl: property.energyAndUtilities.epcCertificateUrl ?? null,
                  primaryHeatingType: property.energyAndUtilities.primaryHeatingType,
                  secondaryHeatingType: property.energyAndUtilities.secondaryHeatingType,
                  boilerType: property.energyAndUtilities.boilerType ?? null,
                  hotWaterSource: property.energyAndUtilities.hotWaterSource ?? null,
                  renewables: property.energyAndUtilities.renewables,
                  connectedUtilities: property.energyAndUtilities.connectedUtilities,
                },
              },
            },
            // Running Costs (required)
            runningCosts: {
              upsert: {
                create: {
                  description: property.runningCosts.description ?? null,
                  councilTaxBand: property.runningCosts.councilTaxBand,
                  serviceCharges: property.runningCosts.serviceCharges ?? null,
                  groundRent: property.runningCosts.groundRent ?? null,
                },
                update: {
                  description: property.runningCosts.description ?? null,
                  councilTaxBand: property.runningCosts.councilTaxBand,
                  serviceCharges: property.runningCosts.serviceCharges ?? null,
                  groundRent: property.runningCosts.groundRent ?? null,
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
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
});
