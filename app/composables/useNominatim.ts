export function useNominatim() {

  const config = useRuntimeConfig();

  interface LocationResult {
    displayName: string;
    lat: string;
    lon: string;
  }

  interface GeocodingResponse {
    features: {
      properties: {
        display_name: string;
      };
      geometry: {
        coordinates: [number, number];
      };
    }[];
  }

  const searchLocations = async (query: string): Promise<LocationResult[]> => {
    if (!query) return [];

    try {
      const response: GeocodingResponse = await $fetch(config.public.NOMINATIM_API_URL, {
        method: "get",
        query: {
          q: query,
          format: "geojson",
          addressdetails: 1,
        },
      });

      return response.features.map((feature) => ({
        displayName: feature.properties.display_name,
        lat: String(feature.geometry.coordinates[1]),
        lon: String(feature.geometry.coordinates[0]),
      }));
    } catch (error) {
      console.error("Error fetching location:", error);
      return [];
    }
  };

  return {
    searchLocations,
  };
}