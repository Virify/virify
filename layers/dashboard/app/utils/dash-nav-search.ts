
export const formatDashboardLabel = (listing: any) => {
  const price = listing.price || 0
  const formattedPrice = numberToCurrency(typeof price === 'number' ? price : 0)
  const address = listing.property?.address
  if (!address) return `Price: ${formattedPrice}`
  
  const addressString = [address.street, address.city, address.postcode].filter(Boolean).join(', ')
  return `Price: ${formattedPrice}, ${addressString}`
}

export const generateDashboardSearchGroups = (items: any[], type: 'favourites' | 'notes') => {
  const isNotes = type === 'notes'
  
  const salesItems = items
    .filter(item => item.listing?.saleListing)
    .map(item => {
      const listing = item.listing!
      return {
        id: listing.id,
        label: formatDashboardLabel(listing),
        icon: isNotes ? 'i-lucide-sticky-note' : 'i-heroicons-heart',
        to: `/listing/${listing.id}`,
        target: '_blank',
        note: item.note,
        // Suffix is a hidden search field containing all searchable text
        suffix: [item.note, listing.property?.address?.fullAddress, listing.property?.numberBedrooms + ' beds', listing.property?.numberBathrooms + ' baths'].filter(Boolean).join(' '),
        image: listing.property?.media?.[0]?.src || '',
        itemPrice: listing.price || listing.saleListing?.price || 0,
        address: listing.property?.address,
        specs: {
          beds: listing.property?.numberBedrooms || 0,
          baths: listing.property?.numberBathrooms || 0
        }
      }
    })

  const rentalItems = items
    .filter(item => item.listing?.rentalListing)
    .map(item => {
      const listing = item.listing!
      return {
        id: listing.id,
        label: formatDashboardLabel(listing),
        icon: isNotes ? 'i-lucide-sticky-note' : 'i-heroicons-heart',
        to: `/listing/${listing.id}`,
        target: '_blank',
        note: item.note,
        // Suffix is a hidden search field containing all searchable text
        suffix: [item.note, listing.property?.address?.fullAddress, listing.property?.numberBedrooms + ' beds', listing.property?.numberBathrooms + ' baths'].filter(Boolean).join(' '),
        image: listing.property?.media?.[0]?.src || '',
        itemPrice: listing.price || listing.rentalListing?.price || 0,
        address: listing.property?.address,
        specs: {
          beds: listing.property?.numberBedrooms || 0,
          baths: listing.property?.numberBathrooms || 0
        }
      }
    })

  const prefix = isNotes ? 'Notes' : 'Favourites'
  const idPrefix = isNotes ? 'notes' : 'favourites'

  return [
    {
      id: `${idPrefix}-rentals`,
      key: `${idPrefix}-rentals`,
      label: `${prefix} Rental`,
      items: rentalItems
    },
    {
      id: `${idPrefix}-sales`,
      key: `${idPrefix}-sales`,
      label: `${prefix} Sale`,
      items: salesItems
    }
  ]
}
