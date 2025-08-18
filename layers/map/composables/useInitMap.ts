const existingMaps = new Map<string, MapInstance>();

export function useInitMap() {
  const DEFAULT_MAP_ID = 'virify-map'

  const sdk = useMapSDK();

  /**
   *  Get an existing map, if it exists
   */
  function getExistingMap(): Map<string, MapInstance>
  function getExistingMap(mapId: string): MapInstance | undefined
  function getExistingMap(mapId?: string): MapInstance | Map<string, MapInstance> | undefined {
    // If no mapId provided, return all maps
    if (!mapId) {
      return existingMaps
    }

    // Return a map matching a mapId
    return existingMaps.get(mapId);
  }

  /**
   * Reuse an existing map instance if it exists.
   * We need to track interactivity to enable/disable map controls
   *
   * @param mapId string - The ID of the map to reuse
   * @param container HTMLElement - The container to attach the map to
   * @returns The reused map instance or undefined if no map exists with this ID
   */
  function _initExistingMap(
    container: HTMLElement,
    options: MapInitOptions,
    mapInstance: MapInstance
  ): ExtendedMapTilerMap {
    console.log("[Map] Reusing existing map instance");

    // Get existing map container
    const mapContainer = mapInstance.map.getContainer();

    // If map is mounted, remove it
    if (mapContainer.parentElement) {
      mapContainer.remove();
    }

    // Clear the container of any existing HTML
    container.innerHTML = "";

    // Re-append map
    container.appendChild(mapContainer);

    // Get map options
    const { zoom = 6, center } = asObject(options)

    // Reset map controls, options
    const { setControls } = useMapControls(mapInstance)

    setControls(options);

    // Reset zoom, center for map
    mapInstance.map.setZoom(zoom);
    mapInstance.map.setCenter(center);

    return mapInstance.map;
  }

  /**
   * Init a new map instance
   *
   * @param container map container
   * @param options options
   * @param mapId string
   */
  function _initNewMap(
    container: HTMLElement,
    options: MapOptions,
    mapId: string
  ): ExtendedMapTilerMap {
    console.log("[Map] Creating new map instance");

    const { interactive, zoom = 6 } = asObject(options)

    const map = new sdk.Map({
      container,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${sdk.config.apiKey}`,
      interactive,
      zoom,
      navigationControl: false, // We'll add it manually in bottom-right
      geolocateControl: false, // We'll add it manually in bottom-right
      center: options.center,
    }) as ExtendedMapTilerMap;

    // Handle missing map images to prevent console warnings
    map.on('styleimagemissing', (e: any) => {
      const size = 1;

      map.addImage(e.id, {
        width: size,
        height: size,
        data: createEmptyMapTile(size)
      });
    });

    // Add controls manually in bottom-right position
    if (interactive) {
      map.addControl(new sdk.NavigationControl() as any, "bottom-right");
      map.addControl(new sdk.GeolocateControl() as any, "bottom-right");
    }

    // cache the map instance
    if (mapId) {
      existingMaps.set(mapId, {
        map,
        markers: [],
        interactive,
        drawControl: null,
        markerMap: new Map(),
        featureMarkers: new Map(),
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
  function initMap(
    container: HTMLElement,
    options: MapOptions,
    mapId = DEFAULT_MAP_ID
  ): ExtendedMapTilerMap {
    const existingMap = getExistingMap(mapId)

    // Set container size
    container.style.width = "100%";
    container.style.height = "100%";

    // If map exists, re-use it
    if (existingMap) {
      return _initExistingMap(container, options, existingMap)
    }

    // Otherwise init a new map
    return _initNewMap(container, options, mapId);
  }

  return {
    initMap,
    getExistingMap
  }
}