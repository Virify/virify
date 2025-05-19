import type { MapMarker } from '#shared/types/map-coordinates';
import type { Map as MapTilerMap } from "@maptiler/sdk";
import { createVNode, render, h, defineComponent } from "vue";
import MoleculesMarkerPopup from '../components/molecules/MoleculesMarkerPopup.vue';
import MoleculesPriceMarker from '../components/molecules/MoleculesPriceMarker.vue';

interface MapInstance {
  map: MapTilerMap;
  markers: any[];
}

// Simple cache to share map instances across pages
const mapCache = new Map<string, MapInstance>();

// Global map ID to ensure we reuse the same map instance
export const GLOBAL_MAP_ID = 'virify-map';

export function useMapTiler() {
  const sdk = useNuxtApp().$maptilersdk;
  const vueApp = useNuxtApp().vueApp;

  /**
   * Initialize or reuse a map instance
   */
  function initializeMap(container: HTMLElement, options: { zoom?: number; interactive?: boolean } = {}, mapId?: string) {
    if (mapId) {
      console.info(`[Map] Initializing map with ID: ${mapId}`);
    }
    
    // Reuse existing map if available
    if (mapId && mapCache.has(mapId)) {
      console.info(`[Map] Reusing existing map instance: ${mapId}`);
      const instance = mapCache.get(mapId)!;
      try {
        // Move map to new container
        const mapContainer = instance.map.getContainer();
        if (mapContainer?.parentElement) {
          mapContainer.remove();
        }
        container.appendChild(mapContainer || document.createElement("div"));
        instance.map.resize();
        console.info(`[Map] Successfully reattached map: ${mapId}`);
      } catch (e) {
        console.error("[Map] Error reattaching map:", e);
      }
      return instance.map;
    }
    
    console.info(`[Map] Creating new map instance${mapId ? `: ${mapId}` : ''}`);

    // Create new map
    const map = new sdk.Map({
      container,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${sdk.config.apiKey}`,
      zoom: options.zoom ?? 12,
      interactive: options.interactive !== false,
      navigationControl: true,
      navigationControlOptions: {
        showCompass: false, // Only show zoom controls
        visualizePitch: false
      }
    });

    // Cache if ID provided
    if (mapId) {
      mapCache.set(mapId, { map, markers: [] });
    }

    return map;
  }

  /**
   * Calculate zoom level based on search radius (in miles)
   */
  function calculateZoomLevelFromRadius(radius?: number | null): number {
    if (!radius) return 14;
    const radiusNum = Number(radius);
    
    if (radiusNum === 0) return 16;
    else if (radiusNum <= 0.25) return 15;
    else if (radiusNum <= 0.5) return 14;
    else if (radiusNum <= 1) return 13;
    else if (radiusNum <= 5) return 12;
    else if (radiusNum <= 10) return 12;
    else if (radiusNum <= 20) return 11;
    else return 10;
  }

  /**
   * Add a marker to the map
   */
  function addMarker(map: MapTilerMap, markerData: MapMarker, withPopup: boolean = false) {
    // Create wrapper for the price marker
    const markerWrapper = document.createElement("div");
    const MarkerComp = defineComponent({
      setup: () => () => {
        return h(MoleculesPriceMarker, {
          price: markerData.price,
          hasNote: Boolean(markerData.hasNote),
          isFavorite: Boolean(markerData.isFavorite)
        });
      },
    });

    const markerVNode = createVNode(MarkerComp);
    markerVNode.appContext = vueApp._context;
    render(markerVNode, markerWrapper);

    // Create marker with custom element
    const marker = new sdk.Marker({
      element: markerWrapper,
      anchor: 'bottom',
      offset: [0, -10] // Offset to account for the price marker's pointer
    }).setLngLat([markerData.lon, markerData.lat]);

    if (withPopup) {
      try {
        const wrapper = document.createElement("div");

        const PopupComp = defineComponent({
          setup: () => () => {
            const markerId = typeof markerData.id === "number" ? markerData.id : null;
            return h(MoleculesMarkerPopup, {
              markerData,
              onNoteClick: (id: any) => {
                map.fire('marker-note', { id });
              },
              onFavoriteClick: (id: any) => {
                map.fire('marker-favorite', { id });
              },
            });
          },
        });

        const vnode = createVNode(PopupComp);
        vnode.appContext = vueApp._context;
        render(vnode, wrapper);

        const popup = new sdk.Popup({ 
          offset: [0, 10],
          closeButton: false,
          maxWidth: '325px',
          className: 'marker-custom-popup'
        }).setDOMContent(wrapper);
        
        marker.setPopup(popup);
      } catch (e) {
        console.error("[Map] Error creating popup:", e);
      }
    }

    marker.addTo(map);

    // Track marker if map is cached
    for (const [_, instance] of mapCache) {
      if (instance.map === map) {
        instance.markers.push(marker);
        break;
      }
    }

    return marker;
  }

  /**
   * Remove all markers from the map
   */
  function clearMarkers(map: MapTilerMap) {
    // Find cached instance
    for (const [_, instance] of mapCache) {
      if (instance.map === map) {
        instance.markers.forEach(marker => marker.remove());
        instance.markers = [];
        break;
      }
    }
  }

  /**
   * Center map on coordinates
   */
  function centerMap(map: MapTilerMap, lat: number, lon: number, zoom?: number) {
    const options: any = {
      center: [lon, lat],
      animate: false
    };
    
    if (typeof zoom === 'number') {
      options.zoom = zoom;
    }

    try {
      map.jumpTo(options);
    } catch (e) {
      console.error("[Map] Error centering map:", e);
    }
  }

  /**
   * Geocoding autocomplete
   */
  async function autoComplete(query: string): Promise<any[]> {
    if (!query) return [];

    try {
      const res = await $fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json`,
        { query: { key: sdk.config.apiKey, country: "gb" } }
      );
      return (res as any).features ?? [];
    } catch (e) {
      console.error("[Map] Search error:", e);
      return [];
    }
  }

  return {
    initializeMap,
    addMarker,
    clearMarkers,
    centerMap,
    autoComplete,
    calculateZoomLevelFromRadius,
  };
}
