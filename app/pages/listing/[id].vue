<template>
  <main class="p-listing">
    <div class="p-listing" role="presentation">
      <div ref="$mobile-carousel" class="p-listing__main-carousel p-listing__main-carousel--mobile" role="presentation">
        <skeleton-loader class="p-listing__main-carousel-skeleton p-listing__main-carousel-skeleton--mobile">
          <MoleculesImageGallery v-if="!isDesktop && galleryImages.length > 0" :images="galleryImages"
            @open-modal="openImageModal" />
        </skeleton-loader>
      </div>

      <div class="p-listing__grid | container" role="presentation">
        <div class="p-listing__content | flow flow-sm">
          <div ref="$desktop-carousel" class="p-listing__main-carousel p-listing__main-carousel--desktop"
            role="presentation">
            <skeleton-loader class="p-listing__main-carousel-skeleton">
              <MoleculesImageGallery v-if="isDesktop && galleryImages.length > 0" :images="galleryImages"
                @open-modal="openImageModal" />
            </skeleton-loader>
          </div>

          <OrganismsListingOverview ref="$overview" class="p-listing__mobile-overview" :price="priceFormatted"
            :address="address" :price-type="priceType" :property-type="property?.type?.name"
            :property-size="property?.size || undefined" :bedrooms="property?.numberBedrooms || undefined"
            :bathrooms="property?.numberBathrooms || undefined" :other-rooms="property?.numberOtherRooms || undefined"
            :rear-garden="property?.rearGarden ? true : false" :front-garden="property?.frontGarden ? true : false"
            :receptions="property?.numberReceptions || undefined" :classification="property?.classification?.name"
            :year-built="property?.yearBuilt || undefined" :construction-type="property?.constructionType || undefined"
            :chain-free="listing?.saleListing ? listing?.saleListing?.chain : null"
            :available="listing?.saleListing ? listing?.saleListing?.availabilityStatus : listing?.rentalListing?.availabilityStatus" />

          <!-- General Property Information (Non-collapsible) -->
          <div v-if="property" class="p-listing__section">
            <AtomsListingGeneralInfo :description="property?.description || undefined" />
          </div>

          <div v-if="listing && property" class="p-listing__section">
            <MoleculesListingEssentials :listing="listing" :property="property" />
          </div>

          <div v-if="property" class="p-listing__section">
            <h2 class="title-md">Rooms</h2>
            <MoleculesListingItemDetails v-if="property?.bedroomFeatures" :items="property?.bedroomFeatures" type="room"
              subtype="Bedroom" title="Bedrooms" />
            <MoleculesListingItemDetails v-if="property?.bathroomFeatures" :items="property?.bathroomFeatures"
              type="room" subtype="Bathroom" title="Bathrooms" />
            <MoleculesListingItemDetails v-if="property?.kitchenFeatures" :items="property?.kitchenFeatures" type="room"
              subtype="Kitchen" title="Kitchen" />
            <MoleculesListingItemDetails v-if="property?.reception" :items="property?.reception" type="room"
              subtype="Reception" title="Receptions" />
            <MoleculesListingItemDetails v-if="property?.otherRoom" :items="property?.otherRoom" type="room"
              subtype="Other Rooms" title="Other Rooms" />
            <MoleculesListingItemDetails v-if="property?.rearGarden || property?.frontGarden"
              :items="getGardenItems(property)" type="garden" title="Gardens" :show-floor="false" />
          </div>

          <!-- Energy & Utilities -->
          <div v-if="property?.energyAndUtilities" class="p-listing__section">
            <MoleculesListingEnergyUtilities :energy-data="property.energyAndUtilities"
              :postcode="property?.address?.postcode" />
          </div>

          <div v-if="property" class="p-listing__section">
            <h2 class="title-md">Additional Details</h2>
            <div class="p-listing__features-list">
              <div class="p-listing__features-column">
                <MoleculesListingFeatures v-if="hasBooleanFeatures(property?.parking)" title="Parking"
                  :features="property?.parking" />
                <MoleculesListingFeatures v-if="hasBooleanFeatures(property?.utility)" title="Utility"
                  :features="property?.utility" />
                <MoleculesListingFeatures v-if="hasBooleanFeatures(property?.storageFeatures)" title="Storage"
                  :features="property?.storageFeatures" />
                <MoleculesListingBroadbandInfo v-if="property?.energyAndUtilities"
                  :broadband-type="property.energyAndUtilities.broadbandType"
                  :max-download-speed-mbps="property.energyAndUtilities.maxDownloadSpeedMbps"
                  :full-fibre-available="property.energyAndUtilities.fullFibreAvailable" />
                <MoleculesListingFeatures v-if="hasBooleanFeatures(property?.additionalFeatures)"
                  title="Additional Features" :features="property?.additionalFeatures" />
              </div>
              <div class="p-listing__features-column">
                <MoleculesListingFeatures v-if="hasBooleanFeatures(property?.accessibilityFeatures)"
                  title="Accessibility" :features="property?.accessibilityFeatures" />
                <MoleculesListingFeatures v-if="hasBooleanFeatures(property?.securityFeatures)" title="Security"
                  :features="property?.securityFeatures" />
                <MoleculesListingEnergyInfo v-if="filterListingFeatures(property?.energyAndUtilities)"
                  title="Energy & Utilities" :energy-data="property.energyAndUtilities!" />
                <MoleculesListingMobileCoverage />
              </div>
            </div>
          </div>

          <!-- Price Paid History -->
          <div v-if="property?.address && listing?.id && listing?.saleListing" class="p-listing__section">
            <MoleculesListingPricePaid :listing-id="listing.id" :address="{
              number: property.address.number,
              flat: property.address.flat,
              street: property.address.street,
              city: property.address.city,
              postcode: property.address.postcode,
              county: property.address.county,
            }" />
          </div>

          <!-- Location & Amenities (Non-collapsible) -->
          <div v-if="property" class="p-listing__section">
            <OrganismsListingSectionLocation :lat="property?.address?.lat!" :lon="property?.address?.lon!"
              :listing="listing" :amenities="amenitiesArray" />
          </div>

          <div v-if="property?.address?.lat && property?.address?.lon && listing?.id" class="p-listing__section">
            <OrganismsListingCrimeScore :lat="property.address.lat" :lon="property.address.lon" />
          </div>

          <div v-if="property?.address?.lat && property?.address?.lon && listing?.id" class="p-listing__section">
            <MoleculesListingFloodRisk :lat="property.address.lat" :lon="property.address.lon" />
          </div>

          <div class="p-listing__section">
            <MoleculesListingAdvert />
          </div>
        </div>

        <div class="p-listing__sidebar" role="presentation">
          <Transition name="p-listing-images">
            <div class="p-listing__sidebar-expand" v-show="!isImagesVisible">
              <div class="p-listing__sidebar-carousel">
                <MoleculesImageGallery v-if="galleryImages.length > 0" :images="galleryImages"
                  @open-modal="openImageModal" />
              </div>
            </div>
          </Transition>

          <OrganismsListingSidebar :price="priceFormatted" :listing-id="listing?.id || 0" :address="address"
            :price-type="priceType" :property-type="property?.type?.name" :property-size="property?.size || undefined"
            :price-number="listing?.price || undefined" :bedrooms="property?.numberBedrooms || undefined"
            :bathrooms="property?.numberBathrooms || undefined" :other-rooms="property?.numberOtherRooms || undefined"
            :rear-garden="property?.rearGarden ? true : false" :front-garden="property?.frontGarden ? true : false"
            :receptions="property?.numberReceptions || undefined" :classification="property?.classification?.name"
            :year-built="property?.yearBuilt || undefined" :construction-type="property?.constructionType || undefined"
            :chain-free="listing?.saleListing ? listing?.saleListing?.chain : null" :has-image-slide="!isImagesVisible"
            :agent="listing?.user || {}"
            :available="listing?.saleListing ? listing?.saleListing?.availabilityStatus : listing?.rentalListing?.availabilityStatus" />
        </div>
      </div>
    </div>

    <!-- Image Gallery Modal -->
    <MoleculesImageGalleryModal :images="galleryImages" :show="showImageModal" :initial-index="modalImageIndex"
      @close="closeImageModal" />

    <client-only>
      <OrganismsListingMobileBanner v-if="!isDesktop" :price="priceFormatted" :overview-visible="isOverviewVisible"
        :price-type="priceType" :address="address" :property-type="property?.type?.name"
        :property-size="property?.size || undefined" :bedrooms="property?.numberBedrooms || undefined"
        :bathrooms="property?.numberBathrooms || undefined" :other-rooms="property?.numberOtherRooms || undefined"
        :rear-garden="property?.rearGarden ? true : false" :front-garden="property?.frontGarden ? true : false"
        :receptions="property?.numberReceptions || undefined" :classification="property?.classification?.name"
        :year-built="property?.yearBuilt || undefined" :construction-type="property?.constructionType || undefined"
        :chain-free="listing?.saleListing ? listing?.saleListing?.chain : null" :listing-id="listing?.id || 0"
        :agent="listing?.user || {}"
        :available="listing?.saleListing ? listing?.saleListing?.availabilityStatus : listing?.rentalListing?.availabilityStatus" />
    </client-only>
  </main>
  <!-- Similar Listings -->
  <div class="p-listing | container">
    <OrganismsRelevantListings type="similar" :listing-id="String(route.params?.id)" :address="similarListingsAddress" />
  </div>

</template>


<script setup lang="ts">
import { useIntersectionObserver, useMediaQuery } from "@vueuse/core";
import breakpoints from "#styles/_utils/breakpoints.module.scss";
const { trackListingView } = useAnalytics();
const route = useRoute();

/**
 *  Fetch listing
 */
const { data: listingData, status } = await useAsyncData(
  `listing-${route.params?.id}`,
  () => {
    return $fetch<{ listing: any }>(`/api/listing/${route.params?.id}`);
  },
  {
    deep: false,
  }
);

const listing = computed(() => listingData.value?.listing);

const similarListingsAddress = computed(() => {
  return listing.value?.property?.address ? {
    street: listing.value.property.address.street,
    city: listing.value.property.address.city,
    postcode: listing.value.property.address.postcode,
  } : {};
});
/**
 *  Content
 */
const property = computed(() => listing.value?.property);

const priceFormatted = computed(() => {
  const price = listing.value?.price;
  return isNumber(price) ? numberToCurrency(price) : "";
});

/** omit street number */
const address = computed(() => {
  return property.value?.address ? `${property.value.address.street || ""}, ${property.value.address.city || ""}, ${property.value.address.postcode || ""}`.trim() : "";
});

const priceType = computed(() => {
  return listing.value?.saleListing ? listing.value.saleListing.priceType : listing.value?.rentalListing?.rentFrequency;
});


// Handle amenities array/object conversion
const amenitiesArray = computed(() => {
  const amenities = property.value?.amenities;
  if (!amenities) return null;
  return Array.isArray(amenities) ? amenities : [amenities];
});

// Create garden items array for unified component
const getGardenItems = (property: any) => {
  const gardens = [];
  if (property?.frontGarden) {
    gardens.push({ ...property.frontGarden, gardenType: "front" });
  }
  if (property?.rearGarden) {
    gardens.push({ ...property.rearGarden, gardenType: "rear" });
  }
  return gardens;
};

/**
 *  Media
 */
const images = computed(() => {
  const media = property.value?.media;
  if (!Array.isArray(media)) return [];

  return media
    .filter((item) => item.image !== null)
    .map((item) => ({
      image: item.image!,
      metadata: item.metadata,
    }));
});

const galleryImages = computed(() => formatGalleryImages(images.value));

/**
 *  Toggle media visibility
 */
const $mobileCarousel = useTemplateRef("$mobile-carousel");
const $desktopCarousel = useTemplateRef("$desktop-carousel");
const isDesktop = useMediaQuery(`(min-width: ${breakpoints.notebook})`);
const isImagesVisible = shallowRef(true);

function parallaxCarousel() {
  if (isDesktop.value) return;

  // Get elem to watch
  const elem = unref($mobileCarousel);

  // Ensure element exists
  if (!elem) return;

  // Get top scroll position
  const getScrollTop = window.scrollY;
  const getScrollThreshold = elem.offsetHeight;

  // Calculate as transform from the top, if below threshold
  if (getScrollTop < getScrollThreshold) {
    elem.style.transform = `translateY(${getScrollTop / 2}px)`;
  }
}

useIntersectionObserver($desktopCarousel, ([entry]) => {
  isImagesVisible.value = !!entry?.isIntersecting;
});

onMounted(() => {
  window.addEventListener("scroll", parallaxCarousel, { passive: true });
  // Removed duplicate event listener registration
  if (listing.value && listing.value.id) {
    trackListingView(String(listing.value.id));
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", parallaxCarousel);
});

/**
 *  Toggle overview scroll
 */
const $overview = useTemplateRef("$overview");
const isOverviewVisible = shallowRef(true);

useIntersectionObserver($overview, ([entry]) => {
  isOverviewVisible.value = !!entry?.isIntersecting;
});

/**
 *  Image Gallery Modal
 */
const showImageModal = ref(false);
const modalImageIndex = ref(0);

function openImageModal(imageIndex: number) {
  modalImageIndex.value = imageIndex;
  showImageModal.value = true;
}

function closeImageModal() {
  showImageModal.value = false;
}

onBeforeUnmount(() => {
  window.removeEventListener("scroll", parallaxCarousel);
});
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;
@use "#styles/_utils/functions" as fn;

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.p-listing {
  padding-top: var(--size-16);

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: calc(var(--container-padding) / 2);
    align-items: flex-start;

    @include mq.not-notebook {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: none;
      background: var(--background-100);
      border-top-right-radius: var(--border-radius-3xl);
      border-top-left-radius: var(--border-radius-3xl);
      padding: var(--border-radius-3xl) 0 0;
      margin: calc(0px - var(--border-radius-3xl)) 0 0;
    }

    @include mq.notebook {
      grid-template-columns: 1fr 18em;
    }

    @include mq.desktop {
      grid-template-columns: 1fr 20em;
    }
  }

  /**
   *  Content wrappers
   */
  &__mobile-overview {
    @include mq.notebook {
      display: none;
    }
  }

  &__content {
    overflow: hidden;

    @include mq.not-notebook {
      padding-inline: var(--size-24);
    }
  }

  &__sidebar {
    display: none;

    @include mq.notebook {
      display: block;
      position: sticky;
      top: calc(var(--header-height) + var(--size-32));
      max-height: calc(100dvh - var(--header-height) - var(--size-32) - var(--size-16));
      overflow: auto;
      overscroll-behavior: contain;
      scrollbar-width: thin;
      padding-bottom: var(--size-16);
    }

    &-expand {
      overflow: hidden;
      display: none;

      @include mq.notebook {
        display: block;
      }
    }
  }

  /**
   *  Images
   */
  &__main-carousel,
  &__sidebar-carousel {
    overflow: hidden;
  }

  &__main-carousel {
    &--mobile {
      display: block;

      @include mq.notebook {
        display: none;
      }
    }

    &--desktop {
      display: none;

      @include mq.notebook {
        display: block;
        margin-bottom: var(--size-24);
      }
    }
  }

  &__sidebar-carousel {
    margin-bottom: var(--size-24);
  }

  /**
   *  Skeleton loaders
   */
  &__main-carousel-skeleton {
    aspect-ratio: 16 / 9;
    width: 100%;

    &--mobile {
      aspect-ratio: 4 / 3;
      max-height: 70vh;
    }
  }
}

/**
 *  Animations
 */
.p-listing-images-enter-active,
.p-listing-images-leave-active {
  interpolate-size: allow-keywords;

  height: calc-size(max-content, size);
  transition-property: opacity, height, transform, margin;
  transition-duration: var(--animation-medium);
  transition-timing-function: var(--ease-in-out);
  transform-origin: 100% 100%;
}

.p-listing-images-leave-to,
.p-listing-images-enter-from {
  height: 0;
  margin: 0;
  transform: translateY(-100%);
}

.p-listing__section {
  padding: var(--size-16) 0;
  margin-left: var(--size-2);

  @include mq.notebook {
    margin-right: var(--size-24);
  }
}

.p-listing__features-list {
  width: 100%;
  display: flex;
  gap: var(--size-16);
  margin-top: var(--size-16);
  align-items: flex-start;

  @include mq.mobile-only {
    flex-direction: column;
    gap: var(--size-12);
  }
}

.p-listing__features-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--size-16);

  @include mq.mobile-only {
    gap: var(--size-12);
    width: 100%;
  }
}

</style>
