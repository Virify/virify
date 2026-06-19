/**
 * Utility functions to load step form data from a listing payload.
 * Used for both new draft creation and editing live listings.
 * Each function extracts and formats data for a specific step in the listing flow.
 */

export function loadStep1(listing: EditableListing) {
  if (listing.saleListing) {
    return {
      selectedType: "sale" as const,
      saleListing: {
        tenureType: listing.saleListing.tenureType,
        chain: listing.saleListing.chain ?? false,
        sharedOwnership: listing.saleListing.sharedOwnership ?? false,
        availabilityStatus: listing.saleListing.availabilityStatus ?? "AVAILABLE",
      },
      rentalListing: null,
    };
  } else if (listing.rentalListing) {
    return {
      selectedType: "rent" as const,
      saleListing: null,
      rentalListing: {
        furnishedStatus: listing.rentalListing.furnishedStatus,
        isBillsIncluded: listing.rentalListing.isBillsIncluded ?? false,
        rentalLength: listing.rentalListing.rentalLength,
        availabilityStatus: listing.rentalListing.availabilityStatus ?? "AVAILABLE",
      },
    };
  }
  return null;
}

export function loadStep2(listing: EditableListing) {
  if (listing.property) {
    return {
      property: {
        address:
          listing.property.address ?
            { ...listing.property.address }
          : {
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
        type: listing.property.type?.id ?? null,
        classification: listing.property.classification?.id ?? null,
        totalFloors: listing.property.totalFloors ?? 1,
        constructionType: listing.property.constructionType ?? null,
        size: listing.property.size ?? null,
        yearBuilt: listing.property.yearBuilt ?? null,
      },
      moveInDate: listing.moveInDate ?? null,
    };
  }
  return null;
}

export function loadStep3(listing: EditableListing) {
  if (listing.price !== null && listing.price !== undefined) {
    return {
      price: listing.price,
      saleListing:
        listing.saleListing ?
          {
            priceType: listing.saleListing.priceType ?? undefined,
          }
        : null,
      rentalListing:
        listing.rentalListing ?
          {
            rentFrequency: listing.rentalListing.rentFrequency ?? undefined,
            deposit: listing.rentalListing.deposit ?? null,
            holdingDeposit: listing.rentalListing.holdingDeposit ?? null,
          }
        : null,
    };
  }
  return null;
}

export function loadStep4(listing: EditableListing) {
  if (listing.property?.bedroomFeatures || listing.property?.bathroomFeatures) {
    return {
      property: {
        totalFloors: listing.property.totalFloors ?? 1,
        bedroomFeatures:
          listing.property.bedroomFeatures?.map((b) => ({
            id: b.id,
            name: b.name ?? "",
            roomNumber: b.roomNumber ?? 1,
            description: b.description ?? null,
            floor: b.floor ?? 0,
            bed: b.bed ?? [],
            features: b.features ?? [],
            size: b.size ?? null,
          })) ?? [],
        numberBedrooms:
          listing.property.numberBedrooms ??
          listing.property.bedroomFeatures?.length ??
          0,
        bathroomFeatures:
          listing.property.bathroomFeatures?.map((b) => ({
            id: b.id,
            name: b.name ?? "",
            roomNumber: b.roomNumber ?? 1,
            description: b.description ?? null,
            floor: b.floor ?? 0,
            features: b.features ?? [],
            size: b.size ?? null,
          })) ?? [],
        numberBathrooms:
          listing.property.numberBathrooms ??
          listing.property.bathroomFeatures?.length ??
          0,
      },
    };
  }
  return null;
}

export function loadStep5(listing: EditableListing) {
  if (
    listing.property?.kitchenFeatures ||
    listing.property?.reception ||
    listing.property?.otherRoom
  ) {
    return {
      property: {
        totalFloors: listing.property.totalFloors ?? 1,
        kitchenFeatures:
          listing.property.kitchenFeatures?.map((k) => ({
            id: k.id,
            name: k.name ?? "",
            roomNumber: k.roomNumber ?? 1,
            description: k.description ?? null,
            floor: k.floor ?? 0,
            features: k.features ?? [],
            size: k.size ?? null,
          })) ?? [],
        numberKitchens:
          listing.property.numberKitchens ??
          listing.property.kitchenFeatures?.length ??
          0,
        reception:
          listing.property.reception?.map((r) => ({
            id: r.id,
            name: r.name ?? "",
            roomNumber: r.roomNumber ?? 1,
            description: r.description ?? null,
            floor: r.floor ?? 0,
            type: r.type,
            features: r.features ?? [],
            size: r.size ?? null,
          })) ?? [],
        numberReceptions:
          listing.property.numberReceptions ?? listing.property.reception?.length ?? 0,
        otherRoom:
          listing.property.otherRoom?.map((o) => ({
            id: o.id,
            name: o.name ?? "",
            roomNumber: o.roomNumber ?? 1,
            description: o.description ?? null,
            floor: o.floor ?? 0,
            type: o.type,
            features: o.features ?? [],
            size: o.size ?? null,
          })) ?? [],
        numberOtherRooms:
          listing.property.numberOtherRooms ?? listing.property.otherRoom?.length ?? 0,
      },
    };
  }
  return null;
}

export function loadStep6(listing: EditableListing) {
  const outdoorSpace = listing.property?.outdoorSpace;
  if (outdoorSpace) {
    return {
      property: {
        outdoorSpace: {
          description: outdoorSpace.description ?? null,
          totalArea: outdoorSpace.totalArea ?? null,
          features: outdoorSpace.features ?? [],
          garden:
            outdoorSpace.garden?.map((g) => ({
              id: g.id,
              name: g.name ?? "",
              description: g.description ?? null,
              facing: g.facing ?? null,
              position: g.position ?? null,
              features: g.features ?? [],
              size: g.size ?? null,
            })) ?? [],
          yard:
            outdoorSpace.yard?.map((y) => ({
              id: y.id,
              name: y.name ?? "",
              description: y.description ?? null,
              facing: y.facing ?? null,
              position: y.position ?? null,
              features: y.features ?? [],
              size: y.size ?? null,
            })) ?? [],
          land:
            outdoorSpace.land?.map((l) => ({
              id: l.id,
              name: l.name ?? "",
              description: l.description ?? null,
              features: l.features ?? [],
              size: l.size ?? null,
            })) ?? [],
        },
      },
    };
  }
  return null;
}

export function loadStep7(listing: EditableListing) {
  const property = listing.property;
  if (
    property?.parking ||
    property?.accessibilityFeatures ||
    property?.securityFeatures ||
    property?.storageFeatures ||
    property?.utility ||
    property?.additionalFeatures
  ) {
    return {
      property: {
        parking:
          property.parking ?
            {
              description: property.parking.description ?? null,
              features: property.parking.features ?? [],
            }
          : { description: null, features: [] },
        accessibilityFeatures:
          property.accessibilityFeatures ?
            {
              description: property.accessibilityFeatures.description ?? null,
              features: property.accessibilityFeatures.features ?? [],
            }
          : { description: null, features: [] },
        securityFeatures:
          property.securityFeatures ?
            {
              description: property.securityFeatures.description ?? null,
              features: property.securityFeatures.features ?? [],
            }
          : { description: null, features: [] },
        storageFeatures:
          property.storageFeatures ?
            {
              description: property.storageFeatures.description ?? null,
              features: property.storageFeatures.features ?? [],
            }
          : { description: null, features: [] },
        utility:
          property.utility ?
            {
              description: property.utility.description ?? null,
              features: property.utility.features ?? [],
              size: property.utility.size ?? null,
            }
          : { description: null, features: [], size: null },
        additionalFeatures:
          property.additionalFeatures ?
            {
              description: property.additionalFeatures.description ?? null,
              petFriendly: property.additionalFeatures.petFriendly ?? true,
              features: property.additionalFeatures.features ?? [],
            }
          : { description: null, petFriendly: true, features: [] },
      },
    };
  }
  return null;
}

export function loadStep8(listing: EditableListing) {
  const property = listing.property;
  if (property?.energyAndUtilities || property?.runningCosts) {
    return {
      property: {
        energyAndUtilities:
          property.energyAndUtilities ?
            {
              description: property.energyAndUtilities.description ?? null,
              epcRating: property.energyAndUtilities.epcRating ?? "G",
              epcCertificateUrl: property.energyAndUtilities.epcCertificateUrl ?? null,
              primaryHeatingType: property.energyAndUtilities.primaryHeatingType ?? [],
              secondaryHeatingType:
                property.energyAndUtilities.secondaryHeatingType ?? [],
              boilerType: property.energyAndUtilities.boilerType ?? null,
              hotWaterSource: property.energyAndUtilities.hotWaterSource ?? null,
              renewables: property.energyAndUtilities.renewables ?? [],
              connectedUtilities: property.energyAndUtilities.connectedUtilities ?? [],
            }
          : {
              description: null,
              epcRating: "G",
              epcCertificateUrl: null,
              primaryHeatingType: [],
              secondaryHeatingType: [],
              boilerType: null,
              hotWaterSource: null,
              renewables: [],
              connectedUtilities: [],
            },
        runningCosts:
          property.runningCosts ?
            {
              description: property.runningCosts.description ?? null,
              councilTaxBand: property.runningCosts.councilTaxBand ?? "A",
              serviceCharges: property.runningCosts.serviceCharges ?? null,
              groundRent: property.runningCosts.groundRent ?? null,
            }
          : {
              description: null,
              councilTaxBand: "A",
              serviceCharges: null,
              groundRent: null,
            },
      },
    };
  }
  return null;
}

export function loadStep9(listing: EditableListing) {
  const property = listing.property;
  const existingMedia = [...(property?.media || [])].sort(
    (a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  // Map existing media to our format, filtering out records without a Cloudflare image ID
  const media = existingMedia
    .filter((m: any) => m.image)
    .map((m: any) => {
      const metadata = m.metadata ? JSON.parse(m.metadata) : {};
      const isGeneral =
        !m.bedroomId &&
        !m.bathroomId &&
        !m.kitchenId &&
        !m.receptionId &&
        !m.otherRoomId &&
        !m.gardenId &&
        !m.yardId &&
        !m.landId;

      return {
        id: m.id as number | undefined,
        cloudflareId: m.image || "",
        filename: metadata.cloudflareImageId || m.image || "",
        description: (metadata.description ?? metadata.alt ?? "").substring(0, 100),
        bedroomId: m.bedroomId || null,
        bathroomId: m.bathroomId || null,
        kitchenId: m.kitchenId || null,
        receptionId: m.receptionId || null,
        otherRoomId: m.otherRoomId || null,
        gardenId: m.gardenId || null,
        yardId: m.yardId || null,
        landId: m.landId || null,
        outdoorSpaceId: m.outdoorSpaceId || null,
        isGeneral,
      };
    });

  return {
    property: {
      description: property?.description ?? "",
      media,
    },
  };
}

/**
 * Populate all step data from a draft listing
 * Returns a record of step data indexed by step number
 */
export function populateAllSteps(listing: EditableListing): Record<number, any> {
  const stepData: Record<number, any> = {};

  const step1Data = loadStep1(listing);
  if (step1Data) stepData[1] = step1Data;

  const step2Data = loadStep2(listing);
  if (step2Data) stepData[2] = step2Data;

  const step3Data = loadStep3(listing);
  if (step3Data) stepData[3] = step3Data;

  const step4Data = loadStep4(listing);
  if (step4Data) stepData[4] = step4Data;

  const step5Data = loadStep5(listing);
  if (step5Data) stepData[5] = step5Data;

  const step6Data = loadStep6(listing);
  if (step6Data) stepData[6] = step6Data;

  const step7Data = loadStep7(listing);
  if (step7Data) stepData[7] = step7Data;

  const step8Data = loadStep8(listing);
  if (step8Data) stepData[8] = step8Data;

  const step9Data = loadStep9(listing);
  if (step9Data) stepData[9] = step9Data;

  return stepData;
}
