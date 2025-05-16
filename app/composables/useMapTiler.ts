import type { MapMarker } from "../../shared/types/map-coordinates";
import type { ListingCardType } from "../../shared/types/listing";

interface UseMapTilerOptions {
  interactive?: boolean;
  zoom?: number;
  enableClustering?: boolean;
}

interface MapCenterCoordinates {
  lat: number;
  lon: number;
}

// Accept callbacks for marker actions
export function useMapTiler({
  onPropertyNote,
  onPropertyFavourite,
}: {
  onPropertyNote?: (propertyId: number) => void;
  onPropertyFavourite?: (propertyId: number) => void;
} = {}) {
  const { $maptilersdk: sdk } = useNuxtApp();

  /**
   * Initialize a map with markers
   */
  function initializeMap(container: HTMLElement, options: UseMapTilerOptions = {}, markers?: MapMarker[], singleLat?: number, singleLon?: number) {
    // Determine center coordinates
    const center = getMapCenter(markers, singleLat, singleLon);
    if (!center) return null;

    // Define map options
    const mapOptions = {
      container: container,
      // Use a complete style URL that includes all required sprites/assets
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${sdk.config.apiKey}`,
      center: [center[1], center[0]] as [number, number],
      zoom: options.zoom || 12,
      interactive: options.interactive === true,
      attributionControl: false,
      dragPan: options.interactive === true,
      scrollZoom: options.interactive === true,
      doubleClickZoom: options.interactive === true,
      touchZoomRotate: options.interactive === true,
      boxZoom: options.interactive === true,
      keyboard: options.interactive === true,
    };

    // Create map instance
    const map = new sdk.Map(mapOptions);

    // Handle missing style images to prevent console warnings
    map.on("styleimagemissing", (e: { id: string }) => {
      // With a complete style URL, we should not get these warnings anymore
      console.debug(`Missing map style image: ${e.id}`);
    });

    return map;
  }

  /**
   * Add markers to a map
   */
  function addMarkersToMap(map: any, markers?: MapMarker[], singleLat?: number, singleLon?: number) {
    const markerElements: any[] = [];

    // Add markers from an array
    if (markers?.length) {
      markers.forEach((markerData) => {
        const marker = createMarker(map, markerData);
        if (marker) markerElements.push(marker);
      });
    }
    // Add a single marker if lat/lon are provided
    else if (singleLat !== undefined && singleLon !== undefined) {
      const marker = new sdk.Marker().setLngLat([singleLon, singleLat]).addTo(map);
      markerElements.push(marker);
    }

    return markerElements;
  }

  /**
   * Create a marker with popup (Vue 3 idiomatic, declarative template)
   */
  function createMarker(map: any, markerData: MapMarker) {
    // --- Declarative popup HTML ---
    const hasBedrooms = markerData.bedrooms !== null && markerData.bedrooms !== undefined;
    const hasBathrooms = markerData.bathrooms !== null && markerData.bathrooms !== undefined;
    const hasNote = !!markerData.hasNote;
    const isFavorite = !!markerData.isFavorite;
    const propertyId = typeof markerData.id === "number" ? markerData.id : null;
    const priceDisplay = markerData.price !== null && markerData.price !== undefined ? (markerData.price >= 10000 ? `£${Math.round(markerData.price / 1000)}k` : `£${markerData.price.toLocaleString()}`) : "";
    const addressParts = markerData.address ? [markerData.address.street, markerData.address.city, markerData.address.postcode].filter(Boolean) : [];
    const typeText = [markerData.propertyType, markerData.classification].filter(Boolean).join(" - ");

    // Compose popup HTML
    const popupHtml = `
      <div class="marker-popup">
        ${
          markerData.image && markerData.image[0] && markerData.image[0].image
            ? `
          <div class="marker-popup-image-container">
            <img class="marker-popup-image" src="${markerData.image[0].image}" alt="${markerData.image[0].metadata || markerData.title || "Property image"}" />
          </div>
        `
            : ""
        }
        ${markerData.title ? `<strong class="marker-popup-title">${markerData.title}</strong>` : ""}
        ${addressParts.length > 0 ? `<div class="marker-popup-address">${addressParts.join(", ")}</div>` : ""}
        <div class="marker-popup-info-container">
          <div class="marker-popup-price-column">
            ${markerData.price !== null && markerData.price !== undefined ? `<div class="marker-popup-price">£${markerData.price.toLocaleString()}</div>` : ""}
            ${markerData.priceType ? `<div class="marker-popup-price-type">${markerData.priceType.replace(/_/g, " ").toLowerCase()}</div>` : ""}
          </div>
          <div class="marker-popup-details-column">
            ${typeText ? `<div class="marker-popup-property-type">${typeText}</div>` : ""}
            ${
              hasBedrooms || hasBathrooms
                ? `
              <div class="marker-popup-features">
                ${hasBedrooms ? `<span class="marker-popup-bedrooms">${markerData.bedrooms} bed${markerData.bedrooms !== 1 ? "s" : ""}</span>` : ""}
                ${hasBedrooms && hasBathrooms ? "<span> • </span>" : ""}
                ${hasBathrooms ? `<span class="marker-popup-bathrooms">${markerData.bathrooms} bath${markerData.bathrooms !== 1 ? "s" : ""}</span>` : ""}
              </div>
            `
                : ""
            }
          </div>
        </div>
        <div class="marker-popup-actions">
          ${
            propertyId !== null
              ? `
            <a class="marker-popup-view-link" href="/listing/${propertyId}">View Listing</a>
            <div class="marker-popup-notes-button-container" data-property-id="${propertyId}">
              <button type="button" role="switch" aria-label="Add/Edit Notes" class="marker-popup-notes-button note-button${hasNote ? " has-note" : ""}">
                <div class="note-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="note-button-icon">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </div>
              </button>
            </div>
            <div class="marker-popup-favorite-button-container" data-property-id="${propertyId}">
              <button type="button" role="switch" aria-label="Add to favourites" class="marker-popup-favorite-button a-favourite-button${isFavorite ? " selected" : ""}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${
                  isFavorite ? "currentColor" : "none"
                }" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="marker-popup-button-icon">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                </svg>
              </button>
            </div>
          `
              : ""
          }
        </div>
      </div>
    `;

    // Create popup element and set HTML
    const popupContent = document.createElement("div");
    popupContent.innerHTML = popupHtml;

    // Attach event listeners for notes and favourite buttons
    if (propertyId !== null) {
      // Notes button
      const notesBtn = popupContent.querySelector(".marker-popup-notes-button") as HTMLButtonElement | null;
      if (notesBtn) {
        notesBtn.addEventListener("click", () => {
          if (onPropertyNote) onPropertyNote(propertyId);
        });
      }
      // Favourite button
      const favBtn = popupContent.querySelector(".marker-popup-favorite-button") as HTMLButtonElement | null;
      if (favBtn) {
        favBtn.addEventListener("click", () => {
          if (onPropertyFavourite) onPropertyFavourite(propertyId);
        });
      }
    }

    const popup = new sdk.Popup({
      offset: 25,
      closeButton: false,
      className: "custom-popup",
    }).setDOMContent(popupContent);

    // --- Declarative marker element ---
    if (markerData.price !== null && markerData.price !== undefined) {
      const el = document.createElement("div");
      el.className = "price-marker";
      el.innerHTML = `
        <div class="price-marker-content">
          <span class="price-marker-price">${priceDisplay}</span>
          ${
            isFavorite || hasNote
              ? `
            <div class="marker-status-container">
              ${
                isFavorite
                  ? `<div class="marker-favorite-indicator"><svg viewBox="0 0 24 24" width="14" height="14" fill="white" stroke="white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div>`
                  : ""
              }
              ${
                hasNote
                  ? `<div class="marker-note-indicator"><svg viewBox="0 0 24 24" width="14" height="14" fill="white" stroke="white"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></div>`
                  : ""
              }
            </div>
          `
              : ""
          }
        </div>
      `;
      const markerOptions = {
        element: el,
        anchor: "bottom",
        offset: [0, -15] as [number, number],
      };
      return new sdk.Marker(markerOptions).setLngLat([markerData.lon, markerData.lat]).setPopup(popup).addTo(map);
    } else {
      // Use standard marker if no price available
      return new sdk.Marker().setLngLat([markerData.lon, markerData.lat]).setPopup(popup).addTo(map);
    }
  }

  /**
   * Center map on specified coordinates
   */
  function centerMapOnCoordinates(map: any, lat?: number, lon?: number): boolean {
    // Verify we have a valid map and coordinates
    if (!map || typeof lat !== 'number' || typeof lon !== 'number' || !isFinite(lat) || !isFinite(lon)) {
      return false;
    }

    // Check if coordinates are valid (non-zero)
    if (lat === 0 && lon === 0) {
      return false;
    }

    // Center the map
    map.setCenter([lon, lat]);
    return true;
  }

  /**
   * Center map using the first marker or specified coordinates
   */
  function centerMapOnMarkers(map: any, markers?: MapMarker[], fallbackLat?: number, fallbackLon?: number): boolean {
    if (!map) return false;

    // Try to use first marker coordinates
    if (markers?.length && markers[0] && typeof markers[0].lat === 'number' && typeof markers[0].lon === 'number') {
      return centerMapOnCoordinates(map, markers[0].lat, markers[0].lon);
    }
    
    // Fall back to specified coordinates
    if (typeof fallbackLat === 'number' && typeof fallbackLon === 'number') {
      return centerMapOnCoordinates(map, fallbackLat, fallbackLon);
    }

    return false;
  }

  /**
   * Determine map center coordinates
   */
  function getMapCenter(markers?: MapMarker[], singleLat?: number, singleLon?: number): [number, number] | undefined {
    if (markers?.length) {
      return markers[0] ? [markers[0].lat, markers[0].lon] : undefined;
    } else if (singleLat !== undefined && singleLon !== undefined) {
      return [singleLat, singleLon];
    }
    return undefined;
  }

  /**
   * Check if coordinates are valid for displaying a map
   */
  function hasValidCoordinates(markers?: MapMarker[], singleLat?: number, singleLon?: number): boolean {
    const isValid = (lat?: number, lon?: number) => typeof lat === "number" && typeof lon === "number" && lat !== 0 && lon !== 0;

    if (markers?.length) {
      return markers.some((marker) => isValid(marker.lat, marker.lon));
    }

    return isValid(singleLat, singleLon);
  }

  /**
   * Add interactive indicator to map
   */
  function addInteractiveIndicator(mapContainer: HTMLElement) {
    const interactiveIndicator = document.createElement("div");
    interactiveIndicator.className = "interactive-map-indicator";
    interactiveIndicator.innerHTML = "Interactive Map";
    mapContainer.appendChild(interactiveIndicator);

    // Add timeout to fade out the indicator
    setTimeout(() => {
      interactiveIndicator.classList.add("fade-out");
      setTimeout(() => {
        interactiveIndicator.remove();
      }, 1000);
    }, 3000);
  }

  /**
   * Setup event handlers for map interaction prevention
   */
  function setupEventHandlers(mapContainer: HTMLElement, interactive: boolean) {
    const preventScroll = (e: Event) => {
      if (!interactive) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (mapContainer) {
      mapContainer.addEventListener("wheel", preventScroll, { passive: false });
      mapContainer.addEventListener("mousewheel", preventScroll, { passive: false });
      mapContainer.addEventListener("touchstart", preventScroll, { passive: false });
    }

    // Return cleanup function
    return () => {
      if (mapContainer) {
        mapContainer.removeEventListener("wheel", preventScroll);
        mapContainer.removeEventListener("mousewheel", preventScroll);
        mapContainer.removeEventListener("touchstart", preventScroll);
      }
    };
  }

  /**
   * Create map markers from listings data
   */
  function createMapMarkersFromListings(
    listings: ListingCardType[] | null, 
    isFavouriteFn: (id: number) => boolean, 
    hasNoteFn: (id: number) => boolean
  ): MapMarker[] {
    if (!listings) return [];
    
    return listings
      .map((listing) => ({
        id: listing.id,
        lat: listing.property?.address.lat ?? 0,
        lon: listing.property?.address.lon ?? 0,
        title: listing.title,
        bedrooms: listing.property?.numberBedrooms || 0,
        bathrooms: listing.property?.numberBathrooms || 0,
        price: listing.price,
        propertyType: listing.property?.type?.name,
        classification: listing.property?.classification?.name,
        priceType: listing.saleListing?.priceType ?? listing.rentalListing?.rentFrequency,
        address: {
          street: listing.property?.address?.street,
          city: listing.property?.address?.city,
          postcode: listing.property?.address?.postcode
        },
        image: listing.property?.media,
        hasNote: hasNoteFn(listing.id),
        isFavorite: isFavouriteFn(listing.id)
      }))
      .filter((m) => m.lat !== 0 && m.lon !== 0);
  }

  /**
   * Get map center coordinates from markers
   */
  function getMapCenterFromMarkers(markers: MapMarker[]): MapCenterCoordinates | null {
    if (markers && markers.length > 0 && markers[0]) {
      return {
        lat: markers[0].lat,
        lon: markers[0].lon
      };
    }
    return null;
  }

  /**
   * Calculate appropriate zoom level based on search radius
   */
  function calculateZoomLevelFromRadius(radius?: number | null): number {
    if (!radius) return 14; // Default zoom if no radius is specified (higher zoom)

    // Map radius values to appropriate zoom levels - higher minimum as requested
    // Lower zoom value = more zoomed out
    const radiusNum = Number(radius);

    if (radiusNum === 0) return 16;
    else if (radiusNum <= 0.25) return 15;
    else if (radiusNum <= 0.5) return 14;
    else if (radiusNum <= 1) return 13;
    else if (radiusNum <= 2) return 12;
    else if (radiusNum <= 5) return 12;
    else if (radiusNum <= 10) return 12;
    else if (radiusNum <= 20) return 11;
    else return 10;
  }

  /**
   * Handle map view changes, updating map responsively
   */
  function handleMapViewChange(
    map: any, 
    mapCenterCoordinates: MapCenterCoordinates | null,
    markers?: MapMarker[]
  ): void {
    if (!map) return;
    
    // Trigger map resize to ensure it renders correctly
    map.resize();

    // Center the map with a small delay to ensure resize has completed
    setTimeout(() => {
      // Try to center on specific coordinates first
      if (mapCenterCoordinates) {
        centerMapOnCoordinates(map, mapCenterCoordinates.lat, mapCenterCoordinates.lon);
      } 
      // Fall back to centering on markers
      else if (markers && markers.length > 0) {
        centerMapOnMarkers(map, markers);
      }
    }, 100);
  }

  /**
   * Setup watchers to automatically recenter map when relevant data changes
   */
  function setupMapAutoRecentering(
    map: Ref<any | null>,
    coordinates: ComputedRef<MapCenterCoordinates | null>,
    zoomLevel: ComputedRef<number>,
    currentView: Ref<string>,
    searchParams?: Ref<Record<string, any> | null>
  ): void {
    watch(
      [searchParams || ref(null), coordinates, zoomLevel, currentView],
      ([newSearchParams, newCoordinates, newZoomLevel, newView]) => {
        // Only proceed if we're in map view and have valid coordinates
        if (newView === 'dual' && map.value?.map && newCoordinates) {
          // For zoom changes, add a small delay to allow the zoom transition to complete
          if (newZoomLevel !== undefined) {
            setTimeout(() => {
              centerMapOnCoordinates(map.value.map, newCoordinates.lat, newCoordinates.lon);
            }, 100);
          } else {
            centerMapOnCoordinates(map.value.map, newCoordinates.lat, newCoordinates.lon);
          }
        }
      },
      { deep: true }
    );
  }

  return {
    sdk,
    initializeMap,
    addMarkersToMap,
    createMarker,
    getMapCenter,
    hasValidCoordinates,
    addInteractiveIndicator,
    setupEventHandlers,
    centerMapOnCoordinates,
    centerMapOnMarkers,
    createMapMarkersFromListings,
    getMapCenterFromMarkers,
    calculateZoomLevelFromRadius,
    handleMapViewChange,
    setupMapAutoRecentering,
  };
}
