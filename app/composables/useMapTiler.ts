import type { MapMarker } from "../../shared/types/map-coordinates";

interface UseMapTilerOptions {
  interactive?: boolean;
  zoom?: number;
  enableClustering?: boolean;
}

export function useMapTiler() {
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
    map.on('styleimagemissing', (e: { id: string }) => {
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
   * Create a marker with popup
   */
  function createMarker(map: any, markerData: MapMarker) {
    // Create popup with property information
    const popupContent = document.createElement("div");
    popupContent.className = "marker-popup";

    if (markerData.title) {
      const title = document.createElement("strong");
      title.textContent = markerData.title;
      popupContent.appendChild(title);
    }

    if (markerData.bedrooms !== null) {
      const bedrooms = document.createElement("div");
      bedrooms.textContent = `Bedrooms: ${markerData.bedrooms}`;
      popupContent.appendChild(bedrooms);
    }

    if (markerData.price !== null) {
      const price = document.createElement("div");
      price.textContent = `Price: £${markerData.price.toLocaleString()}`;
      popupContent.appendChild(price);
    }

    if (markerData.id) {
      const link = document.createElement("a");
      link.href = `/listing/${markerData.id}`;
      link.textContent = "View Listing";

      popupContent.appendChild(link);
    }

    const popup = new sdk.Popup({
      offset: 25,
      closeButton: false,
      className: "custom-popup",
    }).setDOMContent(popupContent);

    // Create custom marker with price if available
    if (markerData.price !== null) {
      // Format price with commas for thousands
      const formattedPrice = markerData.price.toLocaleString();
      
      // Create a custom marker element with the price
      const el = document.createElement('div');
      el.className = 'price-marker';
      
      // Round to nearest thousand if over 10000
      const displayValue = markerData.price >= 10000 
        ? `£${Math.round(markerData.price/1000)}k` 
        : `£${formattedPrice}`;
      
      el.textContent = displayValue;
      
      // Create a marker with custom element and proper offset
      const markerOptions = { 
        element: el,
        anchor: 'bottom',
        offset: [0, -15] as [number, number] // Offset the marker above the actual location point
      };
      
      const marker = new sdk.Marker(markerOptions)
        .setLngLat([markerData.lon, markerData.lat])
        .setPopup(popup)
        .addTo(map);
      
      return marker;
    } else {
      // Use standard marker if no price available
      return new sdk.Marker().setLngLat([markerData.lon, markerData.lat]).setPopup(popup).addTo(map);
    }
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
  const isValid = (lat?: number, lon?: number) =>
    typeof lat === 'number' && typeof lon === 'number' && lat !== 0 && lon !== 0;

  if (markers?.length) {
    return markers.some(marker => isValid(marker.lat, marker.lon));
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

  return {
    sdk,
    initializeMap,
    addMarkersToMap,
    createMarker,
    getMapCenter,
    hasValidCoordinates,
    addInteractiveIndicator,
    setupEventHandlers,
  };
}
