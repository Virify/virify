import { calculateDistance, milesToMeters } from '../utils/calculate';
import type { GeocodingFeature, GeocodingFeatureWithBoundary, GeocodingResponse } from '~~/shared/types/map';

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
  async function enhanceWithBoundaryPolygon(feature: GeocodingFeature): Promise<GeocodingFeatureWithBoundary> {
    const boundaryPolygon = await getBoundaryPolygon(feature.id);
    return {
      ...feature,
      boundaryPolygon: boundaryPolygon || undefined
    };
  }

  /**
   * Find nearby amenities (schools, hospitals, shops) based on lat/long coordinates
   * TODO: Batch these requests to reduce API calls
   */
  async function findNearbyAmenities(lat: number, lon: number, radius: number = 15000): Promise<{
    schools: Array<{ name: string; distance: number; type: string }>;
    hospitals: Array<{ name: string; distance: number; type: string }>;
    train_stations: Array<{ name: string; distance: number; type: string }>;
  }> {
    const amenities = {
      schools: [] as Array<{ name: string; distance: number; type: string }>,
      hospitals: [] as Array<{ name: string; distance: number; type: string }>,
      train_stations: [] as Array<{ name: string; distance: number; type: string }>
    };

    try {
      // Search for different types of amenities
      const amenityTypes = [
        { category: 'schools', query: 'school' },
        { category: 'hospitals', query: 'hospital' },
        { category: 'train_stations', query: 'train station' }
      ];

      for (const amenityType of amenityTypes) {
        try {
          const res = await $fetch<GeocodingResponse>(`https://api.maptiler.com/geocoding/${encodeURIComponent(amenityType.query)}.json`, {
            query: { 
              key: sdk.config.apiKey,
              country: "gb",
              proximity: `${lon},${lat}`,
              limit: 3,
              types: "poi"
            },
          });
          if (res.features) {
            for (const feature of res.features) {
              if (feature.geometry && feature.geometry.type === 'Point') {
                const [featureLon, featureLat] = feature.geometry.coordinates;
                const distanceInMiles = calculateDistance(lat, lon, featureLat, featureLon);
                const distanceInMeters = milesToMeters(distanceInMiles);
                
                if (distanceInMeters <= radius) {
                  amenities[amenityType.category as keyof typeof amenities].push({
                    name: feature.text || 'Unknown',
                    distance: Math.round(distanceInMeters),
                    type: amenityType.category
                  });
                }
              }
            }
          }
        } catch (e) {
          console.error(`[Map] Error fetching ${amenityType.category}:`, e);
        }
      }

      // Sort by distance and take closest 3 for each category
      amenities.schools = amenities.schools.sort((a, b) => a.distance - b.distance).slice(0, 3);
      amenities.hospitals = amenities.hospitals.sort((a, b) => a.distance - b.distance).slice(0, 3);
      amenities.train_stations = amenities.train_stations.sort((a, b) => a.distance - b.distance).slice(0, 3);

    } catch (e) {
      console.error("[Map] Error finding nearby amenities:", e);
    }

    return amenities;
  }


  return {
    autoComplete,
    geocodeAndSelectBest,
    enhanceWithBoundaryPolygon,
    findNearbyAmenities,
  } as const;
}