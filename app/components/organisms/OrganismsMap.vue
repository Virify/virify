<template>
  <div v-if="hasValidCoordinates" ref="mapContainer"
    :class="['maptiler-map', interactive ? 'maptiler-map-interactive' : 'maptiler-map-static', customClass]">
  </div>
  <div v-else :class="['map-placeholder', customClass]">
    <div class="map-placeholder-content">
      <span>Location information not available</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MapMarker } from '../../../shared/types/map-coordinates';
import { useMapTiler } from '~/composables/useMapTiler';

const props = defineProps<{
  markers?: MapMarker[];
  zoom?: number;
  interactive?: boolean;
  mapId?: string;
  center?: { lat: number; lon: number };
  customClass?: string;
  displayPopups?: boolean;
}>();

const emit = defineEmits(['property-note', 'property-favourite']);
const mapContainer = ref<HTMLElement>();
const map = shallowRef<any>(null);

// Import map utilities from composable
const { initializeMap, handleMapViewChange } = useMapTiler();

// Check if we have valid coordinates to display
const hasValidCoordinates = computed(() => {
  if (props.center) {
    return typeof props.center.lat === 'number' && 
    typeof props.center.lon === 'number' &&
    props.center.lat !== 0 &&
    props.center.lon !== 0;
  }
  return !!props.markers?.some(m => m.lat !== 0 && m.lon !== 0);
});

// Display full popups on listing pages but not on detail pages
const shouldDisplayPopups = computed(() => {
  return props.displayPopups !== false;
});

// Simple event emitters for UI updates
const mapEventHandlers = {
  onNote: (id: number) => emit('property-note', id),
  onFavorite: (id: number) => emit('property-favourite', id)
};

// Initialize map on mount
onMounted(() => {
  if (!mapContainer.value || !hasValidCoordinates.value) return;
  
  // Create or reuse map instance
  map.value = initializeMap(
    mapContainer.value,
    { interactive: !!props.interactive, zoom: props.zoom },
    props.mapId
  );
  
  // Apply initial map state
  nextTick(() => {
    handleMapViewChange(
      map.value,
      props.center || props.markers?.[0],
      props.markers,
      !!props.interactive,
      props.zoom,
      shouldDisplayPopups.value,
      shouldDisplayPopups.value ? mapEventHandlers : undefined
    );
  });
});

// Update map when props change - with optimized handling
watch(
  [
    () => props.markers,
    () => props.center,
    () => props.zoom,
    () => props.interactive,
    () => props.displayPopups
  ],
  ([markers, center, zoom, interactive, displayPopups]) => {
    if (!map.value) return;
    
    // Only update center if explicitly provided as a prop
    const centerToUse = center && typeof center.lat === 'number' && typeof center.lon === 'number' 
      ? center 
      : undefined;
    
    // Only update markers if they've actually changed
    const markersToUse = markers && Array.isArray(markers) && markers.length > 0
      ? markers
      : undefined;
    
    handleMapViewChange(
      map.value,
      centerToUse,
      markersToUse,
      !!interactive,
      zoom,
      displayPopups !== false,
      displayPopups !== false ? mapEventHandlers : undefined
    );
  },
  { deep: true }
);

// Force map resize on visibility change
onUpdated(() => {
  if (map.value && typeof map.value.resize === 'function') {
    setTimeout(() => map.value.resize(), 100);
  }
});
</script>

<style>
.maptiler-map {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.maptiler-map-interactive {
  cursor: grab;
}

.maptiler-map-interactive:active {
  cursor: grabbing;
}

.maptiler-map-static {
  cursor: default;
}

.maptiler-map-static::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 999;
  /* Higher z-index to be above all map controls */
  pointer-events: all;
  /* Block pointer events to disable interactions on static map */
}

/* Map placeholder when coordinates are not available */
.map-placeholder {
  width: 100%;
  background-color: var(--background-200);
  border-radius: var(--border-radius-md, 8px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px var(--shadow-subtle, rgba(0, 0, 0, 0.1));
}

.map-placeholder-content {
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}

/* Show controls for interactive maps, hide for non-interactive */
.maptiler-map-static .maplibregl-control-container {
  display: none !important;
}
</style>
