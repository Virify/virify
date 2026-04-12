/**
 * Format dashboard listing label
 * @param listing
 * @returns Formatted label string
 */
export const formatDashboardLabel = (listing: any): string => {
  const price = listing.price || 0;
  const formattedPrice = numberToCurrency(typeof price === "number" ? price : 0);
  const address = listing.property?.address;
  if (!address) return `Price: ${formattedPrice}`;

  const addressString = [address.street, address.city, address.postcode].filter(Boolean).join(", ");
  return `Price: ${formattedPrice}, ${addressString}`;
};

/**
 * Generate dashboard search groups for favourites or notes
 * @param items
 * @param type
 * @returns
 */
export const generateDashboardSearchGroups = (items: any[], type: "favourites" | "notes" | "viewed"): any[] => {
  const isNotes = type === "notes";
  const isViewed = type === "viewed";

  const salesItems: any[] = [];
  const rentalItems: any[] = [];

  // Single pass through items
  for (const item of items) {
    const listing = item.listing;
    if (!listing) continue;

    const isSale = !!listing.saleListing;
    const isRent = !!listing.rentalListing;

    if (!isSale && !isRent) continue;

    const mappedItem = {
      id: listing.id,
      label: formatDashboardLabel(listing),
      icon: isViewed ? "i-lucide-eye" : isNotes ? "i-lucide-sticky-note" : "i-heroicons-heart",
      to: `/listing/${listing.id}`,
      target: "_blank",
      note: item.note,
      // Suffix is a hidden search field containing all searchable text
      suffix: [item.note, listing.property?.address?.fullAddress, listing.property?.numberBedrooms + " beds", listing.property?.numberBathrooms + " baths"].filter(Boolean).join(" "),
      image: listing.property?.media?.[0]?.src || "",
      itemPrice: listing.price || (isSale ? listing.saleListing?.price : listing.rentalListing?.price) || 0,
      address: listing.property?.address,
      specs: {
        beds: listing.property?.numberBedrooms || 0,
        baths: listing.property?.numberBathrooms || 0,
      },
    };

    if (isSale) salesItems.push(mappedItem);
    if (isRent) rentalItems.push(mappedItem);
  }

  const prefix = isViewed ? "Viewed" : isNotes ? "Notes" : "Favourites";
  const idPrefix = isViewed ? "viewed" : isNotes ? "notes" : "favourites";

  return [
    {
      id: `${idPrefix}-rentals`,
      key: `${idPrefix}-rentals`,
      label: `${prefix} Rental`,
      items: rentalItems,
    },
    {
      id: `${idPrefix}-sales`,
      key: `${idPrefix}-sales`,
      label: `${prefix} Sale`,
      items: salesItems,
    },
  ];
};
