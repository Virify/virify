import type { PropertyWithRelations } from "~~/shared/types/property";
import { getLocationByAddressId } from "../../utils/location";

export default defineEventHandler(async (event): Promise<PropertyWithRelations & any> => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing property ID",
    });
  }
  try {
    const property = await prisma.property.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        address: true,
        media: true,
        type: true,
        classification: true,
        bedroomFeatures: true,
        bathroomFeatures: true,
        parking: true,
      },
    });

    if (!property) {
      throw createError({
        statusCode: 404,
        statusMessage: "Property not found",
      });
    }

    const location = await getLocationByAddressId(property?.addressId as number);

    return {
      property: property,
      location: location,
    }
  } catch (error) {
    throw error;
  }
});
