/**
 *  Search radius
 */
const radiusOptions = [
  { value: 0, key: "This location only" },
  { value: 0.25, key: "Within 0.25 miles" },
  { value: 0.5, key: "Within 0.5 miles" },
  { value: 1, key: "Within 1 mile" },
  { value: 2, key: "Within 2 miles" },
  { value: 5, key: "Within 5 miles" },
  { value: 10, key: "Within 10 miles" },
  { value: 20, key: "Within 20 miles" },
  { value: 40, key: "Within 40 miles" },
];

/**
 * Bedrooms
 */
const bedroomOptions = [
  { value: "0", key: "Any" },
  { value: "1", key: "1" },
  { value: "2", key: "2" },
  { value: "3", key: "3" },
  { value: "4", key: "4" },
  { value: "5", key: "5" },
  { value: "6", key: "6" },
  { value: "7", key: "7" },
  { value: "8", key: "8" },
  { value: "9", key: "9" },
  { value: "10", key: "10" },
];

/**
 * Bathroom options
 */

const bathroomOptions = [
  { value: "0", key: "Any" },
  { value: "1", key: "1" },
  { value: "2", key: "2" },
  { value: "3", key: "3" },
  { value: "4", key: "4" },
  { value: "5", key: "5" },
];

/**
 * Date Options
 */
const dateOptions = [
  { value: "0", key: "Anytime" },
  { value: "1", key: "1 day" },
  { value: "3", key: "3 days" },
  { value: "7", key: "7 days" },
  { value: "14", key: "14 days" },
];

/**
 * Include Options
 */
const saleAvailabilityOptions = [
  { value: "all", key: "All" },
  { value: "available", key: "Available" },
  { value: "under offer", key: "Under offer" },
  { value: "sold", key: "Sold" },
]

const rentAvailabilityOptions = [
  { value: "all", key: "All" },
  { value: "available", key: "Available" },
  { value: "let agreed", key: "Let agreed" },
  { value: "let", key: "Let" },
]

/**
 * Propety Feature options
 * 
 * !! IMPORTANT !!
 *  - The group name must match the Prisma model name
 *  - The key name must match the Prisma model field name
 */
const propertyFeatures = [
  { group: 'additionalFeatures', key: "petFriendly", label: "Pet-friendly", isDefault: false },
  { group: 'parking', key: "garage", label: "Garage", isDefault: false },
  { group: 'parking', key: "evCharging", label: "EV Charging", isDefault: false },
  { group: 'rearGarden', key: "garden", label: "Garden", isDefault: false },
  { group: 'frontGarden', key: "garden", label: "Garden", isDefault: false },
  { group: 'accessibilityFeatures', key: "wheelchairFriendly", label: "Accessible", isDefault: false },
];

const buyOrRentOptions = [
  { key: "buy", value: "Buy" },
  { key: "rent", value: "Rent" },
  // { key: 'price', value: 'Prices' },
];

/**
 *  Get config
 */
export function getSearchFormConfig() {
  return {
    radiusOptions,
    bedroomOptions,
    bathroomOptions,
    dateOptions,
    saleAvailabilityOptions,
    rentAvailabilityOptions,
    propertyFeatures,
    buyOrRentOptions
  }
}