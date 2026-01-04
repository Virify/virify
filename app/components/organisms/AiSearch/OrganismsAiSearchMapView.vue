<template>
  <div class="ai-search-map-view">
    <Map ref="mapRef" :markers="convertedMarkers" :zoom="mapZoom" :center="mapCenter" :interactive="true" @map-ready="onMapReady" />

    <!-- Loading overlay for map view - only show when actively searching -->
    <div v-if="isSearching" class="ai-search-map-view__overlay | body-lg">
      {{ loadingMessage }}
    </div>

    <!-- No results overlay - show when search completed with no results -->
    <div v-else-if="hasSearched && !results.length" class="ai-search-map-view__overlay ai-search-map-view__overlay--no-results | body-lg">
      No properties found in this area
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
  location?: GeocodingFeatureWithBoundary | null;
  radius?: number;
  isSearching?: boolean;
  hasSearched?: boolean;
}

const props = defineProps<Props>();

const { updateSearchRadiusVisualization } = useMap();

const mapRef = ref();
const mapInstance = ref<any>(null);

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

// Apply radius visualization to the map
function applyRadiusVisualization() {
  if (mapInstance.value && props.location) {
    const center = calculateMapCenter(props.location, props.radius);
    updateSearchRadiusVisualization(mapInstance.value, center, props.radius, props.location.bbox, props.location.boundaryPolygon);
  }
}

// Handle map ready event - apply visualization when map is fully initialized
function onMapReady(map: any) {
  mapInstance.value = map;
  applyRadiusVisualization();
}

// Watch for prop changes and update radius
watch([() => props.location, () => props.radius], () => {
  applyRadiusVisualization();
});
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

:where(.ai-search-map-view) {
  width: 100%;
  height: 100%;
}

.ai-search-map-view {
  position: relative;
  overflow: hidden;

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    background: fn.faded-color(70%, var(--monochrome-100));
    color: var(--monochrome-900);
    font-weight: var(--font-semibold);

    &--no-results {
      background: fn.faded-color(50%, var(--monochrome-100));
    }
  }
}
</style>