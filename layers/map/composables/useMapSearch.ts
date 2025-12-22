import { calculateDistance, milesToMeters } from '../utils/calculate';
import type { GeocodingFeature, GeocodingFeatureWithBoundary, GeocodingResponse } from '~~/shared/types/map';

export function useMapSearch() {
  const sdk = useMapSDK();

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
          language: "en", // Ensure English place names
        },
      });
      
      // Filter out "place" type entries when a "county" with same name exists
      // Counties have boundary polygons, places are just points
      const features = res.features ?? [];
      const countyNames = new Set(
        features
          .filter(f => f.place_type?.[0] === 'county')
          .map(f => (f.text_en || f.text || '').toLowerCase())
      );
      
      const filtered = features.filter(f => {
        const placeType = f.place_type?.[0];
        const name = (f.text_en || f.text || '').toLowerCase();
        
        // Keep if it's not a "place" or if there's no county with the same name
        return placeType !== 'place' || !countyNames.has(name);
      });
      
      return filtered;
    } catch (e) {
      console.error("[Map] Search error:", e);
      return [];
    }
  }

  /**
   * Autocomplete for UK postcodes
   * @param postcode The postcode to autocomplete
   * @returns A list of matching postcode features
   */
  async function postcodeAutoComplete(postcode: string): Promise<GeocodingFeature[]> {
    if (!postcode) return [];
    try {
      const res = await $fetch<GeocodingResponse>(`https://api.maptiler.com/geocoding/${encodeURIComponent(postcode)}.json`, {
        query: { 
          key: sdk.config.apiKey,
          country: "gb",
          types: "postal_code",
        },
      });
      return res.features ?? [];
    } catch (e) {
      console.error("[Map] Search error:", e);
      return [];
    }
  }

  /**
   * Geocodes a query and returns the best match
   * Tries to find an exact match first, falls back to first result
   */
  async function geocodeAndSelectBest(query: string): Promise<GeocodingFeature | null> {
    if (!query) return null;
    try {
      const suggestions = await autoComplete(query);
      if (!suggestions.length) return null;
      
      // Try to find an exact match by comparing place_name_en (case-insensitive)
      const queryLower = query.toLowerCase().trim();
      const exactMatch = suggestions.find(s => {
        const placeName = (s.place_name_en || s.place_name || '').toLowerCase();
        // Check if the query matches the start of the place name
        // e.g., "cardiff united kingdom" should match "Cardiff, United Kingdom"
        const normalizedPlace = placeName.replace(/,\s*/g, ' ').replace(/\s+/g, ' ');
        const normalizedQuery = queryLower.replace(/,\s*/g, ' ').replace(/\s+/g, ' ');
        return normalizedPlace.startsWith(normalizedQuery) || normalizedPlace === normalizedQuery;
      });
      
      return exactMatch ?? suggestions[0] ?? null;
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
          language: "en", // Ensure English place names
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
  interface Amenity {
    name: string
    distance: number
    type: string
  }

  interface Amenities {
    schools: Amenity[]
    hospitals: Amenity[]
    train_stations: Amenity[]
    bus_stations: Amenity[]
    parks: Amenity[]
    gyms: Amenity[]
  }

  async function findNearbyAmenities(lat: number, lon: number, radius: number = 15000, pick?: number): Promise<Amenities> {
    const amenities: Amenities = {
      schools: [],
      hospitals: [],
      train_stations: [],
      bus_stations: [],
      parks: [],
      gyms: []
    };

    try {
      // Search for different types of amenities
      const amenityTypes = [
        { category: 'schools', query: 'school' },
        { category: 'hospitals', query: 'hospital' },
        { category: 'train_stations', query: 'train_station'},
        { category: 'bus_stations', query: 'bus_station'},
        { category: 'parks', query: 'park' },
        { category: 'gyms', query: 'fitness_centre'},
      ];

      for (const amenityType of amenityTypes) {
        try {
          const res = await $fetch<GeocodingResponse>(`https://api.maptiler.com/geocoding/${encodeURIComponent(amenityType.query)}.json`, {
            query: { 
              key: sdk.config.apiKey,
              country: "gb",
              proximity: `${lon},${lat}`,
              limit: pick || 3,
              types: "poi",
              categories: amenityType.query
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

    } catch (e) {
      console.error("[Map] Error finding nearby amenities:", e);
    }

    return amenities;
  }


  /**
   * Geocode by location ID for precise lookup
   * Returns feature with boundaryPolygon if geometry is Polygon/MultiPolygon
   */
  async function geocodeById(locationId: string): Promise<GeocodingFeatureWithBoundary | null> {
    if (!locationId) return null;
    try {
      const res = await $fetch<any>(`https://api.maptiler.com/geocoding/${encodeURIComponent(locationId)}.json`, {
        query: { 
          key: sdk.config.apiKey,
          language: 'en', // Ensure we get English place names
        },
      });
      
      if (res.features && res.features.length > 0) {
        const feature = res.features[0];
        
        // For regions (counties, cities), geometry may be a Polygon, not a Point
        // Ensure center property exists for coordinate extraction
        if (feature.center?.length >= 2) {
          // If geometry is a Polygon/MultiPolygon, extract it as boundaryPolygon
          const boundaryPolygon = (feature.geometry?.type === 'Polygon' || feature.geometry?.type === 'MultiPolygon')
            ? { type: feature.geometry.type, coordinates: feature.geometry.coordinates }
            : undefined;
          
          return {
            ...feature,
            boundaryPolygon
          } as GeocodingFeatureWithBoundary;
        }
        
        // Fallback: check if geometry is a Point and use its coordinates as center
        if (feature.geometry?.type === 'Point' && feature.geometry?.coordinates?.length >= 2) {
          return {
            ...feature,
            center: feature.geometry.coordinates
          } as GeocodingFeatureWithBoundary;
        }
        
        console.warn("[Map] geocodeById: Feature missing valid center or point geometry", feature);
      }
      
      return null;
    } catch (e) {
      console.error("[Map] Error geocoding by ID:", e);
      return null;
    }
  }


  return {
    autoComplete,
    postcodeAutoComplete,
    geocodeAndSelectBest,
    geocodeById,
    enhanceWithBoundaryPolygon,
    findNearbyAmenities,
  } as const;
}