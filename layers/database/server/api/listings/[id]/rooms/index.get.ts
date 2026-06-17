import { getOwnershipFilter } from "~~/server/utils/ownership";

/**
 * GET /api/listings/[id]/rooms
 * Returns the real DB room IDs for a live listing's property.
 * Used by Step 9 to ensure room assignment uses actual PKs, not placeholder values.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const id = parseInt(getRouterParam(event, "id") || "0");

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid listing ID" });
  }

  const listing = await prisma.listing.findUnique({
    where: { id, ...getOwnershipFilter(user) },
    include: {
      property: {
        include: {
          bedroomFeatures: { select: { id: true, name: true, roomNumber: true } },
          bathroomFeatures: { select: { id: true, name: true, roomNumber: true } },
          kitchenFeatures: { select: { id: true, name: true, roomNumber: true } },
          reception: { select: { id: true, name: true, roomNumber: true, type: true } },
          otherRoom: { select: { id: true, name: true, roomNumber: true, type: true } },
          outdoorSpace: {
            include: {
              garden: { select: { id: true, name: true } },
              yard: { select: { id: true, name: true } },
              land: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });

  if (!listing) {
    throw createError({ statusCode: 404, statusMessage: "Listing not found" });
  }

  return { property: listing.property };
});
