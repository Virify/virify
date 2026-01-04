/**
 * Image assignment structure for Step 10
 */
export interface ImageAssignment {
  cloudflareId: string;
  filename: string;
  description: string | null;
  // Room assignments (only one should be set)
  bedroomId?: number | null;
  bathroomId?: number | null;
  kitchenId?: number | null;
  receptionId?: number | null;
  otherRoomId?: number | null;
  gardenId?: number | null;
  yardId?: number | null;
  landId?: number | null;
  // General property image (no room assignment)
  isGeneral?: boolean;
}

/**
 * Create initial values for step ten based on the draft listing
 * @param draftListing - Draft listing to create initial values from
 * @returns Initial values for step ten
 */
export const createInitialStepTenValues = (listing: EditableListing): StepTen => {
  const property = listing.property;
  
  if (!property) {
    return {
      property: {
        bedroomFeatures: [],
        bathroomFeatures: [],
        kitchenFeatures: [],
        reception: [],
        otherRoom: [],
        outdoorSpace: {
          garden: [],
          yard: [],
          land: [],
        },
        media: [],
      },
    };
  }

  // Extract existing media and map to our format
  const existingMedia = property.media?.map(m => ({
    url: m.image || '',
    type: m.image ? 'image' as const : 'video' as const,
    description: m.metadata || null,
    isCover: false, // TODO: Add cover image logic if needed
  })) || [];

  return {
    property: {
      bedroomFeatures: property.bedroomFeatures || [],
      bathroomFeatures: property.bathroomFeatures || [],
      kitchenFeatures: property.kitchenFeatures || [],
      reception: property.reception || [],
      otherRoom: property.otherRoom || [],
      outdoorSpace: {
        garden: property.outdoorSpace?.garden || [],
        yard: property.outdoorSpace?.yard || [],
        land: property.outdoorSpace?.land || [],
      },
      media: existingMedia,
    },
  };
};

/**
 * Step Ten Validation Helpers
 * Clean, reusable validation functions for step ten
 */
export const stepTenValidation = {
  /**
   * Check if at least one image has been uploaded
   * @param data Step ten form data
   * @returns True if at least one image exists
   */
  hasImages: (data: StepTen): boolean => {
    return data.property.media && data.property.media.length > 0;
  },

  /**
   * Check if step ten data is valid
   * At least one image must be uploaded
   * @param data Step ten form data
   * @returns True if validation passes
   */
  isStepTenValid: (data: StepTen): boolean => {
    // Require at least one image
    return stepTenValidation.hasImages(data);
  },

  /**
   * Check if step ten has existing data
   * @param draft Draft listing
   * @returns True if there are existing images
   */
  hasExistingStepTenData: (listing: EditableListing): boolean => {
    return !!(listing.property?.media && listing.property.media.length > 0);
  },
};

/**
 * Get all available rooms for image assignment
 * @param listing Draft or live listing with full payload
 * @returns Object containing all available rooms by type
 */
export const getAvailableRooms = (listing: EditableListing) => {
  const property = listing.property;
  
  if (!property) {
    return {
      bedrooms: [],
      bathrooms: [],
      kitchens: [],
      receptions: [],
      otherRooms: [],
      gardens: [],
      yards: [],
      lands: [],
    };
  }

  return {
    bedrooms: property.bedroomFeatures?.map(b => ({
      id: b.id,
      name: b.name || `Bedroom ${b.roomNumber}`,
      roomNumber: b.roomNumber,
    })) || [],
    bathrooms: property.bathroomFeatures?.map(b => ({
      id: b.id,
      name: b.name || `Bathroom ${b.roomNumber}`,
      roomNumber: b.roomNumber,
    })) || [],
    kitchens: property.kitchenFeatures?.map(k => ({
      id: k.id,
      name: k.name || `Kitchen ${k.roomNumber}`,
      roomNumber: k.roomNumber || 1,
    })) || [],
    receptions: property.reception?.map(r => ({
      id: r.id,
      name: r.name || `Reception ${r.roomNumber}`,
      roomNumber: r.roomNumber,
      type: r.type,
    })) || [],
    otherRooms: property.otherRoom?.map(o => ({
      id: o.id,
      name: o.name || `Other Room ${o.roomNumber}`,
      roomNumber: o.roomNumber,
      type: o.type,
    })) || [],
    gardens: property.outdoorSpace?.garden?.map(g => ({
      id: g.id,
      name: g.name || 'Garden',
    })) || [],
    yards: property.outdoorSpace?.yard?.map(y => ({
      id: y.id,
      name: y.position ? `${y.position} Yard` : 'Yard',
    })) || [],
    lands: property.outdoorSpace?.land?.map(l => ({
      id: l.id,
      name: l.name || 'Land',
    })) || [],
  };
};
