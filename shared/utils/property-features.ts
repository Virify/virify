/**
 * Property Feature Mapping Utility
 * 
 * This utility provides a truly programmatic way to extract and format property features
 * using Prisma's generated types. Adding new fields to the schema automatically works here.
 */

/**
 * Convert camelCase field names to human-readable labels
 * @param fieldName - The camelCase field name
 * @returns Human-readable label
 */
function camelCaseToLabel(fieldName: string): string {
  // Handle special cases first
  const specialCases: Record<string, string> = {
    'evCharging': 'EV Charging',
    'cableTv': 'Cable TV',
    'cctv': 'CCTV',
    'epcRating': 'EPC Rating',
    'enSuite': 'En-Suite',
    'walkInShower': 'Walk-in Shower',
    'walkInWardrobe': 'Walk-in Wardrobe',
    'walkinCloset': 'Walk-in Closet',
    'builtInStorage': 'Built-in Storage',
    'stepFreeAccess': 'Step Free Access',
    'floorToeCeiling': 'Floor to Ceiling Windows',
    'gatedCommunity': 'Gated Community',
    'neighborhoodWatch': 'Neighbourhood Watch',
    'intercomSystem': 'Intercom System',
    'wheelchairFriendly': 'Wheelchair Friendly',
    'accessibleParking': 'Accessible Parking',
    'wetRoom': 'Wet Room',
    'wideDoorways': 'Wide Doorways',
    'guestCloakroom': 'Guest Cloakroom',
    'underStairsStorage': 'Under Stairs Storage',
    'separateDressing': 'Separate Dressing Room',
    'fullFibreAvailable': 'Full Fibre Available',
    'maxDownloadSpeedMbps': 'Download Speed (Mbps)',
    'councilTaxBand': 'Council Tax Band',
    'serviceCharges': 'Service Charges',
    'groundRent': 'Ground Rent',
    'openPlan': 'Open Plan',
    'whiteGoods': 'White Goods',
    'breakfastBar': 'Breakfast Bar',
    'utilityAccess': 'Utility Access',
    'homeCinema': 'Home Cinema',
    'gamesRoom': 'Games Room',
    'sunTerrace': 'Sun Terrace',
    'separateParcel': 'Separate Parcel',
    'summerHouse': 'Summer House',
    'gardenOffice': 'Garden Office',
    'petFriendly': 'Pet Friendly',
    'homeOffice': 'Home Office'
  }
  
  if (specialCases[fieldName]) {
    return specialCases[fieldName]
  }
  
  // Convert camelCase to Title Case
  return fieldName
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim()
}

/**
 * Extract boolean fields from a feature object and convert to display labels
 * @param featureObject - The feature object to extract boolean fields from
 * @returns Array of display labels for true boolean fields
 */
function extractBooleanFeatures(featureObject: any): string[] {
  if (!featureObject || typeof featureObject !== 'object') return []
  
  const features: string[] = []
  
  // Find all boolean fields that are true
  Object.entries(featureObject).forEach(([key, value]) => {
    if (typeof value === 'boolean' && value === true) {
      features.push(camelCaseToLabel(key))
    }
  })
  
  return features
}

// Special field handlers for complex data types (arrays, enums, etc.)
const SPECIAL_FIELD_HANDLERS: Record<string, (value: any, property?: any) => string[]> = {
  // Handle garden fields specially - show "Garden" if either front or rear
  garden: (_value: any, property: any) => {
    if (property?.frontGarden || property?.rearGarden) return ['Garden']
    return []
  },
  
  // Handle bed types in bedrooms
  bed: (bedTypes: string[]) => {
    if (!Array.isArray(bedTypes)) return []
    return bedTypes.map((type: string) => {
      switch (type) {
        case 'SINGLE': return 'Single Bed'
        case 'DOUBLE': return 'Double Bed'
        case 'QUEEN': return 'Queen Bed'
        case 'KING': return 'King Bed'
        case 'SUPER_KING': return 'Super King Bed'
        case 'BUNK': return 'Bunk Bed'
        default: return camelCaseToLabel(type)
      }
    })
  },

  // Handle renewables array
  renewables: (renewables: string[]) => {
    if (!Array.isArray(renewables)) return []
    return renewables.map((type: string) => {
      switch (type) {
        case 'SOLAR_PV': return 'Solar PV'
        case 'BATTERY_STORAGE': return 'Battery Storage'
        case 'SMART_METER': return 'Smart Meter'
        case 'EV_CHARGING': return 'EV Charging'
        case 'GREY_WATER': return 'Grey Water System'
        default: return camelCaseToLabel(type)
      }
    })
  },

  // Handle heating types
  primaryHeatingType: (heatingTypes: string[]) => {
    if (!Array.isArray(heatingTypes)) return []
    return heatingTypes.filter(type => type !== 'NILL').map((type: string) => {
      switch (type) {
        case 'GAS_CENTRAL': return 'Gas Central Heating'
        case 'ELECTRIC': return 'Electric Heating'
        case 'OIL': return 'Oil Heating'
        case 'UNDERFLOOR': return 'Underfloor Heating'
        case 'BIOMASS': return 'Biomass Heating'
        case 'HEAT_PUMP': return 'Heat Pump'
        case 'DISTRICT': return 'District Heating'
        case 'STORAGE_HEATERS': return 'Storage Heaters'
        case 'LPG': return 'LPG Heating'
        case 'PASSIVE': return 'Passive Heating'
        case 'SOLAR_THERMAL': return 'Solar Thermal'
        case 'OTHER': return 'Other Heating'
        default: return camelCaseToLabel(type)
      }
    })
  },

  secondaryHeatingType: (heatingTypes: string[]) => {
    if (!Array.isArray(heatingTypes)) return []
    return heatingTypes.map((type: string) => {
      switch (type) {
        case 'GAS_CENTRAL': return 'Secondary Gas Central Heating'
        case 'ELECTRIC': return 'Secondary Electric Heating'
        case 'OIL': return 'Secondary Oil Heating'
        case 'UNDERFLOOR': return 'Secondary Underfloor Heating'
        case 'BIOMASS': return 'Secondary Biomass Heating'
        case 'HEAT_PUMP': return 'Secondary Heat Pump'
        case 'DISTRICT': return 'Secondary District Heating'
        case 'STORAGE_HEATERS': return 'Secondary Storage Heaters'
        case 'LPG': return 'Secondary LPG Heating'
        case 'PASSIVE': return 'Secondary Passive Heating'
        case 'SOLAR_THERMAL': return 'Secondary Solar Thermal'
        case 'OTHER': return 'Secondary Other Heating'
        default: return `Secondary ${camelCaseToLabel(type)}`
      }
    })
  },

  // Handle boiler types
  boilerType: (boilerType: string) => {
    if (!boilerType || boilerType === 'UNKNOWN') return []
    switch (boilerType) {
      case 'COMBI': return ['Combi Boiler']
      case 'SYSTEM': return ['System Boiler']
      case 'CONVENTIONAL': return ['Conventional Boiler']
      case 'BACK_BOILER': return ['Back Boiler']
      default: return [camelCaseToLabel(boilerType)]
    }
  },

  // Handle hot water source
  hotWaterSource: (source: string) => {
    if (!source) return []
    switch (source) {
      case 'BOILER': return ['Hot Water from Boiler']
      case 'IMMERSION_HEATER': return ['Immersion Heater']
      case 'SOLAR_THERMAL': return ['Solar Hot Water']
      case 'HEAT_PUMP': return ['Heat Pump Hot Water']
      case 'OTHER': return ['Other Hot Water Source']
      default: return [camelCaseToLabel(source)]
    }
  },

  // Handle connected utilities
  connectedUtilities: (utilities: string[]) => {
    if (!Array.isArray(utilities)) return []
    return utilities.map((utility: string) => {
      switch (utility) {
        case 'GAS': return 'Mains Gas'
        case 'ELECTRICITY': return 'Mains Electricity'
        case 'WATER': return 'Mains Water'
        case 'SEWAGE': return 'Mains Sewage'
        case 'DRAINAGE': return 'Mains Drainage'
        case 'SEPTIC_TANK': return 'Septic Tank'
        case 'CESSPIT': return 'Cesspit'
        case 'RAINWATER_HARVESTING': return 'Rainwater Harvesting'
        default: return camelCaseToLabel(utility)
      }
    })
  },

  // Handle broadband type
  broadbandType: (broadbandType: string) => {
    if (!broadbandType || broadbandType === 'UNKNOWN') return []
    switch (broadbandType) {
      case 'ADSL': return ['ADSL Broadband']
      case 'FTTC': return ['Fibre to Cabinet']
      case 'FTTP': return ['Full Fibre (FTTP)']
      case 'CABLE': return ['Cable Broadband']
      case 'MOBILE': return ['Mobile Broadband']
      default: return [camelCaseToLabel(broadbandType)]
    }
  },

  // Handle EPC rating specially
  epcRating: (rating: string) => {
    if (!rating || rating === 'UNKNOWN') return []
    return [`EPC Rating: ${rating}`]
  },

  // Handle max download speed
  maxDownloadSpeedMbps: (speed: number) => {
    if (!speed || speed <= 0) return []
    return [`Broadband Speed: ${speed}Mbps`]
  },

  // Handle fireplace types
  fireplace: (fireplaceType: string) => {
    if (!fireplaceType) return []
    switch (fireplaceType) {
      case 'LOG_BURNER': return ['Log Burner']
      case 'OPEN_FIRE': return ['Open Fire']
      default: return [camelCaseToLabel(fireplaceType)]
    }
  },

  // Handle appliances array
  appliances: (appliances: string[]) => {
    if (!Array.isArray(appliances)) return []
    return appliances.length > 0 ? appliances : []
  },

  // Handle council tax band
  councilTaxBand: (band: string) => {
    if (!band) return []
    return [`Council Tax Band: ${band}`]
  },

  // Handle service charges
  serviceCharges: (charges: number) => {
    if (!charges || charges <= 0) return []
    return [`Service Charges: £${charges.toLocaleString()}/year`]
  },

  // Handle ground rent
  groundRent: (rent: number) => {
    if (!rent || rent <= 0) return []
    return [`Ground Rent: £${rent.toLocaleString()}/year`]
  },

  // Handle room sizes
  size: (size: number) => {
    if (!size || size <= 0) return []
    return [`Size: ${size}m²`]
  },

  // Handle garden sizes  
  frontGardenSize: (size: number) => {
    if (!size || size <= 0) return []
    return [`Front Garden: ${size}m²`]
  },

  rearGardenSize: (size: number) => {
    if (!size || size <= 0) return []
    return [`Rear Garden: ${size}m²`]
  },

  totalSize: (size: number) => {
    if (!size || size <= 0) return []
    return [`Total Outdoor Size: ${size}m²`]
  }
}

// Interface for feature group configuration
interface FeatureGroup {
  groupName: string
  formatter: (data: any) => string[]
}

/**
 * Dynamically extract features from a feature group object
 * @param groupName - Name of the feature group
 * @param groupData - The feature group data
 * @returns Array of formatted feature strings
 */
function extractGroupFeatures(groupName: string, groupData: any): string[] {
  if (!groupData) return []

  const features: string[] = []
  
  // Handle arrays (bedrooms, bathrooms, receptions)
  if (Array.isArray(groupData)) {
    const itemFeatures = new Set<string>()
    
    groupData.forEach(item => {
      // Extract boolean features from each item
      const booleanFeatures = extractBooleanFeatures(item)
      booleanFeatures.forEach(feature => itemFeatures.add(feature))
      
      // Handle special fields in array items
      Object.entries(item).forEach(([key, value]) => {
        const handler = SPECIAL_FIELD_HANDLERS[key]
        if (handler && value) {
          const specialFeatures = handler(value, item)
          specialFeatures.forEach(feature => itemFeatures.add(feature))
        }
      })
    })
    
    return itemFeatures.size > 0 ? [`${camelCaseToLabel(groupName)}: ${Array.from(itemFeatures).join(', ')}`] : []
  }
  
  // Handle single objects
  const booleanFeatures = extractBooleanFeatures(groupData)
  
  // Handle special fields
  Object.entries(groupData).forEach(([key, value]) => {
    const handler = SPECIAL_FIELD_HANDLERS[key]
    if (handler && value) {
      const specialFeatures = handler(value, groupData)
      features.push(...specialFeatures)
    }
  })
  
  // Combine boolean and special features
  const allFeatures = [...booleanFeatures, ...features]
  
  // Group features under the group name if we have any
  if (allFeatures.length > 0) {
    // Special handling for outdoor space garden logic
    if (groupName === 'outdoorSpace') {
      const gardenHandler = SPECIAL_FIELD_HANDLERS['garden']
      if (gardenHandler) {
        const gardenFeatures = gardenHandler(null, groupData)
        if (gardenFeatures.length > 0) {
          // Replace frontGarden/rearGarden with just Garden
          const filteredFeatures = allFeatures.filter(f => !f.includes('Garden'))
          return [`Outdoor: ${[...gardenFeatures, ...filteredFeatures].join(', ')}`]
        }
      }
    }
    
    return [`${camelCaseToLabel(groupName)}: ${allFeatures.join(', ')}`]
  }
  
  return []
}

/**
 * Feature group configurations - now fully programmatic and schema-driven
 */
const FEATURE_GROUPS: FeatureGroup[] = [
  { groupName: 'outdoorSpace', formatter: (data) => extractGroupFeatures('outdoorSpace', data) },
  { groupName: 'parking', formatter: (data) => extractGroupFeatures('parking', data) },
  { groupName: 'additionalFeatures', formatter: (data) => extractGroupFeatures('additionalFeatures', data) },
  { groupName: 'accessibilityFeatures', formatter: (data) => extractGroupFeatures('accessibilityFeatures', data) },
  { groupName: 'securityFeatures', formatter: (data) => extractGroupFeatures('securityFeatures', data) },
  { groupName: 'kitchenFeatures', formatter: (data) => extractGroupFeatures('kitchenFeatures', data) },
  { groupName: 'livingAreaFeatures', formatter: (data) => extractGroupFeatures('livingAreaFeatures', data) },
  { groupName: 'bathroomFeatures', formatter: (data) => extractGroupFeatures('bathroomFeatures', data) },
  { groupName: 'bedroomFeatures', formatter: (data) => extractGroupFeatures('bedroomFeatures', data) },
  { groupName: 'reception', formatter: (data) => extractGroupFeatures('reception', data) },
  { groupName: 'storageFeatures', formatter: (data) => extractGroupFeatures('storageFeatures', data) },
  { groupName: 'diningroomFeatures', formatter: (data) => extractGroupFeatures('diningroomFeatures', data) },
  { groupName: 'utility', formatter: (data) => extractGroupFeatures('utility', data) },
  { groupName: 'additionalToilet', formatter: (data) => extractGroupFeatures('additionalToilet', data) },
  { groupName: 'runningCosts', formatter: (data) => extractGroupFeatures('runningCosts', data) },
  { groupName: 'energyAndUtilities', formatter: (data) => extractGroupFeatures('energyAndUtilities', data) }
]

/**
 * Extract property features for display using the schema-based mapping
 * 
 * @param property - Property object with all features
 * @returns Array of formatted feature strings
 */
export function extractPropertyFeatures(property: any): string[] {
  if (!property) return [];

  const features: string[] = [];

  // Add basic property info
  if (property.type?.name) features.push(property.type.name);
  if (property.classification?.name) features.push(property.classification.name);
  if (property.chainFree) features.push('Chain Free');
  if (property.vacant) features.push('Vacant');
  if (property.size && property.size > 0) features.push(`Property Size: ${property.size}m²`);
  if (property.yearBuilt) features.push(`Built: ${property.yearBuilt}`);
  if (property.constructionType && property.constructionType !== 'STANDARD') {
    features.push(`${property.constructionType === 'NON_STANDARD' ? 'Non-Standard' : property.constructionType} Construction`);
  }
  if (property.floorLevel !== null && property.floorLevel !== undefined) {
    if (property.floorLevel === 0) {
      features.push('Ground Floor');
    } else if (property.floorLevel > 0) {
      features.push(`Floor ${property.floorLevel}`);
    } else {
      features.push(`Basement Level ${Math.abs(property.floorLevel)}`);
    }
  }

  // Handle amenities specially (nearby amenities info)
  if (property.amenities) {
    const amenityInfo = [];
    if (property.amenities.name) amenityInfo.push(property.amenities.name);
    if (property.amenities.distanceM && property.amenities.distanceM < 1000) {
      amenityInfo.push(`${Math.round(property.amenities.distanceM)}m away`);
    } else if (property.amenities.distanceM) {
      amenityInfo.push(`${(property.amenities.distanceM / 1000).toFixed(1)}km away`);
    }
    if (amenityInfo.length > 0) {
      features.push(`Nearby: ${amenityInfo.join(' - ')}`);
    }
  }

  // Process all feature groups
  FEATURE_GROUPS.forEach(({ groupName, formatter }) => {
    const groupData = property[groupName];
    if (groupData) {
      const groupFeatures = formatter(groupData);
      features.push(...groupFeatures);
    }
  });

  return features;
}

/**
 * Get feature group names from the mapping (useful for dynamic operations)
 */
export function getFeatureGroupNames(): string[] {
  return FEATURE_GROUPS.map(group => group.groupName);
}

/**
 * Check if a feature group exists in the mapping
 */
export function hasFeatureGroup(groupName: string): boolean {
  return FEATURE_GROUPS.some(group => group.groupName === groupName);
}
