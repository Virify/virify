import * as z from "zod";
import { GardenFacing, GardenPosition } from "~~/layers/database/server/database/prisma/generated/enums";

const stepSevenSchema = z.object({
  listingId: z.number().int().positive(),
  property: z.object({
    outdoorSpace: z.object({
      description: z.string().max(500).nullable().optional(),
      totalArea: z.coerce.number().min(0).nullable().optional(),
      hasGarden: z.boolean().optional(),
      hasYard: z.boolean().optional(),
      hasLand: z.boolean().optional(),
      // OutdoorSpace boolean features
      sunTerrace: z.boolean().optional(),
      terrace: z.boolean().optional(),
      balcony: z.boolean().optional(),
      patio: z.boolean().optional(),
      separateParcel: z.boolean().optional(),
      shed: z.boolean().optional(),
      summerHouse: z.boolean().optional(),
      gardenOffice: z.boolean().optional(),
      pool: z.boolean().optional(),
      garden: z.array(
        z.object({
          name: z.string().max(100),
          description: z.string().max(500).nullable().optional(),
          facing: z.enum(Object.values(GardenFacing) as [string, ...string[]]).nullable().optional(),
          position: z.enum(Object.values(GardenPosition) as [string, ...string[]]).nullable().optional(),
          sunTerrace: z.boolean().optional(),
          terrace: z.boolean().optional(),
          balcony: z.boolean().optional(),
          patio: z.boolean().optional(),
          separateParcel: z.boolean().optional(),
          shed: z.boolean().optional(),
          summerHouse: z.boolean().optional(),
          gardenOffice: z.boolean().optional(),
          pool: z.boolean().optional(),
          size: z.coerce.number().min(0).nullable().optional(),
          additionalDetails: z.boolean().optional(),
        })
      ),
      yard: z.array(
        z.object({
          name: z.string().max(100),
          description: z.string().max(500).nullable().optional(),
          facing: z.enum(Object.values(GardenFacing) as [string, ...string[]]).nullable().optional(),
          position: z.enum(Object.values(GardenPosition) as [string, ...string[]]).nullable().optional(),
          sunTerrace: z.boolean().optional(),
          terrace: z.boolean().optional(),
          balcony: z.boolean().optional(),
          patio: z.boolean().optional(),
          separateParcel: z.boolean().optional(),
          shed: z.boolean().optional(),
          summerHouse: z.boolean().optional(),
          gardenOffice: z.boolean().optional(),
          pool: z.boolean().optional(),
          size: z.coerce.number().min(0).nullable().optional(),
          additionalDetails: z.boolean().optional(),
        })
      ),
      land: z.array(
        z.object({
          name: z.string().max(100),
          description: z.string().max(500).nullable().optional(),
          separateParcel: z.boolean().optional(),
          woodland: z.boolean().optional(),
          paddock: z.boolean().optional(),
          stables: z.boolean().optional(),
          tennisCourt: z.boolean().optional(),
          orchard: z.boolean().optional(),
          pond: z.boolean().optional(),
          outbuilding: z.boolean().optional(),
          size: z.coerce.number().min(0).nullable().optional(),
          additionalDetails: z.boolean().optional(),
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
                  // OutdoorSpace boolean features
                  sunTerrace: outdoorSpace.sunTerrace ?? false,
                  terrace: outdoorSpace.terrace ?? false,
                  balcony: outdoorSpace.balcony ?? false,
                  patio: outdoorSpace.patio ?? false,
                  separateParcel: outdoorSpace.separateParcel ?? false,
                  shed: outdoorSpace.shed ?? false,
                  summerHouse: outdoorSpace.summerHouse ?? false,
                  gardenOffice: outdoorSpace.gardenOffice ?? false,
                  pool: outdoorSpace.pool ?? false,
                  garden: {
                    create: outdoorSpace.garden.map((g) => ({
                      name: g.name,
                      description: g.description ?? null,
                      facing: g.facing as GardenFacing | null,
                      position: g.position as GardenPosition | null,
                      sunTerrace: g.sunTerrace ?? false,
                      terrace: g.terrace ?? false,
                      balcony: g.balcony ?? false,
                      patio: g.patio ?? false,
                      separateParcel: g.separateParcel ?? false,
                      shed: g.shed ?? false,
                      summerHouse: g.summerHouse ?? false,
                      gardenOffice: g.gardenOffice ?? false,
                      pool: g.pool ?? false,
                      size: g.size ?? null,
                      additionalDetails: g.additionalDetails ?? false,
                    })),
                  },
                  yard: {
                    create: outdoorSpace.yard.map((y) => ({
                      name: y.name,
                      description: y.description ?? null,
                      facing: y.facing as GardenFacing | null,
                      position: y.position as GardenPosition | null,
                      sunTerrace: y.sunTerrace ?? false,
                      terrace: y.terrace ?? false,
                      balcony: y.balcony ?? false,
                      patio: y.patio ?? false,
                      separateParcel: y.separateParcel ?? false,
                      shed: y.shed ?? false,
                      summerHouse: y.summerHouse ?? false,
                      gardenOffice: y.gardenOffice ?? false,
                      pool: y.pool ?? false,
                      size: y.size ?? null,
                      additionalDetails: y.additionalDetails ?? false,
                    })),
                  },
                  land: {
                    create: outdoorSpace.land.map((l) => ({
                      name: l.name,
                      description: l.description ?? null,
                      separateParcel: l.separateParcel ?? false,
                      woodland: l.woodland ?? false,
                      paddock: l.paddock ?? false,
                      stables: l.stables ?? false,
                      tennisCourt: l.tennisCourt ?? false,
                      orchard: l.orchard ?? false,
                      pond: l.pond ?? false,
                      outbuilding: l.outbuilding ?? false,
                      size: l.size ?? null,
                      additionalDetails: l.additionalDetails ?? false,
                    })),
                  },
                },
                update: {
                  description: outdoorSpace.description ?? null,
                  totalArea: outdoorSpace.totalArea ?? null,
                  // OutdoorSpace boolean features
                  sunTerrace: outdoorSpace.sunTerrace ?? false,
                  terrace: outdoorSpace.terrace ?? false,
                  balcony: outdoorSpace.balcony ?? false,
                  patio: outdoorSpace.patio ?? false,
                  separateParcel: outdoorSpace.separateParcel ?? false,
                  shed: outdoorSpace.shed ?? false,
                  summerHouse: outdoorSpace.summerHouse ?? false,
                  gardenOffice: outdoorSpace.gardenOffice ?? false,
                  pool: outdoorSpace.pool ?? false,
                  garden: {
                    deleteMany: {},
                    create: outdoorSpace.garden.map((g) => ({
                      name: g.name,
                      description: g.description ?? null,
                      facing: g.facing as GardenFacing | null,
                      position: g.position as GardenPosition | null,
                      sunTerrace: g.sunTerrace ?? false,
                      terrace: g.terrace ?? false,
                      balcony: g.balcony ?? false,
                      patio: g.patio ?? false,
                      separateParcel: g.separateParcel ?? false,
                      shed: g.shed ?? false,
                      summerHouse: g.summerHouse ?? false,
                      gardenOffice: g.gardenOffice ?? false,
                      pool: g.pool ?? false,
                      size: g.size ?? null,
                      additionalDetails: g.additionalDetails ?? false,
                    })),
                  },
                  yard: {
                    deleteMany: {},
                    create: outdoorSpace.yard.map((y) => ({
                      name: y.name,
                      description: y.description ?? null,
                      facing: y.facing as GardenFacing | null,
                      position: y.position as GardenPosition | null,
                      sunTerrace: y.sunTerrace ?? false,
                      terrace: y.terrace ?? false,
                      balcony: y.balcony ?? false,
                      patio: y.patio ?? false,
                      separateParcel: y.separateParcel ?? false,
                      shed: y.shed ?? false,
                      summerHouse: y.summerHouse ?? false,
                      gardenOffice: y.gardenOffice ?? false,
                      pool: y.pool ?? false,
                      size: y.size ?? null,
                      additionalDetails: y.additionalDetails ?? false,
                    })),
                  },
                  land: {
                    deleteMany: {},
                    create: outdoorSpace.land.map((l) => ({
                      name: l.name,
                      description: l.description ?? null,
                      separateParcel: l.separateParcel ?? false,
                      woodland: l.woodland ?? false,
                      paddock: l.paddock ?? false,
                      stables: l.stables ?? false,
                      tennisCourt: l.tennisCourt ?? false,
                      orchard: l.orchard ?? false,
                      pond: l.pond ?? false,
                      outbuilding: l.outbuilding ?? false,
                      size: l.size ?? null,
                      additionalDetails: l.additionalDetails ?? false,
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

    return result;
  } catch (error) {
    console.log("Error updating draft listing step seven:", error);
    return errorResponse(error, event);
  }
});
