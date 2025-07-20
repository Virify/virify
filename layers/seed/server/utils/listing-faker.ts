// imports require .ts extension to run seed
import { faker } from "@faker-js/faker";
import type { Prisma, Listing } from "~~/layers/database/server/database/prisma/generated/client";
import { RentalPriceType, FurnishedStatus, RentalAvailabilityStatus, TenureType, SalePriceType, SaleAvailabilityStatus, ListingTier, VerificationLevel } from "~~/layers/database/server/database/prisma/generated/enums";
import { roundFloat } from "~~/shared/utils/numbers";
import { prisma } from "~~/layers/database/server/utils/prisma-client";
/**
 * Generate a random date between 1, 3, 7, and 14 days ago.
 */
export const generateRandomDate = ()  => {
  const daysOptions = [1, 3, 7, 14];
  const randomDays = daysOptions[Math.floor(Math.random() * daysOptions.length)];
  return faker.date.recent({ days: randomDays });
}

/**
 * Generate a random RentalListing object
 * 
 * @returns RentalListing
 */
export const generateRentalObject = (): Prisma.RentalListingCreateWithoutListingInput => {
  return {
    deposit: roundFloat(faker.number.float({ min: 1000, max: 10000 }), 2),
    holdingDeposit: roundFloat(faker.number.float({ min: 1000, max: 10000 }), 2),
    rentFrequency: faker.helpers.arrayElement(Object.values(RentalPriceType)),
    isBillsIncluded: faker.datatype.boolean(),
    rentalLength: faker.number.int({ min: 1, max: 48 }),
    furnishedStatus: faker.helpers.arrayElement(Object.values(FurnishedStatus)),
    availabilityStatus: faker.helpers.arrayElement(Object.values(RentalAvailabilityStatus)),
  };
};

/**
 * Generate a random SaleListing object
 * 
 * @returns SaleListing
 */
export const generateSaleObject = (): Prisma.SaleListingCreateWithoutListingInput => {
  return {
    tenureType: faker.helpers.arrayElement(Object.values(TenureType)),
    chain: faker.datatype.boolean(),
    sharedOwnership: faker.datatype.boolean(),
    priceType: faker.helpers.arrayElement(Object.values(SalePriceType)),
    availabilityStatus: faker.helpers.arrayElement(Object.values(SaleAvailabilityStatus)),
  }
}

const generateRandomViews = () => {
  return faker.number.int({ min: 0, max: 50 });
};

/**
 * Generate random listing views for a listing
 * 
 * @param listingId ID of the listing to create views for
 * @returns Promise resolving to the number of views created
 */
export const generateListingViews = async (listingId: number): Promise<number> => {
  const viewCount = generateRandomViews();
  const views = [];
  
  // Generate views spread out over the past 30 days
  for (let i = 0; i < viewCount; i++) {
    const daysAgo = faker.number.int({ min: 0, max: 30 });
    const viewDate = new Date();
    viewDate.setDate(viewDate.getDate() - daysAgo);
    
    views.push({
      listingId,
      sessionId: faker.string.uuid(),
      createdAt: viewDate
    });
  }
  
  // Create the views in batches for better performance
  const batchSize = 100;
  for (let i = 0; i < views.length; i += batchSize) {
    const batch = views.slice(i, i + batchSize);
    await prisma.listingView.createMany({
      data: batch
    });
  }
  
  return viewCount;
};

/**
 * Gnerate a full random SALE Listing object
 *
 * @param propertyId number
 * @returns Listing
 */
export const generateRentalListing = async (propertyId: number): Promise<Prisma.ListingCreateInput> => {
  const listing: Listing = await prisma.listing.create({
    data: {
      title: faker.word.words(10),
      description: faker.word.words(20),
      price: roundFloat(faker.number.float({ min: 300, max: 3000 }), 2),
      moveInDate: faker.date.future(),
      listingTier: faker.helpers.arrayElement(Object.values(ListingTier)),
      listingStartDate: new Date(),
      listingEndDate: faker.date.future(),
      viewingOptions: faker.word.words(10),
      verificationLevel: faker.helpers.arrayElement(Object.values(VerificationLevel)),
      rentalListing: {
        create: generateRentalObject(),
      },
      published: true,
      publishedAt: generateRandomDate(),
      property: {
        connect: {
          id: propertyId,
        },
      },
      user: {
        connect: {
          id: 1, // admin user
        },
      },
    },
  });

  // Generate random views for this listing
  const viewsGenerated = await generateListingViews(listing.id);
  console.log(`Generated ${viewsGenerated} views for rental listing ${listing.id}`);

  return listing;
};

/**
 * Gnerate a full random RENTAL Listing object
 *
 * @param propertyId number
 * @returns Listing
 */
export const generateSaleListing = async (propertyId: number): Promise<Prisma.ListingCreateInput> => {
  const listing: Listing = await prisma.listing.create({
    data: {
      title: faker.word.words(10),
      description: faker.word.words(20),
      price: roundFloat(faker.number.float({ min: 100000, max: 1000000 }), 2),
      moveInDate: faker.date.future(),
      listingTier: faker.helpers.arrayElement(Object.values(ListingTier)),
      listingStartDate: new Date(),
      listingEndDate: faker.date.future(),
      viewingOptions: faker.word.words(10),
      verificationLevel: faker.helpers.arrayElement(Object.values(VerificationLevel)),
      saleListing: {
        create: generateSaleObject(),
      },
      published: true,
      publishedAt: generateRandomDate(),
      property: {
        connect: {
          id: propertyId,
        },
      },
      user: {
        connect: {
          id: 1, // admin user
        },
      }
    },
  });

  // Generate random views for this listing
  const viewsGenerated = await generateListingViews(listing.id);
  console.log(`Generated ${viewsGenerated} views for sale listing ${listing.id}`);

  return listing;
};

