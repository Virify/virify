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
      
      // Sort results by priority: region -> county -> postal_code -> address
      // Using MapTiler's actual place type names - putting 'place' last to avoid POIs like castles
      
      const sortedFeatures = (res.features ?? []).sort((a, b) => {
        // Since place_type is empty, use simple heuristics based on place names
        const aName = a.place_name_en.toLowerCase();
        const bName = b.place_name_en.toLowerCase();
        
        // Higher priority for shorter, simpler names (likely cities/regions)
        // Lower priority for names with "castle", "road", "cycleway", etc.
        const getPriority = (name: string) => {
          if (name.includes('castle')) return 100; // Very low priority for castles
          if (name.includes('road') || name.includes('street') || name.includes('avenue')) return 90; // Addresses
          if (name.includes('cycleway') || name.includes('path') || name.includes('lane')) return 85; // Paths/routes
          if (name.match(/\b[a-z]{1,2}\d+\s+\d[a-z]{2}\b/)) return 80; // Postcodes (pattern like CF24 0AB)
          
          // Shorter names are likely cities/regions
          const parts = name.split(',').length;
          if (parts <= 2) return 10; // Likely city or region
          if (parts === 3) return 20; // Could be district
          return 30; // Longer names are likely more specific addresses
        };
        
        const aPriority = getPriority(aName);
        const bPriority = getPriority(bName);
        
        return aPriority - bPriority;
      });
      
      return sortedFeatures;
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