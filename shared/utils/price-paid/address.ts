/**
 * Format an address fragment for Land Registry matching.
 */
export function formatPricePaidAddressPart(value: string): string {
  return value.toUpperCase().replace(/\s*,\s*/g, ", ").replace(/\s+/g, " ").trim();
}

/**
 * Format an optional address fragment for Land Registry matching.
 */
export function formatOptionalPricePaidAddressPart(value?: string | null): string | null {
  if (!value) return null;
  return formatPricePaidAddressPart(value) || null;
}

/**
 * Resolve the PPD address parts from structured listing address fields.
 */
export function resolvePricePaidAddressParts(address: PricePaidAddressInput): PricePaidAddressParts {
  return {
    number: formatOptionalPricePaidAddressPart(address.number),
    flat: formatOptionalPricePaidAddressPart(address.flat),
  };
}

/**
 * Build simple PAON/SAON match candidates for Land Registry PPD lookups.
 */
export function buildPricePaidAddressMatches(number: string, flat?: string | null): PricePaidAddressMatch[] {
  const paon = formatPricePaidAddressPart(number);

  if (!flat) {
    return [{ paon }];
  }

  return buildFlatSaonCandidates(flat).map((saon) => ({ paon, saon }));
}

/**
 * Build common SAON aliases for flats and apartments.
 */
function buildFlatSaonCandidates(flat: string): string[] {
  const normalisedFlat = formatPricePaidAddressPart(flat);
  const candidates = [
    normalisedFlat,
    formatPricePaidAddressPart(flat.replace(/,/g, " ")),
    ...buildFlatSynonyms(normalisedFlat),
  ];

  return uniquePopulated(candidates);
}

/**
 * Build common flat/apartment label aliases for a single address part.
 */
function buildFlatSynonyms(value: string): string[] {
  const match = value.match(/^(APARTMENT|APT|FLAT)\s+(.+)$/i);
  if (!match?.[2]) return [];

  return [
    formatPricePaidAddressPart(`APARTMENT ${match[2]}`),
    formatPricePaidAddressPart(`APT ${match[2]}`),
    formatPricePaidAddressPart(`FLAT ${match[2]}`),
  ];
}

/**
 * Remove duplicate and empty string candidates.
 */
function uniquePopulated(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}
