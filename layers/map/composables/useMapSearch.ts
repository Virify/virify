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
      // Add display_name: for postal_code use text, for others use place_name_en
      const features = (res.features ?? []).map((feature) => {
        // MapTiler API: type (string) or place_type (array of string)
        let type = '';
        if ('place_type' in feature && Array.isArray((feature as any).place_type)) {
          type = (feature as any).place_type[0];
        } else if ('type' in feature && typeof (feature as any).type === 'string') {
          type = (feature as any).type;
        }
        let display_name = feature.place_name_en;
        if (type === 'postal_code') {
          if (feature.text && typeof feature.text === 'string') {
            display_name = feature.text;
          } else if (feature.place_name_en && typeof feature.place_name_en === 'string') {
            // Fallback: extract postcode from place_name_en using UK postcode regex
            const match = feature.place_name_en.match(/\b([A-Z]{1,2}\d{1,2}[A-Z]? ?\d[A-Z]{2})\b/i);
            if (match && match[1]) {
              display_name = match[1].toUpperCase();
            }
          }
        } else if (type === 'address') {
          // For addresses, use the full place_name_en (rich, hierarchical address)
          display_name = feature.place_name_en;
        }
        return {
          ...feature,
          display_name,
        };
      });
      return features;
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