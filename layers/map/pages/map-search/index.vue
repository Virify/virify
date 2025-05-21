<template>
  <div class="map-search-page">
    <OrganismsSearchForm :map-draw="true"  @update:draw-mode="updateDrawMode" />
    <div class="map-fullscreen">
      <Map
        ref="mapRef"
        :markers="searchListings"
        :zoom="mapZoomLevel"
        :center="mapCenterCoordinates"
        :interactive="true"
        :mapId="GLOBAL_MAP_ID"
        :draw="drawMode"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { calculateZoomLevelFromRadius, updateSearchRadiusVisualization } = useMap();

/**
 * State
 */
const mapRef = ref<any>();
const drawMode = ref(false);
const userLocation = ref<[number, number] | null>(null);
const searchListings = ref<ListingCardType[]>([]);
const searchParams = useState<Record<string, any>>("searchParams");
provide("searchListings", searchListings);

/**
 * Computed
 */
const mapZoomLevel = computed(() => 
  calculateZoomLevelFromRadius(searchParams.value?.radius)
);

const mapCenterCoordinates = computed(() => {
  const coords = searchParams.value?.coordinates;
  return coords?.lon && coords?.lat ? 
    [coords.lon, coords.lat] as [number, number] : 
    userLocation.value ?? undefined;
});

/**
 * Emit Handlers
 */
const updateDrawMode = (mode: boolean) => {
  drawMode.value = mode;
};

/**
 * Update Map Radius Circle
 */
const updateRadius = () => {
  const coords = searchParams.value?.coordinates;
  const radius = Number(searchParams.value?.radius);
  const mapInstance = mapRef.value?.map;

  if (mapInstance && coords?.lon && coords?.lat && !isNaN(radius)) {
    updateSearchRadiusVisualization(
      mapInstance,
      [coords.lon, coords.lat],
      radius
    );
  }
};

onMounted(() => {
  navigator.geolocation?.getCurrentPosition(
    ({ coords }) => {
      userLocation.value = [coords.longitude, coords.latitude];
    }
  );
});

/**
 * Watch for changes in search parameters
 */
watch(
  [
    () => searchParams.value?.coordinates,
    () => searchParams.value?.radius,
    () => mapRef.value?.map
  ],
  updateRadius,
  { immediate: true }
);
</script>
<style>
.map-search-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
}
.map-fullscreen {
  flex: 1;
  min-height: 0;
  width: 100%;
  position: relative;
}
</style>
