import { Marker } from "@maptiler/sdk";
import { useDebounceFn } from "@vueuse/core";

export function useMapMarkers(mapCache: Map<string, MapInstance>) {
  const vueApp = useNuxtApp();
  const sdk = useMapSDK();

  /**
   * Private helper to create and add a single SDK marker to the map and instance.
   */
  function _createMarkerWithPopup(markerData?: ListingCardType): Marker {
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
   */
  function addMarker(map: ExtendedMapTilerMap, marker?: ListingCardType): Marker | undefined {
    const instance = findMapInstance(map, mapCache);

    if (!instance || !marker) {
      console.error("[Map] Instance not found or invalid markers argument");

      return undefined;
    }

    const { lat, lon } = asObject(marker.property?.address)

    if (!Number(lat) || !Number(lon)) {
      console.error("[Map] Marker does not have a latitude or longitude");

      return undefined
    }

    const newMarker = new sdk.Marker().setLngLat([
      (lon as number),
      (lat as number)
    ]);

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
        const { id, property } = asObject(marker)
        const { lat, lon } = asObject(property?.address)

        return {
          type: 'Feature',
          properties: { id },
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
    }

    // Else add a new source
    else {
      map.addSource('property_listings', {
        type: 'geojson',
        data: markerData,
        cluster: true,
        clusterRadius: 75 // In pixels
      })
    }

    // Add any missing layers
    if (!map.getLayer('clusters')) {
      console.log('Adding clusters layer')

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
            10, // Radius 20px
            2, // When 2 properties
            16, // Radius 30px
            5, // When less than 5 properties
            26 // Else radius 40px when more than 5 properties
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#622c15ff'
        },
      })
    }

    if (!map.getLayer('cluster-count')) {
      console.log('Adding cluster-count layer')

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'property_listings',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['Be Vietnam Pro', 'sans-serif'],
          'text-size': 16
        }
      })
    }

    if (!map.getLayer('unclustered-count')) {
      console.log('Adding unclustered-count layer')

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
    }

    // If listings already exist, listeners have already been added
    if (existingListings) return

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
      const unclusteredMarkers = map.queryRenderedFeatures(null, {
        layers: ['unclustered-count']
      })

      // Clear any existing markers
      clearMarkers(map)

      // Get a list of visible IDs
      // We need to do it this way as the markers added via the
      // map.addSource() does not allow nested objects
      const unclusterMarkerIds = asArray(unclusteredMarkers).map((marker) => {
        const { id } = asObject(marker?.properties)

        return id
      })

      // Get visible markers
      const visibleMarkers = asArray(markers).filter(({ id }) => {
        return unclusterMarkerIds.includes(id)
      })

      // Log new markers to add
      for (const visibleMarkerData of visibleMarkers) {
        const newMarker = _createMarkerWithPopup(visibleMarkerData);

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

  function clearClusters(map: ExtendedMapTilerMap): void {
    const instance = findMapInstance(map, mapCache);

    if (instance) {
      instance.map.removeLayer('clusters')
      instance.map.removeLayer('cluster-count')
      instance.map.removeLayer('unclustered-count')

      console.log('Map] Clusters removed from map')
    }
  }

  /**
   * Clears all markers from a map
   *
   * @param map The map to clear markers from
   */
  function clearMarkers(map: ExtendedMapTilerMap, removeClusters: boolean = false): void {
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
    clearClusters,
  } as const;
}