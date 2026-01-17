import type { DraftListingWithFullPayload } from '~~/shared/types/draft'

/**
 * Utility functions to load step data from draft listings
 * Each function extracts and formats data for a specific step in the listing creation flow
 */

export function loadStep1FromDraft(draft: DraftListingWithFullPayload) {
  if (draft.saleListing) {
    return {
      selectedType: 'sale' as const,
      saleListing: draft.saleListing,
      rentalListing: null
    }
  } else if (draft.rentalListing) {
    return {
      selectedType: 'rent' as const,
      saleListing: null,
      rentalListing: draft.rentalListing
    }
  }
  return null
}

export function loadStep2FromDraft(draft: DraftListingWithFullPayload) {
  if (draft.property) {
    return {
      description: draft.property.description,
      propertyTypeId: draft.property.type?.id,
      propertyClassificationId: draft.property.classification?.id,
      address: draft.property.address ? { ...draft.property.address } : null
    }
  }
  return null
}

export function loadStep3FromDraft(draft: DraftListingWithFullPayload) {
  if (draft.price !== null && draft.price !== undefined) {
    return {
      price: draft.price
    }
  }
  return null
}

export function loadStep4FromDraft(draft: DraftListingWithFullPayload) {
  if (draft.property?.bedroomFeatures || draft.property?.bathroomFeatures) {
    return {
      property: {
        totalFloors: draft.property.totalFloors ?? 1,
        bedroomFeatures: draft.property.bedroomFeatures || [],
        numberBedrooms: draft.property.numberBedrooms ?? draft.property.bedroomFeatures?.length ?? 0,
        bathroomFeatures: draft.property.bathroomFeatures || [],
        numberBathrooms: draft.property.numberBathrooms ?? draft.property.bathroomFeatures?.length ?? 0,
      }
    }
  }
  return null
}

export function loadStep5FromDraft(draft: DraftListingWithFullPayload) {
  if (draft.property?.kitchenFeatures || draft.property?.reception || draft.property?.otherRoom) {
    return {
      property: {
        totalFloors: draft.property.totalFloors ?? 1,
        kitchenFeatures: draft.property.kitchenFeatures || [],
        numberKitchens: draft.property.numberKitchens ?? draft.property.kitchenFeatures?.length ?? 0,
        reception: draft.property.reception || [],
        numberReceptions: draft.property.numberReceptions ?? draft.property.reception?.length ?? 0,
        otherRoom: draft.property.otherRoom || [],
        numberOtherRooms: draft.property.numberOtherRooms ?? draft.property.otherRoom?.length ?? 0,
      }
    }
  }
  return null
}

/**
 * Populate all step data from a draft listing
 * Returns a record of step data indexed by step number
 */
export function populateAllStepsFromDraft(draft: DraftListingWithFullPayload): Record<number, any> {
  const stepData: Record<number, any> = {}
  
  const step1Data = loadStep1FromDraft(draft)
  if (step1Data) stepData[1] = step1Data
  
  const step2Data = loadStep2FromDraft(draft)
  if (step2Data) stepData[2] = step2Data
  
  const step3Data = loadStep3FromDraft(draft)
  if (step3Data) stepData[3] = step3Data
  
  const step4Data = loadStep4FromDraft(draft)
  if (step4Data) stepData[4] = step4Data
  
  const step5Data = loadStep5FromDraft(draft)
  if (step5Data) stepData[5] = step5Data
  
  // Additional steps can be added here as they are built
  
  return stepData
}
