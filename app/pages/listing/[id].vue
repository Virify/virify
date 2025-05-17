<template>
  <div class="| container flow flow-2xl">
    <div v-if="status === 'pending'">
      <h1>Loading...</h1>
    </div>
    <div v-else class="p-listing">
      <div class="p-listing__content">
        <div ref="$images" class="p-listing__images p-listing__images--large">
          Images
        </div>

        <h3 class="| title-sm">Images</h3>
        <pre>{{ images }}</pre>

        <h3 class="| title-sm">Property</h3>
        <pre>{{ property }}</pre>
      </div>

      <div class="p-listing__sidebar">
        <Transition name="p-listing-images">
          <div class="p-listing__sidebar-expand" v-show="!isImagesVisible">
            <div class="p-listing__images">
              Images
            </div>
          </div>
        </Transition>

        <OrganismsListingSidebar :price="listing?.price" />
      </div>
    </div>

    <AtomsDivider text="DEBUG" />

    <pre>{{ listing }}</pre>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import type { ListingWithFullProperty } from "~~/shared/types/listing";
// import { formatMDY } from "~~/shared/utils/format-date";

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
const $images = useTemplateRef('$images')
const isImagesVisible = shallowRef(true)

useIntersectionObserver($images, ([entry]) => {
  isImagesVisible.value = !!entry?.isIntersecting
})

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;
@use '#styles/_utils/functions' as fn;

.p-listing {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--size-32);

  @include mq.notebook {
    gap: var(--size-40);
    grid-template-columns: 1fr 18em;
  }

  @include mq.desktop {
    gap: var(--size-56);
    grid-template-columns: 1fr 20em;
  }

  /**
   *  Content wrappers
   */
  &__content {
    overflow: hidden;
  }

  &__sidebar {
    position: sticky;
    bottom: auto;
    left: unset;
    top: var(--header-height);
    max-height: calc(100dvh - var(--header-height));
    overflow: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    padding-bottom: var(--size-16);

    &-expand {
      overflow: hidden;
    }
  }

  /**
   *  Images
   */
  &__images {
    background: var(--foreground-300);
    aspect-ratio: 16 / 9;
    border-radius: var(--border-radius-2xl);
    margin-bottom: var(--size-24);

    /**
     *  DEBUG
     */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3em;
    color: #{ fn.faded-color(15%, var(--background-200))};
    /**
     *  END DEBUG
     */

    &--large {
      border-radius: var(--border-radius-3xl);
      margin-bottom: var(--size-24);
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