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

/**
 * Step Three Validation Helpers
 * Clean, reusable validation functions for step three
 */
export const stepThreeValidation = {
  /**
   * Check if rental listing price data is valid
   * @param rentalListing Rental listing data
   * @returns True if all required rental price fields are present
   */
  isRentalPriceValid: (rentalListing: any): boolean => {
    return !!(
      rentalListing?.deposit &&
      rentalListing?.holdingDeposit &&
      rentalListing?.rentFrequency &&
      rentalListing?.rentalLength
    );
  },

  /**
   * Check if sale listing price data is valid
   * @param saleListing Sale listing data
   * @returns True if all required sale price fields are present
   */
  isSalePriceValid: (saleListing: any): boolean => {
    return !!(saleListing?.priceType);
  },

  /**
   * Check if step three data is valid
   * @param data Step three form data
   * @param draft Draft listing to check type
   * @returns True if all required fields are present
   */
  isStepThreeValid: (data: StepThree, draft: DraftListingWithFullPayload): boolean => {
    if (!data.price) return false;
    
    if (draft.rentalListing) {
      return stepThreeValidation.isRentalPriceValid(data.rentalListing);
    }
    
    if (draft.saleListing) {
      return stepThreeValidation.isSalePriceValid(data.saleListing);
    }
    
    return false;
  },

  /**
   * Check if draft has existing step three data
   * @param draft Draft listing
   * @returns True if draft has complete step three data
   */
  hasExistingStepThreeData: (draft: DraftListingWithFullPayload): boolean => {
    if (!draft.price) return false;
    
    if (draft.rentalListing) {
      return stepThreeValidation.isRentalPriceValid(draft.rentalListing);
    }
    
    if (draft.saleListing) {
      return stepThreeValidation.isSalePriceValid(draft.saleListing);
    }
    
    return false;
  }
};
