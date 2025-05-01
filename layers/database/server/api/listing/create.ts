import { AvailabilityStatus, ListingCategory, ListingTier, ListingType, PriceType } from "@prisma/client";

export default defineEventHandler(async (event) => {

  const listing = await prisma.listing.create({
    data: {
      title: "Test Listing",
      description: "This is a test listing",
      price: 100000,
      priceType: PriceType.GUIDE_PRICE,
      listingType: ListingType.FOR_SALE,
      listingCategory: ListingCategory.SALE,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      listingTier: ListingTier.BASIC,
      property: {
        connect: {
          id: 1,
        }
      }
    },
  });

  return listing;
});
