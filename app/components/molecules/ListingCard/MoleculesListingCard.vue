<template>
  <div ref="$root" class="m-listing-card | relative" :class="{
    'm-listing-card-hover': isHover
  }">
    <div role="presentation" class="m-listing-card-media | relative">
      <Transition name="image">
        <LazyMoleculesListingCardCarousel v-if="isHover" class="m-listing-card-media-carousel" hydrate-on-visible
          :src="imageSrc" :alt="imageAlt" />

        <button v-else type="button" @click.prevent="forceHover" class="m-listing-card-media-toggle | button-none">
          <MoleculesListingCardImage :src="imageSrc" :alt="imageAlt" class="m-listing-card-media-image" />
        </button>
      </Transition>
    </div>

    <MoleculesListingCardButtons class="m-listing-card-buttons-parent" />

    <div class="| flow flow-lg" role="presentation">
      <ul class="m-listing-card-icons">
        <li class="| font-semibold body-xs nowrap" v-for="{ icon, label } of iconOptions">
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
          <div class="m-list-card-expanding | flow flow-md" role="presentation" v-if="isHover">
            <LazyMoleculesTabs class="m-listing-card-content-tabs" :options="tabContent" v-slot="{ content }">
              <p class="| body-sm">{{ content }}</p>
            </LazyMoleculesTabs>

            <div class="m-listing-card-content-agent">
              Agent Details
            </div>
          </div>
        </Transition>
      </div>
    </div>
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
const imageSrc = computed(() => props.image?.[0]?.image as string)
const imageAlt = computed(() => props.image?.[0]?.metadata as string)

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
  --listing-card-padding: var(--size-40);
  --listing-card-width: calc(100% + (2 * var(--listing-card-padding)));

  position: relative;
  text-align: center;
  max-width: 400px;
}

.m-listing-card-hover {
  z-index: 2;
}

/**
 *  Media hoverstate
 */
.m-listing-card-media {
  aspect-ratio: 4 /3;
}

.m-listing-card-media-toggle {
  width: 100%;
}

.m-listing-card-media-image {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.m-listing-card-media-carousel {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: var(--listing-card-width);
  z-index: 2;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-24);
  text-align: center;
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
 *  Tab fade animation
 */
.m-list-card-expanding {
  interpolate-size: allow-keywords;

  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  transition: height, margin;
  transition-duration: var(--animation-veryslow);
  transition-timing-function: var(--ease-out);
  transition-delay: var(--delay, 0ms);
  overflow-y: clip;
  height: calc-height(max-content, size);
  width: calc(var(--listing-card-width));
}

@starting-style {
  .m-list-card-expanding {
    height: 0;
  }
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
  overflow-y: clip;
  height: calc-height(max-content, size);
}

@starting-style {
  .m-listing-card-content-tabs {
    opacity: 0;
    height: 0;
  }
}

/**
 *  Agent tab
 */
.m-listing-card-content-agent {
  padding: var(--size-12);
  background: var(--blue-400);
  color: var(--monochrome-900);
  border-radius: var(--border-radius-xl);

  @include mq.hover {
    margin-top: var(--size-32);
  }
}

/**
 *  View transitions
 *  Title and prive
 */
.image-enter-active,
.image-leave-active {
  transition-property: width;
  transition-duration: var(--animation-veryslow);
  transition-timing-function: var(--ease-out);
}

.image-leave-to,
.image-enter-from {
  width: 100%;
}

.content-enter-active,
.content-leave-active {
  transition-property: width, box-shadow;
  transition-duration: var(--animation-veryslow);
  transition-timing-function: var(--ease-out);
}

.content-leave-to,
.content-enter-from {
  opacity: 0;
  width: 100%;
}
</style>