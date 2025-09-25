export const createInitialStepFourValues = (draftListing: DraftListingWithFullPayload): StepFour => ({
  property: {
    address: {
      number: draftListing.property?.address?.number || null,
      flat: draftListing.property?.address?.flat || null,
      street: draftListing.property?.address?.street || null,
      city: draftListing.property?.address?.city || null,
      county: draftListing.property?.address?.county || null,
      postcode: draftListing.property?.address?.postcode || null,
      country: draftListing.property?.address?.country || null,
      fullAddress: draftListing.property?.address?.fullAddress || null,
      lat: draftListing.property?.address?.lat || null,
      lon: draftListing.property?.address?.lon || null,
    }
  }
});