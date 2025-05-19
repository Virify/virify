import type { MapMarker } from '#shared/types/map-coordinates';
import type { Map as MapTilerMap } from "@maptiler/sdk";
import { defineComponent, h, createVNode, render } from 'vue';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import type { DrawingMode } from '../../../shared/types/map-drawing';
import { MoleculesMarkerPopup, MoleculesPriceMarker } from '#components';

interface MapInstance {
  map: MapTilerMap;
  markers: any[];
  drawControl?: DrawControl;
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

  /**
   * Get default styles for the drawing control
   */
  function getDrawStyles() {
    // You can customize these styles or make them themeable
    return [
      // Default styles for drawing
      {
        'id': 'gl-draw-polygon-fill-inactive',
        'type': 'fill',
        'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon']],
        'paint': {
          'fill-color': '#3388ff',
          'fill-outline-color': '#3388ff',
          'fill-opacity': 0.1
        }
      },
      {
        'id': 'gl-draw-polygon-fill-active',
        'type': 'fill',
        'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
        'paint': {
          'fill-color': '#3388ff',
          'fill-outline-color': '#3388ff',
          'fill-opacity': 0.3
        }
      },
      {
        'id': 'gl-draw-polygon-stroke-inactive',
        'type': 'line',
        'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon']],
        'paint': {
          'line-color': '#3388ff',
          'line-width': 2
        }
      },
      {
        'id': 'gl-draw-polygon-stroke-active',
        'type': 'line',
        'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
        'paint': {
          'line-color': '#3388ff',
          'line-dasharray': [2, 2],
          'line-width': 2
        }
      },
      {
        'id': 'gl-draw-line-inactive',
        'type': 'line',
        'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'LineString']],
        'paint': {
          'line-color': '#3388ff',
          'line-width': 2
        }
      },
      {
        'id': 'gl-draw-line-active',
        'type': 'line',
        'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'LineString']],
        'paint': {
          'line-color': '#3388ff',
          'line-dasharray': [2, 2],
          'line-width': 2
        }
      },
      {
        'id': 'gl-draw-point-inactive',
        'type': 'circle',
        'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Point']],
        'paint': {
          'circle-radius': 5,
          'circle-color': '#ffffff',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#3388ff'
        }
      },
      {
        'id': 'gl-draw-point-active',
        'type': 'circle',
        'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Point']],
        'paint': {
          'circle-radius': 7,
          'circle-color': '#ffffff',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#3388ff'
        }
      },
      {
        'id': 'gl-draw-polygon-midpoint',
        'type': 'circle',
        'filter': ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
        'paint': {
          'circle-radius': 4,
          'circle-color': '#ffffff',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#3388ff'
        }
      }
    ];
  }

  /**
   * Initialize drawing mode on the map
   * @param map - The MapTiler map instance
   * @param mode - The drawing mode ('polygon', 'rectangle', 'circle', or null to disable)
   */
  function initDrawing(map: MapTilerMap, mode: DrawingMode) {
    // Setup a new MapInstance or get existing one
    let instance: MapInstance | undefined;
    
    // Try to find existing instance
    for (const [_, inst] of mapCache) {
      if (inst.map === map) {
        instance = inst;
        break;
      }
    }
    
    // If we don't have an instance for this map, create one
    if (!instance) {
      instance = { map, markers: [] };
      // Generate a random ID to add to the cache
      const randomId = `map-${Math.random().toString(36).substring(2, 9)}`;
      mapCache.set(randomId, instance);
    }

    // Remove existing draw control if present
    if (instance.drawControl) {
      try {
        map.removeControl(instance.drawControl);
      } catch (e) {
        console.warn("[Map] Error removing draw control:", e);
      }
      instance.drawControl = undefined;
    }

    // If mode is null, we're just disabling drawing
    if (!mode) return;

    // Initialize the draw control with the specified mode
    try {
      console.log(`[Map] Initializing drawing mode: ${mode}`);
      
      const options: any = {
        displayControlsDefault: false,  // Don't show all controls by default
        controls: {
          polygon: true,
          line_string: false,
          point: false,
          trash: true
        },
        styles: getDrawStyles()
      };
      
      // Use standard MapboxDraw with polygon drawing only
      const drawControl = new MapboxDraw(options);
      
      // Add the control to the map in the top-left position
      // This will be positioned below the navigation control
      map.addControl(drawControl, 'top-left');
      
      // Store the draw control in the instance so we can reference it later
      instance.drawControl = drawControl;
      
      // Set the drawing mode after adding the control
      // We need a small delay to ensure the control is fully initialized
      setTimeout(() => {
        try {
          console.log(`[Map] Setting drawing mode to: ${mode}`);
          
          // Always use polygon drawing mode (the only mode we support now)
          drawControl.changeMode('draw_polygon');
        } catch (e) {
          console.error("[Map] Error changing drawing mode:", e);
        }
      }, 100);
      
      // Add event listeners
      map.on('draw.create', (e: any) => {
        if (e.features && e.features.length > 0) {
          map.fire('shape-drawn', { 
            feature: e.features[0],
            type: mode
          });
        }
      });
      
      map.on('draw.update', (e: any) => {
        if (e.features && e.features.length > 0) {
          map.fire('shape-updated', { 
            feature: e.features[0],
            type: mode
          });
        }
      });

      map.on('draw.delete', (e: any) => {
        map.fire('shape-deleted', { 
          features: e.features || [],
          type: mode
        });
      });
    } catch (e) {
      console.error("[Map] Error initializing drawing mode:", e);
    }
  }

  /**
   * Get all drawn shapes from the map
   */
  function getDrawnShapes(map: MapTilerMap): any[] {
    // Find cached instance
    for (const [_, instance] of mapCache) {
      if (instance.map === map && instance.drawControl) {
        return instance.drawControl.getAll().features;
      }
    }
    return [];
  }

  /**
   * Clear all drawn shapes from the map
   */
  function clearDrawnShapes(map: MapTilerMap): void {
    let found = false;
    // Find cached instance
    for (const [_, instance] of mapCache) {
      if (instance.map === map) {
        if (instance.drawControl) {
          console.log('[Map] Clearing drawn shapes');
          try {
            instance.drawControl.deleteAll();
            found = true;
          } catch (e) {
            console.error('[Map] Error clearing shapes:', e);
          }
          return;
        }
      }
    }
    
    if (!found) {
      console.warn('[Map] No draw control found for this map instance');
    }
  }

  return {
    initializeMap,
    addMarker,
    clearMarkers,
    centerMap,
    autoComplete,
    calculateZoomLevelFromRadius,
    initDrawing,
    getDrawnShapes,
    clearDrawnShapes,
  };
}
