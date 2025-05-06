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