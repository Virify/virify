import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { ExtendedMapTilerMap, MapInstance } from "~~/shared/types/map";
import { findMapInstance, styles } from "../utils/mapHelpers";

// Global drawing state for all map instances
const drawingState = reactive({
  isDrawing: false,
  hasShapes: false,
  hasSelectedShape: false,
});

// Global polygon geometry storage - support multiple polygons
const polygonGeometries = ref<any[]>([]);

export function useMapDraw(mapCache: Map<string, MapInstance>) {
  function addBBox(e: any, map: ExtendedMapTilerMap) {
    const feature = e.features[0];
    if (!feature) return;

    // Use the actual feature ID from MapboxDraw - don't generate custom IDs
    const featureId = feature.id;
    if (!featureId) {
      console.error("[Map] Feature has no ID from MapboxDraw");
      return;
    }

    // Ensure polygon coordinates are a closed loop if feature is a Polygon to avoid rendering issues on zoom
    if (feature.geometry && feature.geometry.type === "Polygon") {
      const coords = feature.geometry.coordinates[0];
      if (coords.length > 2) {
        const first = coords[0];
        const last = coords[coords.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
          coords.push([...first]);
        }
      }
    }
    
    // Store the polygon geometry for search integration
    const geometry = feature.geometry && feature.geometry.type === "Polygon" ? { 
      id: featureId,
      type: "Polygon", 
      coordinates: feature.geometry.coordinates 
    } : undefined;
    
    if (geometry) {
      // Add to array of polygon geometries
      polygonGeometries.value.push(geometry);
      console.log("[Map] Polygon geometry stored for search:", geometry);
    }
  }

  /**
   * Draw control for the map
   *
   * @param map The map to add the draw control to
   * @param draw Boolean - whether to add the draw control
   * @param clearMarkers Function to clear markers when entering draw mode
   * @param removeSearchRadiusVisualization Function to remove search radius when entering draw mode
   * @param clearMarkersForFeature Function to clear markers for specific features
   */
  function initDrawing(
    map: ExtendedMapTilerMap, 
    draw: boolean,
    clearMarkers: (map: ExtendedMapTilerMap) => void,
    removeSearchRadiusVisualization: (map: ExtendedMapTilerMap) => void,
    clearMarkersForFeature: (map: ExtendedMapTilerMap, featureId: string) => void
  ): void {
    const instance = findMapInstance(map, mapCache);
    if (!instance) {
      console.error("[Map] Instance not found");
      return;
    }

    // Remove existing draw control and reset cursor
    if (instance.drawControl) {
      map.removeControl(instance.drawControl);
      instance.drawControl = null;
      map.getCanvas().style.cursor = "";
    }

    if (!draw) return;

    console.log("[Map] Adding draw control");

    // Clear existing markers and search radius when entering draw mode
    clearMarkers(map);
    removeSearchRadiusVisualization(map);

    const drawControl = new MapboxDraw({
      displayControlsDefault: false,
      controls: {}, // Remove all default controls for completely custom implementation
      defaultMode: "simple_select",
      userProperties: true,
      styles,
      modes: {
        ...MapboxDraw.modes,
        // Override simple_select to disable dragging
        simple_select: {
          ...MapboxDraw.modes.simple_select,
          onDrag: () => {}, // Disable dragging
          onTouchMove: () => {}, // Disable touch dragging
        },
      },
    });

    // Add the draw control but without displaying any default UI
    map.addControl(drawControl, "top-right");
    instance.drawControl = drawControl;

    // Set cursor to crosshair only when in drawing mode
    map.on("draw.modechange", (e: any) => {
      map.getCanvas().style.cursor = e.mode === "draw_polygon" ? "crosshair" : "";
      drawingState.isDrawing = e.mode === 'draw_polygon';
    });

    // Track selection changes
    map.on('draw.selectionchange', (e: any) => {
      drawingState.hasSelectedShape = e.features && e.features.length > 0;
    });

    map.on("draw.create", (e: any) => {
      // Process the drawn polygon
      addBBox(e, map);
      drawingState.hasShapes = true;
      drawingState.isDrawing = false; // Exit draw mode after creating
      console.log("[Map] Polygon created and processed - dragging disabled");
    });

    map.on("draw.delete", (e: any) => {
      // Clear markers only for the deleted features
      e.features.forEach((feature: any) => {
        if (feature.id) {
          clearMarkersForFeature(map, feature.id);
          // Remove geometry from stored array
          polygonGeometries.value = polygonGeometries.value.filter(
            (geom: any) => geom.id !== feature.id
          );
        }
      });
      
      const drawControl = getDrawControl(map);
      if (drawControl) {
        const allFeatures = drawControl.getAll();
        drawingState.hasShapes = allFeatures.features.length > 0;
        drawingState.hasSelectedShape = false; // Reset selection after delete
        
        // Clear stored polygon geometries if no shapes remain
        if (!drawingState.hasShapes) {
          polygonGeometries.value = [];
        }
      }
    });
  }

  /**
   * Get the draw control instance for a specific map
   *
   * @param map The map to get the draw control from
   * @returns The MapboxDraw instance or null if not found
   */
  function getDrawControl(map: ExtendedMapTilerMap): any | null {
    const instance = findMapInstance(map, mapCache);
    return instance?.drawControl || null;
  }

  /**
   * Handle polygon drawing toggle - manages drawing state
   */
  function togglePolygonDrawing(map: ExtendedMapTilerMap) {
    if (!map) return;
    
    const drawControl = getDrawControl(map);
    if (!drawControl) return;
    
    drawingState.isDrawing = !drawingState.isDrawing;
    
    if (drawingState.isDrawing) {
      drawControl.changeMode('draw_polygon');
    } else {
      drawControl.changeMode('simple_select');
    }
  }

  /**
   * Handle delete all shapes - clears all drawn shapes and markers
   */
  function deleteAllShapes(
    map: ExtendedMapTilerMap,
    clearMarkers: (map: ExtendedMapTilerMap) => void,
    clearMarkersForFeature: (map: ExtendedMapTilerMap, featureId: string) => void
  ) {
    if (!map) return;
    
    const drawControl = getDrawControl(map);
    if (!drawControl) return;
    
    // Get all features before deleting to clear their markers
    const allFeatures = drawControl.getAll();
    allFeatures.features.forEach((feature: any) => {
      if (feature.id) {
        clearMarkersForFeature(map, feature.id);
      }
    });
    
    // Also clear all general markers on the map
    clearMarkers(map);
    
    drawControl.deleteAll();
    drawingState.hasShapes = false;
    drawingState.hasSelectedShape = false;
    
    // Clear stored polygon geometries
    polygonGeometries.value = [];
  }

  /**
   * Handle delete selected shape - removes selected shapes
   */
  function deleteSelectedShape(
    map: ExtendedMapTilerMap,
    clearMarkersForFeature: (map: ExtendedMapTilerMap, featureId: string) => void
  ) {
    if (!map) return;
    
    const drawControl = getDrawControl(map);
    if (!drawControl) return;
    
    // Get selected features
    const selectedFeatures = drawControl.getSelected();
    if (selectedFeatures.features && selectedFeatures.features.length > 0) {
      // Clear markers for selected features
      selectedFeatures.features.forEach((feature: any) => {
        if (feature.id) {
          clearMarkersForFeature(map, feature.id);
          // Remove geometry from stored array
          polygonGeometries.value = polygonGeometries.value.filter(
            (geom: any) => geom.id !== feature.id
          );
        }
      });
      
      // Delete selected features
      const selectedIds = selectedFeatures.features.map((f: any) => f.id);
      drawControl.delete(selectedIds);
      
      // Update state
      const remainingFeatures = drawControl.getAll();
      drawingState.hasShapes = remainingFeatures.features.length > 0;
      drawingState.hasSelectedShape = false;
      
      // Clear stored polygon geometries if no shapes remain
      if (!drawingState.hasShapes) {
        polygonGeometries.value = [];
      }
    }
  }

  /**
   * Get the current polygon geometries for search integration
   */
  function getBBox() {
    return polygonGeometries.value;
  }

  /**
   * Set polygon geometries for search integration
   */
  function setBBox(geometries: any[]) {
    polygonGeometries.value = geometries;
  }

  /**
   * Clear polygon geometries
   */
  function clearBBox() {
    polygonGeometries.value = [];
  }

  return {
    initDrawing,
    getDrawControl,
    togglePolygonDrawing,
    deleteAllShapes,
    deleteSelectedShape,
    getBBox,
    setBBox,
    clearBBox,
    drawingState: readonly(drawingState),
    polygonGeometries: readonly(polygonGeometries),
  } as const;
}