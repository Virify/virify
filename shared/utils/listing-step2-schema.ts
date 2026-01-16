import { z } from 'zod'

/**
 * Step 2: Property Basics Schema
 * Validates property type, classification, description, floors, construction type, size, and year built
 */

// Construction type values (matching Prisma enum)
const constructionTypes = ['STANDARD', 'NON_STANDARD'] as const

// Property schema
export const propertySchema = z.object({
  type: z.number().int().positive({
    message: 'Property type is required',
  }),
  classification: z.number().int().positive({
    message: 'Property classification is required',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters',
  }).max(5000, {
    message: 'Description cannot exceed 5000 characters',
  }),
  totalFloors: z.number().int().min(1, {
    message: 'Property must have at least 1 floor',
  }).max(100, {
    message: 'Total floors cannot exceed 100',
  }),
  constructionType: z.enum(constructionTypes).nullable().optional(),
  size: z.number().positive().nullable().optional(),
  yearBuilt: z.string().nullable().optional(),
})

// Step 2 form schema
export const step2Schema = z.object({
  property: propertySchema,
})

export type Step2FormData = z.infer<typeof step2Schema>
export type PropertyData = z.infer<typeof propertySchema>
