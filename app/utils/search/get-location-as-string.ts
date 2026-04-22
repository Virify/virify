export function getLocationAsString(location?: GeocodingFeature | GeocodingFeatureWithBoundary): string | null {
  const { place_name_en, place_name } = asObject(location)

  if (!isString(place_name_en || place_name)) {
    return null
  }

  return (place_name_en || place_name) as string
}