const mapCache = new Map<string, MapInstance>();
export const GLOBAL_MAP_ID = "virify-map";

export function useMapConfig() {
  const sdk = useNuxtApp().$maptilersdk;

  /**
   * Reuse an existing map instance if it exists.
   * We need to track interactivity to enable/disable map controls
   *
   * @param mapId string - The ID of the map to reuse
   * @param container HTMLElement - The container to attach the map to
   * @returns The reused map instance or undefined if no map exists with this ID
   */
  function reuseMap(container: HTMLElement, options: MapInitOptions, mapId: string): ExtendedMapTilerMap | undefined {
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
    map.setZoom(options.zoom ?? 6);
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
      zoom: options.zoom ?? 6,
      navigationControl: false, // We'll add it manually in bottom-right
      geolocateControl: false, // We'll add it manually in bottom-right
      center: options.center,
    }) as ExtendedMapTilerMap;

    // Handle missing map images to prevent console warnings
    map.on('styleimagemissing', (e: any) => {
      // Create a simple 1x1 transparent pixel as fallback for missing POI icons
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, 1, 1);
        map.addImage(e.id, canvas);
      }
    });

    // Add controls manually in bottom-right position
    if (options.interactive) {
      const navControl = new sdk.NavigationControl() as any;
      const geolocateControl = new sdk.GeolocateControl() as any;
      map.addControl(navControl, "bottom-right");
      map.addControl(geolocateControl, "bottom-right");
    }

    // cache the map instance
    if (mapId) {
      mapCache.set(mapId, {
        map,
        markers: [],
        markerMap: new Map(),
        interactive: options.interactive,
        drawControl: null,
        featureMarkers: new Map(), // Initialize feature markers tracking
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
    return reuseMap(container, options, mapId) ?? initNewMap(container, options, mapId);
  }

  /**
   * Get the map cache for other composables to use
   */
  function getMapCache() {
    return mapCache;
  }

  return {
    initMap,
    getMapCache,
    GLOBAL_MAP_ID,
  } as const;
}