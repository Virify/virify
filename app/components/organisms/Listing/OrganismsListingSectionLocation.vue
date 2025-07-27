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
      <!-- Not logged in: Show original hero + blurred amenities -->
      <template v-if="!loggedIn">
        <AtomsHeroCard>
          <h2 class="| title-md">Know your stuff ahead of time!</h2>
          <p class="| body-md">
            Check out the nearby amenities to see what's around your potential
            new home. We've got you covered with all the info you need.
          </p>
          <p class="| body-md">
            You can even customise them to see what matters most to you.
          </p>
          <button
            @click="openLogin"
            class="| button button-secondary"
          >
            Sign In to Access
          </button>
          <p class="| body-xs">
            <strong>Note:</strong> Amenities are approximate and may not be
            exhaustive. Always verify with local sources.
          </p>
        </AtomsHeroCard>

        <MoleculesListingAmenitiesPreview :show-overlay="false">
          <template #content>
            <MoleculesListingAmenitiesSkeleton />
          </template>
        </MoleculesListingAmenitiesPreview>
      </template>

      <!-- Logged in: Show amenities + upsell for more -->
      <template v-else>
        <MoleculesListingAmenities
          :lat="lat"
          :lon="lon"
          :listing="listing"
          @amenities-loaded="handleAmenitiesLoaded"
        />

        <MoleculesListingAmenitiesPreview>
          <template #content>
            <MoleculesListingAmenitiesSkeleton 
              :show-redacted="false"
              class="o-listing-section-location__amenities-blurred"
            />
          </template>
          <template #overlay>
            <h2 class="| title-sm">Discover More Amenities</h2>
            <p class="| body-sm">
              Unlock restaurants, gyms, parks, shops and 15+ more categories.
            </p>
            <NuxtLink
              to="#"
              class="o-listing-section-location__amenities-unlock-btn | button button-secondary"
            >
              Unlock Premium
            </NuxtLink>
          </template>
        </MoleculesListingAmenitiesPreview>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ViewsDialogLogin } from "#components";

interface Props {
  lat: number;
  lon: number;
  listing?: any;
}

const props = defineProps<Props>();

const { loggedIn } = useUserSession();
const { showDialog } = useDialog();
const mapRef = ref();
const mapMarker = computed(() => props.listing);

function openLogin() {
  showDialog({
    component: ViewsDialogLogin,
  });
}

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
  margin: var(--size-32) 0;
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
    display: flex;
    flex-direction: column;
    gap: var(--size-16);
    margin-top: var(--size-32);

    @include mq.tablet {
      flex-direction: row;
      gap: var(--size-32);
    }

    > * {
      width: 100%;
      
      @include mq.tablet {
        width: calc(50% - var(--size-16));
      }
    }
  }


  &__amenities-blurred {
    filter: blur(var(--size-8));
    pointer-events: none;
  }

  &__amenities-unlock-btn {
    margin-top: var(--size-16);
    color: var(--foreground-100);
    align-self: center;
  }
}
</style>
