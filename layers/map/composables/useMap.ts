import { Marker } from "@maptiler/sdk";
import type { MapMarker, ExtendedMapTilerMap, MapInstance, MapInitOptions, GeocodingFeature, GeocodingResponse } from "~~/shared/types/map";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { setControls, findMapInstance, renderMarker, renderPopup, styles, calculateZoomLevelFromRadius } from "../utils/mapHelpers";

/**
 * State and Cache
 */
const mapCache = new Map<string, MapInstance>();
export const GLOBAL_MAP_ID = "virify-map";
const circleSourceId = 'search-radius-source';
const circleLayerId = 'search-radius-layer';

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
    map.setZoom(options.zoom ?? 12);
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
      zoom: options.zoom ?? 12,
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
   * Adds multiple markers to the map instance (from a search result)
   *
   * @param map The map to add markers to
   * @param markers Array of markers to add
   * @returns Array of created marker objects
   */
  function addMarkers(map: ExtendedMapTilerMap, markers: MapMarker[]): Marker[] {
    const instance = findMapInstance(map, mapCache);
    if (!instance) {
      console.error("[Map] Instance not found");
      return [];
    }

    // each marker needs its own dom element
    // so we need to create a wrapper for each marker
    for (const marker of markers) {
      const markerWrapper = renderMarker(marker.price, marker.hasNote, marker.isFavorite, vueApp);

      const newMarker = new sdk.Marker({
        element: markerWrapper,
      });

      newMarker.setLngLat([marker.lon, marker.lat]);
      const popup = renderPopup(marker, vueApp);
      newMarker.setPopup(popup);
      newMarker.addTo(map);
      instance.markers.push(newMarker);
    }
    console.log("[Map] Added " + markers.length + " markers to map instance");
    return instance.markers;
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

    const drawControl = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true },
      defaultMode: "simple_select",
      userProperties: true,
      styles,
    });

    map.addControl(drawControl, "top-right");
    instance.drawControl = drawControl;

    // Patch classes for Mapbox Draw control (Maplibre compatibility)
    document.querySelectorAll(".mapboxgl-ctrl-group.mapboxgl-ctrl")
      .forEach(elem => elem.classList.add("maplibregl-ctrl", "maplibregl-ctrl-group"));

    // Set cursor to crosshair only when in drawing mode
    map.on("draw.modechange", (e: any) => {
      map.getCanvas().style.cursor = e.mode === "draw_polygon" ? "crosshair" : "";
    });
  }

  /**
   * Geocoding autocomplete
   */
  async function autoComplete(query: string): Promise<GeocodingFeature[]> {
    if (!query) return [];
    try {
      const res = await $fetch<GeocodingResponse>(`https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json`, {
        query: { key: sdk.config.apiKey, country: "gb" },
      });
      return res.features ?? [];
    } catch (e) {
      console.error("[Map] Search error:", e);
      return [];
    }
  }

  /**
   * Updates or adds a circle to visualize the search radius
   *
   * @param map The map instance
   * @param center The center coordinates [lon, lat]
   * @param radiusMiles The radius in miles
   */
  function updateSearchRadiusVisualization(
    map: ExtendedMapTilerMap,
    center: [number, number],
    radiusMiles: number
  ) {
    // Remove existing circle layers and sources
    [circleLayerId + '-outline', circleLayerId].forEach(layerId => {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
    });
    if (map.getSource(circleSourceId)) map.removeSource(circleSourceId);

    // Create a circle polygon (approximate)
    const points = 64;
    const coordinates: [number, number][] = [];
    const radiusKm = radiusMiles * 1.60934;
    const lat = center[1];
    const lon = center[0];
    const latOffset = radiusKm / 111.32;
    const lonOffset = (deg: number) => radiusKm / (111.32 * Math.cos(deg * Math.PI / 180));

    for (let i = 0; i < points; i++) {
      const angle = (i * 2 * Math.PI) / points;
      coordinates.push([
        lon + lonOffset(lat) * Math.cos(angle),
        lat + latOffset * Math.sin(angle)
      ]);
    }
    if (coordinates.length > 0 && coordinates[0] !== undefined) {
      const [firstLon, firstLat] = coordinates[0];
      coordinates.push([firstLon, firstLat]); // Close the circle
    }

    map.addSource(circleSourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates]
        }
      }
    });

    map.addLayer({
      id: circleLayerId,
      type: 'fill',
      source: circleSourceId,
      paint: {
        'fill-color': '#326C96',
        'fill-opacity': 0.15,
        'fill-outline-color': '#326C96'
      }
    });

    map.addLayer({
      id: circleLayerId + '-outline',
      type: 'line',
      source: circleSourceId,
      paint: {
        'line-color': '#326C96',
        'line-width': 2,
        'line-opacity': 0.4
      }
    });
  }

  return {
    initMap,
    addMarkers,
    addMarker,
    clearMarkers,
    calculateZoomLevelFromRadius,
    autoComplete,
    initDrawing,
    updateSearchRadiusVisualization
  } as const;
}