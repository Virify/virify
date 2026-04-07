import type { ListingCardType } from './listing';

export type UserHiddenListingCard = {
  id: number;
  hiddenAt: Date | string;
  reason: string | null;
  userPreferencesId: number;
  listing: ListingCardType;
};
