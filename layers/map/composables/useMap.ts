import { MoleculesMarkerPopup, MoleculesPriceMarker } from "#components";
import { defineComponent, h, createVNode, render } from "vue";
import { Marker, Popup } from "@maptiler/sdk";
import type { MapMarker, ExtendedMapTilerMap, MapInstance, MapInitOptions, GeocodingFeature, GeocodingResponse } from "~~/shared/types/map";

const mapCache = new Map<string, MapInstance>();
export const GLOBAL_MAP_ID = "virify-map";

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
    const instance = findMapInstance(map);
    if (!instance || !marker || marker.length === 0 || !marker[0]) {
      console.error("[Map] Instance not found or invalid marker");
      return undefined;
    }
    const newMarker = new sdk.Marker().setLngLat([marker[0].lon, marker[0].lat]);
    newMarker.addTo(map);
    instance.markers.push(newMarker);

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
    const instance = findMapInstance(map);
    if (!instance) {
      console.error("[Map] Instance not found");
      return [];
    }

    // each marker needs its own dom element
    // so we need to create a wrapper for each marker
    for (const marker of markers) {
      const markerWrapper = renderMarker(marker.price, marker.hasNote, marker.isFavorite);
      const newMarker = new sdk.Marker({
        element: markerWrapper,
      });
      newMarker.setLngLat([marker.lon, marker.lat]);
      const popup = renderPopup(marker);
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
    const instance = findMapInstance(map);
    if (instance) {
      instance.markers.forEach((marker) => marker.remove());
      instance.markers = [];
    }
  }

  /**
   * Calculate zoom level based on search radius (in miles)
   */
  function calculateZoomLevelFromRadius(radius?: number | null): number {
    if (!radius) return 10;
    const radiusNum = Number(radius);

    switch (true) {
      case radiusNum === 0:
        return 16;
      case radiusNum <= 0.25:
        return 15;
      case radiusNum <= 0.5:
        return 14;
      case radiusNum <= 1:
        return 13;
      case radiusNum <= 5:
        return 12;
      case radiusNum <= 10:
        return 12;
      case radiusNum <= 20:
        return 11;
      default:
        return 10;
    }
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

  return {
    initMap,
    addMarkers,
    addMarker,
    clearMarkers,
    calculateZoomLevelFromRadius,
    autoComplete,
  } as const;

  /**
   * !! Helper functions !!
   * These functions are not exported and are only used internally
   */

  function setControls(existingMapInstance: MapInstance, map: ExtendedMapTilerMap, options: MapOptions): boolean | void {
    const prevInteractive = existingMapInstance.interactive;
    const newInteractive = options.interactive;

    // Update navigation control
    // Use type assertion since sdk's NavigationControl doesn't match the IControl interface exactly
    const navControl = new sdk.NavigationControl() as any;
    const controls = map._controls ?? [];

    if (prevInteractive !== newInteractive) {
      if (newInteractive) {
        map.dragPan.enable();
        map.scrollZoom.enable();
        map.doubleClickZoom.enable();
        map.touchZoomRotate.enable();
        map.keyboard.enable();
        map.boxZoom.enable();

        if (!controls.some((c: any) => c instanceof sdk.NavigationControl)) {
          map.addControl(navControl as any, "top-right");
        }
      } else {
        map.dragPan.disable();
        map.scrollZoom.disable();
        map.doubleClickZoom.disable();
        map.touchZoomRotate.disable();
        map.keyboard.disable();
        map.boxZoom.disable();

        for (const control of controls) {
          if (control instanceof sdk.NavigationControl) {
            map.removeControl(control as any);
          }
        }
      }

      existingMapInstance.interactive = newInteractive;
      return newInteractive;
    }
  }

  /**
   * Find a MapInstance by its map object
   *
   * @param map The map object to find
   * @returns The MapInstance or undefined if not found
   */
  function findMapInstance(map: ExtendedMapTilerMap): MapInstance | undefined {
    for (const [_, instance] of mapCache) {
      if (instance.map === map) {
        return instance;
      }
    }
    return undefined;
  }

  /**
   * Render a price marker
   *
   * @param price number | null
   * @param hasNote boolean | undefined
   * @param isFavorite boolean | undefined
   * @returns HTMLElement
   */
  function renderMarker(price: number | null, hasNote?: boolean, isFavorite?: boolean): HTMLElement {
    const markerWrapper = document.createElement("div");
    const MarkerComp = defineComponent({
      setup: () => () => {
        return h(MoleculesPriceMarker, {
          price,
          hasNote: Boolean(hasNote),
          isFavorite: Boolean(isFavorite),
        });
      },
    });

    const markerNode = createVNode(MarkerComp);
    markerNode.appContext = vueApp.vueApp._context;
    render(markerNode, markerWrapper);

    return markerWrapper;
  }

  /**
   * Render a popup for a marker
   *
   * @param marker MapMarker
   * @returns Popup
   */
  function renderPopup(marker: MapMarker): Popup {
    const popupWrapper = document.createElement("div");

    const PopupComp = defineComponent({
      setup: () => () => {
        return h(MoleculesMarkerPopup, {
          marker,
        });
      },
    });

    const popupNode = createVNode(PopupComp);
    popupNode.appContext = vueApp.vueApp._context;
    render(popupNode, popupWrapper);

    return new sdk.Popup({
      offset: 25,
    }).setDOMContent(popupWrapper);
  }
}
