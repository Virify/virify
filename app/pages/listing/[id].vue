<template>
  <main>
    <div v-if="status === 'pending'">
      <h1>Loading...</h1>
    </div>

    <div v-else class="p-listing" role="presentation">
      <div ref="$mobile-carousel" class="p-listing__main-carousel p-listing__main-carousel--mobile" role="presentation">
        <skeleton-loader class="p-listing__main-carousel-skeleton p-listing__main-carousel-skeleton--mobile">
          <OrganismsListingCarousel v-if="!isDesktop" :slides="images" :width="1000" aspect-ratio="4/3" />
        </skeleton-loader>
      </div>

      <div class="p-listing__grid | container" role="presentation">
        <div class="p-listing__content | flow flow-sm">
          <div ref="$desktop-carousel" class="p-listing__main-carousel p-listing__main-carousel--desktop"
            role="presentation">
            <skeleton-loader class="p-listing__main-carousel-skeleton">
              <OrganismsListingCarousel v-if="isDesktop" :slides="images" :width="1000" />
            </skeleton-loader>
          </div>

          <OrganismsListingOverview ref="$overview" class="p-listing__mobile-overview" :price="priceFormatted" :address="fullAddress" />

          <!-- Location & Amenities (Most Important) -->
          <OrganismsListingSection v-if="property" accordion-label="Map and Location" :start-expanded="isDesktop || true">
            <OrganismsListingSectionLocation :lat="property?.address?.lat!" :lon="property?.address?.lon!" :listing="listing" :amenities="amenitiesArray" />
          </OrganismsListingSection>

          <!-- Core Room Features -->
          <OrganismsListingSection v-if="bedroomFeatures" accordion-label="Bedroom Features" :start-expanded="isDesktop || true">
            <MoleculesPropertyTable :data="bedroomFeatures" :fields="bedroomFields" title="Bedroom" />
          </OrganismsListingSection>

          <OrganismsListingSection v-if="bathroomFeatures" accordion-label="Bathroom Features" :start-expanded="isDesktop">
            <MoleculesPropertyTable :data="bathroomFeatures" :fields="bathroomFields" title="Bathroom" />
          </OrganismsListingSection>

          <OrganismsListingSection v-if="kitchenFeatures" accordion-label="Kitchen" :start-expanded="isDesktop">
            <MoleculesPropertyTable :data="kitchenFeatures" :fields="kitchenFields" title="Kitchen" :is-array="false" />
          </OrganismsListingSection>

          <OrganismsListingSection v-if="livingAreaFeatures" accordion-label="Living Area" :start-expanded="isDesktop">
            <MoleculesPropertyTable :data="livingAreaFeatures" :fields="livingAreaFields" title="Living Area" :is-array="false" />
          </OrganismsListingSection>

          <OrganismsListingSection v-if="reception" accordion-label="Reception Rooms" :start-expanded="isDesktop">
            <MoleculesPropertyTable :data="reception" :fields="receptionFields" title="Reception" />
          </OrganismsListingSection>

          <OrganismsListingSection v-if="diningroomFeatures" accordion-label="Dining Room" :start-expanded="isDesktop">
            <MoleculesPropertyTable :data="diningroomFeatures" :fields="diningroomFields" title="Dining Room" :is-array="false" />
          </OrganismsListingSection>

          <!-- External Features -->

          <OrganismsListingSection v-if="parking" accordion-label="Parking" :start-expanded="isDesktop">
            <MoleculesPropertyTable :data="parking" :fields="parkingFields" title="Parking" :is-array="false" />
          </OrganismsListingSection>

          <OrganismsListingSection v-if="outdoorSpace" accordion-label="Outdoor Space" :start-expanded="isDesktop">
            <MoleculesPropertyTable :data="outdoorSpace" :fields="outdoorSpaceFields" title="Outdoor Space" :is-array="false" />
          </OrganismsListingSection>

          <!-- Property Features & Amenities -->
          <OrganismsListingSection v-if="additionalFeatures" accordion-label="Additional Features" :start-expanded="isDesktop">
            <MoleculesPropertyTable :data="additionalFeatures" :fields="additionalFields" title="Features" :is-array="false" />
          </OrganismsListingSection>

          <OrganismsListingSection v-if="storageFeatures" accordion-label="Storage Features" :start-expanded="isDesktop">
            <MoleculesPropertyTable :data="storageFeatures" :fields="storageFields" title="Storage" :is-array="false" />
          </OrganismsListingSection>

          <OrganismsListingSection v-if="utility" accordion-label="Utility Room" :start-expanded="isDesktop">
            <MoleculesPropertyTable :data="utility" :fields="utilityFields" title="Utility" :is-array="false" />
          </OrganismsListingSection>

          <OrganismsListingSection v-if="additionalToilet" accordion-label="Additional Toilet" :start-expanded="isDesktop">
            <MoleculesPropertyTable :data="additionalToilet" :fields="additionalToiletFields" title="Additional Toilet" :is-array="false" />
          </OrganismsListingSection>

          <!-- Technical & Financial -->
          <OrganismsListingSection v-if="energyAndUtilities" accordion-label="Energy and Utilities" :start-expanded="isDesktop">
            <MoleculesPropertyTable :data="energyAndUtilities" :fields="energyAndUtilitiesFields" title="Energy & Utilities" :is-array="false" />
          </OrganismsListingSection>

          <OrganismsListingSection v-if="runningCosts" accordion-label="Running Costs" :start-expanded="isDesktop">
            <MoleculesPropertyTable :data="runningCosts" :fields="runningCostsFields" title="Running Costs" :is-array="false" />
          </OrganismsListingSection>

          <OrganismsListingSection v-if="securityFeatures" accordion-label="Security Features" :start-expanded="isDesktop">
            <MoleculesPropertyTable :data="securityFeatures" :fields="securityFields" title="Security" :is-array="false" />
          </OrganismsListingSection>

          <OrganismsListingSection v-if="accessibilityFeatures" accordion-label="Accessibility Features" :start-expanded="isDesktop">
            <MoleculesPropertyTable :data="accessibilityFeatures" :fields="accessibilityFields" title="Accessibility" :is-array="false" />
          </OrganismsListingSection>
        </div>

        <div class="p-listing__sidebar" role="presentation">
          <Transition name="p-listing-images">
            <div class="p-listing__sidebar-expand" v-show="!isImagesVisible">
              <OrganismsListingCarousel class="p-listing__sidebar-carousel" :slides="images" :width="400" />
            </div>
          </Transition>

          <OrganismsListingSidebar :price="priceFormatted" :listing-id="listing?.id || 0" :address="fullAddress" />
        </div>
      </div>
    </div>

    <client-only>
      <OrganismsListingMobileBanner v-if="!isDesktop" :price="priceFormatted" :overview-visible="isOverviewVisible" />
    </client-only>
  </main>
</template>

<script setup lang="ts">
import { useIntersectionObserver, useMediaQuery } from "@vueuse/core";
import breakpoints from '#styles/_utils/breakpoints.module.scss'
import { generateDynamicFields } from '~/utils/listing/dynamic-fields'

const route = useRoute();

/**
 *  Fetch listing
 */
const { data: listing, status } = await useAsyncData("listing", () => {
  return $fetch<ListingWithFullProperty>(`/api/listing/${route.params?.id}`)
}, {
  deep: false
});

/**
 *  Content
 */
const property = computed(() => listing.value?.property)

const priceFormatted = computed(() => {
  const price = listing.value?.price
  return isNumber(price) ? numberToCurrency(price) : ''
})

function getPropertyFeature(key: keyof NonNullable<typeof property.value>, validator: (value: any) => boolean) {
  return computed(() => {
    const feature = property.value?.[key]
    return validator(feature) ? feature : false
  })
}

const fullAddress = computed(() => {
  return property.value?.address?.fullAddress || "No address provided"
})
const bedroomFeatures = getPropertyFeature('bedroomFeatures', Array.isArray)
const bathroomFeatures = getPropertyFeature('bathroomFeatures', Array.isArray)
const additionalFeatures = getPropertyFeature('additionalFeatures', isObject)
const accessibilityFeatures = getPropertyFeature('accessibilityFeatures', isObject)
const energyAndUtilities = getPropertyFeature('energyAndUtilities', isObject)
const parking = getPropertyFeature('parking', isObject)
const outdoorSpace = getPropertyFeature('outdoorSpace', isObject)
const securityFeatures = getPropertyFeature('securityFeatures', isObject)
const storageFeatures = getPropertyFeature('storageFeatures', isObject)
const runningCosts = getPropertyFeature('runningCosts', isObject)
const diningroomFeatures = getPropertyFeature('diningroomFeatures', isObject)
const kitchenFeatures = getPropertyFeature('kitchenFeatures', isObject)
const livingAreaFeatures = getPropertyFeature('livingAreaFeatures', isObject)
const reception = getPropertyFeature('reception', Array.isArray)
const utility = getPropertyFeature('utility', isObject)
const additionalToilet = getPropertyFeature('additionalToilet', isObject)

// Handle amenities array/object conversion
const amenitiesArray = computed(() => {
  const amenities = property.value?.amenities
  if (!amenities) return null
  return Array.isArray(amenities) ? amenities : [amenities]
})

/**
 * Dynamic field generation from actual data
 */
const bedroomFields = computed(() => generateDynamicFields(bedroomFeatures.value))
const bathroomFields = computed(() => generateDynamicFields(bathroomFeatures.value))
const additionalFields = computed(() => generateDynamicFields(additionalFeatures.value))
const accessibilityFields = computed(() => generateDynamicFields(accessibilityFeatures.value))
const energyAndUtilitiesFields = computed(() => generateDynamicFields(energyAndUtilities.value))
const parkingFields = computed(() => generateDynamicFields(parking.value))
const outdoorSpaceFields = computed(() => generateDynamicFields(outdoorSpace.value))
const securityFields = computed(() => generateDynamicFields(securityFeatures.value))
const storageFields = computed(() => generateDynamicFields(storageFeatures.value))
const runningCostsFields = computed(() => generateDynamicFields(runningCosts.value))
const diningroomFields = computed(() => generateDynamicFields(diningroomFeatures.value))
const kitchenFields = computed(() => generateDynamicFields(kitchenFeatures.value))
const livingAreaFields = computed(() => generateDynamicFields(livingAreaFeatures.value))
const receptionFields = computed(() => generateDynamicFields(reception.value))
const utilityFields = computed(() => generateDynamicFields(utility.value))
const additionalToiletFields = computed(() => generateDynamicFields(additionalToilet.value))


/**
 *  Media
 */
const images = computed(() => {
  const media = property.value?.media
  if (!Array.isArray(media)) return []
  
  return media
    .filter(item => item.image !== null)
    .map(item => ({
      image: item.image!,
      metadata: item.metadata
    }))
})

/**
 *  Toggle media visibility
 */
const $mobileCarousel = useTemplateRef('$mobile-carousel')
const $desktopCarousel = useTemplateRef('$desktop-carousel')
const isDesktop = useMediaQuery(`(min-width: ${breakpoints.notebook})`)
const isImagesVisible = shallowRef(true)

function parallaxCarousel() {
  if (isDesktop.value) return

  // Get elem to watch
  const elem = unref($mobileCarousel)

  // Ensure element exists
  if (!elem) return

  // Get top scroll position
  const getScrollTop = window.scrollY
  const getScrollThreshold = elem.offsetHeight;

  // Calculate as transform from the top, if below threshold
  if (getScrollTop < getScrollThreshold) {
    elem.style.transform = `translateY(${getScrollTop / 2}px)`
  }
}

useIntersectionObserver($desktopCarousel, ([entry]) => {
  isImagesVisible.value = !!entry?.isIntersecting
})

onMounted(() => {
  window.addEventListener('scroll', parallaxCarousel, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', parallaxCarousel)
})

/**
 *  Toggle overview scroll
 */
const $overview = useTemplateRef('$overview')
const isOverviewVisible = shallowRef(true)

useIntersectionObserver($overview, ([entry]) => {
  isOverviewVisible.value = !!entry?.isIntersecting
})

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;
@use '#styles/_utils/functions' as fn;

.p-listing {

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
      top: var(--header-height);
      max-height: calc(100dvh - var(--header-height));
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
    background: var(--foreground-300);
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
        border-radius: var(--border-radius-3xl);
        margin-bottom: var(--size-24);
      }
    }
  }

  &__sidebar-carousel {
    border-radius: var(--border-radius-2xl);
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
</style>
