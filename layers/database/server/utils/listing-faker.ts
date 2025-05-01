import { faker } from "@faker-js/faker";
import { roundFloat } from "../../../../shared/utils/float.ts";
import { AvailabilityStatus, ContactMethod, ListingCategory, ListingTier, ListingType, PriceType, PrismaClient, VerificationLevel, type Listing, type Prisma } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Gnerate a full random Listing object
 *
 * @param propertyId number
 * @returns Listing
 */
export const generateListing = async (propertyId: number): Promise<Prisma.ListingCreateInput> => {
  const listing: Listing = await prisma.listing.create({
    data: {
      title: faker.word.words(10),
      description: faker.word.words(20),
      price: roundFloat(faker.number.float({ min: 100000, max: 1000000 }), 2),
      priceType: faker.helpers.arrayElement(Object.values(PriceType)),
      listingType: faker.helpers.arrayElement(Object.values(ListingType)),
      listingCategory: faker.helpers.arrayElement(Object.values(ListingCategory)),
      listingCosts: {
        create: generateListingCosts(),
      },
      availabilityStatus: faker.helpers.arrayElement(Object.values(AvailabilityStatus)),
      moveInDate: faker.date.future(),
      listingTier: faker.helpers.arrayElement(Object.values(ListingTier)),
      listingStartDate: new Date(),
      listingEndDate: faker.date.future(),
      contactMethod: [faker.helpers.arrayElement(Object.values(ContactMethod))],
      viewingOptions: faker.word.words(10),
      verificationLevel: faker.helpers.arrayElement(Object.values(VerificationLevel)),
      property: {
        connect: {
          id: propertyId,
        },
      },
    },
  });

  return listing;
};

/**
 * Generate a random Listing Costs object
 *
 * @returns ListingCosts
 */
export const generateListingCosts = (): Prisma.ListingCostsCreateWithoutListingInput => {
  return {
    holdingDeposit: faker.number.int({ min: 100, max: 500 }),
    tenancyDeposit: faker.number.int({ min: 1000, max: 5000 }),
    upfrontCosts: faker.number.int({ min: 1000, max: 5000 }),
    description: faker.word.words(10),
  };
};
