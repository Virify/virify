import * as z from "zod";

const addressSchema = z.object({
  draftId: z.number().int().positive(),
  property: z.object({
    address: z.object({
      number: z.string().max(20),
      flat: z.string().max(20).nullable().optional(),
      street: z.string().max(50),
      city: z.string().max(100),
      postcode: z.string().max(20),
      county: z.string().max(100).nullable().optional(),
      country: z.string().max(100).optional(),
      fullAddress: z.string().max(300),
      lat: z.number(),
      lon: z.number()
    }),
  }),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  try {
    const { draftId, property, } = await readValidatedBody(event, addressSchema.parse);

    // Map incoming payload to Address model fields
    const addressData = {
      ...property.address,
    };

    // insert or update the address record associated with the draft listing
    const result = await prisma.draftListing.update({
      where: { id: draftId },
      data: {
        property: {
          update: {
            address: {
              upsert: {
                update: addressData,
                create: addressData,
              },
            },
          },
        },
      },
      include: {
        property: {
          include: {
            address: true,
          },
        },
      },
    });

    const address = result.property?.address;
    
    /**
     * If we have latitude and longitude, update the PostGIS location
     */
    if (address && address.lat && address.lon) {
      const { id, lat, lon } = address;
      await updateLocationByAddressId(id, lon, lat);
    }
    
    return result;
  } catch (error) {
    console.log("Error updating draft listing:", error);
    return errorResponse(error, event);
  }
});
