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

/**
 * Format a single listing to MapMarker format
 * 
 * @param listing The listing to format
 * @returns Formatted MapMarker
 */
export function formatMarker(listing: any): any {
  return {
    id: listing.id,
    lat: listing.property?.address?.lat ?? 0,
    lon: listing.property?.address?.lon ?? 0,
    title: listing.title ?? null,
    bedrooms: listing.property?.numberBedrooms ?? null,
    bathrooms: listing.property?.numberBathrooms ?? null,
    receptions: listing.property?.numberReceptions ?? null,
    otherRooms: listing.property?.numberOtherRooms ?? null,
    price: listing.price ?? null,
    propertyType: listing.property?.type?.name ?? null,
    classification: listing.property?.classification?.name ?? null,
    priceType: listing.saleListing?.priceType ?? listing.rentalListing?.rentFrequency ?? null,
    address: listing.property?.address
      ? {
          street: listing.property.address.street,
          city: listing.property.address.city,
          postcode: listing.property.address.postcode,
        }
      : null,
    image: listing.property?.media ?? [],
    tier: listing.listingTier,
  };
}

/**
 * Convert ListingWithFullProperty to ListingCardType format that Map component expects
 */
export function convertListingsToMarkers(listings: any[]): any[] {
  return listings
    .filter(listing => listing.property?.address?.lat && listing.property?.address?.lon)
    .map((listing, index) => ({
      id: listing.id || `listing-${index}`,
      title: listing.title,
      price: listing.price,
      listingTier: listing.listingTier,
      publishedAt: listing.publishedAt,
      rentalListing: listing.rentalListing,
      saleListing: listing.saleListing,
      property: {
        address: listing.property?.address ? {
          id: listing.property.address.id,
          number: listing.property.address.number,
          flat: listing.property.address.flat,
          street: listing.property.address.street,
          city: listing.property.address.city,
          postcode: listing.property.address.postcode,
          country: listing.property.address.country,
          county: listing.property.address.county,
          fullAddress: listing.property.address.fullAddress,
          lat: listing.property.address.lat,
          lon: listing.property.address.lon,
        } : null,
        media: listing.property?.media || [],
        type: listing.property?.type || null,
        classification: listing.property?.classification || null,
        numberBedrooms: listing.property?.numberBedrooms || null,
        numberBathrooms: listing.property?.numberBathrooms || null,
        numberReceptions: listing.property?.numberReceptions || null,
        numberOtherRooms: listing.property?.numberOtherRooms || null,
        accessibilityFeatures: listing.property?.accessibilityFeatures || null,
        additionalFeatures: listing.property?.additionalFeatures || null,
        parking: listing.property?.parking || null,
        outdoorSpace: listing.property?.outdoorSpace || null,
      },
      user: listing.user,
    }));
}