export type MinMax = number | string

export interface TraditionalSearchDataOptions {
  [key: string]: boolean
}

export interface PropertyTypes {
  [key: string]: string[]
}

export interface TraditionalSearchData {
  isSale: boolean
  propertyTypes: PropertyTypes
  minBathrooms: number
  maxBathrooms: number
  minBeds: number
  maxBeds: number
  price: [number, number]
  rentIncludes: TraditionalSearchDataOptions
  saleIncludes: TraditionalSearchDataOptions
  additionalFeatures: TraditionalSearchDataOptions
}

