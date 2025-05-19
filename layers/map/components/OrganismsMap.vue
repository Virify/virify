<template>
  <div v-if="hasValidCoordinates" ref="mapContainer"
    :class="[
      'maptiler-map', 
      interactive ? 'maptiler-map-interactive' : 'maptiler-map-static', 
      drawingEnabled ? 'drawing-enabled' : '',
      customClass
    ]">
  </div>
  <div v-else :class="['map-placeholder', customClass]">
    <div class="map-placeholder-content">
      <span>Location information not available</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MapMarker } from '~~/shared/types/map-coordinates';
import type { Map as MapTilerMap } from '@maptiler/sdk';
import { useMapTiler } from '../composables/useMapTiler';
// Import draw CSS if drawing functionality is used
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const props = defineProps<{
  markers?: MapMarker[];
  zoom?: number;
  interactive?: boolean;
  mapId?: string;
  center?: { lat: number; lon: number };
  customClass?: string;
  displayPopups?: boolean;
  // Drawing functionality
  drawingEnabled?: boolean;
  drawingMode?: 'polygon' | null;
  onShapeDrawn?: (feature: any) => void;
  onShapeUpdated?: (feature: any) => void;
  onShapeDeleted?: (features: any[]) => void;
}>();

const emit = defineEmits([
  'property-note', 
  'property-favourite',
  'shape-drawn',
  'shape-updated',
  'shape-deleted'
]);
const mapContainer = ref<HTMLElement>();
const map = shallowRef<MapTilerMap | null>(null);

// Import map utilities from composable
const { initializeMap, addMarker, clearMarkers, centerMap, initDrawing, clearDrawnShapes } = useMapTiler();

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

// Initialize map on mount
onMounted(() => {
  // Wait for next tick to ensure container is properly sized
  nextTick(() => {
    if (!mapContainer.value || !hasValidCoordinates.value) return;

    // Create or reuse map instance
    const mapInstance = initializeMap(
      mapContainer.value,
      { interactive: !!props.interactive, zoom: props.zoom },
      props.mapId
    );

    // Setup map event handlers
    mapInstance.on('marker-note', (e: any) => emit('property-note', e.id));
    mapInstance.on('marker-favorite', (e: any) => emit('property-favourite', e.id));
    
    // Setup drawing event handlers
    mapInstance.on('shape-drawn', (e: any) => {
      console.info('[Map] Shape drawn:', e);
      emit('shape-drawn', e.feature);
      if (props.onShapeDrawn) props.onShapeDrawn(e.feature);
    });
    
    mapInstance.on('shape-updated', (e: any) => {
      console.info('[Map] Shape updated:', e);
      emit('shape-updated', e.feature);
      if (props.onShapeUpdated) props.onShapeUpdated(e.feature);
    });
    
    mapInstance.on('shape-deleted', (e: any) => {
      console.info('[Map] Shape deleted:', e);
      emit('shape-deleted', e.features || []);
      if (props.onShapeDeleted) props.onShapeDeleted(e.features || []);
    });

    map.value = mapInstance;

    // Set initial center and zoom
    if (props.center) {
      centerMap(
        mapInstance,
        props.center.lat,
        props.center.lon,
        props.zoom
      );
    } else if (props.markers?.[0]) {
      centerMap(
        mapInstance,
        props.markers[0].lat,
        props.markers[0].lon,
        props.zoom
      );
    }

    // Add initial markers
    updateMarkers();
    
    // Initialize drawing if enabled
    if (props.drawingEnabled) {
      initDrawing(mapInstance, props.drawingMode || 'polygon');
    }
  });
});

// Update markers when props change
function updateMarkers() {
  if (!map.value) return;

  // Update markers
  clearMarkers(map.value);
  if (props.markers?.length) {
    props.markers.forEach(markerData => {
      addMarker(map.value!, markerData, props.displayPopups !== false);
    });
  }
}

// Only watch markers for adding/removing markers
watch(
  () => props.markers,
  () => updateMarkers(),
  { deep: true }
);

// Force map resize on visibility change
onUpdated(() => {
  if (map.value) {
    nextTick(() => map.value?.resize());
  }
});

// Combined watcher for all map updates
watch(
  [
    () => props.markers,
    () => props.center,
    () => props.zoom
  ],
  ([newMarkers, newCenter, newZoom], [oldMarkers, oldCenter, oldZoom]) => {
    if (!map.value) return;

    // Update markers if they've changed
    if (newMarkers !== oldMarkers) {
      updateMarkers();
    }

    // Only recenter if coordinates or zoom actually changed
    const centerChanged = JSON.stringify(newCenter) !== JSON.stringify(oldCenter);
    const zoomChanged = newZoom !== oldZoom;
    const firstMarkerChanged = newMarkers?.[0]?.lat !== oldMarkers?.[0]?.lat ||
      newMarkers?.[0]?.lon !== oldMarkers?.[0]?.lon;

    if (centerChanged || zoomChanged || firstMarkerChanged) {
      if (newCenter) {
        centerMap(map.value, newCenter.lat, newCenter.lon, newZoom);
      } else if (newMarkers?.[0]) {
        centerMap(map.value, newMarkers[0].lat, newMarkers[0].lon, newZoom);
      }
    }
  },
  { deep: true }
);

// Watch for changes to drawing props
watch(
  [() => props.drawingEnabled, () => props.drawingMode],
  ([newDrawingEnabled, newDrawingMode], [oldDrawingEnabled, oldDrawingMode]) => {
    if (!map.value) return;
    
    if (newDrawingEnabled !== oldDrawingEnabled || newDrawingMode !== oldDrawingMode) {
      console.info(`[Map] Drawing settings changed: enabled=${newDrawingEnabled}, mode=${newDrawingMode}`);
      
      if (newDrawingEnabled) {
        initDrawing(map.value, newDrawingMode || 'polygon');
      } else {
        initDrawing(map.value, null);
      }
    }
  }
);

// Method to clear drawn shapes - can be called from outside via ref if needed
function clearDrawings() {
  if (map.value) {
    clearDrawnShapes(map.value);
    // Optional: notify any listeners
    emit('shape-deleted', []);
  }
}

// Add clearDrawings to exposed methods
defineExpose({ map, clearDrawings });
</script>

<style>
.maptiler-map {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  width: 100%;
  height: 100%;
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

/* Drawing control styles */
.mapbox-gl-draw_ctrl-draw-btn {
  background-repeat: no-repeat;
  background-position: center;
}

/* Override pointer-events when drawing is enabled */
.drawing-enabled .mapboxgl-canvas-container,
.drawing-enabled .mapboxgl-canvas,
.drawing-enabled .mapboxgl-ctrl-group,
.drawing-enabled .mapbox-gl-draw_ctrl-draw-btn,
.drawing-enabled .maplibregl-canvas-container,
.drawing-enabled .maplibregl-canvas,
.drawing-enabled .maplibregl-ctrl-group,
.drawing-enabled .mapbox-gl-draw_trash {
  pointer-events: auto !important;
}

/* Make sure static map mode can be disabled for drawing */
.drawing-enabled.maptiler-map-static::after {
  pointer-events: none !important;
}
</style>
