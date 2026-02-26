import { z } from 'zod'
import {
  EPCRating,
  HeatingType,
  BoilerType,
  HotWaterSource,
  RenewableEnergy,
  ConnectedUtilities,
} from '~~/layers/database/server/database/prisma/generated/enums'

/**
 * Step 8: Energy & Costs Schema
 * Validates energy performance, heating, utilities, and running costs
 */

// Enum values for schema
const epcRatingValues = Object.values(EPCRating) as [string, ...string[]]
const heatingTypeValues = Object.values(HeatingType) as [string, ...string[]]
const boilerTypeValues = Object.values(BoilerType) as [string, ...string[]]
const hotWaterSourceValues = Object.values(HotWaterSource) as [string, ...string[]]
const renewableEnergyValues = Object.values(RenewableEnergy) as [string, ...string[]]
const connectedUtilitiesValues = Object.values(ConnectedUtilities) as [string, ...string[]]

// Energy and Utilities schema
export const energyAndUtilitiesSchema = z.object({
  description: z.string().max(5000, 'Description must be 5000 characters or less').nullable().optional(),
  epcRating: z.enum(epcRatingValues),
  epcCertificateUrl: z.string().url().nullable().optional(),
  primaryHeatingType: z.array(z.enum(heatingTypeValues)).optional().default([]),
  secondaryHeatingType: z.array(z.enum(heatingTypeValues)).optional().default([]),
  boilerType: z.enum(boilerTypeValues).nullable().optional(),
  hotWaterSource: z.enum(hotWaterSourceValues).nullable().optional(),
  renewables: z.array(z.enum(renewableEnergyValues)).optional().default([]),
  connectedUtilities: z.array(z.enum(connectedUtilitiesValues)).optional().default([]),
})

// Running Costs schema
export const runningCostsSchema = z.object({
  description: z.string().max(5000, 'Description must be 5000 characters or less').nullable().optional(),
  councilTaxBand: z.string({ message: 'Council tax band is required' }),
  serviceCharges: z.coerce.number().min(0, 'Service charges must be 0 or greater').nullable().optional(),
  groundRent: z.coerce.number().min(0, 'Ground rent must be 0 or greater').nullable().optional(),
})

// Property schema for Step 8
export const step8PropertySchema = z.object({
  energyAndUtilities: energyAndUtilitiesSchema,
  runningCosts: runningCostsSchema,
})

// Step 8 form schema
export const step8Schema = z.object({
  property: step8PropertySchema,
})

// Types - Zod inferred (strict for validation)
export type EnergyAndUtilitiesData = z.infer<typeof energyAndUtilitiesSchema>
export type RunningCostsData = z.infer<typeof runningCostsSchema>
export type Step8PropertyData = z.infer<typeof step8PropertySchema>
export type Step8FormData = z.infer<typeof step8Schema>

// Looser interface for form state (USelect returns strings)
export interface Step8FormState {
  property: {
    energyAndUtilities: {
      description: string | null
      epcRating: string
      epcCertificateUrl: string | null
      primaryHeatingType: string[]
      secondaryHeatingType: string[]
      boilerType: string | null
      hotWaterSource: string | null
      renewables: string[]
      connectedUtilities: string[]
    }
    runningCosts: {
      description: string | null
      councilTaxBand: string
      serviceCharges: number | null
      groundRent: number | null
    }
  }
}

/**
 * Create initial Step 8 values from existing draft data
 */
export function createInitialStep8Values(draftData?: any): Step8FormState {
  const property = draftData?.property
  const energyAndUtilities = property?.energyAndUtilities
  const runningCosts = property?.runningCosts

  return {
    property: {
      energyAndUtilities: {
        description: energyAndUtilities?.description ?? null,
        epcRating: energyAndUtilities?.epcRating ?? EPCRating.G,
        epcCertificateUrl: energyAndUtilities?.epcCertificateUrl ?? null,
        primaryHeatingType: energyAndUtilities?.primaryHeatingType ?? [],
        secondaryHeatingType: energyAndUtilities?.secondaryHeatingType ?? [],
        boilerType: energyAndUtilities?.boilerType ?? null,
        hotWaterSource: energyAndUtilities?.hotWaterSource ?? null,
        renewables: energyAndUtilities?.renewables ?? [],
        connectedUtilities: energyAndUtilities?.connectedUtilities ?? [],
      },
      runningCosts: {
        description: runningCosts?.description ?? null,
        councilTaxBand: runningCosts?.councilTaxBand ?? 'A',
        serviceCharges: runningCosts?.serviceCharges ?? null,
        groundRent: runningCosts?.groundRent ?? null,
      },
    },
  }
}

/**
 * Step 8 Validation Helpers
 */
export const step8Validation = {
  /**
   * Check if energy and utilities data is valid
   */
  isEnergyAndUtilitiesValid: (data: Step8FormState['property']['energyAndUtilities']): boolean => {
    return !!data?.epcRating
  },

  /**
   * Check if running costs data is valid
   */
  isRunningCostsValid: (data: Step8FormState['property']['runningCosts']): boolean => {
    return !!data?.councilTaxBand
  },

  /**
   * Check if step 8 form is valid
   */
  isStep8Valid: (data: Step8FormState): boolean => {
    if (!data?.property?.energyAndUtilities || !data?.property?.runningCosts) return false
    return (
      step8Validation.isEnergyAndUtilitiesValid(data.property.energyAndUtilities) &&
      step8Validation.isRunningCostsValid(data.property.runningCosts)
    )
  },

  /**
   * Check if step 8 has existing data
   */
  hasExistingStep8Data: (draftData?: any): boolean => {
    return !!(draftData?.property?.energyAndUtilities || draftData?.property?.runningCosts)
  },
}
