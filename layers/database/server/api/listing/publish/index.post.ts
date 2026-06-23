import * as z from "zod";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";
import { updateLocationByAddressId } from "~~/layers/database/server/utils/location";

const publishSchema = z.object({
  draftId: z.number().int().positive(),
});

// Comprehensive validation schema for a publishable draft listing
const publishableDraftSchema = z
  .object({
    // Core listing fields (Step 1, 3)
    price: z.number().positive("Price must be greater than 0"),
    listingTier: z.enum(["BASIC", "PREMIUM", "FEATURED"]),

    // Must have either sale or rental listing (Step 1)
    saleListing: z
      .object({
        tenureType: z.enum(["FREEHOLD", "LEASEHOLD", "COMMONHOLD"]),
        priceType: z.enum(["FIXED", "OFFERS_OVER", "GUIDE_PRICE"]).nullable().optional(),
      })
      .nullable()
      .optional(),

    rentalListing: z
      .object({
        isBillsIncluded: z.boolean(),
        furnishedStatus: z
          .enum(["FURNISHED", "UNFURNISHED", "PART_FURNISHED"])
          .nullable()
          .optional(),
        rentFrequency: z.enum(["WEEKLY", "MONTHLY"]).nullable().optional(),
      })
      .nullable()
      .optional(),

    // Property is required
    property: z.object({
      // Step 2: Property basics
      type: z
        .object({
          id: z.number().int().positive(),
        })
        .nullable(),
      classification: z
        .object({
          id: z.number().int().positive(),
        })
        .nullable(),
      constructionType: z.enum(["STANDARD", "NON_STANDARD"]).nullable().optional(),
      yearBuilt: z.string().nullable().optional(),
      size: z.number().positive().nullable().optional(),
      description: z.string().nullable().optional(),
      totalFloors: z.number().int().min(0).nullable().optional(),

      // Step 2: Address (required - now part of Property Basics)
      address: z.object({
        number: z.string().nullable().optional(),
        street: z.string().min(1, "Street is required"),
        city: z.string().min(1, "City is required"),
        postcode: z.string().min(1, "Postcode is required"),
        country: z.string().min(1, "Country is required"),
        lat: z.number(),
        lon: z.number(),
      }),

      // Step 4: Room counts
      numberBedrooms: z.number().int().min(0).nullable().optional(),
      numberBathrooms: z.number().int().min(0).nullable().optional(),

      // Step 9: Media (at least 1 image required, with sortOrder for ordering)
      // Note: image field can be null for video tours/floor plans, so we filter for images with actual image values
      media: z
        .array(
          z.object({
            image: z.string().nullable().optional(),
            sortOrder: z.number().int().min(0).optional(),
          }),
        )
        .refine((mediaArray) => mediaArray.some((m) => m.image && m.image.length > 0), {
          message: "At least one image is required",
        }),
    }),

    // Must have completed all 9 steps (new flow)
    completedSteps: z
      .array(z.number().int().min(1).max(9))
      .length(9, "All 9 steps must be completed"),
  })
  .refine((data) => data.saleListing !== null || data.rentalListing !== null, {
    message: "Either saleListing or rentalListing must be present",
    path: ["saleListing"],
  })
  .refine(
    (data) => data.property?.type !== null && data.property?.classification !== null,
    {
      message: "Property type and classification are required",
      path: ["property", "type"],
    },
  );

/**
 * POST /api/listing/publish
 * Publish a draft listing by migrating it to a real Listing
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);

  try {
    const { draftId } = await readValidatedBody(event, publishSchema.parse);

    // Fetch the draft listing with all its relations
    const draft = await prisma.draftListing.findUnique({
      where: {
        id: draftId,
        userId: user.id, // Ensure the user owns this draft
      },
      include: {
        saleListing: true,
        rentalListing: true,
        property: {
          include: {
            address: true,
            media: true,
            type: true,
            classification: true,
            bedroomFeatures: {
              include: {
                media: true,
              },
            },
            bathroomFeatures: {
              include: {
                media: true,
              },
            },
            kitchenFeatures: {
              include: {
                media: true,
              },
            },
            reception: {
              include: {
                media: true,
              },
            },
            otherRoom: {
              include: {
                media: true,
              },
            },
            outdoorSpace: {
              include: {
                garden: {
                  include: {
                    media: true,
                  },
                },
                yard: {
                  include: {
                    media: true,
                  },
                },
                land: {
                  include: {
                    media: true,
                  },
                },
                media: true,
              },
            },
            parking: true,
            utility: true,
            storageFeatures: true,
            securityFeatures: true,
            energyAndUtilities: true,
            runningCosts: true,
            amenities: true,
            additionalFeatures: true,
            accessibilityFeatures: true,
          },
        },
      },
    });

    if (!draft) {
      return errorResponse(
        createError({
          statusCode: 404,
          statusMessage:
            "Draft listing not found or you don't have permission to publish it",
        }),
        event,
      );
    }

    // Ownership verification gate: USER role must have an APPROVED verification for this specific draft
    const userRole = (user as any).role as string | undefined;
    const isExemptFromVerification = userRole === "ADMIN" || userRole === "AGENT";
    if (!isExemptFromVerification) {
      const ownershipRecord = await prisma.ownershipVerification.findUnique({
        where: { draftListingId: draftId },
        select: { status: true },
      });
      if (!ownershipRecord || ownershipRecord.status !== "APPROVED") {
        return errorResponse(
          createError({
            statusCode: 403,
            statusMessage:
              "Ownership verification required. Please submit and get your ownership documents approved before publishing.",
          }),
          event,
        );
      }
    }

    // Comprehensive validation using Zod schema
    try {
      publishableDraftSchema.parse(draft);
    } catch (validationError: any) {
      console.error(
        "Draft listing validation failed:",
        JSON.stringify(validationError, null, 2),
      );

      // Zod errors are in the `issues` property, not `errors`
      const issues = validationError.issues || validationError.errors || [];

      const errorMessages =
        issues.map((err: any) => `${err.path.join(".")}: ${err.message}`).join(", ") ||
        "Draft listing validation failed - no details available";

      console.error("Formatted error messages:", errorMessages);
      console.error("Issues:", issues);

      return errorResponse(
        createError({
          statusCode: 400,
          statusMessage: `Cannot publish listing: ${errorMessages}`,
          data: issues,
        }),
        event,
      );
    }

    // Additional safety checks for required fields before publishing
    if (!draft.propertyId) {
      return errorResponse(
        createError({
          statusCode: 400,
          statusMessage: "Property is required to publish a listing",
        }),
        event,
      );
    }

    // Create the published listing in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the main Listing
      const listing = await tx.listing.create({
        data: {
          price: draft.price!,
          moveInDate: draft.moveInDate,
          listingTier: draft.listingTier,
          listingStartDate: draft.listingStartDate,
          listingEndDate: draft.listingEndDate,
          viewingOptions: draft.viewingOptions,
          verificationLevel: draft.verificationLevel,
          userId: draft.userId,
          propertyId: draft.propertyId!,
          published: true,
          publishedAt: new Date(),
        },
      });

      // Migrate RentalListing if it exists
      if (draft.rentalListing) {
        await tx.rentalListing.update({
          where: { id: draft.rentalListing.id },
          data: {
            listingId: listing.id,
            draftListingId: null, // Unlink from draft
          },
        });
      }

      // Migrate SaleListing if it exists
      if (draft.saleListing) {
        await tx.saleListing.update({
          where: { id: draft.saleListing.id },
          data: {
            listingId: listing.id,
            draftListingId: null, // Unlink from draft
          },
        });
      }

      // Note: Property is already connected via propertyId in Listing
      // No need to update property separately as there's no draftListingId field

      // Delete the draft listing (cascade will handle unlinking)
      await tx.draftListing.delete({
        where: { id: draftId },
      });

      return listing;
    });

    // Bust all relevant caches: aggregates (badge counts), my-listings page, draft-listings page
    await Promise.all([
      invalidateAggregatesCache(user.id as number),
      invalidateMyListingsCache(user.id as number),
      invalidateDraftListingsCache(user.id as number),
    ]);

    // Send WebSocket aggregate updates: draft removed, listing added
    try {
      const { sendMessage, createAggregateUpdateMessage } = useWebSocketServer();
      sendMessage(
        createAggregateUpdateMessage("draftListings", "remove", user.id as number),
      );
      sendMessage(createAggregateUpdateMessage("listings", "add", user.id as number));
    } catch {
      // Non-critical
    }

    // Fire-and-forget: fetch real amenities from MapTiler and persist them
    // Done after the response so it doesn't block the publish flow
    const address = draft.property?.address;
    if (address?.lat && address?.lon && draft.propertyId) {
      // Safety-net: ensure PostGIS geometry column is set so the listing appears in spatial search.
      // This is a no-op if step 2 already wrote the geometry; it's cheap and idempotent.
      updateLocationByAddressId(address.id, address.lon, address.lat).catch((err) =>
        console.error("[Publish] Failed to update PostGIS location:", err),
      );

      const { findNearbyAmenities } = useMapSearch();
      findNearbyAmenities(address.lat, address.lon)
        .then((amenitiesData) => {
          if (amenitiesData.length > 0) {
            return createAmenitiesForProperty(draft.propertyId!, amenitiesData);
          }
        })
        .catch((err) => console.error("[Publish] Failed to fetch/save amenities:", err));
    }

    return {
      success: true,
      listingId: result.id,
      message: "Listing published successfully",
    };
  } catch (error) {
    console.error("Error publishing listing:", error);
    return errorResponse(error, event);
  }
});
