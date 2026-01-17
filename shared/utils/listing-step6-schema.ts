import { z } from 'zod'
import { GardenFacing, GardenPosition, OutdoorSpaceFeature, LandFeature } from '~~/layers/database/server/database/prisma/generated/enums'

/**
 * Step 6: Outdoor Spaces Schema
 * Validates garden, yard, and land features with nested arrays
 */

// Enum values for schema
const gardenFacingValues = Object.values(GardenFacing) as [string, ...string[]]
const gardenPositionValues = Object.values(GardenPosition) as [string, ...string[]]
const outdoorSpaceFeatureValues = Object.values(OutdoorSpaceFeature) as [string, ...string[]]
const landFeatureValues = Object.values(LandFeature) as [string, ...string[]]

// Garden schema - matches Prisma model
export const gardenSchema = z.object({
  name: z.string().min(1, 'Garden name is required').max(100, 'Garden name must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').nullable().optional(),
  facing: z.enum(gardenFacingValues).nullable().optional(),
  position: z.enum(gardenPositionValues).nullable().optional(),
  features: z.array(z.enum(outdoorSpaceFeatureValues)).optional().default([]),
  size: z.coerce.number().min(0, 'Size must be 0 or greater').nullable().optional(),
})

// Yard schema - matches Prisma model
export const yardSchema = z.object({
  name: z.string().min(1, 'Yard name is required').max(100, 'Yard name must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').nullable().optional(),
  facing: z.enum(gardenFacingValues).nullable().optional(),
  position: z.enum(gardenPositionValues).nullable().optional(),
  features: z.array(z.enum(outdoorSpaceFeatureValues)).optional().default([]),
  size: z.coerce.number().min(0, 'Size must be 0 or greater').nullable().optional(),
})

// Land schema - matches Prisma model
export const landSchema = z.object({
  name: z.string().min(1, 'Land name is required').max(100, 'Land name must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').nullable().optional(),
  features: z.array(z.enum(landFeatureValues)).optional().default([]),
  size: z.coerce.number().min(0, 'Size must be 0 or greater').nullable().optional(),
})

// Outdoor space schema for Step 6
export const step6OutdoorSpaceSchema = z.object({
  description: z.string().max(1000).nullable().optional(),
  totalArea: z.coerce.number().min(0).nullable().optional(),
  features: z.array(z.enum(outdoorSpaceFeatureValues)).optional().default([]),
  garden: z.array(gardenSchema).default([]),
  yard: z.array(yardSchema).default([]),
  land: z.array(landSchema).default([]),
})

// Property schema for Step 6
export const step6PropertySchema = z.object({
  outdoorSpace: step6OutdoorSpaceSchema,
})

// Step 6 form schema
export const step6Schema = z.object({
  property: step6PropertySchema,
})

// Types inferred from schemas (matching Step 4 pattern)
export type GardenData = z.infer<typeof gardenSchema>
export type YardData = z.infer<typeof yardSchema>
export type LandData = z.infer<typeof landSchema>
export type Step6OutdoorSpaceData = z.infer<typeof step6OutdoorSpaceSchema>
export type Step6PropertyData = z.infer<typeof step6PropertySchema>
export type Step6FormData = z.infer<typeof step6Schema>

/**
 * Create initial Step 6 values from existing draft data
 */
export function createInitialStep6Values(draftData?: any): Step6FormData {
  const outdoorSpace = draftData?.property?.outdoorSpace
  return {
    property: {
      outdoorSpace: {
        description: outdoorSpace?.description ?? null,
        totalArea: outdoorSpace?.totalArea ?? null,
        features: outdoorSpace?.features ?? [],
        garden: outdoorSpace?.garden?.map((g: any) => ({
          name: g.name ?? '',
          description: g.description ?? null,
          facing: g.facing ?? null,
          position: g.position ?? null,
          features: g.features ?? [],
          size: g.size ?? null,
        })) ?? [],
        yard: outdoorSpace?.yard?.map((y: any) => ({
          name: y.name ?? '',
          description: y.description ?? null,
          facing: y.facing ?? null,
          position: y.position ?? null,
          features: y.features ?? [],
          size: y.size ?? null,
        })) ?? [],
        land: outdoorSpace?.land?.map((l: any) => ({
          name: l.name ?? '',
          description: l.description ?? null,
          features: l.features ?? [],
          size: l.size ?? null,
        })) ?? [],
      }
    }
  }
}

/**
 * Validation helpers for Step 6
 */
export const step6Validation = {
  /**
   * Check if a garden has all required fields
   */
  isGardenComplete: (garden: GardenData): boolean => {
    return Boolean(garden?.name && garden.name.trim().length > 0)
  },

  /**
   * Check if a yard has all required fields
   */
  isYardComplete: (yard: YardData): boolean => {
    return Boolean(yard?.name && yard.name.trim().length > 0)
  },

  /**
   * Check if a land parcel has all required fields
   */
  isLandComplete: (land: LandData): boolean => {
    return Boolean(land?.name && land.name.trim().length > 0)
  },

  /**
   * Check if all gardens are valid
   */
  areGardensValid: (gardens: GardenData[]): boolean => {
    if (!gardens || gardens.length === 0) return true // Optional
    return gardens.every(step6Validation.isGardenComplete)
  },

  /**
   * Check if all yards are valid
   */
  areYardsValid: (yards: YardData[]): boolean => {
    if (!yards || yards.length === 0) return true // Optional
    return yards.every(step6Validation.isYardComplete)
  },

  /**
   * Check if all land parcels are valid
   */
  areLandParcelsValid: (land: LandData[]): boolean => {
    if (!land || land.length === 0) return true // Optional
    return land.every(step6Validation.isLandComplete)
  },

  /**
   * Check if Step 6 form is valid
   */
  isStep6Valid: (data: Step6FormData): boolean => {
    if (!data?.property?.outdoorSpace) return true // No data yet is valid (all outdoor spaces are optional)
    return step6Validation.areGardensValid(data.property.outdoorSpace.garden || []) &&
           step6Validation.areYardsValid(data.property.outdoorSpace.yard || []) &&
           step6Validation.areLandParcelsValid(data.property.outdoorSpace.land || [])
  },
}
