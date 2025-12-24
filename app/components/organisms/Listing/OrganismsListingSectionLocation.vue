<template>
  <div class="o-listing-section-location | flow flow-lg">
    <h2 class="| title-md">Location and Amenities</h2>
    <!-- Map Section on its own row -->
    <div class="o-listing-section-location__map-container">
      <Map v-if="lat && lon" ref="mapRef" :center="[lon, lat]" :zoom="12" :interactive="false" :markers="[mapMarker]"
        class="o-listing-section-location__map" />
    </div>

    <div class="o-listing-section-location__amenities-section">
      <MoleculesListingAmenities
        :lat="lat"
        :lon="lon"
        :listing="listing"
        :amenities="amenities"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Amenities } from '~~/layers/database/server/database/prisma/generated/client';


interface Props {
  lat: number;
  lon: number;
  listing?: any;
  amenities: Amenities[];
}

const props = defineProps<Props>();

const mapRef = ref();
const mapMarker = computed(() => props.listing);

onMounted(() => {
  nextTick(() => {
    if (mapRef.value?.recenterMap) {
      setTimeout(() => {
        mapRef.value.recenterMap();
      }, 200);
    }
  });
});
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.o-listing-section-location {
  &__map-container {
    width: 100%;
    height: min(40em, 40vh);
    border-radius: var(--border-radius-2xl);
    overflow: hidden;
  }

  &__map {
    width: 100%;
    height: 100%;
  }

  &__amenities-section {
    gap: var(--size-16);
    margin-top: var(--size-32);
  }
}
</style>
