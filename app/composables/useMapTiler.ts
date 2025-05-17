import type { MapMarker } from "~~/shared/types/map-coordinates";
import { useNotes } from "~~/app/composables/useNotes";
import { useFavourites } from "~~/app/composables/useFavourites";
import { createVNode, render, h, defineComponent } from "vue";
import MoleculesMarkerPopup from "../components/molecules/MoleculesMarkerPopup.vue";
import MoleculesPriceMarker from "../components/molecules/MoleculesPriceMarker.vue";

/**
 * Extended map type to include our custom properties
 */
interface ExtendedMap {
  _markers?: any[];
  _controls?: any[];
  _lastMarkerData?: MapMarker[];
  _eventHandlers?: {
    noteHandler?: (id: number) => void;
    favoriteHandler?: (id: number) => void;
  };
  [key: string]: any;
}

/**
 * Map instance cache for reusing maps across the app to reduce MapTiler API usage
 */
const mapInstanceCache: Record<string, ExtendedMap> = {};

export function useMapTiler() {
  const sdk = useNuxtApp().$maptilersdk;
  const notes = useNotes();
  const favs = useFavourites();

  /**
   * Initialize or reuse a MapTiler map instance.
   * @param container DOM element for map
   * @param options interactive & zoom settings
   * @param mapId optional cache key
   */
  function initializeMap(container: HTMLElement, options: { interactive?: boolean; zoom?: number } = {}, mapId?: string): ExtendedMap {
    // Case 1: Reuse existing map if available
    if (mapId && mapInstanceCache[mapId]) {
      const existingMap = mapInstanceCache[mapId];
      console.log(`[useMapTiler] Reusing map instance: ${mapId}`);

      // Safely detach from old container and attach to new one
      try {
        const mapContainer = existingMap.getContainer();
        if (mapContainer && mapContainer.parentElement) {
          mapContainer.remove();
        }
        container.appendChild(mapContainer || document.createElement("div"));
      } catch (e) {
        console.error("[useMapTiler] Error reattaching map:", e);
      }

      // Schedule a safe resize to ensure proper rendering
      setTimeout(() => {
        try {
          existingMap.resize();
          console.log("[useMapTiler] Resized reused map");
        } catch {}
      }, 50);

      return existingMap;
    }

    // Case 2: Create new map instance
    console.log(`[useMapTiler] Creating new map instance${mapId ? ": " + mapId : ""}`);
    const map = new sdk.Map({
      container,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${sdk.config.apiKey}`,
      zoom: options.zoom ?? 12,
      interactive: options.interactive !== false,
    }) as ExtendedMap;

    // Initialize map data structures
    map._markers = [];
    map._controls = [];
    map._eventHandlers = {};

    // Set up map event listeners for stability
    map.on("load", () => {
      console.log("[useMapTiler] Map loaded, forcing resize");
      setTimeout(() => {
        try {
          map.resize();
        } catch {}
      }, 100);
    });

    // Cache if ID provided
    if (mapId) {
      mapInstanceCache[mapId] = map;
    }

    return map;
  }

  /**
   * Update map controls (navigation, etc)
   */
  function setControls(map: ExtendedMap, interactive: boolean) {
    if (!map) return;

    // Store current control count for debugging
    const currentControlCount = map._controls?.length || 0;

    // Check if any control elements exist on the map
    let mapControlContainer;
    try {
      mapControlContainer = map.getContainer()?.querySelector(".maplibregl-control-container");
    } catch (e) {}

    // If controls already exist with correct state, don't modify them
    if ((interactive && currentControlCount > 0) || (!interactive && currentControlCount === 0)) {
      return;
    }

    // Remove existing controls - both tracked and any that might exist on the DOM
    (map._controls || []).forEach((control: any) => {
      try {
        map.removeControl(control);
      } catch {}
    });

    // Reset controls tracking array
    map._controls = [];

    // Also try to remove any pre-existing controls that might be left over
    if (mapControlContainer) {
      try {
        const navControls = mapControlContainer.querySelectorAll(".maplibregl-ctrl-group");
        navControls.forEach((ctrl: { remove: () => void }) => {
          ctrl.remove();
        });
      } catch (e) {}
    }

    // Add new controls if interactive
    if (interactive) {
      try {
        const navControl = new sdk.NavigationControl({
          showCompass: true,
          showZoom: true,
        });
        map.addControl(navControl);
        map._controls.push(navControl);
      } catch (e) {
        console.error("[useMapTiler] Error adding controls:", e);
      }
    }
  }

  /**
   * Remove all existing markers from the map
   */
  function clearMarkers(map: ExtendedMap) {
    if (!map) return;

    // Remove all existing markers
    (map._markers || []).forEach((marker: any) => {
      try {
        if (marker && typeof marker.remove === "function") {
          marker.remove();
        }
      } catch {}
    });

    map._markers = [];
  }

  /**
   * Create a single marker with popup or simple marker based on data
   */
  function createMarker(map: ExtendedMap, data: MapMarker, displayPopup: boolean = true) {
    if (!map || !data) return null;

    // Case 1: Simple marker (no price/popup) for detail pages
    if (!displayPopup) {
      return new sdk.Marker().setLngLat([data.lon, data.lat]).addTo(map as any);
    }

    // Case 2: Full marker with popup for listings
    // Create popup with Vue component
    let popup;
    try {
      const wrapper = document.createElement("div");
      const vueApp = useNuxtApp().vueApp;

      // Handler functions using map._eventHandlers
      const onNoteClick = (id: number) => {
        if (typeof id === "number") {
          notes.showNoteDialog(id);
          map._eventHandlers?.noteHandler?.(id);
        }
      };
      const onFavoriteClick = (id: number) => {
        if (typeof id === "number") {
          favs.toggleFavourite(id);
          map._eventHandlers?.favoriteHandler?.(id);
        }
      };

      // Create the popup component with event handlers
      const PopupComp = defineComponent({
        setup: () => {
          return () =>
            h(MoleculesMarkerPopup, {
              markerData: data,
              onNoteClick,
              onFavoriteClick,
            });
        },
      });

      const vnode = createVNode(PopupComp);
      vnode.appContext = vueApp._context;
      render(vnode, wrapper);

      popup = new sdk.Popup({ offset: 25, closeButton: false }).setDOMContent(wrapper);
    } catch (e) {
      console.error("[useMapTiler] Error creating popup:", e);
    }

    // Create price marker element if price exists
    let el;
    if (data.price != null) {
      try {
        el = document.createElement("div");
        el.className = "vue-marker-container";
        const PriceComp = defineComponent({
          setup: () => () =>
            h(MoleculesPriceMarker, {
              price: data.price,
              hasNote: !!data.hasNote,
              isFavorite: !!data.isFavorite,
            }),
        });
        const priceNode = createVNode(PriceComp);
        priceNode.appContext = useNuxtApp().vueApp._context;
        render(priceNode, el);
      } catch (e) {
        console.error("[useMapTiler] Error creating price marker:", e);
      }
    }

    // Create and return marker
    try {
      const marker = new sdk.Marker(el ? { element: el, anchor: "bottom" } : {}).setLngLat([data.lon, data.lat]);

      if (popup) {
        marker.setPopup(popup);
      }

      return marker.addTo(map as any);
    } catch (e) {
      console.error("[useMapTiler] Error creating marker:", e);
      return null;
    }
  }

  /**
   * Clear all markers and add new ones
   */
  function addMarkers(map: ExtendedMap, markers: MapMarker[] = [], displayPopups: boolean = true): any[] {
    if (!map) return [];
    clearMarkers(map);
    const created: any[] = [];
    markers.forEach((data) => {
      const marker = createMarker(map, data, displayPopups);
      if (marker) created.push(marker);
    });
    map._markers = created;
    return created;
  }

  /**
   * Center map on coordinates
   */
  function centerMap(map: ExtendedMap, lat: number, lon: number) {
    if (!map || typeof lat !== "number" || typeof lon !== "number") return;

    try {
      map.jumpTo({ center: [lon, lat], animate: false });
    } catch (e) {
      console.error("[useMapTiler] Error centering map:", e);
      try {
        map.setCenter([lon, lat]);
      } catch {}
    }
  }

  /**
   * Calculate zoom level based on search radius
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
   * Create map markers from listings data
   * Uses internal state management for favorites and notes
   */
  function createMapMarkersFromListings(listings: any[] | null | undefined): MapMarker[] {
    if (!listings || !Array.isArray(listings)) return [];

    return listings.map((item) => ({
      id: item.id,
      lat: item.property?.address?.lat ?? 0,
      lon: item.property?.address?.lon ?? 0,
      title: item.title ?? null,
      bedrooms: item.property?.numberBedrooms ?? null,
      bathrooms: item.property?.numberBathrooms ?? null,
      price: item.price ?? null,
      propertyType: item.property?.type?.name ?? null,
      classification: item.property?.classification?.name ?? null,
      priceType: item.saleListing?.priceType ?? item.rentalListing?.rentFrequency ?? null,
      address: item.property?.address
        ? {
            street: item.property.address.street,
            city: item.property.address.city,
            postcode: item.property.address.postcode,
          }
        : null,
      image: item.property?.media ?? [],
      hasNote: notes.hasNote(item.id),
      isFavorite: favs.isFavourite(item.id),
    }));
  }

  /**
   * Geocoding autocomplete
   */
  async function autoComplete(query: string): Promise<any[]> {
    if (!query) return [];

    try {
      const res = await $fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json`, { query: { key: sdk.config.apiKey, country: "gb" } });
      return (res as any).features ?? [];
    } catch (e) {
      console.error("[useMapTiler] Autocomplete error:", e);
      return [];
    }
  }

  /**
   * Main function to update map view (center, zoom, markers, controls)
   */
  function handleMapViewChange(
    map: ExtendedMap,
    center?: { lat: number; lon: number },
    markers?: MapMarker[],
    interactive: boolean = true,
    zoom?: number,
    displayPopups: boolean = true,
    eventHandlers?: {
      onNote?: (id: number) => void;
      onFavorite?: (id: number) => void;
    }
  ) {
    if (!map) return;

    console.log(`[useMapTiler] Updating map view:`, {
      hasCenter: !!center,
      markerCount: markers?.length ?? 0,
      interactive,
      zoom,
      displayPopups,
    });

    // Store event handlers on map
    if (eventHandlers) {
      map._eventHandlers = {
        noteHandler: eventHandlers.onNote,
        favoriteHandler: eventHandlers.onFavorite,
      };
    }

    // Update controls
    setControls(map, interactive);

    // Only update map position if center or zoom explicitly provided
    const hasPositionChange = center || typeof zoom === "number";

    if (hasPositionChange) {
      // Prepare jump options - only include properties that are provided
      const jumpOptions: Record<string, any> = { animate: false };

      if (center) {
        jumpOptions.center = [center.lon, center.lat];
      }

      if (typeof zoom === "number") {
        jumpOptions.zoom = zoom;
      }

      // Only update position if we have something to update
      if (Object.keys(jumpOptions).length > 1) {
        // More than just 'animate: false'
        try {
          map.jumpTo(jumpOptions);
        } catch (e) {
          console.error("[useMapTiler] Error updating map view:", e);

          // Fallback to individual methods
          if (center) {
            try {
              map.setCenter([center.lon, center.lat]);
            } catch {}
          }

          if (typeof zoom === "number") {
            try {
              map.setZoom(zoom);
            } catch {}
          }
        }
      }
    }

    // Update markers only if explicitly provided AND data actually changed
    if (markers) {
      const prev = map._lastMarkerData || [];
      const changed =
        !prev ||
        prev.length !== markers.length ||
        markers.some((m, i) => {
          return !prev[i] || m.id !== prev[i].id || m.hasNote !== prev[i].hasNote || m.isFavorite !== prev[i].isFavorite;
        });

      if (changed) {
        console.log(`[useMapTiler] Updating ${markers.length} markers`);
        addMarkers(map, markers, displayPopups);
        map._lastMarkerData = [...markers];
      }
    }

    // Final resize after all updates, but only if map is still valid
    setTimeout(() => {
      // Check if map is still mounted and valid
      if (map && map.getContainer && map.getContainer()) {
        try {
          map.resize();
          console.log("[useMapTiler] Map resized successfully");
        } catch (e) {
          console.error("[useMapTiler] Error during map resize:", e);
        }
      }
    }, 100);
  }

  /**
   * Create reactive map markers that update when favorites or notes change
   */
  function useReactiveMapMarkers(listings: Ref<any[] | null> | any[] | null) {
    return computed(() => {
      const listArray = Array.isArray(unref(listings)) ? unref(listings) : [];
      return createMapMarkersFromListings(listArray);
    });
  }

  return {
    initializeMap,
    setControls,
    clearMarkers,
    addMarkers,
    centerMap,
    calculateZoomLevelFromRadius,
    autoComplete,
    createMapMarkersFromListings,
    handleMapViewChange,
    useReactiveMapMarkers,
  };
}
