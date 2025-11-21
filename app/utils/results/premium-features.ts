// Premium features utility for listing cards
import {
  BedroomFeature,
  BathroomFeature,
  KitchenFeature,
  RoomFeature,
  OutdoorSpaceFeature,
  LandFeature,
  BuildingFeature,
  ParkingFeature,
  SecurityFeature,
  AccessibilityFeature,
  StorageFeature
} from "~~/layers/database/server/database/prisma/generated/enums";

interface PremiumListItem {
  label: string;
  value: string;
}

/**
 * Get premium features from a listing to display on cards
 * Features are prioritized by what property seekers value most
 */
export function getPremiumFeatures(listing: any, max = 20): PremiumListItem[] {
  const features: PremiumListItem[] = [];
  
  // Helper to check if a feature array includes a specific enum value
  const hasFeature = (arr: any[], feature: string): boolean => {
    return Array.isArray(arr) && arr.includes(feature);
  };

  // Extract feature arrays from listing
  const bedrooms = listing?.property?.bedrooms || [];
  const bathrooms = listing?.property?.bathrooms || [];
  const kitchens = listing?.property?.kitchens || [];
  const receptions = listing?.property?.receptions || [];
  const otherRooms = listing?.property?.otherRooms || [];
  const gardens = listing?.property?.gardens || [];
  const yards = listing?.property?.yards || [];
  const land = listing?.property?.land || [];
  const additionalFeatures = listing?.property?.additionalFeatures;
  const parking = listing?.property?.parking;
  const security = listing?.property?.security;
  const accessibility = listing?.property?.accessibility;
  const storage = listing?.property?.storage;

  // TOP TIER - High demand, major decision factors
  if (parking && hasFeature(parking.features, ParkingFeature.GARAGE)) {
    features.push({ label: 'Garage', value: ParkingFeature.GARAGE });
  }
  if (parking && hasFeature(parking.features, ParkingFeature.DRIVEWAY)) {
    features.push({ label: 'Driveway', value: ParkingFeature.DRIVEWAY });
  }
  if (gardens.length > 0) {
    features.push({ label: 'Garden', value: 'GARDEN' });
  }
  if (otherRooms.some((r: any) => r.type === 'OFFICE')) {
    features.push({ label: 'Home Office', value: 'OFFICE' });
  }
  if (kitchens.some((k: any) => hasFeature(k.features, KitchenFeature.MODERN))) {
    features.push({ label: 'Modern Kitchen', value: KitchenFeature.MODERN });
  }
  if (additionalFeatures?.petFriendly) {
    features.push({ label: 'Pet Friendly', value: 'PET_FRIENDLY' });
  }
  if (parking && hasFeature(parking.features, ParkingFeature.ALLOCATED_PARKING)) {
    features.push({ label: 'Allocated Parking', value: ParkingFeature.ALLOCATED_PARKING });
  }
  if (gardens.some((g: any) => hasFeature(g.features, OutdoorSpaceFeature.POOL))) {
    features.push({ label: 'Pool', value: OutdoorSpaceFeature.POOL });
  }

  // HIGH PRIORITY - Desirable lifestyle features
  if (gardens.some((g: any) => hasFeature(g.features, OutdoorSpaceFeature.BALCONY))) {
    features.push({ label: 'Balcony', value: OutdoorSpaceFeature.BALCONY });
  }
  if (parking && hasFeature(parking.features, ParkingFeature.EV_CHARGING)) {
    features.push({ label: 'EV Charging', value: ParkingFeature.EV_CHARGING });
  }
  if (additionalFeatures && hasFeature(additionalFeatures.features, BuildingFeature.GYM)) {
    features.push({ label: 'Gym', value: BuildingFeature.GYM });
  }
  if (additionalFeatures && hasFeature(additionalFeatures.features, BuildingFeature.CONCIERGE)) {
    features.push({ label: 'Concierge', value: BuildingFeature.CONCIERGE });
  }
  if (kitchens.some((k: any) => hasFeature(k.features, KitchenFeature.OPEN_PLAN))) {
    features.push({ label: 'Open Plan Kitchen', value: KitchenFeature.OPEN_PLAN });
  }
  if (kitchens.some((k: any) => hasFeature(k.features, KitchenFeature.WHITE_GOODS))) {
    features.push({ label: 'White Goods', value: KitchenFeature.WHITE_GOODS });
  }
  if (bedrooms.some((b: any) => hasFeature(b.features, BedroomFeature.EN_SUITE))) {
    features.push({ label: 'Ensuite', value: BedroomFeature.EN_SUITE });
  }
  if (bedrooms.some((b: any) => hasFeature(b.features, BedroomFeature.WALK_IN_WARDROBE))) {
    features.push({ label: 'Walk-in Wardrobe', value: BedroomFeature.WALK_IN_WARDROBE });
  }

  // MEDIUM PRIORITY - Nice to have features
  if (receptions.some((r: any) => hasFeature(r.features, RoomFeature.FIREPLACE)) ||
      otherRooms.some((r: any) => hasFeature(r.features, RoomFeature.FIREPLACE))) {
    features.push({ label: 'Fireplace', value: RoomFeature.FIREPLACE });
  }
  if (security && hasFeature(security.features, SecurityFeature.GATED_COMMUNITY)) {
    features.push({ label: 'Gated Community', value: SecurityFeature.GATED_COMMUNITY });
  }
  if (kitchens.some((k: any) => hasFeature(k.features, KitchenFeature.ISLAND))) {
    features.push({ label: 'Island', value: KitchenFeature.ISLAND });
  }
  if (gardens.some((g: any) => hasFeature(g.features, OutdoorSpaceFeature.TERRACE))) {
    features.push({ label: 'Terrace', value: OutdoorSpaceFeature.TERRACE });
  }
  if (gardens.some((g: any) => hasFeature(g.features, OutdoorSpaceFeature.PATIO))) {
    features.push({ label: 'Patio', value: OutdoorSpaceFeature.PATIO });
  }
  if (gardens.some((g: any) => hasFeature(g.features, OutdoorSpaceFeature.SUN_TERRACE))) {
    features.push({ label: 'Sun Terrace', value: OutdoorSpaceFeature.SUN_TERRACE });
  }
  if (kitchens.some((k: any) => hasFeature(k.features, KitchenFeature.UTILITY_ACCESS))) {
    features.push({ label: 'Utility Room Access', value: KitchenFeature.UTILITY_ACCESS });
  }
  if (kitchens.some((k: any) => hasFeature(k.features, KitchenFeature.PANTRY))) {
    features.push({ label: 'Pantry', value: KitchenFeature.PANTRY });
  }
  if (kitchens.some((k: any) => hasFeature(k.features, KitchenFeature.BREAKFAST_BAR))) {
    features.push({ label: 'Breakfast Bar', value: KitchenFeature.BREAKFAST_BAR });
  }
  if (bedrooms.some((b: any) => hasFeature(b.features, BedroomFeature.BUILT_IN_STORAGE))) {
    features.push({ label: 'Built-in Storage', value: BedroomFeature.BUILT_IN_STORAGE });
  }

  // LOWER PRIORITY - Specific needs/situations
  if (gardens.some((g: any) => hasFeature(g.features, OutdoorSpaceFeature.GARDEN_OFFICE))) {
    features.push({ label: 'Garden Office', value: OutdoorSpaceFeature.GARDEN_OFFICE });
  }
  if (gardens.some((g: any) => hasFeature(g.features, OutdoorSpaceFeature.SUMMER_HOUSE))) {
    features.push({ label: 'Summer House', value: OutdoorSpaceFeature.SUMMER_HOUSE });
  }
  if (bathrooms.some((b: any) => hasFeature(b.features, BathroomFeature.WALK_IN_SHOWER))) {
    features.push({ label: 'Walk-in Shower', value: BathroomFeature.WALK_IN_SHOWER });
  }
  if (bathrooms.some((b: any) => hasFeature(b.features, BathroomFeature.BATHTUB))) {
    features.push({ label: 'Bathtub', value: BathroomFeature.BATHTUB });
  }
  if (parking && hasFeature(parking.features, ParkingFeature.CARPORT)) {
    features.push({ label: 'Carport', value: ParkingFeature.CARPORT });
  }
  if (land.length > 0) {
    features.push({ label: 'Land', value: 'LAND' });
  }
  if (security && hasFeature(security.features, SecurityFeature.CCTV)) {
    features.push({ label: 'CCTV', value: SecurityFeature.CCTV });
  }
  if (security && hasFeature(security.features, SecurityFeature.ALARM_SYSTEM)) {
    features.push({ label: 'Alarm System', value: SecurityFeature.ALARM_SYSTEM });
  }

  // ACCESSIBILITY - Important for specific users
  if (accessibility && hasFeature(accessibility.features, AccessibilityFeature.WHEELCHAIR_FRIENDLY)) {
    features.push({ label: 'Wheelchair Friendly', value: AccessibilityFeature.WHEELCHAIR_FRIENDLY });
  }
  if (accessibility && hasFeature(accessibility.features, AccessibilityFeature.STEP_FREE_ACCESS)) {
    features.push({ label: 'Step Free Access', value: AccessibilityFeature.STEP_FREE_ACCESS });
  }
  if (accessibility && hasFeature(accessibility.features, AccessibilityFeature.ELEVATOR)) {
    features.push({ label: 'Elevator', value: AccessibilityFeature.ELEVATOR });
  }
  if (accessibility && hasFeature(accessibility.features, AccessibilityFeature.WIDE_DOORWAYS)) {
    features.push({ label: 'Wide Doorways', value: AccessibilityFeature.WIDE_DOORWAYS });
  }

  // BASIC AMENITIES - Expected in many properties
  if (additionalFeatures && hasFeature(additionalFeatures.features, BuildingFeature.INTERNET)) {
    features.push({ label: 'Internet', value: BuildingFeature.INTERNET });
  }
  if (gardens.some((g: any) => hasFeature(g.features, OutdoorSpaceFeature.SHED))) {
    features.push({ label: 'Shed', value: OutdoorSpaceFeature.SHED });
  }
  if (parking && hasFeature(parking.features, ParkingFeature.PERMIT_PARKING)) {
    features.push({ label: 'Permit Parking', value: ParkingFeature.PERMIT_PARKING });
  }
  if (parking && hasFeature(parking.features, ParkingFeature.ON_STREET)) {
    features.push({ label: 'On Street Parking', value: ParkingFeature.ON_STREET });
  }

  // LOWER PRIORITY - Less commonly sought
  if (security && hasFeature(security.features, SecurityFeature.RECEPTION)) {
    features.push({ label: 'Reception', value: SecurityFeature.RECEPTION });
  }
  if (security && hasFeature(security.features, SecurityFeature.SECURITY)) {
    features.push({ label: 'Security', value: SecurityFeature.SECURITY });
  }
  if (security && hasFeature(security.features, SecurityFeature.INTERCOM_SYSTEM)) {
    features.push({ label: 'Intercom System', value: SecurityFeature.INTERCOM_SYSTEM });
  }
  if (accessibility && hasFeature(accessibility.features, AccessibilityFeature.WET_ROOM)) {
    features.push({ label: 'Wet Room', value: AccessibilityFeature.WET_ROOM });
  }
  if (accessibility && hasFeature(accessibility.features, AccessibilityFeature.HANDRAILS)) {
    features.push({ label: 'Handrails', value: AccessibilityFeature.HANDRAILS });
  }
  if (accessibility && hasFeature(accessibility.features, AccessibilityFeature.ACCESSIBLE_PARKING)) {
    features.push({ label: 'Accessible Parking', value: AccessibilityFeature.ACCESSIBLE_PARKING });
  }
  if (security && hasFeature(security.features, SecurityFeature.NEIGHBORHOOD_WATCH)) {
    features.push({ label: 'Neighbourhood Watch', value: SecurityFeature.NEIGHBORHOOD_WATCH });
  }

  // STORAGE - Useful but lower priority
  if (storage && hasFeature(storage.features, StorageFeature.BASEMENT)) {
    features.push({ label: 'Basement', value: StorageFeature.BASEMENT });
  }
  if (storage && hasFeature(storage.features, StorageFeature.ATTIC)) {
    features.push({ label: 'Attic', value: StorageFeature.ATTIC });
  }
  if (storage && hasFeature(storage.features, StorageFeature.UNDER_STAIRS_STORAGE)) {
    features.push({ label: 'Under Stairs Storage', value: StorageFeature.UNDER_STAIRS_STORAGE });
  }

  return features.slice(0, max);
}
