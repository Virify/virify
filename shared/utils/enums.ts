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
 * Format and return a pretty price type enum.
 * 
 * @param type Price Type enum.
 * @returns string.
 */
export function convertEnumToString(type: string | undefined): string {
  if(!type) return "";
  return type.toUpperCase().replace("_", " ");
}

/**
 * Format and return a capitalized price type enum.
 * @param type Price Type enum.
 * @returns Capitalized string.
 */
export function convertEnumToCapalizedString(type: string | undefined): string {
  if(!type) return "";
  const formatted = type.toLowerCase().replace("_", " ");
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
