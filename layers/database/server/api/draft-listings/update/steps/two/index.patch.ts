import { z } from "zod";
import { step2Schema } from "~~/shared/utils/listing-step2-schema";

/**
 * Step 2: Property Details API Endpoint
 * 
 * Works for BOTH draft listings (draftId) and live listings (listingId)
 */

const stepDataSchema = step2Schema.extend({
  draftId: z.number().int().positive().optional(),
  listingId: z.number().int().positive().optional(),
}).refine(
  (data) => data.draftId !== undefined || data.listingId !== undefined,
  { message: "Either draftId or listingId must be provided" }
);

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  
  try {
    const body = await readBody(event);
    const { draftId, listingId, property } = stepDataSchema.parse(body);

    // First, handle address upsert if provided
    let addressId: number | undefined;
    if (property.address && property.address.street && property.address.city && property.address.postcode) {
      const addressData = {
        number: property.address.number,
        flat: property.address.flat,
        name: property.address.name,
        street: property.address.street,
        city: property.address.city,
        postcode: property.address.postcode,
        country: property.address.country || 'United Kingdom',
        locality: property.address.locality,
        county: property.address.county,
        district: property.address.district,
        fullAddress: property.address.fullAddress,
        lat: property.address.lat,
        lon: property.address.lon,
      };

      // Upsert address based on unique constraint
      const address = await prisma.address.upsert({
        where: {
          number_street_city_postcode_country: {
            number: addressData.number || '',
            street: addressData.street,
            city: addressData.city,
            postcode: addressData.postcode,
            country: addressData.country || 'United Kingdom',
          },
        },
        update: addressData,
        create: addressData,
      });
      addressId = address.id;
    }

    const propertyUpdate = {
      upsert: {
        update: {
          type: { connect: { id: property.type } },
          classification: { connect: { id: property.classification } },
          constructionType: property.constructionType || null,
          yearBuilt: property.yearBuilt && property.yearBuilt !== 0 ? String(property.yearBuilt) : null,
          size: property.size || null,
          description: property.description,
          totalFloors: property.totalFloors,
          ...(addressId ? { address: { connect: { id: addressId } } } : {}),
        },
        create: {
          type: { connect: { id: property.type } },
          classification: { connect: { id: property.classification } },
          constructionType: property.constructionType || null,
          yearBuilt: property.yearBuilt && property.yearBuilt !== 0 ? String(property.yearBuilt) : null,
          size: property.size || null,
          description: property.description,
          totalFloors: property.totalFloors,
          ...(addressId ? { address: { connect: { id: addressId } } } : {}),
        },
      },
    };

    // LIVE LISTING - update Listing table
    if (listingId) {
      const result = await prisma.listing.update({
        where: { id: listingId, userId: user.id },
        data: { property: propertyUpdate },
        include: {
          property: {
            include: {
              address: true,
            },
          },
        },
      });

      // Invalidate listing detail cache and my-listings page cache
      const storage = useStorage('cache:listing');
      await Promise.all([
        storage.removeItem(`listing:${listingId}`),
        invalidateMyListingsCache(user.id as number),
      ]);

      return result;
    }

    // DRAFT LISTING - update DraftListing table with completedSteps
    const currentDraft = await prisma.draftListing.findUnique({
      where: { id: draftId },
      select: { completedSteps: true },
    });

    const draftResult = await prisma.draftListing.update({
      where: { id: draftId!, userId: user.id },
      data: {
        // Add step 2 to completedSteps if not already there
        ...(currentDraft && !currentDraft.completedSteps.includes(2) ? { completedSteps: { push: 2 } } : {}),
        property: propertyUpdate,
      },
      include: {
        property: {
          include: {
            address: true,
          },
        },
      },
    });
    await invalidateDraftListingsCache(user.id as number);
    return draftResult;
  } catch (error) {
    return errorResponse(error, event);
  }
});
