import type { ListingWithFullProperty as Result } from '../types/listing'

interface LastChange {
  dateChanged: string
  dateChangedType: 'Added' | 'Updated' | 'Reduced'
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
 *  Get all images for the result card
 */
function __getImages(property: Result['property']): string[] {
  const { media } = asObject(property)

  interface PropertyImage {
    image: string
  }

  return asArray(media).map((row: PropertyImage) => {
    const { image } = asObject(row)

    return image
  })
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
function __getLabels(result: Result, isSale: boolean): string[] {
  if (isSale) {
    const { tenureType, furnishedStatus, chain } = asObject(result?.saleListing)

    // @TODO - probably want to standardise how we format enum strings
    return [
      tenureType,
      furnishedStatus,
      chain && 'Chain free'
    ].map(__formatString).filter(isString)
  }

  const { rentalLength, furnishedStatus } = asObject(result?.rentalListing)

  // @TODO - probably want to standardise how we format enum strings
  return [rentalLength, furnishedStatus].map(__formatString).filter(isString)
}

/**
 *  Get icons for all property key features
 */
function __getIcons(property: Result['property']): { icon: string, label: string }[] {
  const {
    numberBedrooms,
    numberBathrooms,
    numberReceptions,
    energyAndUtilities,
    parking,
    outdoorSpace,
  } = asObject(property)

  const __hasRenewables = (energyAndUtilities: unknown): boolean => {
    const { renewables } = asObject(energyAndUtilities)

    return isPopulatedArray(renewables)
  }

  const __hasParking = (parking: unknown): boolean => {
    const { features } = asObject(parking)

    return isPopulatedArray(features)
  }

  const __hasOutdoorSpace = (outdoorSpace: unknown): boolean => {
    const { garden, yard, land } = asObject(outdoorSpace)

    const hasGarden = isPopulatedArray(garden)
    const hasYard = isPopulatedArray(yard)
    const hasLand = isPopulatedArray(land)

    return hasGarden || hasYard || hasLand
  }

  // Get numbered rooms
  const numberedRooms = [
    {
      icon: 'property/bedrooms',
      count: numberBedrooms,
      label: 'Bedrooms'
    },
    {
      icon: 'property/bathrooms',
      count: numberBathrooms,
      label: 'Bathrooms'
    },
    {
      icon: 'property/receptions',
      count: numberReceptions,
      label: 'Receptions'
    },
  ].filter(({ count }) => !!count)

  // Get other features
  const booleanFeatures = [
    {
      icon: 'property/parking',
      label: 'Parking',
      active: __hasParking(parking),
    },
    {
      icon: 'property/front-garden',
      label: 'Garden',
      active: __hasOutdoorSpace(outdoorSpace),
    },
    {
      icon: 'property/utility',
      label: 'Renewables',
      active: __hasRenewables(energyAndUtilities),
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
function __getRentalFrequency(rentalListing: Result['rentalListing']): string | undefined {
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
    price,
    property,
    listingType,
    saleListing,
    rentalListing,
    user,
  } = asObject(result)

  const isSale = listingType === 'buy'
  const { dateChanged, dateChangedType } = __getLastChanged(property)

  const { id: userId, username, avatar } = asObject(user)
  const images = __getImages(property as Result['property'])

  /**
   *  @TODO - Should fix type hinting below, as casting everything can
   *          hide any errors (though defensive programming should
   *          mean this does not error)
   */
  return {
    listingId: id as number,
    userId: userId as number,
    saleOrRent: listingType as 'buy' | 'rent',
    price: numberToCurrency(price as number, true),
    overviewAddress: __getFullAddress(property as Result['property']),
    propertyImage: images[0],
    carouselImages: images,
    coords: __getCoords(property as Result['property']),
    overview: __getOverview(property as Result['property']),
    icons: __getIcons(property as Result['property']),
    viewUrl: __getListingURL(result as Result),
    dateChanged: dateChanged,
    dateChangedType: dateChangedType,
    labels: __getLabels(result as Result, isSale),
    priceLabel: __getPriceLabel(isSale && saleListing),
    rentFrequency: __getRentalFrequency(!isSale && rentalListing),
    sellerName: username as string | undefined,
    sellerImage: avatar as string | undefined
  }
}