import type { Address } from "../database/prisma/generated/client";


/**
 * Searches for addresses matching the query string using PostgreSQL full-text search.
 *
 * @param query The query string to search for addresses.
 * @returns A promise that resolves to an array of formatted address strings.
 */
export async function autocompleteAddresses(query: string): Promise<string[]> {
  const sanitizedQuery = prepareFullTextSearch(query);
  const addresses: Address[] = await prisma.$queryRaw<Address[]>`
    SELECT id, street, city, postcode,
    location::text AS location
    FROM "Address"
    WHERE to_tsvector('english', COALESCE(street, '') || ' ' || COALESCE(city, '') || ' ' || COALESCE(postcode, ''))
          @@ to_tsquery('english', ${sanitizedQuery})
    LIMIT 5;
  `;

  return addresses.map((address) => formatAddress(address, query));
}

/**
 * Get AddressID by Text Search.
 *
 * Returns the best match for the given query.
 *
 * @param query The query string to search for an address.
 * @returns A promise that resolves to the ID of the best-matching address or `null` if no match is found.
 */
export async function getAddressIdByTextSearch(query: string): Promise<number | null> {
  const sanitizedQuery = prepareFullTextSearch(query);
  const address = await prisma.$queryRaw<{ id: number }[]>`
    SELECT id
    FROM "Address"
    WHERE to_tsvector('english', COALESCE(street, '') || ' ' || COALESCE(city, '') || ' ' || COALESCE(postcode, ''))
          @@ to_tsquery('english', ${sanitizedQuery})
    ORDER BY ts_rank(
      to_tsvector('english', COALESCE(street, '') || ' ' || COALESCE(city, '') || ' ' || COALESCE(postcode, '')),
      to_tsquery('english', ${sanitizedQuery})
    ) DESC
    LIMIT 1;
  `;

  // Return the ID of the best match or null if no match is found
  return address.length > 0 && address[0] ? address[0].id : null;
}

/**
 * Prepares the query string for PostgreSQL full-text search.
 *
 * @param query string
 * @returns string
 */
export function prepareFullTextSearch(query: string): string {
  const trimmedQuery = query.trim();
  // Replace spaces with " & " for AND logic
  const fullTextQuery = trimmedQuery.replace(/\s+/g, " & ");
  // Add ":*" for prefix matching
  return `${fullTextQuery}:*`;
}

/**
 * Formats an address object into a string, prioritizing the query match.
 *
 * @param address The address object to format.
 * @param query The query string to prioritize in the formatted address.
 * @returns A formatted address string.
 */
function formatAddress(address: Address, query: string): string {
  const street = address.street;
  const city = address.city;
  const postcode = address.postcode;

  const lowerQuery = query.toLowerCase();

  // Generate all possible orders of the address
  const addressVariations = [
    `${city}, ${street}, ${postcode}`,
    `${street}, ${city}, ${postcode}`,
    `${postcode}, ${street}, ${city}`,
    `${city}, ${postcode}, ${street}`,
    `${street}, ${postcode}, ${city}`,
    `${postcode}, ${city}, ${street}`
  ];

  // Check if the query matches any of the variations (case-insensitive)
  for (const variation of addressVariations) {
    if (variation.toLowerCase() === lowerQuery) {
      return variation; // Return the matching variation
    }
  }

  // Check which part of the address matches the query and prioritize it
  if (street.toLowerCase().includes(lowerQuery)) {
    return `${street}, ${city}, ${postcode}`;
  } else if (city.toLowerCase().includes(lowerQuery)) {
    return `${city}, ${street}, ${postcode}`;
  } else if (postcode.toLowerCase().includes(lowerQuery)) {
    return `${postcode}, ${street}, ${city}`;
  }

  // Return null if no match is found
  return `${city}, ${postcode}, ${street}`;
}
