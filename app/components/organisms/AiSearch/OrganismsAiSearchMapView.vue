<template>
  <div class="ai-search-map-view" :class="{
    'ai-search-map-view--inactive | v-skeleton': isSearching || !results.length
  }">
    <Map :markers="convertedMarkers" :zoom="mapZoom" :center="mapCenter" :interactive="true" @map-ready="onMapReady" />

    <!-- No results overlay - show when search completed with no results -->
    <div v-if="hasSearched && !results.length"
      class="ai-search-map-view__overlay ai-search-map-view__overlay--no-results | body-lg">
      No properties found in this area
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  results: ListingWithFullProperty[];
  location?: GeocodingFeatureWithBoundary | null;
  radius?: number;
  isSearching?: boolean;
  hasSearched?: boolean;
}

const props = defineProps<Props>();

const { updateSearchRadiusVisualization } = useMap();

const mapInstance = ref<any>(null);

// Convert ListingWithFullProperty to ListingCardType format that Map component expects
const convertedMarkers = computed((): ListingCardType[] => {
  const { results } = asObject(props)

  return convertListingsToMarkers(results);
});

// Calculate map center from location or bbox
const mapCenter = computed(() => {
  const { location, radius = 0 } = asObject(props)

  if (!location) return undefined // Let Map component use defaults

  return calculateMapCenter(location, radius)
})

// Calculate zoom from radius or bbox
const mapZoom = computed(() => {
  const { location, radius = 0 } = asObject(props)

  if (!location) return undefined // Let Map component use defaults

  return calculateMapZoom(location, radius);
});

// Apply radius visualization to the map
function applyRadiusVisualization() {
  const { location, radius = 0 } = asObject(props)

  if (!mapInstance.value || !location) return

  const { bbox, boundaryPolygon } = asObject(location)
  const center = calculateMapCenter(location, radius)

  updateSearchRadiusVisualization(mapInstance.value, center, radius, bbox, boundaryPolygon);
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

  &--inactive {

    .map-container {
      opacity: 0;
    }
  }

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
    background: fn.faded-color(70%, var(--background-200));
    color: var(--monochrome-900);
    font-weight: var(--font-semibold);

    &--no-results {
      background: fn.faded-color(50%, var(--monochrome-100));
    }
  }
}
</style>