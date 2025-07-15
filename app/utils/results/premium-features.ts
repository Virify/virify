// Premium features utility for listing cards

export interface PremiumFeatureDef {
  label: string;
  path: string[];
}

// Prioritized by what property seekers value most
export const premiumFeatureDefs: PremiumFeatureDef[] = [
  // TOP TIER - High demand, major decision factors
  { label: 'Garage', path: ['property', 'parking', 'garage'] },
  { label: 'Driveway', path: ['property', 'parking', 'driveway'] },
  { label: 'Rear Garden', path: ['property', 'outdoorSpace', 'rearGarden'] },
  { label: 'Home Office', path: ['property', 'additionalFeatures', 'homeOffice'] },
  { label: 'Modern Kitchen', path: ['property', 'kitchenFeatures', 'modern'] },
  { label: 'Pet Friendly', path: ['property', 'additionalFeatures', 'petFriendly'] },
  { label: 'Allocated Parking', path: ['property', 'parking', 'allocatedParking'] },
  { label: 'Pool', path: ['property', 'outdoorSpace', 'pool'] },
  
  // HIGH PRIORITY - Desirable lifestyle features
  { label: 'Balcony', path: ['property', 'outdoorSpace', 'balcony'] },
  { label: 'EV Charging', path: ['property', 'parking', 'evCharging'] },
  { label: 'Gym', path: ['property', 'additionalFeatures', 'gym'] },
  { label: 'Concierge', path: ['property', 'additionalFeatures', 'concierge'] },
  { label: 'Open Plan Kitchen', path: ['property', 'kitchenFeatures', 'openPlan'] },
  { label: 'White Goods', path: ['property', 'kitchenFeatures', 'whiteGoods'] },
  { label: 'Ensuite', path: ['property', 'bedroomFeatures', 'ensuite'] },
  { label: 'Walk-in Wardrobe', path: ['property', 'bedroomFeatures', 'walkInWardrobe'] },
  
  // MEDIUM PRIORITY - Nice to have features
  { label: 'Fireplace', path: ['property', 'livingArea', 'fireplace'] },
  { label: 'Gated Community', path: ['property', 'securityFeatures', 'gatedCommunity'] },
  { label: 'Island', path: ['property', 'kitchenFeatures', 'island'] },
  { label: 'Terrace', path: ['property', 'outdoorSpace', 'terrace'] },
  { label: 'Patio', path: ['property', 'outdoorSpace', 'patio'] },
  { label: 'Sun Terrace', path: ['property', 'outdoorSpace', 'sunTerrace'] },
  { label: 'Utility Room Access', path: ['property', 'kitchenFeatures', 'utilityRoomAccess'] },
  { label: 'Pantry', path: ['property', 'kitchenFeatures', 'pantry'] },
  { label: 'Breakfast Bar', path: ['property', 'kitchenFeatures', 'breakfastBar'] },
  { label: 'Built-in Storage', path: ['property', 'bedroomFeatures', 'builtInStorage'] },
  
  // LOWER PRIORITY - Specific needs/situations
  { label: 'Garden Office', path: ['property', 'outdoorSpace', 'gardenOffice'] },
  { label: 'Summer House', path: ['property', 'outdoorSpace', 'summerHouse'] },
  { label: 'Games Room', path: ['property', 'receptionRooms', 'gamesRoom'] },
  { label: 'Home Cinema', path: ['property', 'receptionRooms', 'homeCinema'] },
  { label: 'Walk-in Shower', path: ['property', 'bathroomFeatures', 'walkInShower'] },
  { label: 'Bathtub', path: ['property', 'bathroomFeatures', 'bathtub'] },
  { label: 'Carport', path: ['property', 'parking', 'carport'] },
  { label: 'Front Garden', path: ['property', 'outdoorSpace', 'frontGarden'] },
  { label: 'CCTV', path: ['property', 'securityFeatures', 'cctv'] },
  { label: 'Alarm System', path: ['property', 'securityFeatures', 'alarmSystem'] },
  
  // ACCESSIBILITY - Important for specific users
  { label: 'Wheelchair Friendly', path: ['property', 'accessibilityFeatures', 'wheelchairFriendly'] },
  { label: 'Step Free Access', path: ['property', 'accessibilityFeatures', 'stepFreeAccess'] },
  { label: 'Elevator', path: ['property', 'accessibilityFeatures', 'elevator'] },
  { label: 'Wide Doorways', path: ['property', 'accessibilityFeatures', 'wideDoorways'] },
  
  // BASIC AMENITIES - Expected in many properties
  { label: 'Laundry', path: ['property', 'additionalFeatures', 'laundry'] },
  { label: 'Internet', path: ['property', 'additionalFeatures', 'internet'] },
  { label: 'Shed', path: ['property', 'outdoorSpace', 'shed'] },
  { label: 'Permit Parking', path: ['property', 'parking', 'permitParking'] },
  { label: 'On Street Parking', path: ['property', 'parking', 'onStreet'] },
  
  // LOWER PRIORITY - Less commonly sought
  { label: 'Reception', path: ['property', 'securityFeatures', 'reception'] },
  { label: 'Security Staff', path: ['property', 'securityFeatures', 'securityStaff'] },
  { label: 'Intercom System', path: ['property', 'securityFeatures', 'intercomSystem'] },
  { label: 'Shop', path: ['property', 'additionalFeatures', 'shop'] },
  { label: 'Cable TV', path: ['property', 'additionalFeatures', 'cableTV'] },
  { label: 'Phone', path: ['property', 'additionalFeatures', 'phone'] },
  { label: 'Wet Room', path: ['property', 'accessibilityFeatures', 'wetRoom'] },
  { label: 'Handrails', path: ['property', 'accessibilityFeatures', 'handrails'] },
  { label: 'Accessible Parking', path: ['property', 'accessibilityFeatures', 'accessibleParking'] },
  { label: 'Neighbourhood Watch', path: ['property', 'securityFeatures', 'neighbourhoodWatch'] },
  
  // STORAGE - Useful but lower priority
  { label: 'Basement', path: ['property', 'storageFeatures', 'basement'] },
  { label: 'Attic', path: ['property', 'storageFeatures', 'attic'] },
  { label: 'Separate Dressing', path: ['property', 'storageFeatures', 'separateDressing'] },
  { label: 'Under Stairs Storage', path: ['property', 'storageFeatures', 'underStairsStorage'] },
  { label: 'Pantry (Storage)', path: ['property', 'storageFeatures', 'pantry'] },
];

export function getFeatureValue(obj: any, path: string[]): any {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

export function getPremiumFeatures(listing: any, max = 20) {
  return premiumFeatureDefs
    .map(f => ({ label: f.label, value: getFeatureValue(listing, f.path) }))
    .filter(f => f.value === true)
    .slice(0, max);
}
