import type { AddressLocation } from "~~/shared/types/location";
import { getLocationByAddressId } from "../../utils/location";
import type { ListingWithProperty } from "~~/shared/types/listing";

export default defineEventHandler(async (event): Promise<ListingWithProperty> => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing Listing ID",
    });
  }
  try {
    const listing = await prisma.listing.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        property: {
          include: {
            address: true,
            media: true,
            type: true,
            classification: true,
            bedroomFeatures: true,
            bathroomFeatures: true,
            parking: true,
          },
        },
      },
    });

    if (!listing) {
      throw createError({
        statusCode: 404,
        statusMessage: "listing not found",
      });
    }

    const location: AddressLocation = await getLocationByAddressId(listing?.property?.addressId as number);

    return {
      ...listing,
    };
  } catch (error) {
    throw error;
  }
});
