import { z } from 'zod'
import { BedSizeType, BedroomFeature, BathroomFeature } from '~~/layers/database/server/database/prisma/generated/enums'

/**
 * Step 4: Bedrooms & Bathrooms Schema
 * Validates bedroom and bathroom features with nested room arrays
 */

// Bed size enum values
const bedSizeValues = Object.values(BedSizeType) as [string, ...string[]]
const bedroomFeatureValues = Object.values(BedroomFeature) as [string, ...string[]]
const bathroomFeatureValues = Object.values(BathroomFeature) as [string, ...string[]]

// Bedroom schema - matches Prisma model (name and bed are optional)
export const bedroomSchema = z.object({
  name: z.string().min(1, 'Bedroom name is required').max(100, 'Bedroom name must be 100 characters or less'),
  roomNumber: z.coerce.number().int().min(1),
  description: z.string().max(500).nullable().optional(),
  floor: z.coerce.number().int().min(1, 'Floor is required'),
  bed: z.array(z.enum(bedSizeValues)).default([]),
  features: z.array(z.enum(bedroomFeatureValues)).optional().default([]),
  size: z.coerce.number().min(0).nullable().optional(),
})

// Bathroom schema - matches Prisma model (name is optional)
export const bathroomSchema = z.object({
  name: z.string().min(1, 'Bathroom name is required').max(100, 'Bathroom name must be 100 characters or less'),
  roomNumber: z.coerce.number().int().min(1),
  description: z.string().max(500).nullable().optional(),
  floor: z.coerce.number().int().min(1, 'Floor is required'),
  features: z.array(z.enum(bathroomFeatureValues)).optional().default([]),
  size: z.coerce.number().min(0).nullable().optional(),
})

// Property schema for Step 4
export const step4PropertySchema = z.object({
  totalFloors: z.coerce.number().int().min(1),
  bedroomFeatures: z.array(bedroomSchema).default([]),
  numberBedrooms: z.coerce.number().int().min(0).default(0),
  bathroomFeatures: z.array(bathroomSchema).default([]),
  numberBathrooms: z.coerce.number().int().min(0).default(0),
})

// Step 4 form schema
export const step4Schema = z.object({
  property: step4PropertySchema,
})

// Types
export type BedroomData = z.infer<typeof bedroomSchema>
export type BathroomData = z.infer<typeof bathroomSchema>
export type Step4PropertyData = z.infer<typeof step4PropertySchema>
export type Step4FormData = z.infer<typeof step4Schema>

/**
 * Create initial Step 4 values from existing draft data
 */
export function createInitialStep4Values(draftData?: any): Step4FormData {
  return {
    property: {
      totalFloors: draftData?.property?.totalFloors ?? 1,
      bedroomFeatures: draftData?.property?.bedroomFeatures?.map((b: any) => ({
        name: b.name ?? '',
        roomNumber: b.roomNumber ?? 1,
        description: b.description ?? null,
        floor: b.floor ?? 1,
        bed: b.bed ?? [],
        features: b.features ?? [],
        size: b.size ?? null,
      })) ?? [],
      numberBedrooms: draftData?.property?.numberBedrooms ?? 0,
      bathroomFeatures: draftData?.property?.bathroomFeatures?.map((b: any) => ({
        name: b.name ?? '',
        roomNumber: b.roomNumber ?? 1,
        description: b.description ?? null,
        floor: b.floor ?? 1,
        features: b.features ?? [],
        size: b.size ?? null,
      })) ?? [],
      numberBathrooms: draftData?.property?.numberBathrooms ?? 0,
    }
  }
}

/**
 * Validation helpers for Step 4
 */
export const step4Validation = {
  /**
   * Check if a bedroom has all required fields
   */
  isBedroomComplete: (bedroom: BedroomData): boolean => {
    return Boolean(
      bedroom?.name &&
      bedroom?.roomNumber &&
      bedroom?.floor &&
      bedroom?.bed?.length > 0
    )
  },

  /**
   * Check if a bathroom has all required fields
   */
  isBathroomComplete: (bathroom: BathroomData): boolean => {
    return Boolean(
      bathroom?.name &&
      bathroom?.roomNumber &&
      bathroom?.floor
    )
  },

  /**
   * Check if all bedrooms are valid
   */
  areBedroomsValid: (bedrooms: BedroomData[]): boolean => {
    if (!bedrooms || bedrooms.length === 0) return true // Optional
    return bedrooms.every(step4Validation.isBedroomComplete)
  },

  /**
   * Check if all bathrooms are valid
   */
  areBathroomsValid: (bathrooms: BathroomData[]): boolean => {
    if (!bathrooms || bathrooms.length === 0) return true // Optional
    return bathrooms.every(step4Validation.isBathroomComplete)
  },

  /**
   * Check if Step 4 form is valid
   */
  isStep4Valid: (data: Step4FormData): boolean => {
    if (!data?.property) return true // No data yet is valid (bedrooms/bathrooms are optional)
    return step4Validation.areBedroomsValid(data.property.bedroomFeatures || []) &&
           step4Validation.areBathroomsValid(data.property.bathroomFeatures || [])
  },
}
