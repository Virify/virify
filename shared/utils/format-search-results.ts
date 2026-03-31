import type { ListingWithFullProperty as Result } from '../types/listing'

interface LastChange {
  dateChanged: string
  dateChangedType: 'Added' | 'Updated'
}

/**
 *  Format copy from labels
 */
function __formatString(key?: string | null): string | undefined {
  // If not a string, return nothing
  if (!isString(key)) return undefined

  // Otherwise return closest match, OR itself
  const dictionaryPhrases: Record<string, string> = {
    // Rental frequency
    WEEKLY: '/week',
    MONTHLY: '/month',

    // Price offer type
    FIXED: 'Fixed Price',
    OFFERS_OVER: 'Offers Over',
    GUIDE_PRICE: 'Guide Price',

    // Furnishing
    FURNISHED: 'Unfurnished',
    UNFURNISHED: 'Unfurnished',
    PART_FURNISHED: 'Part-furnished',

    // Availability
    AVAILABLE: 'Available',
    LET_AGREED: 'Let agreed',
    LET: 'Let',
    UNDER_OFFER: 'Under offer',
    SOLD: 'Sold STC',

    // Sale contract type
    FREEHOLD: 'Freehold',
    LEASEHOLD: 'Leasehold',
    COMMONHOLD: 'Commonhold',

    // Let length
    SHORT_TERM: 'Short term',
    LONG_TERM: 'Long term',
  }

  return dictionaryPhrases[key] || key
}

/**
 *  Get property coords
 */
function __getCoords(property: Result['property']): [number, number] | undefined {
  const { lat, lon } = asObject(property?.address)

  if (lat && lon) return [lat as number, lon as number]

  return undefined
}

/**
 *  Get seller username
 */
function __getUsername(result: Result): string | undefined {
  const { username } = asObject(result?.user)

  return username as string | undefined
}

/**
 *  Get first image from property media attribute
 */
function __getFirstImage(property: Result['property']): string | undefined {
  const { media } = asObject(property)

  // @ts-ignore
  const [firstImage] = asArray(media)

  // @ts-ignore
  return firstImage?.image
}

/**
 *  Get full property address
 */
function __getFullAddress(property: Result['property']): string | undefined {
  const { street, city, postcode } = asObject(property?.address)

  return [street, city, postcode].filter(Boolean).join(', ')
}

/**
 *  Get labels for sale type (e.g. 'chain free', 'leasehold')
 */
function __getLabels(result: Result, isSale: boolean) {
  if (isSale) {
    const { tenureType } = asObject(result?.saleListing)

    // @ts-ignore
    // @TODO - check what the actual type expected is, here
    return [tenureType].map(__formatString).filter(isString)
  }

  const { rentalLength, furnishedStatus } = asObject(result?.rentalListing)

  // @ts-ignore
  // @TODO - check what the actual type expected is, here
  return [rentalLength, furnishedStatus].map(__formatString).filter(isString)
}

/**
 *  Get icons for all property key features
 */
function __getIcons(property: Result['property']): { icon: string, label: string }[] {
  const {
    bedroomFeatures,
    bathroomFeatures,
    reception,
    parking,
    outdoorSpace,
  } = asObject(property)

  // Quickly check if features exist
  const hasFeatures = (attr: unknown): boolean => {
    const { features } = asObject(attr)

    return !!(features as unknown[])?.length
  }

  // Get numbered rooms
  const numberedRooms = [
    {
      icon: 'property/bedrooms',
      count: (bedroomFeatures as unknown[])?.length,
      label: 'Bedrooms'
    },
    {
      icon: 'property/bathrooms',
      count: (bathroomFeatures as unknown[])?.length,
      label: 'Bathrooms'
    },
    {
      icon: 'property/receptions',
      count: (reception as unknown[])?.length,
      label: 'Receptions'
    },
  ].filter(({ count }) => !!count)

  // Get other features
  const booleanFeatures = [
    {
      icon: 'property/parking',
      label: 'Parking',
      active: hasFeatures(parking),
    },
    {
      icon: 'property/front-garden',
      label: 'Garden',
      active: hasFeatures(outdoorSpace),
    }
  ].filter(({ active }) => !!active)

  return [
    ...numberedRooms,
    ...booleanFeatures
  ]
}

/**
 *  Get overview (e.g. bedroom count, property type)
 */
function __getOverview(property: Result['property']): string {
  const { numberBedrooms, type, classification } = asObject(property)

  // Get type, classification names
  const { name: typeName } = asObject(type)
  const { name: classificationName } = asObject(classification)

  // Check bedrooms (e.g. to exclude land without bedrooms)
  if ((numberBedrooms as number) > 0) {
    return `${numberBedrooms} Bed ${typeName}, ${classificationName}`
  }

  // Otherwise return just the type, classification names
  return `${typeName} ${classificationName}`
}

/**
 *  Get rental duration (e.g. price per week or per month)
 */
function __getRentalFrequency(rentalListing: Result['rentalListing']) {
  const { rentFrequency } = asObject(rentalListing)

  return __formatString(rentalListing?.rentFrequency) || rentFrequency
}

/**
 *  Get price label (e.g. 'Offers in excess of', 'Fixed price')
 */
function __getPriceLabel(saleListing: Result['saleListing']): string | undefined {
  const { priceType } = asObject(saleListing)

  return __formatString(priceType) || priceType
}

/**
 *  Construct URL for listing
 */
function __getListingURL(result: Result) {
  const { id } = asObject(result)

  return `/listing/${id}/`
}

/**
 *  Get the year part of an ISO datetime string
 */
function __getDateFromISOString(isoDate?: string): string[] {
  if (!isString(isoDate)) return []

  return isoDate?.split('T') as string[]
}

/**
 *  Get date added, updated
 */
function __getLastChanged(property: Result['property']): LastChange {
  const { createdAt, updatedAt } = asObject(property)

  // Check if the created/edited is the same day. We don't need to
  // convert to dates - we can just compare the ISO string up until the
  // time delineater
  const [day1] = __getDateFromISOString(createdAt)
  const [day2] = __getDateFromISOString(updatedAt)

  if (day1 !== day2) {
    return {
      dateChangedType: 'Reduced',
      dateChanged: updatedAt as string
    }
  }

  return {
    dateChangedType: 'Added',
    dateChanged: createdAt as string
  }
}

/**
 *  Get formatted property information
 */
export function formatSearchResults(result?: Result) {
  const {
    id,
    userId,
    price,
    property,
    listingType,
    saleListing,
    rentalListing
  } = asObject(result)

  const isSale = listingType === 'buy'
  const { dateChanged, dateChangedType } = __getLastChanged(property)

  /**
   *  @TODO - Should fix type hinting below, as casting everything can
   *          hide any errors (though defensive programming should
   *          mean this does not error)
   */
  return {
    listingId: id,
    userId,
    saleOrRent: listingType as 'buy' | 'rent',
    price: numberToCurrency(price as number, true),
    overviewAddress: __getFullAddress(property as Result['property']),
    propertyImage: __getFirstImage(property as Result['property']),
    coords: __getCoords(property as Result['property']),
    sellerName: __getUsername(result as Result),
    overview: __getOverview(property as Result['property']),
    icons: __getIcons(property as Result['property']),
    viewUrl: __getListingURL(result as Result),
    dateChanged: dateChanged,
    dateChangedType: dateChangedType,

    // @TODO - partial
    labels: __getLabels(result as Result, isSale),
    priceLabel: __getPriceLabel(isSale && saleListing),
    rentFrequency: __getRentalFrequency(!isSale && rentalListing),

    // @TODO - full
    sellerImage: null,
  }
}