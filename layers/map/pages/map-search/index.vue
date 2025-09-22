<template>
  <div class="map-search-page">
    <OrganismsSearchForm :map-draw="true"  @update:draw-mode="updateDrawMode" />
    <div class="map-fullscreen">
      <Map ref="mapRef" :markers="searchListings" :zoom="mapZoomLevel" :center="mapCenterCoordinates"
        :interactive="true" :draw="drawMode" :search-radius="searchRadius" :search-center="mapCenterCoordinates" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { calculateZoomLevelFromRadius } = useMap();

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
const mapZoomLevel = computed(() => {
  const radius = searchParams.value?.radius;
  if (radius) {
    return calculateZoomLevelFromRadius(radius);
  }
  // Don't return anything - let Map component use its defaults (zoom 6 for UK)
  return undefined;
});

const searchRadius = computed(() => {
  const radius = searchParams.value?.radius;
  return radius ? Number(radius) : null;
});

const mapCenterCoordinates = computed(() => {
  const coords = searchParams.value?.coordinates;
  if (coords?.lon && coords?.lat) {
    return [coords.lon, coords.lat] as [number, number];
  }
  if (userLocation.value) {
    return userLocation.value;
  }
  // Don't return anything - let Map component use its defaults (UK center)
  return undefined;
});

/**
 * Emit Handlers
 */
const updateDrawMode = (mode: boolean) => {
  drawMode.value = mode;
};

onMounted(() => {
  navigator.geolocation?.getCurrentPosition(
    ({ coords }) => {
      userLocation.value = [coords.longitude, coords.latitude];
    }
  );
});
</script>
<style>
/* Oli to fix the stupid header height issues */
.map-search-page {
  margin-top: -1.3rem;
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--header-expanded-height));
  overflow: hidden;
}
.map-fullscreen {
  flex: 1;
  min-height: 0;
  width: 100%;
  position: relative;
}
</style>
