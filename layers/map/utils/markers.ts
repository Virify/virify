/**
 * Map marker and popup utilities
 */

import { MoleculesMarkerPopup, MoleculesPriceMarker } from "#components";
import { defineComponent, h, createVNode, render } from "vue";

/**
 * Render a price marker
 *
 * @param id Marker identifier
 * @param price Listing price
 * @param tier Listing tier (FEATURED, BASIC, PREMIUM)
 * @param vueApp Optional Vue app context
 * @param priceType Price type (e.g., "rent", "sale")
 * @returns HTMLElement containing the rendered marker
 */
export function renderMarker(
  id: string | number | null, 
  price: number | null, 
  tier?: string, 
  vueApp?: any, 
  priceType?: string | null
): HTMLElement {
  const markerWrapper = document.createElement("div");
  
  const resolvedTier = tier === "FEATURED" || tier === "BASIC" || tier === "PREMIUM" ? tier : "BASIC";
  
  const MarkerComp = defineComponent({
    setup: () => () => {
      return h(MoleculesPriceMarker, {
        id,
        price,
        tier: resolvedTier,
        priceType,
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
 * @param marker MapMarker data
 * @param vueApp Optional Vue app context
 * @returns Popup instance
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
 * Create a simple marker element for basic use cases
 * 
 * @param options Marker styling options
 * @returns HTMLElement
 */
export function createSimpleMarker(options: {
  color?: string;
  size?: number;
  borderColor?: string;
  borderWidth?: number;
}): HTMLElement {
  const {
    color = '#326C96',
    size = 12,
    borderColor = '#fff',
    borderWidth = 2
  } = options;

  const marker = document.createElement("div");
  marker.style.width = `${size}px`;
  marker.style.height = `${size}px`;
  marker.style.backgroundColor = color;
  marker.style.border = `${borderWidth}px solid ${borderColor}`;
  marker.style.borderRadius = '50%';
  marker.style.cursor = 'pointer';
  marker.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
  
  return marker;
}