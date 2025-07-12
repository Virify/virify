import { Marker } from "@maptiler/sdk";
import type { MapMarker, ExtendedMapTilerMap, MapInstance, MapInitOptions, GeocodingFeature, GeocodingResponse } from "~~/shared/types/map";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { setControls, findMapInstance, renderMarker, renderPopup, styles, calculateZoomLevelFromRadius } from "../utils/mapHelpers";

/**
 * State and Cache
 */
const mapCache = new Map<string, MapInstance>();
export const GLOBAL_MAP_ID = "virify-map";

// Global drawing state for all map instances
const drawingState = reactive({
  isDrawing: false,
  hasShapes: false,
  hasSelectedShape: false,
});

// Global polygon geometry storage - support multiple polygons
const polygonGeometries = ref<any[]>([]);

export function useMap() {
  const sdk = useNuxtApp().$maptilersdk;
  const vueApp = useNuxtApp();

  /**
   * Reuse an existing map instance if it exists.
   * We need to track interactivity to enable/disable map controls
   *
   * @param mapId string - The ID of the map to reuse
   * @param container HTMLElement - The container to attach the map to
   * @returns The reused map instance or undefined if no map exists with this ID
   */
  function resuseMap(container: HTMLElement, options: MapInitOptions, mapId: string): ExtendedMapTilerMap | undefined {
    const existingMapInstance = mapCache.get(mapId);
    if (!existingMapInstance) return undefined;

    const map = existingMapInstance.map;
    const mapContainer = map.getContainer();

    if (mapContainer.parentElement) mapContainer.remove();

    container.innerHTML = "";
    container.appendChild(mapContainer);
    container.style.width = "100%";
    container.style.height = "100%";

    // reset map controls and options
    setControls(existingMapInstance, map, options);
    map.setZoom(options.zoom ?? 6);
    map.setCenter(options.center);

    console.log("[Map] Reusing existing map instance");

    return map;
  }

  /**
   * Init a new map instance
   *
   * @param container map container
   * @param options options
   * @param mapId string
   */
  function initNewMap(container: HTMLElement, options: MapOptions, mapId: string): ExtendedMapTilerMap {
    console.log("[Map] Creating new map instance");

    container.style.width = "100%";
    container.style.height = "100%";

    const map = new sdk.Map({
      container,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${sdk.config.apiKey}`,
      interactive: options.interactive,
      zoom: options.zoom ?? 6,
      navigationControl: options.interactive,
      navigationControlOptions: {
        position: "top-right",
      },
      center: options.center,
    }) as ExtendedMapTilerMap;

    // cache the map instance
    if (mapId) {
      mapCache.set(mapId, {
        map,
        markers: [],
        markerMap: new Map(),
        interactive: options.interactive,
        drawControl: null,
        featureMarkers: new Map(), // Initialize feature markers tracking
      });
    }

    return map;
  }

  /**
   * Init an existing map instance or create a new one
   *
   * @param container map container
   * @param options options
   * @param mapId string
   * @returns The map instance (either reused or newly created)
   */
  function initMap(container: HTMLElement, options: MapOptions, mapId: string): ExtendedMapTilerMap {
    return resuseMap(container, options, mapId) ?? initNewMap(container, options, mapId);
  }

  /**
   * Private helper to create and add a single SDK marker to the map and instance.
   */
  function _createAndAddSdkMarker(map: ExtendedMapTilerMap, markerData: MapMarker, instance: MapInstance): Marker {
    const markerWrapper = renderMarker(markerData.price, markerData.hasNote, markerData.isFavorite, markerData.tier, vueApp, markerData.id, markerData.priceType);
    const newSdkMarker = new sdk.Marker({
      element: markerWrapper,
      anchor: "bottom",
    });
    newSdkMarker.setLngLat([markerData.lon, markerData.lat]);
    const popup = renderPopup(markerData, vueApp);
    newSdkMarker.setPopup(popup);
    newSdkMarker.addTo(map);
    instance.markers.push(newSdkMarker); // Add to the main list of all markers
    return newSdkMarker;
  }

  /**
   * Adds a marker to the map instance
   *
   * @param map The map to add the marker to
   * @param marker The marker to add
   */
  function addMarker(map: ExtendedMapTilerMap, marker: Array<{ lat: number; lon: number }> | null | undefined): Marker | undefined {
    const instance = findMapInstance(map, mapCache);
    if (!instance || !marker || marker.length === 0 || !marker[0]) {
      console.error("[Map] Instance not found or invalid marker");
      return undefined;
    }
    const newMarker = new sdk.Marker().setLngLat([marker[0].lon, marker[0].lat]);
    newMarker.addTo(map);
    instance.markers.push(newMarker);
    console.log("[Map] Added marker to map instance");
    return newMarker;
  }

  /**
   * Adds multiple markers to the map instance for a specific feature
   *
   * @param map The map to add markers to
   * @param markers Array of markers to add
   * @param featureId The ID of the feature these markers belong to
   * @returns Array of created marker objects
   */
  function addMarkersForFeature(map: ExtendedMapTilerMap, markersData: MapMarker[], featureId: string): Marker[] {
    const instance = findMapInstance(map, mapCache);
    if (!instance) {
      console.error("[Map] Instance not found");
      return [];
    }

    const addedSdkMarkers: Marker[] = [];
    for (const markerData of markersData) {
      const newSdkMarker = _createAndAddSdkMarker(map, markerData, instance);
      addedSdkMarkers.push(newSdkMarker);
    }

    // Store the markers for this feature
    instance.featureMarkers.set(featureId, addedSdkMarkers);

    console.log(`[Map] Added ${addedSdkMarkers.length} markers for feature ${featureId}`);
    return addedSdkMarkers;
  }

  /**
   * Adds multiple markers to the map instance (from a search result or general purpose)
   *
   * @param map The map to add markers to
   * @param markers Array of markers to add
   * @returns Array of newly created marker objects
   */
  function addMarkers(map: ExtendedMapTilerMap, markersData: MapMarker[]): Marker[] {
    const instance = findMapInstance(map, mapCache);
    if (!instance) {
      console.error("[Map] Instance not found");
      return [];
    }

    // Sort markers by tier priority: BASIC first (bottom), then FEATURED, then PREMIUM last (top)
    const sortedMarkersData = [...markersData].sort((a, b) => {
      const getTierPriority = (tier?: string) => {
        switch (tier) {
          case "BASIC": return 1;
          case "FEATURED": return 2;
          case "PREMIUM": return 3;
          default: return 1; // Default to BASIC priority
        }
      };
      return getTierPriority(a.tier) - getTierPriority(b.tier);
    });

    const addedSdkMarkers: Marker[] = [];
    for (const markerData of sortedMarkersData) {
      const newSdkMarker = _createAndAddSdkMarker(map, markerData, instance);
      addedSdkMarkers.push(newSdkMarker);
    }

    console.log(`[Map] Added ${addedSdkMarkers.length} general markers to map instance`);
    return addedSdkMarkers; // Return only the newly added markers
  }

  /**
   * Clears all markers from a map
   *
   * @param map The map to clear markers from
   */
  function clearMarkers(map: ExtendedMapTilerMap): void {
    const instance = findMapInstance(map, mapCache);
    if (instance) {
      instance.markers.forEach((marker) => marker.remove());
      console.log("[Map] Cleared markers from map instance");
      instance.markers = [];
      instance.featureMarkers.clear(); // Clear feature marker tracking too
    }
  }

  /**
   * Clears markers for a specific feature
   *
   * @param map The map to clear markers from
   * @param featureId The ID of the feature whose markers should be cleared
   */
  function clearMarkersForFeature(map: ExtendedMapTilerMap, featureId: string): void {
    const instance = findMapInstance(map, mapCache);
    if (!instance) return;

    const featureMarkers = instance.featureMarkers.get(featureId);
    if (featureMarkers) {
      // Remove these markers from the map
      featureMarkers.forEach((marker) => marker.remove());

      // Remove these markers from the main markers array
      instance.markers = instance.markers.filter((marker) => !featureMarkers.includes(marker));

      // Remove the feature from tracking
      instance.featureMarkers.delete(featureId);

      console.log("[Map] Cleared " + featureMarkers.length + " markers for feature " + featureId);
    }
  }

  /**
   * Draw control for the map
   *
   * @param map The map to add the draw control to
   * @param draw Boolean - whether to add the draw control
   */
  function initDrawing(map: ExtendedMapTilerMap, draw: boolean): void {
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
   * Geocoding autocomplete
   */
  async function autoComplete(query: string): Promise<GeocodingFeature[]> {
    if (!query) return [];
    try {
      const res = await $fetch<GeocodingResponse>(`https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json`, {
        query: { 
          key: sdk.config.apiKey, 
          country: "gb",
        },
      });
      
      // Sort results by priority: region -> county -> postal_code -> address
      // Using MapTiler's actual place type names - putting 'place' last to avoid POIs like castles
      const priorityOrder = ['region', 'district', 'municipality', 'locality', 'postcode', 'address', 'place'];
      
      const sortedFeatures = (res.features ?? []).sort((a, b) => {
        // Since place_type is empty, use simple heuristics based on place names
        const aName = a.place_name_en.toLowerCase();
        const bName = b.place_name_en.toLowerCase();
        
        // Higher priority for shorter, simpler names (likely cities/regions)
        // Lower priority for names with "castle", "road", "cycleway", etc.
        const getPriority = (name: string) => {
          if (name.includes('castle')) return 100; // Very low priority for castles
          if (name.includes('road') || name.includes('street') || name.includes('avenue')) return 90; // Addresses
          if (name.includes('cycleway') || name.includes('path') || name.includes('lane')) return 85; // Paths/routes
          if (name.match(/\b[a-z]{1,2}\d+\s+\d[a-z]{2}\b/)) return 80; // Postcodes (pattern like CF24 0AB)
          
          // Shorter names are likely cities/regions
          const parts = name.split(',').length;
          if (parts <= 2) return 10; // Likely city or region
          if (parts === 3) return 20; // Could be district
          return 30; // Longer names are likely more specific addresses
        };
        
        const aPriority = getPriority(aName);
        const bPriority = getPriority(bName);
        
        return aPriority - bPriority;
      });
      
      return sortedFeatures;
    } catch (e) {
      console.error("[Map] Search error:", e);
      return [];
    }
  }

  /**
   * Geocodes a query and returns the best match (first result)
   * Used as fallback when user doesn't click on autocomplete suggestions
   */
  async function geocodeAndSelectBest(query: string): Promise<GeocodingFeature | null> {
    if (!query) return null;
    try {
      const suggestions = await autoComplete(query);
      const result = suggestions.length > 0 ? suggestions[0] ?? null : null;
      return result;
    } catch (e) {
      return null;
    }
  }

  /**
   * Updates or adds a circle to visualize the search radius as an SVG overlay (no tile requests)
   *
   * @param map The map instance
   * @param center The center coordinates [lon, lat]
   * @param radiusMiles The radius in miles
   */
  function updateSearchRadiusVisualization(map: ExtendedMapTilerMap, center: [number, number], radiusMiles: number) {
    // Remove any existing SVG overlay
    const mapContainer = map.getContainer();
    let svgOverlay = mapContainer.querySelector(".search-radius-svg") as SVGSVGElement | null;
    if (svgOverlay) {
      // Cleanup listeners if present
      if ((svgOverlay as any)._cleanup) (svgOverlay as any)._cleanup();
      svgOverlay.remove();
    }

    // Create SVG overlay
    svgOverlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgOverlay.classList.add("search-radius-svg");
    svgOverlay.style.position = "absolute";
    svgOverlay.style.top = "0";
    svgOverlay.style.left = "0";
    svgOverlay.style.width = "100%";
    svgOverlay.style.height = "100%";
    svgOverlay.style.pointerEvents = "none";
    mapContainer.appendChild(svgOverlay);

    // Helper to update the circle position/size
    function drawCircle() {
      // Get map size
      const width = mapContainer.offsetWidth;
      const height = mapContainer.offsetHeight;
      (svgOverlay as SVGSVGElement).setAttribute("width", width.toString());
      (svgOverlay as SVGSVGElement).setAttribute("height", height.toString());

      // Project center to pixel coordinates
      const mapAny = map as any; // project exists at runtime
      const centerPx = mapAny.project(center);

      // Calculate radius in meters
      const radiusMeters = radiusMiles * 1609.34;
      // Calculate pixel radius at current zoom
      // Use a point due east of center at the radius distance
      const earthRadius = 6378137;
      const dLng = ((radiusMeters / (earthRadius * Math.cos((Math.PI * center[1]) / 180))) * 180) / Math.PI;
      const edgeLng = center[0] + dLng;
      const edgePx = mapAny.project([edgeLng, center[1]]);
      const pixelRadius = Math.abs(edgePx.x - centerPx.x);

      // Clear previous SVG content
      (svgOverlay as SVGSVGElement).innerHTML = "";
      // Draw the circle
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", centerPx.x.toString());
      circle.setAttribute("cy", centerPx.y.toString());
      circle.setAttribute("r", pixelRadius.toString());
      circle.setAttribute("fill", "#326C96");
      circle.setAttribute("fill-opacity", "0.15");
      circle.setAttribute("stroke", "#326C96");
      circle.setAttribute("stroke-width", "2");
      circle.setAttribute("stroke-opacity", "0.4");
      (svgOverlay as SVGSVGElement).appendChild(circle);
    }

    drawCircle();

    // Redraw on move/zoom/resize
    function onMove() {
      drawCircle();
    }
    map.on("move", onMove);
    map.on("zoom", onMove);
    window.addEventListener("resize", onMove);

    // Store cleanup for this overlay
    (svgOverlay as any)._cleanup = () => {
      map.off("move", onMove);
      map.off("zoom", onMove);
      window.removeEventListener("resize", onMove);
    };
  }

  /**
   * Removes the SVG overlay for the search radius visualization (and cleans up listeners)
   * @param map The map instance
   */
  function removeSearchRadiusVisualization(map: ExtendedMapTilerMap) {
    if (!map || !map.getContainer) return;
    const mapContainer = map.getContainer();
    const svgOverlay = mapContainer.querySelector(".search-radius-svg") as SVGSVGElement | null;
    if (svgOverlay) {
      if ((svgOverlay as any)._cleanup) (svgOverlay as any)._cleanup();
      svgOverlay.remove();
    }
  }

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
  function deleteAllShapes(map: ExtendedMapTilerMap) {
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
  function deleteSelectedShape(map: ExtendedMapTilerMap) {
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

  return {
    initMap,
    addMarkers,
    addMarker,
    clearMarkers,
    clearMarkersForFeature,
    addMarkersForFeature,
    calculateZoomLevelFromRadius,
    autoComplete,
    geocodeAndSelectBest,
    initDrawing,
    getDrawControl,
    updateSearchRadiusVisualization,
    removeSearchRadiusVisualization,
    // Drawing state and functions
    drawingState: readonly(drawingState),
    polygonGeometries: readonly(polygonGeometries),
    togglePolygonDrawing,
    deleteAllShapes,
    deleteSelectedShape,
    // Polygon geometry management
    getBBox,
    setBBox,
    clearBBox,
  } as const;
}
