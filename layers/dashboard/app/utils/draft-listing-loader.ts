import type { DraftListingWithFullPayload } from '~~/shared/types/draft'

/**
 * Utility functions to load step data from draft listings
 * Each function extracts and formats data for a specific step in the listing creation flow
 */

export function loadStep1FromDraft(draft: DraftListingWithFullPayload) {
  if (draft.saleListing) {
    return {
      selectedType: 'sale' as const,
      saleListing: {
        tenureType: draft.saleListing.tenureType,
        chain: draft.saleListing.chain ?? false,
        sharedOwnership: draft.saleListing.sharedOwnership ?? false,
        availabilityStatus: draft.saleListing.availabilityStatus ?? 'AVAILABLE',
      },
      rentalListing: null
    }
  } else if (draft.rentalListing) {
    return {
      selectedType: 'rent' as const,
      saleListing: null,
      rentalListing: {
        furnishedStatus: draft.rentalListing.furnishedStatus,
        isBillsIncluded: draft.rentalListing.isBillsIncluded ?? false,
        rentalLength: draft.rentalListing.rentalLength,
        availabilityStatus: draft.rentalListing.availabilityStatus ?? 'AVAILABLE',
      }
    }
  }
  return null
}

export function loadStep2FromDraft(draft: DraftListingWithFullPayload) {
  if (draft.property) {
    return {
      property: {
        address: draft.property.address ? { ...draft.property.address } : {
          number: null,
          flat: null,
          name: null,
          street: null,
          city: null,
          postcode: null,
          country: null,
          locality: null,
          county: null,
          district: null,
          fullAddress: null,
          lat: null,
          lon: null,
        },
        type: draft.property.type?.id ?? null,
        classification: draft.property.classification?.id ?? null,
        description: draft.property.description ?? '',
        totalFloors: draft.property.totalFloors ?? 1,
        constructionType: draft.property.constructionType ?? null,
        size: draft.property.size ?? null,
        yearBuilt: draft.property.yearBuilt ?? null,
      }
    }
  }
  return null
}

export function loadStep3FromDraft(draft: DraftListingWithFullPayload) {
  if (draft.price !== null && draft.price !== undefined) {
    return {
      price: draft.price,
      saleListing: draft.saleListing ? {
        priceType: draft.saleListing.priceType ?? undefined,
      } : null,
      rentalListing: draft.rentalListing ? {
        rentFrequency: draft.rentalListing.rentFrequency ?? undefined,
        deposit: draft.rentalListing.deposit ?? null,
        holdingDeposit: draft.rentalListing.holdingDeposit ?? null,
      } : null,
    }
  }
  return null
}

export function loadStep4FromDraft(draft: DraftListingWithFullPayload) {
  if (draft.property?.bedroomFeatures || draft.property?.bathroomFeatures) {
    return {
      property: {
        totalFloors: draft.property.totalFloors ?? 1,
        bedroomFeatures: draft.property.bedroomFeatures?.map(b => ({
          name: b.name ?? '',
          roomNumber: b.roomNumber ?? 1,
          description: b.description ?? null,
          floor: b.floor ?? 1,
          bed: b.bed ?? [],
          features: b.features ?? [],
          size: b.size ?? null,
        })) ?? [],
        numberBedrooms: draft.property.numberBedrooms ?? draft.property.bedroomFeatures?.length ?? 0,
        bathroomFeatures: draft.property.bathroomFeatures?.map(b => ({
          name: b.name ?? '',
          roomNumber: b.roomNumber ?? 1,
          description: b.description ?? null,
          floor: b.floor ?? 1,
          features: b.features ?? [],
          size: b.size ?? null,
        })) ?? [],
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
        kitchenFeatures: draft.property.kitchenFeatures?.map(k => ({
          name: k.name ?? '',
          roomNumber: k.roomNumber ?? 1,
          description: k.description ?? null,
          floor: k.floor ?? 1,
          features: k.features ?? [],
          size: k.size ?? null,
        })) ?? [],
        numberKitchens: draft.property.numberKitchens ?? draft.property.kitchenFeatures?.length ?? 0,
        reception: draft.property.reception?.map(r => ({
          name: r.name ?? '',
          roomNumber: r.roomNumber ?? 1,
          description: r.description ?? null,
          floor: r.floor ?? 1,
          type: r.type,
          features: r.features ?? [],
          size: r.size ?? null,
        })) ?? [],
        numberReceptions: draft.property.numberReceptions ?? draft.property.reception?.length ?? 0,
        otherRoom: draft.property.otherRoom?.map(o => ({
          name: o.name ?? '',
          roomNumber: o.roomNumber ?? 1,
          description: o.description ?? null,
          floor: o.floor ?? 1,
          type: o.type,
          features: o.features ?? [],
          size: o.size ?? null,
        })) ?? [],
        numberOtherRooms: draft.property.numberOtherRooms ?? draft.property.otherRoom?.length ?? 0,
      }
    }
  }
  return null
}

export function loadStep6FromDraft(draft: DraftListingWithFullPayload) {
  const outdoorSpace = draft.property?.outdoorSpace
  if (outdoorSpace) {
    return {
      property: {
        outdoorSpace: {
          description: outdoorSpace.description ?? null,
          totalArea: outdoorSpace.totalArea ?? null,
          features: outdoorSpace.features ?? [],
          garden: outdoorSpace.garden?.map(g => ({
            name: g.name ?? '',
            description: g.description ?? null,
            facing: g.facing ?? null,
            position: g.position ?? null,
            features: g.features ?? [],
            size: g.size ?? null,
          })) ?? [],
          yard: outdoorSpace.yard?.map(y => ({
            name: y.name ?? '',
            description: y.description ?? null,
            facing: y.facing ?? null,
            position: y.position ?? null,
            features: y.features ?? [],
            size: y.size ?? null,
          })) ?? [],
          land: outdoorSpace.land?.map(l => ({
            name: l.name ?? '',
            description: l.description ?? null,
            features: l.features ?? [],
            size: l.size ?? null,
          })) ?? [],
        }
      }
    }
  }
  return null
}

export function loadStep7FromDraft(draft: DraftListingWithFullPayload) {
  const property = draft.property
  if (property?.parking || property?.accessibilityFeatures || property?.securityFeatures || 
      property?.storageFeatures || property?.utility || property?.additionalFeatures) {
    return {
      property: {
        parking: property.parking ? {
          description: property.parking.description ?? null,
          features: property.parking.features ?? [],
        } : { description: null, features: [] },
        accessibilityFeatures: property.accessibilityFeatures ? {
          description: property.accessibilityFeatures.description ?? null,
          features: property.accessibilityFeatures.features ?? [],
        } : { description: null, features: [] },
        securityFeatures: property.securityFeatures ? {
          description: property.securityFeatures.description ?? null,
          features: property.securityFeatures.features ?? [],
        } : { description: null, features: [] },
        storageFeatures: property.storageFeatures ? {
          description: property.storageFeatures.description ?? null,
          features: property.storageFeatures.features ?? [],
        } : { description: null, features: [] },
        utility: property.utility ? {
          description: property.utility.description ?? null,
          features: property.utility.features ?? [],
          size: property.utility.size ?? null,
        } : { description: null, features: [], size: null },
        additionalFeatures: property.additionalFeatures ? {
          description: property.additionalFeatures.description ?? null,
          petFriendly: property.additionalFeatures.petFriendly ?? true,
          moveInDate: property.additionalFeatures.moveInDate ?? null,
          features: property.additionalFeatures.features ?? [],
        } : { description: null, petFriendly: true, moveInDate: null, features: [] },
      }
    }
  }
  return null
}

export function loadStep8FromDraft(draft: DraftListingWithFullPayload) {
  const property = draft.property
  if (property?.energyAndUtilities || property?.runningCosts) {
    return {
      property: {
        energyAndUtilities: property.energyAndUtilities ? {
          description: property.energyAndUtilities.description ?? null,
          epcRating: property.energyAndUtilities.epcRating ?? 'G',
          epcCertificateUrl: property.energyAndUtilities.epcCertificateUrl ?? null,
          primaryHeatingType: property.energyAndUtilities.primaryHeatingType ?? [],
          secondaryHeatingType: property.energyAndUtilities.secondaryHeatingType ?? [],
          boilerType: property.energyAndUtilities.boilerType ?? null,
          hotWaterSource: property.energyAndUtilities.hotWaterSource ?? null,
          renewables: property.energyAndUtilities.renewables ?? [],
          connectedUtilities: property.energyAndUtilities.connectedUtilities ?? [],
        } : {
          description: null,
          epcRating: 'G',
          epcCertificateUrl: null,
          primaryHeatingType: [],
          secondaryHeatingType: [],
          boilerType: null,
          hotWaterSource: null,
          renewables: [],
          connectedUtilities: [],
        },
        runningCosts: property.runningCosts ? {
          description: property.runningCosts.description ?? null,
          councilTaxBand: property.runningCosts.councilTaxBand ?? 'A',
          serviceCharges: property.runningCosts.serviceCharges ?? null,
          groundRent: property.runningCosts.groundRent ?? null,
        } : {
          description: null,
          councilTaxBand: 'A',
          serviceCharges: null,
          groundRent: null,
        },
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
  
  const step6Data = loadStep6FromDraft(draft)
  if (step6Data) stepData[6] = step6Data
  
  const step7Data = loadStep7FromDraft(draft)
  if (step7Data) stepData[7] = step7Data
  
  const step8Data = loadStep8FromDraft(draft)
  if (step8Data) stepData[8] = step8Data
  
  // Additional steps can be added here as they are built
  
  return stepData
}
