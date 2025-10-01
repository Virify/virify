import * as z from "zod";
import { GardenFacing, GardenPosition } from "~~/layers/database/server/database/prisma/generated/enums";

const stepSevenSchema = z.object({
  draftId: z.number().int().positive(),
  property: z.object({
    outdoorSpace: z.object({
      description: z.string().max(500).nullable().optional(),
      totalGardenSize: z.coerce.number().min(0).nullable().optional(),
      totalLandSize: z.coerce.number().min(0).nullable().optional(),
      garden: z.array(
        z.object({
          name: z.string().max(100),
          description: z.string().max(500).nullable().optional(),
          facing: z.enum(Object.values(GardenFacing)),
          position: z.enum(Object.values(GardenPosition)),
          sunTerrace: z.boolean().optional(),
          terrace: z.boolean().optional(),
          balcony: z.boolean().optional(),
          patio: z.boolean().optional(),
          separateParcel: z.boolean().optional(),
          shed: z.boolean().optional(),
          summerHouse: z.boolean().optional(),
          gardenOffice: z.boolean().optional(),
          pool: z.boolean().optional(),
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
        })
      ),
    }),
  }),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  
  try {
    const { draftId, property } = await readValidatedBody(event, stepSevenSchema.parse);

    const { outdoorSpace } = property;

    const result = await prisma.draftListing.update({
      where: { id: draftId, userId: user.id },
      data: {
        property: {
          update: {
            outdoorSpace: {
              upsert: {
                create: {
                  description: outdoorSpace.description ?? null,
                  totalGardenSize: outdoorSpace.totalGardenSize ?? null,
                  totalLandSize: outdoorSpace.totalLandSize ?? null,
                  garden: {
                    create: outdoorSpace.garden.map((g) => ({
                      name: g.name,
                      description: g.description ?? null,
                      facing: g.facing,
                      position: g.position,
                      sunTerrace: g.sunTerrace ?? false,
                      terrace: g.terrace ?? false,
                      balcony: g.balcony ?? false,
                      patio: g.patio ?? false,
                      separateParcel: g.separateParcel ?? false,
                      shed: g.shed ?? false,
                      summerHouse: g.summerHouse ?? false,
                      gardenOffice: g.gardenOffice ?? false,
                      pool: g.pool ?? false,
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
                    })),
                  },
                },
                update: {
                  description: outdoorSpace.description ?? null,
                  totalGardenSize: outdoorSpace.totalGardenSize ?? null,
                  totalLandSize: outdoorSpace.totalLandSize ?? null,
                  garden: {
                    deleteMany: {},
                    create: outdoorSpace.garden.map((g) => ({
                      name: g.name,
                      description: g.description ?? null,
                      facing: g.facing,
                      position: g.position,
                      sunTerrace: g.sunTerrace ?? false,
                      terrace: g.terrace ?? false,
                      balcony: g.balcony ?? false,
                      patio: g.patio ?? false,
                      separateParcel: g.separateParcel ?? false,
                      shed: g.shed ?? false,
                      summerHouse: g.summerHouse ?? false,
                      gardenOffice: g.gardenOffice ?? false,
                      pool: g.pool ?? false,
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
