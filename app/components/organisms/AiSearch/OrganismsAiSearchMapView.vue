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
  location: GeocodingFeatureWithBoundary | null;
  radius: number;
  isSearching?: boolean;
}

const props = defineProps<Props>();

const { calculateZoomLevelFromRadius, updateSearchRadiusVisualization } = useMap();

const mapRef = ref();

// Convert ListingWithFullProperty to ListingCardType format that Map component expects
const convertedMarkers = computed((): ListingCardType[] => {
  return convertListingsToMarkers(props.results);
});

// Calculate map center from location or bbox
const mapCenter = computed(() => {
  if (props.location) {
    return calculateMapCenter(props.location, props.radius);
  }
  return undefined; // Let Map component use defaults
});

// Calculate zoom from radius or bbox
const mapZoom = computed(() => {
  if (props.location) {
    return calculateMapZoom(props.location, props.radius);
  }
  return undefined; // Let Map component use defaults
});

// Manually add radius visualization when map is ready
onMounted(() => {
  // Wait for map to be fully mounted
  nextTick(() => {
    setTimeout(() => {
      if (mapRef.value?.map && props.location) {
        const center = calculateMapCenter(props.location, props.radius);
        updateSearchRadiusVisualization(mapRef.value.map, center, props.radius, props.location.bbox, props.location.boundaryPolygon);
      }
    }, 500); // Give map time to fully initialize
  });
});

// Watch for prop changes and update radius
watch([() => props.location, () => props.radius], ([newLocation, newRadius]) => {
  if (mapRef.value?.map && newLocation) {
    const center = calculateMapCenter(newLocation, newRadius);
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