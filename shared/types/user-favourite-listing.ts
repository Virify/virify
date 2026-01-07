import type { ListingCardType } from './listing';

export type UserFavouriteListingCard = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userPreferencesId: number;
  listing: ListingCardType;
};
