// Premium features utility for listing cards

export interface PremiumFeatureDef {
  label: string;
  path: string[];
}

export const premiumFeatureDefs: PremiumFeatureDef[] = [
  { label: 'EV Charging', path: ['property', 'parking', 'evCharging'] },
  { label: 'Pet Friendly', path: ['property', 'additionalFeatures', 'petFriendly'] },
  { label: 'Garage', path: ['property', 'parking', 'garage'] },
  { label: 'Driveway', path: ['property', 'parking', 'driveway'] },
  { label: 'Allocated Parking', path: ['property', 'parking', 'allocatedParking'] },
  { label: 'Carport', path: ['property', 'parking', 'carport'] },
  { label: 'On Street Parking', path: ['property', 'parking', 'onStreet'] },
  { label: 'Permit Parking', path: ['property', 'parking', 'permitParking'] },
  { label: 'Front Garden', path: ['property', 'outdoorSpace', 'frontGarden'] },
  { label: 'Rear Garden', path: ['property', 'outdoorSpace', 'rearGarden'] },
  { label: 'Sun Terrace', path: ['property', 'outdoorSpace', 'sunTerrace'] },
  { label: 'Terrace', path: ['property', 'outdoorSpace', 'terrace'] },
  { label: 'Balcony', path: ['property', 'outdoorSpace', 'balcony'] },
  { label: 'Patio', path: ['property', 'outdoorSpace', 'patio'] },
  { label: 'Shed', path: ['property', 'outdoorSpace', 'shed'] },
  { label: 'Summer House', path: ['property', 'outdoorSpace', 'summerHouse'] },
  { label: 'Garden Office', path: ['property', 'outdoorSpace', 'gardenOffice'] },
  { label: 'Pool', path: ['property', 'outdoorSpace', 'pool'] },
  { label: 'Wheelchair Friendly', path: ['property', 'accessibilityFeatures', 'wheelchairFriendly'] },
  { label: 'Step Free Access', path: ['property', 'accessibilityFeatures', 'stepFreeAccess'] },
  { label: 'Wide Doorways', path: ['property', 'accessibilityFeatures', 'wideDoorways'] },
  { label: 'Wet Room', path: ['property', 'accessibilityFeatures', 'wetRoom'] },
  { label: 'Handrails', path: ['property', 'accessibilityFeatures', 'handrails'] },
  { label: 'Elevator', path: ['property', 'accessibilityFeatures', 'elevator'] },
  { label: 'Accessible Parking', path: ['property', 'accessibilityFeatures', 'accessibleParking'] },
  { label: 'Gated Community', path: ['property', 'securityFeatures', 'gatedCommunity'] },
  { label: 'CCTV', path: ['property', 'securityFeatures', 'cctv'] },
  { label: 'Alarm System', path: ['property', 'securityFeatures', 'alarmSystem'] },
  { label: 'Neighbourhood Watch', path: ['property', 'securityFeatures', 'neighbourhoodWatch'] },
  { label: 'Intercom System', path: ['property', 'securityFeatures', 'intercomSystem'] },
  { label: 'Security Staff', path: ['property', 'securityFeatures', 'securityStaff'] },
  { label: 'Reception', path: ['property', 'securityFeatures', 'reception'] },
  { label: 'Home Office', path: ['property', 'additionalFeatures', 'homeOffice'] },
  { label: 'Internet', path: ['property', 'additionalFeatures', 'internet'] },
  { label: 'Cable TV', path: ['property', 'additionalFeatures', 'cableTV'] },
  { label: 'Phone', path: ['property', 'additionalFeatures', 'phone'] },
  { label: 'Laundry', path: ['property', 'additionalFeatures', 'laundry'] },
  { label: 'Concierge', path: ['property', 'additionalFeatures', 'concierge'] },
  { label: 'Shop', path: ['property', 'additionalFeatures', 'shop'] },
  { label: 'Gym', path: ['property', 'additionalFeatures', 'gym'] },
  { label: 'Modern Kitchen', path: ['property', 'kitchenFeatures', 'modern'] },
  { label: 'Open Plan Kitchen', path: ['property', 'kitchenFeatures', 'openPlan'] },
  { label: 'White Goods', path: ['property', 'kitchenFeatures', 'whiteGoods'] },
  { label: 'Breakfast Bar', path: ['property', 'kitchenFeatures', 'breakfastBar'] },
  { label: 'Island', path: ['property', 'kitchenFeatures', 'island'] },
  { label: 'Pantry', path: ['property', 'kitchenFeatures', 'pantry'] },
  { label: 'Utility Room Access', path: ['property', 'kitchenFeatures', 'utilityRoomAccess'] },
  { label: 'Attic', path: ['property', 'storageFeatures', 'attic'] },
  { label: 'Basement', path: ['property', 'storageFeatures', 'basement'] },
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
