import type { RentalListing, SaleListing } from "~~/layers/database/server/database/prisma/generated/client"

export type StepOne = {
  rentalListing?: Omit<RentalListing, 'id' | 'listing' | 'DraftListing'>
  saleListing?: Omit<SaleListing, 'id' | 'listing' | 'DraftListing'>
}