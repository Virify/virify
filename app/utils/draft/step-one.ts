import { FurnishedStatus, RentalAvailabilityStatus, SaleAvailabilityStatus, TenureType } from "~~/layers/database/server/database/prisma/generated/enums";
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
 * Sale Listing Shared Ownership Options
 */
export const saleSharedOwnershipOptions = Object.values([true, false]).map((value) => {
  return { value: value, key: value ? "Shared Ownership" : "No Shared Ownership", info: value ? "The property is available for shared ownership." : "The property is not available for shared ownership." };
});

/**
 * Sale Listing Price Type Options
 */
export const saleListingAvailabilityOptions = Object.values(SaleAvailabilityStatus).map((element) => {
  return { value: element, key: convertEnumToCapalizedString(element), info: `Your property availability is ${convertEnumToCapalizedString(element).toLowerCase()}` };
});

/**
 * Rental Furnished Status Options
 */
export const rentalFurnishedStatusOptions = Object.values(FurnishedStatus).map((element) => {
  return { value: element, key: convertEnumToCapalizedString(element), info: `Furnished status: ${convertEnumToCapalizedString(element).toLowerCase()}` };
});

/**
 * Rental Availability Status Options
 */
export const rentalAvailabilityStatusOptions = Object.values(RentalAvailabilityStatus).map((element) => {
  return { value: element, key: convertEnumToCapalizedString(element), info: `Your property availability is ${convertEnumToCapalizedString(element).toLowerCase()}` };
});

/**
 * Rental Bills Included Options
 */
export const rentalBillsIncludedOptions = [
  { value: true, key: "Yes", info: "Bills are included in the rent" },
  { value: false, key: "No", info: "Bills are not included in the rent" },
];

/**
 * Create initial sale values from draft listing
 * @param draftListing Draft listing to create initial values from
 * @returns Initial sale listing values
 */
export const createInitialSaleValues = (draftListing: DraftListingWithFullPayload): SaleListingCreateWithoutListingInput => ({
  tenureType: draftListing.saleListing?.tenureType || null,
  chain: draftListing.saleListing?.chain || false,
  sharedOwnership: draftListing.saleListing?.sharedOwnership || false,
  availabilityStatus: draftListing.saleListing?.availabilityStatus || null as any,
  priceType: draftListing.saleListing?.priceType || null
});

/**
 * Create initial rental values from draft listing
 * @param draftListing Draft listing to create initial values from
 * @returns Initial rental listing values
 */
export const createInitialRentalValues = (draftListing: DraftListingWithFullPayload): RentalListingCreateWithoutListingInput => ({
  deposit: draftListing.rentalListing?.deposit || null,
  holdingDeposit: draftListing.rentalListing?.holdingDeposit || null,
  rentFrequency: draftListing.rentalListing?.rentFrequency || null as any,
  isBillsIncluded: draftListing.rentalListing?.isBillsIncluded || null as any,
  rentalLength: draftListing.rentalListing?.rentalLength || null,
  furnishedStatus: draftListing.rentalListing?.furnishedStatus || null,
  availabilityStatus: draftListing.rentalListing?.availabilityStatus || null as any
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
    return !!(saleListing.tenureType && saleListing.availabilityStatus);
  },

  /**
   * Check if rental listing data is complete  
   * @param rentalListing Rental listing data
   * @returns True if all required rental fields are present
   */
  isRentalComplete: (rentalListing: RentalListingCreateWithoutListingInput): boolean => {
    return !!(
      rentalListing.furnishedStatus && 
      rentalListing.availabilityStatus && 
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
   * Check if draft has existing step one data
   * @param draft Draft listing
   * @returns True if draft has complete step one data
   */
  hasExistingStepOneData: (draft: DraftListingWithFullPayload): boolean => {
    const hasSaleData = draft.saleListing && stepOneValidation.isSaleComplete(draft.saleListing);
    const hasRentalData = draft.rentalListing && stepOneValidation.isRentalComplete(draft.rentalListing);
    return !!(hasSaleData || hasRentalData);
  }
};