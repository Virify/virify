import type { RentalAvailabilityStatus, SaleAvailabilityStatus } from "~~/layers/database/server/database/prisma/generated/client";

/**
 * Converts a string to a valid Prisma enum value.
 * 
 * @param value The input string to convert.
 * @returns A valid enum value or undefined if the input is invalid.
 */
export function convertToValidEnum(
  value: string | undefined
): (RentalAvailabilityStatus | SaleAvailabilityStatus)[] | undefined {
  if (!value || value === "all") {
    return undefined;
  }

  // Convert string to array of valid Prisma enum values
  return value.split(",").map((v) =>
    v.trim().toUpperCase().replace(/\s+/g, "_") as RentalAvailabilityStatus | SaleAvailabilityStatus
  );
}

/**
 * Convert enum values to readable strings (handles underscore, camelCase, and uppercase)
 * This is the comprehensive version used for all feature/room enums.
 * 
 * @param enumValue The enum value to convert
 * @returns Readable string with proper capitalization
 */
export function convertEnumToString(enumValue: string | null | undefined): string {
  if (!enumValue) return "";
  
  // Handle underscore-separated enums first (e.g., "OPEN_PLAN" -> "Open Plan")
  if (enumValue.includes('_')) {
    return enumValue
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  // Handle all-uppercase enums (like "GYM" -> "Gym")
  if (enumValue === enumValue.toUpperCase() && enumValue.length > 1) {
    return enumValue.charAt(0).toUpperCase() + enumValue.slice(1).toLowerCase();
  }
  
  // Handle camelCase enums (e.g., "enSuite" -> "En Suite")
  return enumValue.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
}

/**
 * Format and return a capitalized enum string (simple version for basic enums).
 * 
 * @param type Enum value.
 * @returns Capitalized string.
 */
export function convertEnumToCapalizedString(type: string | undefined): string {
  if(!type) return "";
  const formatted = type.toLowerCase().replace(/_/g, " ");
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
