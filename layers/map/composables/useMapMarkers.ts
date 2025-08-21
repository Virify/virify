import { Marker } from "@maptiler/sdk";

export function useMapMarkers(mapCache: Map<string, MapInstance>) {
  const vueApp = useNuxtApp();
  const sdk = useMapSDK();

  /**
   * Private helper to create and add a single SDK marker to the map and instance.
   */
  function _createMarkerWithPopup(markerData?: ListingCardType[]): Marker {
    const formattedMarker = formatMarker(markerData)

    const [firstImageObject] = asArray(formattedMarker.image, true)
    const { image } = asObject(firstImageObject)

    // Create marker Vue element
    const marker = renderMarker({
      id: formattedMarker.id,
      price: formattedMarker.price,
      tier: formattedMarker.tier,
      image: image as string,
      priceType: formattedMarker.priceType,
      vueApp,
    });

    // Create popup Vue element
    const popup = renderPopup(formattedMarker, vueApp);

    // Convert marker to SDK
    const sdkMarker = new sdk.Marker({
      element: marker,
      anchor: "bottom",
    });

    // Set the appropriate lat/long and popup
    sdkMarker.setLngLat([formattedMarker.lon, formattedMarker.lat]);
    sdkMarker.setPopup(popup);

    return sdkMarker
  }


  /**
   * Adds a marker to the map instance
   * @deprecated this method does not appear to be used
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
   * @deprecated this method does not appear to be used
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
  function addMarkers(map: ExtendedMapTilerMap, markers?: ListingCardType[]) {
    const instance = findMapInstance(map, mapCache);

    if (!instance) {
      console.error("[Map] Instance not found");

      return [];
    }

    let markerCount = 0;

    for (const markerData of asArray(markers, true)) {
      const newMarker = _createMarkerWithPopup(markerData);

      newMarker.addTo(map);
      instance.markers.push(newMarker);

      markerCount++
    }

    console.log(`[Map] Added ${markerCount} general markers to map instance`);
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