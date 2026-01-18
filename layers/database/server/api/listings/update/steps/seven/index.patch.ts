import * as z from "zod";
import { GardenFacing, GardenPosition, OutdoorSpaceFeature, LandFeature } from "~~/layers/database/server/database/prisma/generated/enums";
import { invalidateListingCache } from "~~/layers/database/server/utils/listing-cache";

const stepSevenSchema = z.object({
  listingId: z.number().int().positive(),
  property: z.object({
    outdoorSpace: z.object({
      description: z.string().max(500).nullable().optional(),
      totalArea: z.coerce.number().min(0).nullable().optional(),
      hasGarden: z.boolean().optional(),
      hasYard: z.boolean().optional(),
      hasLand: z.boolean().optional(),
      features: z.array(z.enum(Object.values(OutdoorSpaceFeature) as [string, ...string[]])).optional(),
      garden: z.array(
        z.object({
          name: z.string().max(100),
          description: z.string().max(500).nullable().optional(),
          facing: z.enum(Object.values(GardenFacing) as [string, ...string[]]).nullable().optional(),
          position: z.enum(Object.values(GardenPosition) as [string, ...string[]]).nullable().optional(),
          features: z.array(z.enum(Object.values(OutdoorSpaceFeature) as [string, ...string[]])).optional(),
          size: z.coerce.number().min(0).nullable().optional(),
        })
      ),
      yard: z.array(
        z.object({
          name: z.string().max(100),
          description: z.string().max(500).nullable().optional(),
          facing: z.enum(Object.values(GardenFacing) as [string, ...string[]]).nullable().optional(),
          position: z.enum(Object.values(GardenPosition) as [string, ...string[]]).nullable().optional(),
          features: z.array(z.enum(Object.values(OutdoorSpaceFeature) as [string, ...string[]])).optional(),
          size: z.coerce.number().min(0).nullable().optional(),
        })
      ),
      land: z.array(
        z.object({
          name: z.string().max(100),
          description: z.string().max(500).nullable().optional(),
          features: z.array(z.enum(Object.values(LandFeature) as [string, ...string[]])).optional(),
          size: z.coerce.number().min(0).nullable().optional(),
        })
      ),
    }),
  }),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  
  try {
    const { listingId, property } = await readValidatedBody(event, stepSevenSchema.parse);

    const { outdoorSpace } = property;

    const result = await prisma.listing.update({
      where: { id: listingId, userId: user.id },
      data: {
        property: {
          update: {
            outdoorSpace: {
              upsert: {
                create: {
                  description: outdoorSpace.description ?? null,
                  totalArea: outdoorSpace.totalArea ?? null,
                  features: outdoorSpace.features as OutdoorSpaceFeature[] ?? [],
                  garden: {
                    create: outdoorSpace.garden.map((g) => ({
                      name: g.name,
                      description: g.description ?? null,
                      facing: (g.facing === '0' ? null : g.facing) as GardenFacing | null,
                      position: (g.position === '0' ? null : g.position) as GardenPosition | null,
                      features: g.features as OutdoorSpaceFeature[] ?? [],
                      size: g.size ?? null,
                    })),
                  },
                  yard: {
                    create: outdoorSpace.yard.map((y) => ({
                      name: y.name,
                      description: y.description ?? null,
                      facing: (y.facing === '0' ? null : y.facing) as GardenFacing | null,
                      position: (y.position === '0' ? null : y.position) as GardenPosition | null,
                      features: y.features as OutdoorSpaceFeature[] ?? [],
                      size: y.size ?? null,
                    })),
                  },
                  land: {
                    create: outdoorSpace.land.map((l) => ({
                      name: l.name,
                      description: l.description ?? null,
                      features: l.features as LandFeature[] ?? [],
                      size: l.size ?? null,
                    })),
                  },
                },
                update: {
                  description: outdoorSpace.description ?? null,
                  totalArea: outdoorSpace.totalArea ?? null,
                  features: outdoorSpace.features as OutdoorSpaceFeature[] ?? [],
                  garden: {
                    deleteMany: {},
                    create: outdoorSpace.garden.map((g) => ({
                      name: g.name,
                      description: g.description ?? null,
                      facing: (g.facing === '0' ? null : g.facing) as GardenFacing | null,
                      position: (g.position === '0' ? null : g.position) as GardenPosition | null,
                      features: g.features as OutdoorSpaceFeature[] ?? [],
                      size: g.size ?? null,
                    })),
                  },
                  yard: {
                    deleteMany: {},
                    create: outdoorSpace.yard.map((y) => ({
                      name: y.name,
                      description: y.description ?? null,
                      facing: (y.facing === '0' ? null : y.facing) as GardenFacing | null,
                      position: (y.position === '0' ? null : y.position) as GardenPosition | null,
                      features: y.features as OutdoorSpaceFeature[] ?? [],
                      size: y.size ?? null,
                    })),
                  },
                  land: {
                    deleteMany: {},
                    create: outdoorSpace.land.map((l) => ({
                      name: l.name,
                      description: l.description ?? null,
                      features: l.features as LandFeature[] ?? [],
                      size: l.size ?? null,
                    })),
                  },
                },
              },
            },
          },
        },
      },
      include: {
        property: {
          include: {
            outdoorSpace: {
              include: {
                garden: true,
                yard: true,
                land: true,
              },
            },
          },
        },
      },
    });

    // Invalidate cache after update
    await invalidateListingCache(listingId);

    return result;
  } catch (error) {
    console.log("Error updating draft listing step seven:", error);
    return errorResponse(error, event);
  }
});
