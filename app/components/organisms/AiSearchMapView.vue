<template>
  <div class="ai-search-map-view">
    <Map
      ref="mapRef"
      :markers="convertedMarkers"
      :zoom="mapZoom"
      :center="mapCenter"
      :interactive="true"
      :mapId="GLOBAL_MAP_ID"
    />
    
    <!-- Loading overlay for map view -->
    <div v-if="isSearching" class="loading-overlay">
      <div class="loading-message | body-sm">
        {{ loadingMessage }}
      </div>
    </div>
    
    <!-- No results overlay for map view -->
    <div v-else-if="!results || results.length === 0" class="no-results-overlay">
      <div class="no-results-message">
        No results found
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { loadingMessages } from '~/utils/search-form/loading-messages';

const loadingMessage = computed(() => {
  const randomIndex = Math.floor(Math.random() * loadingMessages.length);
  return loadingMessages[randomIndex] ?? 'Searching for properties...';
});

interface Props {
  results: ListingWithFullProperty[];
  location: GeocodingFeature | null;
  radius: number;
  isSearching?: boolean;
}

const props = defineProps<Props>();

const { calculateZoomLevelFromRadius, updateSearchRadiusVisualization } = useMap();

const mapRef = ref();

// Convert ListingWithFullProperty to ListingCardType format that Map component expects
const convertedMarkers = computed((): ListingCardType[] => {
  return props.results
    .filter(listing => listing.property?.address?.lat && listing.property?.address?.lon)
    .map((listing, index) => ({
      id: listing.id || `listing-${index}`,
      title: listing.title,
      price: listing.price,
      listingTier: listing.listingTier,
      publishedAt: listing.publishedAt,
      rentalListing: listing.rentalListing,
      saleListing: listing.saleListing,
      property: {
        address: listing.property?.address ? {
          id: listing.property.address.id,
          number: listing.property.address.number,
          flat: listing.property.address.flat,
          street: listing.property.address.street,
          city: listing.property.address.city,
          postcode: listing.property.address.postcode,
          country: listing.property.address.country,
          county: listing.property.address.county,
          fullAddress: listing.property.address.fullAddress,
          lat: listing.property.address.lat,
          lon: listing.property.address.lon,
        } : null,
        media: listing.property?.media || [],
        type: listing.property?.type || null,
        classification: listing.property?.classification || null,
        numberBedrooms: listing.property?.numberBedrooms || null,
        numberBathrooms: listing.property?.numberBathrooms || null,
        numberReceptions: listing.property?.numberReceptions || null,
        accessibilityFeatures: listing.property?.accessibilityFeatures || null,
        additionalFeatures: listing.property?.additionalFeatures || null,
        parking: listing.property?.parking || null,
        outdoorSpace: listing.property?.outdoorSpace || null,
      },
      user: listing.user,
    } as ListingCardType));
});

// Calculate map center from location or bbox
const mapCenter = computed(() => {
  if (props.location) {
    // For location-only searches (radius = 0), use bbox center
    if (props.radius === 0 && props.location.bbox) {
      const [west, south, east, north] = props.location.bbox;
      const centerLon = (west + east) / 2;
      const centerLat = (south + north) / 2;
      return [centerLon, centerLat] as [number, number];
    }
    // For radius searches, use geometry coordinates
    return [props.location.geometry.coordinates[0], props.location.geometry.coordinates[1]] as [number, number];
  }
  return undefined; // Let Map component use defaults
});

// Calculate zoom from radius or bbox
const mapZoom = computed(() => {
  if (props.location) {
    // For location-only searches (radius = 0), calculate zoom from bbox
    if (props.radius === 0 && props.location.bbox) {
      const [west, south, east, north] = props.location.bbox;
      const latDiff = Math.abs(north - south);
      const lonDiff = Math.abs(east - west);
      const maxDiff = Math.max(latDiff, lonDiff);
      
      // Calculate zoom based on bbox size
      if (maxDiff < 0.01) return 15; // Very small area
      if (maxDiff < 0.05) return 13; // Small area  
      if (maxDiff < 0.1) return 12;  // Medium area
      if (maxDiff < 0.5) return 10;  // Large area
      return 8; // Very large area
    }
    // For radius searches, use existing calculation
    if (props.radius && props.radius > 0) {
      return calculateZoomLevelFromRadius(props.radius);
    }
  }
  return undefined; // Let Map component use defaults
});

// Manually add radius visualization when map is ready
onMounted(() => {
  // Wait for map to be fully mounted
  nextTick(() => {
    setTimeout(() => {
      if (mapRef.value?.map && props.location) {
        // Use bbox center for location-only searches
        let center: [number, number];
        if (props.radius === 0 && props.location.bbox) {
          const [west, south, east, north] = props.location.bbox;
          center = [(west + east) / 2, (south + north) / 2];
        } else {
          center = [props.location.geometry.coordinates[0], props.location.geometry.coordinates[1]];
        }
        
        console.log('Map visualization - Location:', props.location.place_name_en);
        console.log('Map visualization - Radius:', props.radius);
        console.log('Map visualization - Bbox:', props.location.bbox);
        console.log('Map visualization - Boundary polygon:', props.location.boundaryPolygon);
        console.log('Map visualization - Center:', center);
        
        updateSearchRadiusVisualization(mapRef.value.map, center, props.radius, props.location.bbox, props.location.boundaryPolygon);
      }
    }, 500); // Give map time to fully initialize
  });
});

// Watch for prop changes and update radius
watch([() => props.location, () => props.radius], ([newLocation, newRadius]) => {
  if (mapRef.value?.map && newLocation) {
    // Use bbox center for location-only searches
    let center: [number, number];
    if (newRadius === 0 && newLocation.bbox) {
      const [west, south, east, north] = newLocation.bbox;
      center = [(west + east) / 2, (south + north) / 2];
    } else {
      center = [newLocation.geometry.coordinates[0], newLocation.geometry.coordinates[1]];
    }
    
    updateSearchRadiusVisualization(mapRef.value.map, center, newRadius, newLocation.bbox, newLocation.boundaryPolygon);
  }
});
</script>

<style lang="scss">
.ai-search-map-view {
  position: relative;
  width: 100%;
  height: calc(100vh - var(--header-height));
  border-radius: var(--border-radius-2xl) var(--border-radius-2xl) 0 0;
  overflow: hidden;
}

.loading-overlay,
.no-results-overlay {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  pointer-events: none;
}

.loading-message,
.no-results-message {
  background: rgba(255, 255, 255, 0.95);
  color: var(--monochrome-100);
  padding: var(--size-12) var(--size-20);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--color-border-light);
}

@media (max-width: 768px) {
  .ai-search-map-view {
    height: calc(100vh - var(--header-height) - var(--size-72));
    min-height: 400px;
  }
}
</style>