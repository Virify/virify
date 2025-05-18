<template>
  <main>
    <div v-if="status === 'pending'">
      <h1>Loading...</h1>
    </div>

    <div v-else class="p-listing" role="presentation">
      <div ref="$mobile-carousel" class="p-listing__main-carousel p-listing__main-carousel--mobile" role="presentation">
        <client-only>
          <OrganismsListingCarousel v-if="!isDesktop" :slides="images" :width="1000" />
        </client-only>
      </div>

      <div class="p-listing__mobile-overlap" role="presentation">
        <div class="p-listing__grid | container flow flow-2xl">
          <div class="p-listing__content">
            <div ref="$desktop-carousel" class="p-listing__main-carousel p-listing__main-carousel--desktop"
              role="presentation">
              <client-only>
                <OrganismsListingCarousel v-if="isDesktop" :slides="images" :width="1000" />
              </client-only>
            </div>

            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum, est! Ullam eum commodi temporibus, ipsa
              praesentium, architecto soluta iure nisi sed dignissimos voluptatibus cum repellendus quae nostrum impedit
              optio! Exercitationem!</p>
          </div>

          <div class="p-listing__sidebar" role="presentation">
            <Transition name="p-listing-images">
              <div class="p-listing__sidebar-expand" v-show="!isImagesVisible">
                <OrganismsListingCarousel class="p-listing__sidebar-carousel" :slides="images" :width="400" />
              </div>
            </Transition>

            <OrganismsListingSidebar :price="listing?.price" />
          </div>
        </div>
      </div>
    </div>

    <AtomsDivider text="DEBUG" />

    <div style="overflow: hidden">
      <pre>{{ debugContent }}</pre>
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
  return asObject(unref(listing)?.property)
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
    property: excludeKeys(data?.property || {}, ['media'])
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
    gap: var(--size-32);
    align-items: flex-start;

    @include mq.notebook {
      gap: var(--size-40);
      grid-template-columns: 1fr 18em;
    }

    @include mq.desktop {
      gap: var(--size-56);
      grid-template-columns: 1fr 20em;
    }
  }

  /**
   *  Wrapper allows overlapping carousel on mobile
   */
  &__mobile-overlap {
    position: relative;
    background: var(--background-100);
    z-index: 2;
    border-top-right-radius: var(--border-radius-3xl);
    border-top-left-radius: var(--border-radius-3xl);
    margin-top: calc(0px - var(--border-radius-3xl));
    padding-top: var(--border-radius-3xl);
  }

  /**
   *  Content wrappers
   */
  &__content {
    overflow: hidden;
    min-height: calc(100vw / (16 / 9));
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
    aspect-ratio: 16 / 9;
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
    background: var(--foreground-300);
    aspect-ratio: 16 / 9;
    border-radius: var(--border-radius-2xl);
    margin-bottom: var(--size-24);
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