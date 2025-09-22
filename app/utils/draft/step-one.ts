import { SaleAvailabilityStatus, TenureType } from "~~/layers/database/server/database/prisma/generated/enums";

/**
 * Step One Listing Options
 */
export const stepOneListingOptions = [
  { value: 'sale', key: 'For Sale', info: 'Further listing details will be specific to Sales' },
  { value: 'rent', key: 'For Rent', info: 'Further listing details will be specific to Rentals' },
];

/**
 * Sale Step One Options
 */
export const stepOneSaleOptions = {
  saleListingTenureOptions: Object.values(TenureType).map(element => {
    return { value: element, key: convertEnumToCapalizedString(element), info: `Tenure type: ${convertEnumToCapalizedString(element).toLowerCase()}` };
  }),
  saleListingChainOptions: [
    { value: true, key: 'Yes', info: 'This property is part of a chain' },
    { value: false, key: 'No', info: 'This property is not part of a chain' },
  ],
  saleSharedOwnershipOptions: Object.values([true, false]).map(value => {
    return { value: value, key: value ? 'Shared Ownership' : 'No Shared Ownership', info: value ? 'The property is available for shared ownership.' : 'The property is not available for shared ownership.' };
  }),
  saleListingAvailabilityOptions: Object.values(SaleAvailabilityStatus).map(element => {
    return { value: element, key: convertEnumToCapalizedString(element), info: `Your property availability is ${convertEnumToCapalizedString(element).toLowerCase()}` };
  }),
};