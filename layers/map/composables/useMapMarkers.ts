import { Marker } from "@maptiler/sdk";
import { useDebounceFn } from "@vueuse/core";

export function useMapMarkers(mapCache: Map<string, MapInstance>) {
  const vueApp = useNuxtApp();
  const sdk = useMapSDK();

  /**
   * Private helper to create and add a single SDK marker to the map and instance.
   */
  function _createMarkerWithPopup(markerData?: any): Marker {
    const [firstImageObject] = asArray(markerData.image, true)
    const { image } = asObject(firstImageObject)

    // Create marker Vue element
    const marker = renderMarker({
      id: markerData.id,
      price: markerData.price,
      tier: markerData.tier,
      image: image as string,
      priceType: markerData.priceType,
      vueApp,
    });

    // Create popup Vue element
    const popup = renderPopup(markerData, vueApp);

    // Convert marker to SDK
    const sdkMarker = new sdk.Marker({
      element: marker,
      anchor: "bottom",
    });

    // Set the appropriate lat/long and popup
    sdkMarker.setLngLat([markerData.lon, markerData.lat]);
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
  function createMapSource(markers: ListingCardType[] | undefined) {
    const markersArray: ListingCardType[] = asArray(markers)

    return {
      type: 'FeatureCollection',
      features: markersArray.map((marker) => {
        const { lat, lon } = asObject(marker?.property?.address)

        return {
          type: 'Feature',
          properties: formatMarker(marker),
          geometry: {
            type: 'Point',
            coordinates: [lon, lat]
          }
        }
      })
    }
  }

  async function addMarkers(map: ExtendedMapTilerMap, markers?: ListingCardType[]) {
    const instance = findMapInstance(map, mapCache);

    if (!instance) {
      console.error("[Map] Instance not found");

      return [];
    }

    // Wait for map to be ready
    await map.onReadyAsync()

    // Create marker data
    const markerData = createMapSource(markers)

    // Set (or update) sources
    const existingListings = map.getSource('property_listings')

    // If a source already exists, simple update the data
    if (existingListings) {
      existingListings.setData(markerData)

      return
    }

    // Else add a new source
    map.addSource('property_listings', {
      type: 'geojson',
      data: markerData,
      cluster: true,
      clusterRadius: 50 // In pixels
    })

    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'property_listings',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#FEC7B0', // Colour...
          2, // ...when 2 properties
          '#FD8E61', // Colour...
          5, // ...when less than 5 properties
          '#FC7239' // Else when more than 5 properties
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          15, // Radius 20px
          2, // When 2 properties
          20, // Radius 30px
          5, // When less than 5 properties
          30 // Else radius 40px when more than 5 properties
        ]
      },
    })

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'property_listings',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-size': 16
      }
    })

    map.addLayer({
      id: 'unclustered-count',
      type: 'circle',
      source: 'property_listings',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-radius': 2,
        'circle-color': 'transparent',
      }
    })

    // Zoom into cluster on click
    map.on('click', 'clusters', async (e: { point: unknown }) => {
      const [feature] = map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
      });

      // Get cluster ID, coordinates
      const { cluster_id } = asObject(feature?.properties)
      const { coordinates } = asObject(feature?.geometry)

      // Get the cluster expansion zoom
      const zoom = await map
        .getSource('property_listings')
        .getClusterExpansionZoom(cluster_id);

      // Animate to cluster position
      map.easeTo({
        center: coordinates,
        zoom
      });
    })

    // Show pointer on cluster hover
    map.on('mouseenter', 'clusters', () => {
      map.getCanvas().style.cursor = 'pointer'
    })

    map.on('mouseleave', 'clusters', () => {
      map.getCanvas().style.cursor = ''
    })

    // Function to get and add unclustered markers
    const _addUnClusteredMarkers = useDebounceFn(() => {
      // Get a list of visible markers
      const visibleMarkers = map.queryRenderedFeatures(null, {
        layers: ['unclustered-count']
      })

      // Clear any existing markers
      clearMarkers(map)

      // Log new markers to add
      for (const visibleMarkerData of asArray(visibleMarkers)) {
        const { properties } = asObject(visibleMarkerData)

        const newMarker = _createMarkerWithPopup(properties);

        newMarker.addTo(map);
        instance.markers.push(newMarker);
      }

      // Show how many markers added to map
      console.log(`[Map] Added ${visibleMarkers?.length} unclustered markers to map instance`);
    }, 200)

    // Add new listeners
    map.on('data', ({ sourceId }: { sourceId: string }) => {
      if (sourceId !== 'property_listings') return

      // Show markers
      _addUnClusteredMarkers()

      // Update on zoom, moveend
      map.on('zoomend', _addUnClusteredMarkers)
      map.on('moveend', _addUnClusteredMarkers)
    })

    console.log(`[Map] Added ${markerData.features?.length} general markers to map instance`);
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