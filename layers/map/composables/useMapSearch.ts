export function useMapSearch() {
  const sdk = useNuxtApp().$maptilersdk;

  /**
   * Geocoding autocomplete
   */
  async function autoComplete(query: string): Promise<GeocodingFeature[]> {
    if (!query) return [];
    try {
      const res = await $fetch<GeocodingResponse>(`https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json`, {
        query: { 
          key: sdk.config.apiKey, 
          country: "gb",
        },
      });
      return res.features ?? [];
    } catch (e) {
      console.error("[Map] Search error:", e);
      return [];
    }
  }

  /**
   * Geocodes a query and returns the best match (first result)
   * Used as fallback when user doesn't click on autocomplete suggestions
   */
  async function geocodeAndSelectBest(query: string): Promise<GeocodingFeature | null> {
    if (!query) return null;
    try {
      const suggestions = await autoComplete(query);
      const result = suggestions.length > 0 ? suggestions[0] ?? null : null;
      return result;
    } catch (e) {
      return null;
    }
  }

  /**
   * Fetch boundary polygon for a geocoding feature
   */
  async function getBoundaryPolygon(featureId: string): Promise<any | null> {
    if (!featureId) return null;
    try {
      const res = await $fetch<any>(`https://api.maptiler.com/geocoding/${encodeURIComponent(featureId)}.json`, {
        query: { 
          key: sdk.config.apiKey,
        },
      });
      
      if (res.features && res.features.length > 0) {
        const feature = res.features[0];
        if (feature.geometry && (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon')) {
          return {
            type: feature.geometry.type,
            coordinates: feature.geometry.coordinates
          };
        }
      }
      
      return null;
    } catch (e) {
      console.error("[Map] Error fetching boundary polygon:", e);
      return null;
    }
  }

  /**
   * Enhance location with boundary polygon for location-only searches
   */
  async function enhanceWithBoundaryPolygon(feature: GeocodingFeature): Promise<GeocodingFeature> {
    const boundaryPolygon = await getBoundaryPolygon(feature.id);
    return {
      ...feature,
      boundaryPolygon: boundaryPolygon || undefined
    };
  }

  return {
    autoComplete,
    geocodeAndSelectBest,
    enhanceWithBoundaryPolygon,
  } as const;
}