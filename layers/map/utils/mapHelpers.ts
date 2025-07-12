import { MoleculesMarkerPopup, MoleculesPriceMarker } from "#components";
import { defineComponent, h, createVNode, render } from "vue";

export const styles = [
  // Vertex points style (dots while drawing)
  {
    id: "gl-draw-polygon-and-line-vertex-inactive",
    type: "circle",
    filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
    paint: {
      "circle-radius": 6,
      "circle-color": "#fff",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#8CC6F0",
    },
  },
  // Active vertex points (selected points)
  {
    id: "gl-draw-polygon-and-line-vertex-active",
    type: "circle",
    filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
    paint: {
      "circle-radius": 7,
      "circle-color": "#fff",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#326C96",
    },
  },
  // Midpoints for drawing (smaller dots between vertices)
  {
    id: "gl-draw-polygon-midpoint",
    type: "circle",
    filter: ["all", ["==", "meta", "midpoint"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
    paint: {
      "circle-radius": 4,
      "circle-color": "#fff",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#8CC6F0",
    },
  },
  // Polygon fill
  {
    id: "gl-draw-polygon",
    type: "fill",
    filter: ["all", ["==", "$type", "Polygon"]],
    paint: {
      "fill-color": "#8CC6F0",
      "fill-outline-color": "#326C96",
      "fill-opacity": 0.15,
    },
  },
  // Polygon outline (dotted)
  {
    id: "gl-draw-polygon-stroke",
    type: "line",
    filter: ["all", ["==", "$type", "Polygon"]],
    paint: {
      "line-color": "#326C96",
      "line-width": 2,
      "line-dasharray": [3, 2],
    },
  },
  // Active polygon outline (dotted, brighter)
  {
    id: "gl-draw-polygon-stroke-active",
    type: "line",
    filter: ["all", ["==", "$type", "Polygon"], ["==", "active", "true"]],
    paint: {
      "line-color": "#8CC6F0",
      "line-dasharray": [3, 2],
      "line-width": 2,
    },
  },
];

/**
 * Set map controls and interactivity based on options
 *
 * @param existingMapInstance The cached map instance
 * @param map The map object
 * @param options MapOptions
 * @returns boolean | void
 */
export function setControls(existingMapInstance: MapInstance, map: ExtendedMapTilerMap, options: MapOptions): boolean | void {
  const prevInteractive = existingMapInstance.interactive;
  const newInteractive = options.interactive;
  const sdk = useNuxtApp().$maptilersdk;
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
      // Add navigation control if not present
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
      // Remove navigation control if present
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
 * @param mapCache The map cache
 * @returns The MapInstance or undefined if not found
 */
export function findMapInstance(map: ExtendedMapTilerMap, mapCache: Map<string, MapInstance>): MapInstance | undefined {
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
 * @param tier string | undefined
 * @param vueApp optional Vue app context
 * @returns HTMLElement
 */
export function renderMarker(price: number | null, hasNote?: boolean, isFavorite?: boolean, tier?: string, vueApp?: any): HTMLElement {
  const markerWrapper = document.createElement("div");
  
  const resolvedTier = tier === "FEATURED" || tier === "BASIC" || tier === "PREMIUM" ? tier : "BASIC";
  
  const MarkerComp = defineComponent({
    setup: () => () => {
      return h(MoleculesPriceMarker, {
        price,
        hasNote: Boolean(hasNote),
        isFavorite: Boolean(isFavorite),
        tier: resolvedTier,
      });
    },
  });
  const markerNode = createVNode(MarkerComp);
  if (vueApp) markerNode.appContext = vueApp.vueApp._context;
  render(markerNode, markerWrapper);
  return markerWrapper;
}

/**
 * Render a popup for a marker
 *
 * @param marker MapMarker
 * @param vueApp optional Vue app context
 * @returns Popup
 */
export function renderPopup(marker: MapMarker, vueApp?: any): any {
  const sdk = useNuxtApp().$maptilersdk;
  const popupWrapper = document.createElement("div");
  const PopupComp = defineComponent({
    setup: () => () => {
      return h(MoleculesMarkerPopup, {
        marker,
      });
    },
  });
  const popupNode = createVNode(PopupComp);
  if (vueApp) popupNode.appContext = vueApp.vueApp._context;
  render(popupNode, popupWrapper);
  
  const popup = new sdk.Popup({ 
    closeButton: false,
    closeOnClick: true,
    offset: {
      'top': [0, 0],
      'bottom': [0, 0],
      'left': [0, 0],
      'right': [0, 0]
    }
  }).setDOMContent(popupWrapper);

  return popup;
}

/**
 * Calculate zoom level based on search radius (in miles)
 *
 * @param radius The search radius in miles
 * @returns The appropriate zoom level
 */
export function calculateZoomLevelFromRadius(radius?: number | null): number {
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
    case radiusNum <= 2:
      return 12.5;
    case radiusNum <= 3:
      return 12;
    case radiusNum <= 5:
      return 11.5;
    case radiusNum <= 10:
      return 11;
    case radiusNum <= 15:
      return 10.5;
    case radiusNum <= 20:
      return 10;
    case radiusNum <= 30:
      return 9.5;
    case radiusNum <= 40:
      return 9;
    default:
      return 8;
  }
}
