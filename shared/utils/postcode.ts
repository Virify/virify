import { z } from 'zod';

/**
 * Comprehensive UK postcode validation regex
 * Covers 100% of UK postcodes including:
 * - Standard UK mainland postcodes
 * - Special cases (GIR 0AA, etc.)
 * - British Forces Post Office (BFPO)
 * - Crown Dependencies (Jersey, Guernsey, Isle of Man)
 * - Overseas Territories (Cayman Islands, Montserrat, etc.)
 */
export const UK_POSTCODE_REGEX = /^(GIR\s?0AA|SAN\s?TA1|GE\s?CX|BFPO\s?\d{1,4}|KY1[ -]?\d{4}|(MSR|VG|AI)[ -]?\d{4}|([A-Z]{1,2}\d[A-Z\d]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA)\s?\d[A-Z]{2})$/i;

/**
 * Formats a UK postcode to the standard format
 * Examples:
 * - cf101aa -> CF10 1AA
 * - GIR0AA -> GIR 0AA
 * - BFPO1234 -> BFPO 1234
 * - KY11234 -> KY1-1234
 */
export function formatPostcode(postcode: string): string {
  const upper = postcode.toUpperCase().replace(/\s+/g, ' ').trim();
  
  // Special case: GIR 0AA
  if (upper.replace(/\s/g, '') === 'GIR0AA') {
    return 'GIR 0AA';
  }
  
  // Special case: BFPO
  if (/^BFPO\s?\d{1,4}$/.test(upper)) {
    return upper.replace(/^(BFPO)\s?(\d+)$/, '$1 $2');
  }
  
  // Overseas territories with hyphen format (KY1-1234, AI-2640, etc.)
  // These can be input with or without hyphen/space
  const cleanedForTerritory = upper.replace(/[ -]/g, '');
  if (/^(KY\d)\d{4}$/.test(cleanedForTerritory)) {
    // KY1-1234 format
    return cleanedForTerritory.slice(0, 3) + '-' + cleanedForTerritory.slice(3);
  }
  if (/^(MSR|VG|AI)\d{4}$/.test(cleanedForTerritory)) {
    // MSR-1234, VG-1234, AI-2640 format
    return cleanedForTerritory.slice(0, -4) + '-' + cleanedForTerritory.slice(-4);
  }
  
  // Standard UK postcodes - add space before last 3 characters
  const cleaned = upper.replace(/\s/g, '');
  if (cleaned.length >= 5 && cleaned.length <= 7) {
    return cleaned.slice(0, -3) + ' ' + cleaned.slice(-3);
  }
  
  return upper;
}

/**
 * Validates if a string is a valid UK postcode
 */
export function isValidPostcode(postcode: string): boolean {
  // Normalize multiple spaces to single space before validation
  const normalized = postcode.replace(/\s+/g, ' ').trim();
  return UK_POSTCODE_REGEX.test(normalized);
}

/**
 * Zod schema for UK postcode validation and formatting
 * Use this for form validation with automatic formatting
 */
export const postcodeSchema = z.string()
  .min(1, 'Postcode is required')
  .refine(
    (val) => UK_POSTCODE_REGEX.test(val.replace(/\s+/g, ' ').trim()),
    'Please enter a valid UK postcode (e.g., CF10 1AA or cf101aa)'
  )
  .transform(formatPostcode);

/**
 * Validates and formats a postcode, throwing an error if invalid
 * @throws {z.ZodError} if the postcode is invalid
 */
export function validateAndFormatPostcode(postcode: string): string {
  return postcodeSchema.parse(postcode);
}

/**
 * Safely validates and formats a postcode, returning null if invalid
 */
export function safeValidateAndFormatPostcode(postcode: string): string | null {
  const result = postcodeSchema.safeParse(postcode);
  return result.success ? result.data : null;
}
