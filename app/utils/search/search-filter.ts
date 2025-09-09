/**
 * Simple listing search utilities shared by favourites & notes.
 * Intentionally untyped / loose for flexibility.
 */

/**
 * Check if a single item matches the search term.
 * Searches: full address, title, price (raw), category tokens (sale/rental), optional note.
 */
export function matchesListingSearch(item: any, term: string, includeNote: boolean = false) {
  if (!term) return true;
  const t = term.toLowerCase();
  const listing = item?.listing || item; // fallback if raw listing passed

  const parts: any[] = [
    listing?.property?.address?.fullAddress,
    listing?.title,
    listing?.price != null ? String(listing.price) : "",
    listing?.saleListing ? "sale" : "",
    listing?.rentalListing ? "rental" : "",
  ];
  if (includeNote) parts.push(item?.note);

  return parts
    .filter(Boolean)
    .map(p => String(p).toLowerCase())
    .some(p => p.includes(t));
}

/**
 * Filter a collection of items by term.
 */
export function filterListingItems(items: any[], term: string, includeNote: boolean = false) {
  const trimmed = term?.trim().toLowerCase();
  if (!trimmed) return items;
  return (items || []).filter(it => matchesListingSearch(it, trimmed, includeNote));
}
