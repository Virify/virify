<template>
  <div class="o-listing-section-location | flow flow-lg">
    <h2 class="| title-md">Location and Amenities</h2>
    <!-- Map Section on its own row -->
    <div class="o-listing-section-location__map-container">
      <Map
        v-if="lat && lon"
        ref="mapRef"
        :center="[lon, lat]"
        :zoom="12"
        :interactive="false"
        :marker="mapMarker"
        class="o-listing-section-location__map"
      />
    </div>

    <div class="o-listing-section-location__amenities-section">
      <div class="o-listing-section-location__amenities-hero">
        <h2 class="| title-md">Know your stuff ahead of time!</h2>
        <p class="| body-md">
          Check out the nearby amenities to see what’s around your potential new
          home. We’ve got you covered with all the info you need.
        </p>
        <p class="| body-md">
          You can even cutomise them to see what matters most to you.
        </p>
        <NuxtLink
          to="#"
          class="o-listing-section-location__amenities-hero__link | button button-secondary"
          >
          Customise
          </NuxtLink>
        <p class="| body-xs">
          <strong>Note:</strong> Amenities are approximate and may not be
          exhaustive. Always verify with local sources.
        </p>
      </div>

      <ListingAmenities
        :lat="lat"
        :lon="lon"
        :listing="listing"
        @amenities-loaded="handleAmenitiesLoaded"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ListingAmenities from "../../molecules/Listing/MolculesListingAmenities.vue";

interface Props {
  lat: number;
  lon: number;
  listing?: any;
}

const props = defineProps<Props>();

const mapRef = ref();
const mapMarker = computed(() => props.listing);

function handleAmenitiesLoaded() {
  // Recenter map after amenities are loaded (content has changed the layout)
  nextTick(() => {
    if (mapRef.value?.recenterMap) {
      setTimeout(() => {
        mapRef.value.recenterMap();
      }, 100);
    }
  });
}

// Ensure map loads properly after component mount
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
  padding: var(--size-16);
  &__map-container {
    width: 100%;
    height: min(40em, 30vh);
    border-radius: var(--border-radius-2xl);
    overflow: hidden;
  }

  &__map {
    width: 100%;
    height: 100%;
  }

  &__amenities-section {
    display: flex;
    flex-direction: column;
    gap: var(--size-16);
    margin-top: var(--size-32);

    @include mq.tablet {
      flex-direction: row;
    }
  }

  &__amenities-hero {
    border-radius: var(--border-radius-2xl);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    padding: var(--size-32);
    background: url("/img/logo-background.svg") no-repeat top right,
      var(--blue-400);
    color: var(--monochrome-900);

    &__link {
      margin: var(--size-16) 0;
      color: var(--foreground-100);
    }
  }
}
</style>
