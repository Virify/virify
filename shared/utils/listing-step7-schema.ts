import { z } from 'zod'
import {
  ParkingFeature,
  AccessibilityFeature,
  SecurityFeature,
  StorageFeature,
  UtilityFeature,
  BuildingFeature,
} from '~~/layers/database/server/database/prisma/generated/enums'

/**
 * Step 7: Additional Features Schema
 * Validates parking, accessibility, security, storage, utility, and building features
 */

// Enum values for schema
const parkingFeatureValues = Object.values(ParkingFeature) as [string, ...string[]]
const accessibilityFeatureValues = Object.values(AccessibilityFeature) as [string, ...string[]]
const securityFeatureValues = Object.values(SecurityFeature) as [string, ...string[]]
const storageFeatureValues = Object.values(StorageFeature) as [string, ...string[]]
const utilityFeatureValues = Object.values(UtilityFeature) as [string, ...string[]]
const buildingFeatureValues = Object.values(BuildingFeature) as [string, ...string[]]

// Parking schema
export const parkingSchema = z.object({
  description: z.string().max(500, 'Description must be 500 characters or less').nullable().optional(),
  features: z.array(z.enum(parkingFeatureValues)).optional().default([]),
})

// Accessibility schema
export const accessibilitySchema = z.object({
  description: z.string().max(500, 'Description must be 500 characters or less').nullable().optional(),
  features: z.array(z.enum(accessibilityFeatureValues)).optional().default([]),
})

// Security schema (renamed to avoid conflict with auth securitySchema)
export const step7SecuritySchema = z.object({
  description: z.string().max(500, 'Description must be 500 characters or less').nullable().optional(),
  features: z.array(z.enum(securityFeatureValues)).optional().default([]),
})

// Storage schema
export const storageSchema = z.object({
  description: z.string().max(500, 'Description must be 500 characters or less').nullable().optional(),
  features: z.array(z.enum(storageFeatureValues)).optional().default([]),
})

// Utility room schema
export const utilitySchema = z.object({
  description: z.string().max(500, 'Description must be 500 characters or less').nullable().optional(),
  features: z.array(z.enum(utilityFeatureValues)).optional().default([]),
  size: z.coerce.number().min(0, 'Size must be 0 or greater').nullable().optional(),
})

// Additional/Building features schema
export const additionalFeaturesSchema = z.object({
  description: z.string().max(500, 'Description must be 500 characters or less').nullable().optional(),
  petFriendly: z.boolean().default(true),
  features: z.array(z.enum(buildingFeatureValues)).optional().default([]),
})

// Property schema for Step 7
export const step7PropertySchema = z.object({
  parking: parkingSchema.nullable().optional(),
  accessibilityFeatures: accessibilitySchema.nullable().optional(),
  securityFeatures: step7SecuritySchema.nullable().optional(),
  storageFeatures: storageSchema.nullable().optional(),
  utility: utilitySchema.nullable().optional(),
  additionalFeatures: additionalFeaturesSchema.nullable().optional(),
})

// Step 7 form schema
export const step7Schema = z.object({
  property: step7PropertySchema,
})

// Types
export type ParkingData = z.infer<typeof parkingSchema>
export type AccessibilityData = z.infer<typeof accessibilitySchema>
export type SecurityData = z.infer<typeof step7SecuritySchema>
export type StorageData = z.infer<typeof storageSchema>
export type UtilityData = z.infer<typeof utilitySchema>
export type AdditionalFeaturesData = z.infer<typeof additionalFeaturesSchema>
export type Step7PropertyData = z.infer<typeof step7PropertySchema>
export type Step7FormData = z.infer<typeof step7Schema>

/**
 * Create initial Step 7 values from existing draft data
 */
export function createInitialStep7Values(draftData?: any): Step7FormData {
  const property = draftData?.property
  return {
    property: {
      parking: property?.parking ? {
        description: property.parking.description ?? null,
        features: property.parking.features ?? [],
      } : {
        description: null,
        features: [],
      },
      accessibilityFeatures: property?.accessibilityFeatures ? {
        description: property.accessibilityFeatures.description ?? null,
        features: property.accessibilityFeatures.features ?? [],
      } : {
        description: null,
        features: [],
      },
      securityFeatures: property?.securityFeatures ? {
        description: property.securityFeatures.description ?? null,
        features: property.securityFeatures.features ?? [],
      } : {
        description: null,
        features: [],
      },
      storageFeatures: property?.storageFeatures ? {
        description: property.storageFeatures.description ?? null,
        features: property.storageFeatures.features ?? [],
      } : {
        description: null,
        features: [],
      },
      utility: property?.utility ? {
        description: property.utility.description ?? null,
        features: property.utility.features ?? [],
        size: property.utility.size ?? null,
      } : {
        description: null,
        features: [],
        size: null,
      },
      additionalFeatures: property?.additionalFeatures ? {
        description: property.additionalFeatures.description ?? null,
        petFriendly: property.additionalFeatures.petFriendly ?? true,
        features: property.additionalFeatures.features ?? [],
      } : {
        description: null,
        petFriendly: true,
        features: [],
      },
    }
  }
}

/**
 * Validation helpers for Step 7
 */
export const step7Validation = {
  /**
   * Check if Step 7 form is valid
   * All fields are optional, so step is always valid
   */
  isStep7Valid: (): boolean => {
    return true
  },

  /**
   * Check if step 7 has any data
   */
  hasStep7Data: (data: Step7FormData): boolean => {
    const p = data.property
    return (
      (p.parking?.features?.length ?? 0) > 0 ||
      (p.accessibilityFeatures?.features?.length ?? 0) > 0 ||
      (p.securityFeatures?.features?.length ?? 0) > 0 ||
      (p.storageFeatures?.features?.length ?? 0) > 0 ||
      (p.utility?.features?.length ?? 0) > 0 ||
      (p.additionalFeatures?.features?.length ?? 0) > 0 ||
      !!p.parking?.description ||
      !!p.accessibilityFeatures?.description ||
      !!p.securityFeatures?.description ||
      !!p.storageFeatures?.description ||
      !!p.utility?.description ||
      !!p.additionalFeatures?.description
    )
  },
}
