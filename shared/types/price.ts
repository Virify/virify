import type { RentalPriceType } from "~~/layers/database/server/database/prisma/generated/client"
import type { SalePriceType } from "~~/layers/database/server/database/prisma/generated/client"

export type MinMaxPrice = [
  min: number,
  max: number
]

export type MinMaxPriceResponse = {
  sale: MinMaxPrice,
  rental: MinMaxPrice
}

export type PriceFilter = {
  gte: number
  lte: number
} | undefined

export type PriceType = {
  sale: SalePriceType
  rental: RentalPriceType
}