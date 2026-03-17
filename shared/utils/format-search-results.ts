import type { ListingWithFullProperty as Result } from '../types/listing'

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
  const { fullAddress } = asObject(property?.address)

  return fullAddress as string | undefined
}

/**
 *  Get labels for sale type (e.g. 'chain free', 'leasehold')
 */
function __getLabels(property: Result['property'], isSale: boolean) {
  if (isSale) {
    const { saleListing } = asObject(property)

    // @ts-ignore
    // @TODO - check what the actual type expected is, here
    return [saleListing?.tenureType].filter(Boolean)
  }

  const { rentalListing } = asObject(property)

  // @ts-ignore
  // @TODO - check what the actual type expected is, here
  return [rentalListing?.tenureType].filter(Boolean)
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
      icon: 'property/font-garden',
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
    return `${numberBedrooms} Bed ${typeName} ${classificationName}`
  }

  // Otherwise return just the type, classification names
  return `${typeName} ${classificationName}`
}


/**
 *  Get price label (e.g. 'Offers in excess of', 'Fixed price')
 */
function __getPriceLabel(result: Result, isSale: boolean) {
  if (isSale) {
    const { priceType } = asObject(result?.saleListing)

    return priceType
  }

  const { priceType } = asObject(result?.rentalListing)

  return priceType
}


/**
 *  Construct URL for listing
 */
function __getListingURL(result: Result) {
  const { id } = asObject(result)

  return `/listing/${id}/`
}


/**
 *  Get formatted property information
 */
export function formatSearchResults(result?: Result) {
  const { price, property, listingType } = asObject(result)

  const isSale = listingType === 'buy'

  /**
   *  @TODO - Should fix type hinting below, as casting everything can
   *          hide any errors (though defensive programming should
   *          mean this does not error)
   */
  return {
    saleOrRent: listingType,
    price: numberToCurrency(price as number),
    overviewAddress: __getFullAddress(property as Result['property']),
    propertyImage: __getFirstImage(property as Result['property']),
    coords: __getCoords(property as Result['property']),
    sellerName: __getUsername(result as Result),
    overview: __getOverview(property as Result['property']),
    icons: __getIcons(property as Result['property']),
    viewURL: __getListingURL(result as Result),

    // @TODO - partial
    labels: __getLabels(property as Result['property'], isSale),
    priceLabel: __getPriceLabel(result as Result, isSale),

    // @TODO - full
    sellerImage: null,
  }
}