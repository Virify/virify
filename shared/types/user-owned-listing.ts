import type { ListingCardType } from "~~/shared/types/listing"

export type OwnedListingAnalytics = {
  viewsCount: number
  favouritesCount: number
  enquiriesCount: number
}

export type OwnedListingWithAnalytics = ListingCardType & {
  published: boolean
  archived: boolean
  analytics: OwnedListingAnalytics
  isDraft: boolean
}
