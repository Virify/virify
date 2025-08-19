import { Marker } from "@maptiler/sdk";

export function useMapMarkers(mapCache: Map<string, MapInstance>) {
  const vueApp = useNuxtApp();
  const sdk = useMapSDK();

  /**
   * Private helper to create and add a single SDK marker to the map and instance.
   */
  function _createAndAddSdkMarker(map: ExtendedMapTilerMap, markerData: MapMarker, instance: MapInstance): Marker {
    const [firstImageObject] = asArray(markerData.image, true)
    const { image } = asObject(firstImageObject)

    const markerWrapper = renderMarker(markerData.id, markerData.price, markerData.tier, image as string, vueApp, markerData.priceType);
    const newSdkMarker = new sdk.Marker({
      element: markerWrapper,
      anchor: "bottom",
    });
    newSdkMarker.setLngLat([markerData.lon, markerData.lat]);
    const popup = renderPopup(markerData, vueApp);
    newSdkMarker.setPopup(popup);
    newSdkMarker.addTo(map);
    instance.markers.push(newSdkMarker);
    return newSdkMarker;
  }


  /**
   * Adds a marker to the map instance
   *
   * @param map The map to add the marker to
   * @param marker The marker to add
   */
  function addMarker(map: ExtendedMapTilerMap, marker: Array<{ lat: number; lon: number }> | null | undefined): Marker | undefined {
    const instance = findMapInstance(map, mapCache);
    if (!instance || !marker || marker.length === 0 || !marker[0]) {
      console.error("[Map] Instance not found or invalid marker");
      return undefined;
    }
    const newMarker = new sdk.Marker().setLngLat([marker[0].lon, marker[0].lat]);
    newMarker.addTo(map);
    instance.markers.push(newMarker);
    console.log("[Map] Added marker to map instance");
    return newMarker;
  }


  /**
   * Adds multiple markers to the map instance for a specific feature
   *
   * @param map The map to add markers to
   * @param markers Array of markers to add
   * @param featureId The ID of the feature these markers belong to
   * @returns Array of created marker objects
   */
  function addMarkersForFeature(map: ExtendedMapTilerMap, markersData: MapMarker[], featureId: string): Marker[] {
    const instance = findMapInstance(map, mapCache);
    if (!instance) {
      console.error("[Map] Instance not found");
      return [];
    }

    const addedSdkMarkers: Marker[] = [];
    for (const markerData of markersData) {
      const newSdkMarker = _createAndAddSdkMarker(map, markerData, instance);
      addedSdkMarkers.push(newSdkMarker);
    }

    // Store the markers for this feature
    instance.featureMarkers.set(featureId, addedSdkMarkers);

    console.log(`[Map] Added ${addedSdkMarkers.length} markers for feature ${featureId}`);
    return addedSdkMarkers;
  }

  /**
   * Adds multiple markers to the map instance (from a search result or general purpose)
   *
   * @param map The map to add markers to
   * @param markers Array of markers to add
   * @returns Array of newly created marker objects
   */
  function addMarkers(map: ExtendedMapTilerMap, markersData: MapMarker[]): Marker[] {
    const instance = findMapInstance(map, mapCache);
    if (!instance) {
      console.error("[Map] Instance not found");
      return [];
    }

    const addedSdkMarkers: Marker[] = [];
    for (const markerData of markersData) {
      const newSdkMarker = _createAndAddSdkMarker(map, markerData, instance);
      addedSdkMarkers.push(newSdkMarker);
    }

    console.log(`[Map] Added ${addedSdkMarkers.length} general markers to map instance`);
    return addedSdkMarkers;
  }

  /**
   * Clears all markers from a map
   *
   * @param map The map to clear markers from
   */
  function clearMarkers(map: ExtendedMapTilerMap): void {
    const instance = findMapInstance(map, mapCache);
    if (instance) {
      instance.markers.forEach((marker) => marker.remove());
      console.log("[Map] Cleared markers from map instance");
      instance.markers = [];
      instance.featureMarkers.clear();
    }
  }

  /**
   * Clears markers for a specific feature
   *
   * @param map The map to clear markers from
   * @param featureId The ID of the feature whose markers should be cleared
   */
  function clearMarkersForFeature(map: ExtendedMapTilerMap, featureId: string): void {
    const instance = findMapInstance(map, mapCache);
    if (!instance) return;

    const featureMarkers = instance.featureMarkers.get(featureId);
    if (featureMarkers) {
      // Remove these markers from the map
      featureMarkers.forEach((marker) => marker.remove());

      // Remove these markers from the main markers array
      instance.markers = instance.markers.filter((marker) => !featureMarkers.includes(marker));

      // Remove the feature from tracking
      instance.featureMarkers.delete(featureId);

      console.log("[Map] Cleared " + featureMarkers.length + " markers for feature " + featureId);
    }
  }


  return {
    addMarker,
    addMarkers,
    addMarkersForFeature,
    clearMarkers,
    clearMarkersForFeature,
  } as const;
}