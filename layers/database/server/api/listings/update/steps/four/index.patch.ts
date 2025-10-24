import * as z from "zod";

const addressSchema = z.object({
  listingId: z.number().int().positive(),
  property: z.object({
    address: z.object({
      number: z.string().max(20),
      flat: z.string().max(20).nullable().optional(),
      name: z.string().max(100).nullable().optional(),
      street: z.string().max(50),
      city: z.string().max(100),
      locality: z.string().max(100).nullable().optional(),
      district: z.string().max(100).nullable().optional(),
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
  const { user } = await requireUserSession(event);
  
  try {
    const { listingId, property } = await readValidatedBody(event, addressSchema.parse);

    // Map incoming payload to Address model fields
    const addressData = {
      ...property.address,
    };
    
    const result = await prisma.$transaction(async (tx) => {
      // First, try to find an existing address with the same unique fields
      const existingAddress = await tx.address.findUnique({
        where: {
          number_street_city_postcode_country: {
            number: addressData.number || '',
            street: addressData.street,
            city: addressData.city,
            postcode: addressData.postcode,
            country: addressData.country || 'UK'
          }
        }
      });

      let addressId: number;

      if (existingAddress) {
        // Use the existing address
        addressId = existingAddress.id;
        
        // Optionally update the existing address with new data (like lat/lon if provided)
        if (addressData.lat || addressData.lon || addressData.fullAddress) {
          await tx.address.update({
            where: { id: existingAddress.id },
            data: {
              lat: addressData.lat || existingAddress.lat,
              lon: addressData.lon || existingAddress.lon,
              fullAddress: addressData.fullAddress || existingAddress.fullAddress,
            }
          });
        }
      } else {
        // Create a new address
        const newAddress = await tx.address.create({
          data: addressData
        });
        addressId = newAddress.id;
      }

      // Update the property to link to the address (existing or new)
      return await tx.listing.update({
        where: { id: listingId, userId: user.id },
        data: {
          property: {
            update: {
              addressId: addressId
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
    });

    const address = result.property?.address;
    
    /**
     * If we have latitude and longitude, update the PostGIS location
     * Note: This is done outside the transaction as it's a separate operation
     */
    if (address && address.lat && address.lon) {
      const { id, lat, lon } = address;
      await updateLocationByAddressId(id, lon, lat);
    }
    
    return result;
  } catch (error) {
    return errorResponse(error, event);
  }
});
