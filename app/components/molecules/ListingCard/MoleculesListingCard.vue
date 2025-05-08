<template>
  <div ref="$root" class="m-listing-card | relative" :class="{
    'm-listing-card-hover': isHover
  }">
    <div role="presentation" class="m-listing-card-media | relative">
      <LazyMoleculesCarousel :slides="carouselImages" hydrate-on-interaction="mouseover"
        class="m-listing-card-media-carousel m-listing-card-outline" v-slot="{ slide: { src, alt } }">
        <img :src :alt class="m-listing-card-carousel-image" />
      </LazyMoleculesCarousel>
    </div>

    <MoleculesListingCardButtons class="m-listing-card-buttons-parent" />

    <div class="| flow flow-lg" role="presentation">
      <ul class="m-listing-card-icons">
        <li class="| font-semibold body-xs" v-for="{ icon, label } of iconOptions">
          <AtomsIcon :icon aria-hidden="true" class="m-listing-card-icon" />
          {{ label }}
        </li>
      </ul>

      <NuxtLink :to="propertyUrl" role="presentation" class="m-listing-card-link">
        <h3 class="m-listing-card-price | title-md">{{ priceFormatted }}</h3>

        <p class="m-listing-card-address | body-sm font-bold">
          {{ addressString }}
        </p>
      </NuxtLink>

      <div role="presentation">
        <Transition name="content">
          <div class="m-list-card-expanding m-listing-card-outline | flow flow-md" role="presentation" v-if="isHover">
            <LazyMoleculesTabs class="m-listing-card-content-tabs" :options="tabContent" v-slot="{ content }">
              <p class="| body-sm">{{ content }}</p>
            </LazyMoleculesTabs>

            <MoleculesListingCardAgent />
          </div>
        </Transition>
      </div>
    </div>

    <Transition name="backdrop">
      <div v-if="isHover" class="m-listing-card-backdrop" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useElementHover, onClickOutside } from '@vueuse/core'

/**
 *  Props
 */
interface Props {
  image?: Record<string, unknown>[]
  address?: Record<string, unknown>
  price?: number
  bedrooms?: number
  bathrooms?: number
  description?: string
  propertyId: number
  propertyType?: string
}

const props = defineProps<Props>()

/**
 *  Manage hover state
 */
const $root = useTemplateRef('$root')

const isHover = useElementHover($root, { delayEnter: 200 })

function forceHover() {
  isHover.value = true
}

function removeHover() {
  isHover.value = false
}

onClickOutside($root, removeHover)

/**
 *  Format content
 */
const carouselImages = computed(() => {
  const { image = [] } = props

  return Array.from({ length: 3 }).map(() => {
    const [firstImage] = image

    return {
      src: firstImage?.image,
      alt: firstImage?.metadata
    }
  })
})

const priceFormatted = computed(() => {
  const { price = 0 } = props

  return `£${parseInt(String(price)).toLocaleString()}`
})

const addressString = computed(() => {
  const { street, city, postcode } = asObject(props.address)

  return [street, city, postcode].filter(Boolean).join(', ')
})

const propertyUrl = computed(() => {
  const { propertyId } = props

  return `/listing/${propertyId}`
})

const tabContent = computed(() => {
  return [
    { label: 'Description', content: props.description },
    { label: 'Features', content: 'See all features (list format)' },
    { label: 'Amenities', content: 'The amenities, wow! (list format)' },
  ]
})

const iconOptions = computed(() => {
  const { propertyType, bedrooms, bathrooms } = props

  return [
    { icon: 'cards/property-type', label: `${propertyType}` },
    { icon: 'cards/beds', label: `${bedrooms} beds` },
    { icon: 'cards/bathrooms', label: `${bathrooms} bathrooms` }
  ]
})

</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;
@use '#styles/_utils/media' as mq;

.m-listing-card {
  --listing-card-background: var(--background-100);
  --listing-card-boxshadow: #{ fn.faded-color(18%) };
  --listing-card-outline: var(--size-14);
  --listing-card-padding: var(--size-40);
  --listing-card-width: calc(100% + (2 * var(--listing-card-padding)));

  position: relative;
  text-align: center;
  max-width: 400px;
  background: var(--listing-card-background);
}

.m-listing-card-hover {
  z-index: 2;
}

/**
 *  Media hoverstate
 */
.m-listing-card-media {
  aspect-ratio: 4 / 3;
}

.m-listing-card-media-carousel {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  transition-property: width;
  transition-duration: var(--animation-veryslow);
  transition-timing-function: var(--ease-out);
}

.m-listing-card-hover .m-listing-card-media-carousel {
  width: var(--listing-card-width);
}

.m-listing-card-carousel-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--border-radius-2xl);
}

/**
 *  Notes, Favourite buttons
 */
.m-listing-card-buttons-parent {
  margin: 0 auto calc(0px - var(--size-8));
  position: relative;
  z-index: 2;
  transform: translateY(-50%);
  transition: transform var(--animation-veryslow) var(--ease-out);
}

/**
 *  Icons
 */
.m-listing-card-icons {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  justify-content: center;
  gap: var(--size-20);
  text-align: center;
  width: fit-content;
  padding: 0;
  margin-inline: auto;
}

.m-listing-card-icon {
  width: var(--size-32);
  height: var(--size-32);
  margin: 0 auto var(--size-6);
  color: fn.faded-color(33%);
}

/**
 *  Title and prive
 */
.m-listing-card-price,
.m-listing-card-address {
  max-width: 22ch;
  margin-inline: auto;
}

.m-listing-card-price {
  margin-bottom: var(--size-6);
}

.m-listing-card-link {
  display: block;
  text-decoration: none;
}

.m-listing-card-expand-button {
  @include mq.hover {
    display: none;
  }
}

/**
 *  Expanding content
 */
.m-list-card-expanding {
  interpolate-size: allow-keywords;

  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  height: calc-height(max-content, size);
  width: calc(var(--listing-card-width));
  background: var(--listing-card-background);
}

/**
 *  Animate tabs to reduce CLS
 */
.m-listing-card-content-tabs {
  interpolate-size: allow-keywords;

  transition-property: height, opacity;
  transition-duration: var(--animation-slow);
  transition-timing-function: var(--ease-out);
  transition-delay: var(--animation-slow);
  height: calc-height(max-content, size);
}

@starting-style {
  .m-listing-card-content-tabs {
    opacity: 0;
    height: 0;
  }
}

/**
 *  Backdrop
 */
.m-listing-card-backdrop {
  background: var(--listing-card-background);
  position: absolute;
  top: 0;
  left: 50%;
  width: calc(var(--listing-card-width) + (2 * var(--listing-card-outline)));
  height: calc(100% + var(--border-radius-2xl));
  transform: translateX(-50%);
  z-index: -1;
  box-shadow: 0 0 20px var(--listing-card-boxshadow);
}

.m-listing-card-outline::before {
  content: '';
  position: absolute;
  top: calc(0px - var(--listing-card-outline));
  left: calc(0px - var(--listing-card-outline));
  right: calc(0px - var(--listing-card-outline));
  bottom: calc(0px - var(--listing-card-outline));
  background: var(--listing-card-background);
  border-radius: var(--border-radius-2xl);
  z-index: -2;
  box-shadow: 0 20px 20px var(--listing-card-boxshadow);
}

.m-listing-card-media-carousel.m-listing-card-outline::before {
  box-shadow: none;
}

/**
 *  View transitions
 *  Title and prive
 */
.content-enter-active,
.content-leave-active {
  transition-property: width;
  transition-duration: var(--animation-veryslow);
  transition-timing-function: var(--ease-out);
}

.content-leave-to,
.content-enter-from {
  opacity: 0;
  width: 100%;
}

.backdrop-enter-active,
.backdrop-leave-active {
  transition-property: width;
  transition-duration: var(--animation-veryslow);
  transition-timing-function: var(--ease-out);
}

.backdrop-leave-to,
.backdrop-enter-from {
  width: 100%;
}
</style>