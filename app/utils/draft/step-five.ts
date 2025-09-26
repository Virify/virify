/**
 * Create initial values for step five based on the draft listing
 * @param draftListing - Draft listing to create initial values from
 * @returns Initial values for step five
 */
export const createInitialStepFiveValues = (draftListing: DraftListingWithFullPayload): StepFive => ({
  property: {
    totalFloors: draftListing.property?.totalFloors || 0,
    bedroomFeatures: draftListing.property?.bedroomFeatures || [],
    numberBedrooms: draftListing.property?.numberBedrooms || 0,
    bathroomFeatures: draftListing.property?.bathroomFeatures || [],
    numberBathrooms: draftListing.property?.numberBathrooms || 0,
  }
});