import type { PropertyTypes } from './types'

export function buildPropertyTypes(propertyTypes: PropertyTypes) {
  const propertyTypesArray = Object.entries(propertyTypes)

  const queryArray = propertyTypesArray.flatMap(([type, subtypes]) => {
    if (!subtypes.length) {
      return ''
    }

    if (subtypes.length === 1) {
      return `a ${type} that is ${subtypes[0]}`
    }

    return `a ${type} that is either a ${subtypes.join(' or a ')}`
  })

  return queryArray.filter(Boolean).join(', or ').toLowerCase()
}