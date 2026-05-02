<template>
  <main class="p-listing">
    <div class="p-listing" role="presentation">
      <div ref="$mobile-carousel" class="p-listing__main-carousel p-listing__main-carousel--mobile" role="presentation">
        <MoleculesImageGallery :images="galleryImages" @open-modal="openImageModal" />
        <ClientOnly>
          <UBadge v-if="viewingLabel" :label="viewingLabel" icon="i-lucide-calendar" size="lg" color="secondary"
            variant="solid" class="mb-1 absolute top-2 right-2 z-1 text-xs" />
        </ClientOnly>
      </div>

      <div class="p-listing__grid | container" role="presentation">
        <div class="p-listing__content | flow flow-sm">
          <div ref="$desktop-carousel" class="p-listing__main-carousel p-listing__main-carousel--desktop"
            role="presentation">
            <MoleculesImageGallery :images="galleryImages" @open-modal="openImageModal" />
            <ClientOnly>
              <UBadge v-if="viewingLabel" :label="viewingLabel" icon="i-lucide-calendar" size="lg" color="secondary"
                variant="solid" class="mb-1 absolute top-2 right-2 z-1 text-xs" />
            </ClientOnly>
          </div>

          <OrganismsListingOverview ref="$overview" class="p-listing__mobile-overview" :price="priceFormatted"
            :address="address" :price-type="priceType" :property-type="property?.type?.name"
            :property-size="property?.size || undefined" :bedrooms="property?.numberBedrooms || undefined"
            :bathrooms="property?.numberBathrooms || undefined" :other-rooms="property?.numberOtherRooms || undefined"
            :has-garden="hasGarden" :has-land="hasLand" :receptions="property?.numberReceptions || undefined"
            :classification="property?.classification?.name" :year-built="property?.yearBuilt || undefined"
            :construction-type="property?.constructionType || undefined"
            :chain-free="listing?.saleListing ? !listing?.saleListing?.chain : null" :listing-id="listing?.id"
            :price-history="listing?.ListingPriceHistory ?? undefined"
            :current-price-number="listing?.price ?? undefined"
            :available="listing?.saleListing ? listing?.saleListing?.availabilityStatus : listing?.rentalListing?.availabilityStatus" />

          <!-- General Property Information (Non-collapsible) -->
          <div v-if="property" class="p-listing__section">
            <AtomsListingGeneralInfo :description="property?.description || undefined" />
          </div>

          <div v-if="listing && property" class="p-listing__section">
            <MoleculesListingEssentials :listing="listing" :property="property" />
          </div>

          <div v-if="hasRooms" class="p-listing__section">
            <h2 class="title-md">Rooms</h2>
            <MoleculesListingItemDetails v-if="property?.bedroomFeatures && property.bedroomFeatures.length > 0"
              :items="property?.bedroomFeatures" type="room" subtype="Bedroom" title="Bedrooms" />
            <MoleculesListingItemDetails v-if="property?.bathroomFeatures && property.bathroomFeatures.length > 0"
              :items="property?.bathroomFeatures" type="room" subtype="Bathroom" title="Bathrooms" />
            <MoleculesListingItemDetails v-if="property?.kitchenFeatures && property.kitchenFeatures.length > 0"
              :items="property?.kitchenFeatures" type="room" subtype="Kitchen" title="Kitchen" />
            <MoleculesListingItemDetails v-if="property?.reception && property.reception.length > 0"
              :items="property?.reception" type="room" subtype="Reception" title="Receptions" />
            <MoleculesListingItemDetails v-if="property?.otherRoom && property.otherRoom.length > 0"
              :items="property?.otherRoom" type="room" subtype="Other Rooms" title="Other Rooms" />
            <!-- Outdoor Space Section (if it exists) -->
            <MoleculesListingItemDetails v-if="property?.outdoorSpace" :items="[property.outdoorSpace]"
              type="outdoorspace" title="Outdoor Space" :show-floor="false"
              :total-area="property.outdoorSpace.totalArea" :has-gardens="hasGarden" :has-yards="hasYard"
              :has-land="hasLand" :gardens="gardensWithDetails" :yards="yardsWithDetails" :lands="landsWithDetails" />
          </div>

          <!-- Energy & Utilities -->
          <div v-if="property?.energyAndUtilities" class="p-listing__section">
            <MoleculesListingEnergyUtilities :energy-data="property.energyAndUtilities"
              :postcode="property?.address?.postcode" />
          </div>

          <div v-if="hasAdditionalDetails" class="p-listing__section">
            <h2 class="title-md">Additional Details</h2>
            <div class="p-listing__features-grid">
              <MoleculesListingFeatures v-if="property?.parking?.features?.length" title="Parking"
                :features="property?.parking" />
              <MoleculesListingFeatures v-if="property?.utility?.features?.length" title="Utility"
                :features="property?.utility" />
              <MoleculesListingFeatures v-if="property?.storageFeatures?.features?.length" title="Storage"
                :features="property?.storageFeatures" />
              <MoleculesListingBroadbandInfo v-if="property?.energyAndUtilities?.broadbandType"
                :broadband-type="property.energyAndUtilities.broadbandType"
                :max-download-speed-mbps="property.energyAndUtilities.maxDownloadSpeedMbps"
                :full-fibre-available="property.energyAndUtilities.fullFibreAvailable" />
              <MoleculesListingFeatures v-if="property?.additionalFeatures?.features?.length"
                title="Additional Features" :features="property?.additionalFeatures" />
              <MoleculesListingFeatures v-if="property?.accessibilityFeatures?.features?.length" title="Accessibility"
                :features="property?.accessibilityFeatures" />
              <MoleculesListingFeatures v-if="property?.securityFeatures?.features?.length" title="Security"
                :features="property?.securityFeatures" />
              <MoleculesListingEnergyInfo v-if="property?.energyAndUtilities" title="Energy & Utilities"
                :energy-data="property.energyAndUtilities!" />
              <MoleculesListingMobileCoverage />
            </div>
          </div>

          <!-- Mortgage Calculator (Sale listings only) -->
          <!-- <div v-if="listing?.saleListing && listing?.price" class="p-listing__section">
            <h2 class="title-md">Mortgage Calculator</h2>
            <OrganismsMortgageCalculator 
              :property-price="listing.price" 
              :listing-id="String(listing.id)" 
            />
          </div> -->

          <!-- Price Paid History -->
          <div v-if="property?.address && listing?.id && listing?.saleListing" class="p-listing__section">
            <MoleculesListingPricePaid :listing-id="listing.id" :price="listing.saleListing ? listing.price : undefined"
              :property-type="property?.type?.name" :address="{
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
              :listing="listing" :amenities="property?.amenities" />
          </div>

          <div v-if="property?.address?.lat && property?.address?.lon && listing?.id" class="p-listing__section">
            <OrganismsListingCrimeScore :lat="property.address.lat" :lon="property.address.lon" />
          </div>

          <div v-if="property?.address?.lat && property?.address?.lon && listing?.id" class="p-listing__section">
            <MoleculesListingFloodRisk :lat="property.address.lat" :lon="property.address.lon" />
          </div>

          <div class="p-listing__section" v-if="!loggedIn">
            <MoleculesListingAdvert :title="advertTitle" :description="advertDescription" :link="advertLink"
              :linkText="advertLinkText" />
          </div>
        </div>

        <div class="p-listing__sidebar" role="presentation">
          <Transition name="p-listing-images">
            <div class="p-listing__sidebar-expand" v-show="!isImagesVisible">
              <div class="p-listing__sidebar-carousel">
                <MoleculesImageGallery :images="galleryImages" @open-modal="openImageModal" />
                <ClientOnly>
                  <UBadge v-if="viewingLabel" :label="viewingLabel" icon="i-lucide-calendar" size="lg" color="secondary"
                    variant="solid" class="mb-1 absolute top-2 right-2 z-1 text-xs" />
                </ClientOnly>
              </div>
            </div>
          </Transition>

          <OrganismsListingSidebar :price="priceFormatted" :listing-id="listing?.id || 0" :address="address"
            :price-type="priceType" :property-type="property?.type?.name" :property-size="property?.size || undefined"
            :price-number="listing?.price || undefined" :bedrooms="property?.numberBedrooms || undefined"
            :bathrooms="property?.numberBathrooms || undefined" :other-rooms="property?.numberOtherRooms || undefined"
            :has-garden="hasGarden" :has-land="hasLand" :receptions="property?.numberReceptions || undefined"
            :classification="property?.classification?.name" :year-built="property?.yearBuilt || undefined"
            :construction-type="property?.constructionType || undefined"
            :chain-free="listing?.saleListing ? !listing?.saleListing?.chain : null" :has-image-slide="!isImagesVisible"
            :agent="listing?.user || {}" :price-history="listing?.ListingPriceHistory ?? undefined"
            :current-price-number="listing?.price ?? undefined"
            :available="listing?.saleListing ? listing?.saleListing?.availabilityStatus : listing?.rentalListing?.availabilityStatus"
            :is-draft="isDraft" />
        </div>
      </div>
    </div>

    <!-- Image Gallery Modal -->
    <MoleculesImageGalleryModal :images="galleryImages" :show="showImageModal" :initial-index="modalImageIndex"
      @close="closeImageModal" />

    <!-- Sentinel: when visible the user has scrolled past the listing into the footer -->
    <div ref="$listingEnd" />

    <client-only>
      <OrganismsListingMobileBanner v-if="!isDesktop && !isBeyondListing" :price="priceFormatted"
        :overview-visible="isOverviewVisible" :gallery-visible="isMobileGalleryVisible" :modal-open="showImageModal"
        :price-type="priceType" :address="address" :property-type="property?.type?.name"
        :property-size="property?.size || undefined" :bedrooms="property?.numberBedrooms || undefined"
        :bathrooms="property?.numberBathrooms || undefined" :other-rooms="property?.numberOtherRooms || undefined"
        :has-garden="hasGarden" :has-land="hasLand" :receptions="property?.numberReceptions || undefined"
        :classification="property?.classification?.name" :year-built="property?.yearBuilt || undefined"
        :construction-type="property?.constructionType || undefined"
        :chain-free="listing?.saleListing ? !listing?.saleListing?.chain : null" :listing-id="listing?.id || 0"
        :agent="listing?.user || {}" :price-history="listing?.ListingPriceHistory ?? undefined"
        :current-price-number="listing?.price ?? undefined"
        :available="listing?.saleListing ? listing?.saleListing?.availabilityStatus : listing?.rentalListing?.availabilityStatus"
        :is-draft="isDraft" />
    </client-only>
  </main>
</template>

<script setup lang="ts">
import { useIntersectionObserver, useMediaQuery } from "@vueuse/core";
import breakpoints from "#styles/_utils/breakpoints.module.scss";

const props = defineProps<{
  listing: any;
  isDraft?: boolean;
}>();

const { trackView } = useAnalyticsTracking();

/**
 *  Content
 */
const property = computed(() => props.listing?.property);

const priceFormatted = computed(() => {
  const price = props.listing?.price;
  return isNumber(price) ? numberToCurrency(price) : "";
});

/** omit street number */
const address = computed(() => {
  return property.value?.address.street + ", " + property.value?.address.city + ", " + property.value?.address.postcode.split(" ")[0]
});

const priceType = computed(() => {
  return props.listing?.saleListing ? props.listing.saleListing.priceType : props.listing?.rentalListing?.rentFrequency;
});

const hasRooms = computed(() => {
  const prop = property.value;
  if (!prop) return false;

  return (
    (prop.bedroomFeatures && prop.bedroomFeatures.length > 0) ||
    (prop.bathroomFeatures && prop.bathroomFeatures.length > 0) ||
    (prop.kitchenFeatures && prop.kitchenFeatures.length > 0) ||
    (prop.reception && prop.reception.length > 0) ||
    (prop.otherRoom && prop.otherRoom.length > 0)
  );
});

const advertTitle = computed(() => 'List your property with Virify!');

const advertDescription = computed(() => 'Ready to sell or rent? Get your home in front of the right buyers and renters with Virify\'s smart, modern platform.');

const advertLinkText = computed(() => 'List Your Property');

const advertLink = computed(() => '/dashboard/create-listing');

// Handle amenities array/object conversion
const amenitiesArray = computed(() => {
  const amenities = property.value?.amenities;
  if (!amenities) return null;
  return Array.isArray(amenities) ? amenities : [amenities];
});

// Check if property has any garden (regardless of additionalDetails)
const hasGarden = computed(() => {
  const gardens = property.value?.outdoorSpace?.garden;
  return gardens && Array.isArray(gardens) && gardens.length > 0;
});

// Check if property has any yard (regardless of additionalDetails)
const hasYard = computed(() => {
  const yards = property.value?.outdoorSpace?.yard;
  return yards && Array.isArray(yards) && yards.length > 0;
});

// Check if property has any land (regardless of additionalDetails)
const hasLand = computed(() => {
  const land = property.value?.outdoorSpace?.land;
  return land && Array.isArray(land) && land.length > 0;
});

// Filter gardens/yards/lands that have additional details (for rendering individual cards)
const gardensWithDetails = computed(() => {
  const gardens = property.value?.outdoorSpace?.garden;
  if (!gardens || !Array.isArray(gardens)) return [];
  return gardens.filter(g => g.additionalDetails === true);
});

const yardsWithDetails = computed(() => {
  const yards = property.value?.outdoorSpace?.yard;
  if (!yards || !Array.isArray(yards)) return [];
  return yards.filter(y => y.additionalDetails === true);
});

const landsWithDetails = computed(() => {
  const lands = property.value?.outdoorSpace?.land;
  if (!lands || !Array.isArray(lands)) return [];
  return lands.filter(l => l.additionalDetails === true);
});

// Check if property has any additional details to display
const hasAdditionalDetails = computed(() => {
  const prop = property.value;
  if (!prop) return false;

  return (
    prop.parking?.features?.length ||
    prop.utility?.features?.length ||
    prop.storageFeatures?.features?.length ||
    prop.energyAndUtilities?.broadbandType ||
    prop.additionalFeatures?.features?.length ||
    prop.accessibilityFeatures?.features?.length ||
    prop.securityFeatures?.features?.length ||
    prop.energyAndUtilities
  );
});

/**
 *  Media
 */
const images = computed(() => {
  const media = property.value?.media;
  if (!Array.isArray(media)) return [];

  return media
    .filter((item) => item.image !== null)
    .map((item, index) => ({
      image: item.image!,
      metadata: item.metadata,
      // Room relationship data for categorization
      bedroomId: item.bedroomId,
      bathroomId: item.bathroomId,
      kitchenId: item.kitchenId,
      receptionId: item.receptionId,
      otherRoomId: item.otherRoomId,
      gardenId: item.gardenId,
      yardId: item.yardId,
      landId: item.landId,
      outdoorSpaceId: item.outdoorSpaceId,
      globalIndex: index,
    }));
});

const galleryImages = computed(() => {
  return images.value.map((item, index) => ({
    src: item.image,
    alt: (() => {
      try {
        const metadata = typeof item.metadata === 'string' ? JSON.parse(item.metadata) : item.metadata;
        return metadata?.alt || `Property image ${index + 1}`;
      } catch {
        return `Property image ${index + 1}`;
      }
    })(),
    // Pass room IDs for gallery to categorize
    bedroomId: item.bedroomId,
    bathroomId: item.bathroomId,
    kitchenId: item.kitchenId,
    receptionId: item.receptionId,
    otherRoomId: item.otherRoomId,
    gardenId: item.gardenId,
    yardId: item.yardId,
    landId: item.landId,
    outdoorSpaceId: item.outdoorSpaceId,
    globalIndex: index
  }));
});

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

const { loggedIn } = useUserSession();
const { viewings, getActiveViewingForListing, getViewingStatusLabel, fetchViewings } = useViewings();

const viewingLabel = computed(() => {
  const id = props.listing?.id;
  if (!id) return null;
  const v = getActiveViewingForListing(id);
  return v ? getViewingStatusLabel(v) : null;
});

onMounted(() => {
  window.addEventListener("scroll", parallaxCarousel, { passive: true });
  // Track listing view only for published listings, not drafts
  if (!props.isDraft && props.listing && props.listing.id) {
    trackView(props.listing.id);
  }
  if (loggedIn.value && viewings.value.length === 0) {
    fetchViewings().catch(() => { });
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
 *  Toggle mobile gallery visibility
 */
const isMobileGalleryVisible = shallowRef(false);

useIntersectionObserver($mobileCarousel, ([entry]) => {
  isMobileGalleryVisible.value = !!entry?.isIntersecting;
});

/**
 *  Hide mobile banner once the user scrolls past the listing into the footer
 */
const $listingEnd = useTemplateRef('$listingEnd');
const isBeyondListing = shallowRef(false);

useIntersectionObserver($listingEnd, ([entry]) => {
  if (!entry) return;
  if (entry.isIntersecting) {
    // Sentinel entered viewport — user is in the footer area
    isBeyondListing.value = true;
  } else if (entry.boundingClientRect.top > 0) {
    // Sentinel is below viewport — user scrolled back up into the listing
    isBeyondListing.value = false;
  }
  // If top <= 0 and not intersecting, sentinel scrolled above viewport (fully past it) — stay hidden
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
</script>

<style lang="scss" scoped>
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
      background: var(--background-200);
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
    position: relative;
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

  &__image-badge {
    position: absolute;
    top: var(--size-12);
    right: var(--size-12);
    z-index: 10;
    pointer-events: none;
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
  display: grid;
  gap: var(--size-16);
  margin-top: var(--size-16);
  grid-template-columns: 1fr;

  @include mq.tablet {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mq.mobile-only {
    gap: var(--size-12);
  }
}

.p-listing__features-grid {
  width: 100%;
  margin-top: var(--size-16);
  column-gap: var(--size-16);
  row-gap: var(--size-16);

  @include mq.tablet {
    column-count: 2;
  }

  @include mq.notebook {
    column-count: 3;
  }

  @include mq.mobile-only {
    column-gap: var(--size-12);
    row-gap: var(--size-12);
  }

  >* {
    break-inside: avoid;
    margin-bottom: var(--size-16);
    display: inline-block;
    width: 100%;

    @include mq.mobile-only {
      margin-bottom: var(--size-12);
    }
  }
}
</style>
