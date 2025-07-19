<template>
  <div class="ai-search-map-view">
    <Map ref="mapRef" :markers="convertedMarkers" :zoom="mapZoom" :center="mapCenter" :interactive="true"
      :mapId="GLOBAL_MAP_ID" />

    <!-- Loading overlay for map view -->
    <div v-if="isSearching || !results || results.length === 0" class="ai-search-map-view__overlay | body-lg">
      <template v-if="isSearching">
        {{ loadingMessage }}
      </template>

      <template v-else>
        No results found
      </template>
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
@use '#styles/_utils/functions' as fn;

.ai-search-map-view {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    background: fn.faded-color(70%, var(--monochrome-100));
    color: var(--monochrome-900);
    font-weight: var(--font-semibold);
  }
}
</style>