import { z } from 'zod'

/**
 * Step 1: Listing Type Schema
 * Validates sale or rental listing data
 */

// Sale listing schema
export const saleListingSchema = z.object({
  tenureType: z.enum(['FREEHOLD', 'LEASEHOLD', 'COMMONHOLD'], {
    message: 'Property tenure is required',
  }),
  chain: z.boolean().default(false),
  sharedOwnership: z.boolean().default(false),
})

// Rental listing schema
export const rentalListingSchema = z.object({
  furnishedStatus: z.enum(['FURNISHED', 'PART_FURNISHED', 'UNFURNISHED'], {
    message: 'Furnished status is required',
  }),
  isBillsIncluded: z.boolean({
    message: 'Please specify if bills are included',
  }),
})

// Step 1 form schema (sale OR rental, not both)
export const step1Schema = z.object({
  selectedType: z.enum(['sale', 'rent'], {
    message: 'Please select sale or rent',
  }),
  saleListing: saleListingSchema.nullable().optional(),
  rentalListing: rentalListingSchema.nullable().optional(),
}).refine(
  (data) => {
    // If sale is selected, validate sale listing
    if (data.selectedType === 'sale') {
      return data.saleListing?.tenureType != null
    }
    // If rent is selected, validate rental listing
    if (data.selectedType === 'rent') {
      return data.rentalListing?.furnishedStatus != null && 
             data.rentalListing?.isBillsIncluded != null
    }
    return false
  },
  {
    message: 'Please complete all required fields for the selected listing type',
  }
)

export type Step1FormData = z.infer<typeof step1Schema>
export type SaleListingData = z.infer<typeof saleListingSchema>
export type RentalListingData = z.infer<typeof rentalListingSchema>
