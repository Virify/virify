// imports require .ts extension to run seed
import { faker } from "@faker-js/faker";
import { roundFloat } from "../../../../shared/utils/float.ts";
import { ContactMethod, FurnishedStatus, ListingTier, PrismaClient, RentalPriceType, VerificationLevel, type Listing, type Prisma, RentalAvailabilityStatus, TenureType, OwnershipType, SalePriceType, SaleAvailabilityStatus } from "@prisma/client";
const prisma = new PrismaClient();

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
    ownershipType: faker.helpers.arrayElement(Object.values(OwnershipType)),
    priceType: faker.helpers.arrayElement(Object.values(SalePriceType)),
    availabilityStatus: faker.helpers.arrayElement(Object.values(SaleAvailabilityStatus)),
  }
}

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
      contactMethod: [faker.helpers.arrayElement(Object.values(ContactMethod))],
      viewingOptions: faker.word.words(10),
      verificationLevel: faker.helpers.arrayElement(Object.values(VerificationLevel)),
      rentalListing: {
        create: generateRentalObject(),
      },
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
      contactMethod: [faker.helpers.arrayElement(Object.values(ContactMethod))],
      viewingOptions: faker.word.words(10),
      verificationLevel: faker.helpers.arrayElement(Object.values(VerificationLevel)),
      saleListing: {
        create: generateSaleObject(),
      },
      property: {
        connect: {
          id: propertyId,
        },
      },
    },
  });

  return listing;
};

