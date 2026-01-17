import { z } from 'zod'

/**
 * Step 3: Price Schema
 * Validates price data for sale or rental listings
 * 
 * Note: The `price` field is stored directly on the DraftListing model.
 * Sale/rental specific fields (priceType, rentFrequency, deposits) are on
 * the respective SaleListing/RentalListing relations.
 */

// Sale listing price fields
export const salePriceSchema = z.object({
  priceType: z.enum(['FIXED', 'OFFERS_OVER', 'GUIDE_PRICE']).nullable().optional(),
})

// Rental listing price fields
export const rentalPriceSchema = z.object({
  rentFrequency: z.enum(['WEEKLY', 'MONTHLY']).nullable().optional(),
  deposit: z.number().min(0).nullable().optional(),
  holdingDeposit: z.number().min(0).nullable().optional(),
})

// Step 3 form schema - price is always required, listing-specific fields optional
export const step3Schema = z.object({
  price: z.coerce.number({ message: 'Price is required' }).positive('Price must be greater than 0'),
  saleListing: salePriceSchema.nullable().optional(),
  rentalListing: rentalPriceSchema.nullable().optional(),
})

export type Step3FormData = z.infer<typeof step3Schema>
export type SalePriceData = z.infer<typeof salePriceSchema>
export type RentalPriceData = z.infer<typeof rentalPriceSchema>
