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

          <OrganismsListingOverview ref="$overview" class="p-listing__mobile-overview" :price="priceFormatted" />

          <OrganismsListingSection v-if="property">
            <OrganismsListingSectionLocation :lat="property?.address?.lat" :lon="property?.address?.lon" />
          </OrganismsListingSection>

          <OrganismsListingSection v-if="bedroomFeatures" accordion-label="Bedroom Features" start-expanded>
            <pre>{{ bedroomFeatures }}</pre>
          </OrganismsListingSection>

          <OrganismsListingSection v-if="bathroomFeatures" accordion-label="Bathroom Features">
            <pre>{{ bathroomFeatures }}</pre>
          </OrganismsListingSection>

          <OrganismsListingSection v-if="additionalFeatures" accordion-label="Additional Features">
            <pre>{{ additionalFeatures }}</pre>
          </OrganismsListingSection>

          <OrganismsListingSection v-if="accessibilityFeatures" accordion-label="Accessibility Features">
            <pre>{{ accessibilityFeatures }}</pre>
          </OrganismsListingSection>

          <OrganismsListingSection v-if="energyAndUtilities">
            <h3 class="| title-xs">Energy and Utilities</h3>

            <pre>{{ energyAndUtilities }}</pre>
          </OrganismsListingSection>
        </div>

        <div class="p-listing__sidebar" role="presentation">
          <Transition name="p-listing-images">
            <div class="p-listing__sidebar-expand" v-show="!isImagesVisible">
              <OrganismsListingCarousel class="p-listing__sidebar-carousel" :slides="images" :width="400" />
            </div>
          </Transition>

          <OrganismsListingSidebar :price="priceFormatted" />
        </div>
      </div>
    </div>

    <client-only>
      <OrganismsListingMobileBanner v-if="!isDesktop" :price="priceFormatted" :overview-visible="isOverviewVisible" />
    </client-only>

    <AtomsDivider text="DEBUG" />

    <div style="overflow: hidden">
      <pre class="| body-sm">{{ debugContent }}</pre>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useIntersectionObserver, useMediaQuery } from "@vueuse/core";
import type { ListingWithFullProperty } from "~~/shared/types/listing";
import breakpoints from '#styles/_utils/breakpoints.module.scss'

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
const property = computed(() => {
  const { property } = asObject(listing.value)

  return property
})

const priceFormatted = computed(() => {
  const { price } = asObject(listing.value)

  return isNumber(price) ? numberToCurrency(price) : ''
})

const bedroomFeatures = computed(() => {
  const { bedroomFeatures } = asObject(listing.value?.property)

  return Array.isArray(bedroomFeatures) && bedroomFeatures
})

const bathroomFeatures = computed(() => {
  const { bathroomFeatures } = asObject(listing.value?.property)

  return Array.isArray(bathroomFeatures) && bathroomFeatures
})

const additionalFeatures = computed(() => {
  const { additionalFeatures } = asObject(listing.value?.property)

  return isObject(additionalFeatures) && additionalFeatures
})

const accessibilityFeatures = computed(() => {
  const { accessibilityFeatures } = asObject(listing.value?.property)

  return isObject(accessibilityFeatures) && accessibilityFeatures
})

const energyAndUtilities = computed(() => {
  const { energyAndUtilities } = asObject(listing.value?.property)

  return isObject(energyAndUtilities) && energyAndUtilities
})

/**
 *  Media
 */
const images = computed(() => {
  const { media } = asObject(property.value)

  return Array.isArray(media) ? media : []
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

/**
 *  Debug content
 */
const debugContent = computed(() => {
  const data = listing.value

  if (!isObject(data)) return {}

  function excludeKeys(obj: Record<string, unknown>, keys: string[] = []) {
    const objClone = structuredClone(obj)

    for (let key of keys) {
      delete objClone[key]
    }

    return objClone
  }

  return {
    ...data,
    property: excludeKeys(data?.property || {}, ['media', 'bedroomFeatures', 'bathroomFeatures', 'additionalFeatures', 'accessibilityFeatures'])
  }
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