import { FurnishedStatus, TenureType } from "~~/layers/database/server/database/prisma/generated/enums";
import type { RentalListingCreateWithoutListingInput, SaleListingCreateWithoutListingInput } from "~~/layers/database/server/database/prisma/generated/models";

/**
 * Step One Listing Options
 */
export const stepOneListingOptions = [
  { value: "sale", key: "For Sale", info: "Further listing details will be specific to Sales" },
  { value: "rent", key: "For Rent", info: "Further listing details will be specific to Rentals" },
];

/**
 * Sale Listing Tenure Options
 */
export const saleListingTenureOptions = Object.values(TenureType).map((element) => {
  return { value: element, key: convertEnumToCapalizedString(element), info: `Tenure type: ${convertEnumToCapalizedString(element).toLowerCase()}` };
});

/**
 * Sale Listing Chain Options
 */
export const saleListingChainOptions = [
  { value: true, key: "Yes", info: "This property is part of a chain" },
  { value: false, key: "No", info: "This property is not part of a chain" },
];

/**
 * Rental Furnished Status Options
 */
export const rentalFurnishedStatusOptions = Object.values(FurnishedStatus).map((element) => {
  return { value: element, key: convertEnumToCapalizedString(element), info: `Furnished status: ${convertEnumToCapalizedString(element).toLowerCase()}` };
});

/**
 * Rental Bills Included Options
 */
export const rentalBillsIncludedOptions = [
  { value: true, key: "Yes", info: "Bills are included in the rent" },
  { value: false, key: "No", info: "Bills are not included in the rent" },
];

/**
 * Create initial sale values from listing (draft or live)
 * @param listing Listing to create initial values from
 * @returns Initial sale listing values
 */
export const createInitialSaleValues = (listing: EditableListing): SaleListingCreateWithoutListingInput => ({
  tenureType: listing.saleListing?.tenureType || null,
  chain: listing.saleListing?.chain || false,
  sharedOwnership: listing.saleListing?.sharedOwnership || false,
  priceType: listing.saleListing?.priceType || null
});

/**
 * Create initial rental values from listing (draft or live)
 * @param listing Listing to create initial values from
 * @returns Initial rental listing values
 */
export const createInitialRentalValues = (listing: EditableListing): RentalListingCreateWithoutListingInput => ({
  deposit: listing.rentalListing?.deposit ?? null,
  holdingDeposit: listing.rentalListing?.holdingDeposit ?? null,
  rentFrequency: listing.rentalListing?.rentFrequency ?? null as any,
  isBillsIncluded: listing.rentalListing?.isBillsIncluded ?? null as any,
  rentalLength:
    typeof listing.rentalListing?.rentalLength === 'string'
      ? (listing.rentalListing?.rentalLength as 'SHORT_TERM' | 'LONG_TERM')
      : typeof listing.rentalListing?.rentalLength === 'number'
        ? (listing.rentalListing?.rentalLength < 6 ? 'SHORT_TERM' : 'LONG_TERM')
        : null,
  furnishedStatus: listing.rentalListing?.furnishedStatus ?? null,
});

/**
 * Set step data for the listing process
 * @param selectedType "sale" | "rent"
 * @param listingData 
 * @returns StepOne
 */
export function setStepData(selectedType: "sale" | "rent", listingData: SaleListingCreateWithoutListingInput | RentalListingCreateWithoutListingInput): StepOne {
  const stepData: StepOne = {};

  if (selectedType === "sale") {
    stepData.saleListing = { ...(listingData as SaleListingCreateWithoutListingInput) };
  } else if (selectedType === "rent") {
    stepData.rentalListing = { ...(listingData as RentalListingCreateWithoutListingInput) };
  }

  return stepData;
}

/**
 * Step One Validation Helpers
 * Clean, reusable validation functions for step one
 */
export const stepOneValidation = {
  /**
   * Check if sale listing data is complete
   * @param saleListing Sale listing data
   * @returns True if all required sale fields are present
   */
  isSaleComplete: (saleListing: SaleListingCreateWithoutListingInput): boolean => {
    return !!(saleListing.tenureType);
  },

  /**
   * Check if rental listing data is complete  
   * @param rentalListing Rental listing data
   * @returns True if all required rental fields are present
   */
  isRentalComplete: (rentalListing: RentalListingCreateWithoutListingInput): boolean => {
    return !!(
      rentalListing.furnishedStatus && 
      rentalListing.isBillsIncluded !== null
    );
  },

  /**
   * Check if step one data is valid based on selected type
   * @param data Step one form data
   * @returns True if the selected listing type is complete
   */
  isStepOneValid: (data: { selectedType: string | null; saleListing: SaleListingCreateWithoutListingInput; rentalListing: RentalListingCreateWithoutListingInput }): boolean => {
    if (data.selectedType === 'sale') return stepOneValidation.isSaleComplete(data.saleListing);
    if (data.selectedType === 'rent') return stepOneValidation.isRentalComplete(data.rentalListing);
    return false;
  },

  /**
   * Check if step one has existing data
   * @param listing Listing (draft or live)
   * @returns True if listing has complete step one data
   */
  hasExistingStepOneData: (listing: EditableListing): boolean => {
    const hasSaleData = listing.saleListing && stepOneValidation.isSaleComplete(listing.saleListing);
    const hasRentalData = listing.rentalListing && stepOneValidation.isRentalComplete(listing.rentalListing);
    return !!(hasSaleData || hasRentalData);
  }
};