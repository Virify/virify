import { buildBathroomQuery } from './build-bathroom-query'
import { buildbedroomQuery } from './build-bedroom-query'
import { buildPropertyTypes } from './build-property-types'
import { buildContractQuery } from './build-contract-query'
import { buildFeaturesQuery } from './build-features-query'
import { buildPriceQuery } from './build-price-query'
import type { TraditionalSearchData } from './types'

export { buildQueryAnalysisFromFormData } from './build-query-analysis'

export function buildQueryFromTraditionalFormData(data: TraditionalSearchData): string {
  // Build mock AI query
  const { isSale, propertyTypes, maxBathrooms, minBathrooms, maxBeds, minBeds, price, rentIncludes, saleIncludes, additionalFeatures } = asObject(data)

  // Get rent or sale included properties
  const includedProperties = toValue(isSale ? saleIncludes : rentIncludes)

  // Sale or rent
  const querySale = isSale ? 'to buy' : 'to rent'

  // Property type
  const queryType = buildPropertyTypes(propertyTypes)
  const queryBeds = buildbedroomQuery(minBeds, maxBeds)
  const queryBathrooms = buildBathroomQuery(minBathrooms, maxBathrooms)
  const queryContract = buildContractQuery(includedProperties)
  const queryFeatures = buildFeaturesQuery(additionalFeatures)
  const queryPrice = buildPriceQuery(price)

  // Return full query
  let query = `properties ${querySale} that costs ${queryPrice} and has ${queryBeds} and ${queryBathrooms}`

  // Add property types - if any exist
  if (queryType) {
    query += ` and is ${queryType}`
  }

  // Add contract includes, features - if any exist
  if (queryContract || queryFeatures) {
    const optionalIncludes = [queryContract, queryFeatures].filter(Boolean)

    query += `. Only include properties that ${optionalIncludes.join(' and ')}`
  }

  return query
}

export type { TraditionalSearchData }
