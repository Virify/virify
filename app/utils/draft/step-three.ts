import { RentalPriceType, SalePriceType } from "~~/layers/database/server/database/prisma/generated/enums";

/**
 * Creates initial values for step two of the draft listing process.
 * @param draftListing Draft listing to create initial values from
 * @returns Initial values for step three
 */
export const createInitialStepThreeValues = (draftListing: DraftListingWithFullPayload): StepThree => {
  console.log("Draft Listing Property:", draftListing);
  return {
    price: draftListing.price || null,
    ...(draftListing.rentalListing && {
      rentalListing: {
        deposit: draftListing.rentalListing.deposit || null,
        holdingDeposit: draftListing.rentalListing.holdingDeposit || null,
        rentFrequency: draftListing.rentalListing.rentFrequency || null,
        rentalLength: draftListing.rentalListing.rentalLength || null,
      },
    }),
    ...(draftListing.saleListing && {
      saleListing: {
        priceType: draftListing.saleListing.priceType || null,
      },
    }),
  };
};

/**
 * Sale Price Type Options
 */
export const salePriceTypeOptions = Object.values(SalePriceType).map((element) => ({
  value: element,
  key: convertEnumToCapalizedString(element),
  info: `Set the sale price type as ${convertEnumToCapalizedString(element).toLowerCase()}`
}));

/**
 * Rental Price Type Options
 */
export const rentalPriceTypeOptions = Object.values(RentalPriceType).map((element) => ({
  value: element,
  key: convertEnumToCapalizedString(element),
  info: `Set the rental frequency as ${convertEnumToCapalizedString(element).toLowerCase()}`
}));
