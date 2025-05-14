<template>
  <div ref="$root" :id="controlsId" class="m-listing-card | relative" :class="{
    'm-listing-card-hover': isHover
  }" @mouseleave="removeHover">
    
    <div role="presentation" class="m-listing-card-media | relative">
      <!-- Tier Banner -->
      <div v-if="tierTab && !isHover" :class="`${tierTab.class} | body-md font-semibold`">{{ tierTab.label }}</div>
      <div class="m-listing-card-media-carousel-wrapper | relative">
        <LazyMoleculesCarousel :slides="carouselImages" hydrate-on-interaction="mouseover"
          class="m-listing-card-media-carousel m-listing-card-outline" v-slot="{ slide: { src, alt } }">
          <nuxt-link :to="propertyUrl" class="relative">
            <img :src :alt class="m-listing-card-carousel-image" width="400" height="300" loading="lazy" />
          </nuxt-link>
        </LazyMoleculesCarousel>
      </div>
    </div>

    <MoleculesListingCardButtons :controls-id="controlsId" class="m-listing-card-buttons-parent" :is-expanded="isHover"
      :property-id @toggle-content="toggleHover" />

    <div class="| flow flow-lg" role="presentation">
      <ul class="m-listing-card-icons">
        <li class="| font-semibold body-xs" v-for="{ icon, label } of iconOptions">
          <AtomsIcon :icon="icon" aria-hidden="true" class="m-listing-card-icon" />
          {{ label === 'Student Accommodation' ? 'Student' : label }}
        </li>
      </ul>

      <nuxt-link :to="propertyUrl" class="m-listing-card-link">
        <h3 class="m-listing-card-price | title-lg">{{ priceFormatted }}</h3>
        <p class="m-listing-card-price-type | body-xs">
          {{ convertEnumToString(priceType) }}
        </p>
        <p class="m-listing-card-address | body-md font-bold">
          {{ addressString }}
        </p>
      </nuxt-link>

      <Transition name="content">
        <div class="m-list-card-expanding m-listing-card-outline | flow flow-md" role="presentation" v-if="isHover">
          <div class="m-listing-card-ribbon m-listing-card-ribbon--expanded | body-md font-semibold">Featured</div>
          <LazyMoleculesListingCardTabs :description />
          <MoleculesListingCardAgent agent-id="001" />
        </div>
      </Transition>
    </div>

    <Transition name="backdrop">
      <div v-if="isHover" class="m-listing-card-backdrop"></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { RentalPriceType, SalePriceType } from '@prisma/client'
import { useElementHover, onClickOutside } from '@vueuse/core'

/**
 *  Props
 */
interface Props {
  image?: Record<string, unknown>[]
  address?: Record<string, unknown>
  price?: number
  priceType?: SalePriceType | RentalPriceType
  bedrooms?: number | undefined | null
  bathrooms?: number | undefined | null
  description: string
  propertyId: number
  propertyType?: string
  classification?: string
  listingTier?: string
}
const props = defineProps<Props>()

const tierTab = computed(() => {
  if (props.listingTier === 'FEATURED') {
    return { label: 'Featured', class: 'm-listing-card-tab' }
  }
  if (props.listingTier === 'PREMIUM') {
    return { label: 'Premium', class: 'm-listing-card-tab m-listing-card-tab-premium' }
  }
  return null
})


/**
 *  a11y
 */
const controlsId = useId()

/**
 *  Manage hover state
 */
const isHover = ref(false);

function toggleHover(value: boolean) {
  isHover.value = value
}

function removeHover() {
  isHover.value = false
}

onClickOutside(useTemplateRef('$root'), removeHover)

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

/**
 * Map classification to icon
 */
const getClassificationIcon = (classification: string | undefined) => {
  // Map of classifications to icons
  const iconMappings: Record<string, string> = {
    'Terraced': 'property/terraced',
    'Semi-detached': 'property/terraced',
    'End of terrace': 'property/terraced',
    'Detached': 'property/detatched',
    'Mansion': 'property/mansion',
    'Cottage': 'property/cottage',
    'Bungalow': 'property/bungalow',
    'Converted flat': 'property/flat',
    'Studio flat': 'property/flat',
    'Maisonette': 'property/flat',
    'High-rise': 'property/flat',
    'Within a complex': 'property/flat',
    'Penthouse': 'property/flat',
    'Land': 'property/land',
    'Residential Land': 'property/land',
    'Commercial Land': 'property/land',
    'Agricultural Land': 'property/land',
    'Development plot': 'property/land',
    'Development potential': 'property/land',
    'Non-working Farmhouse': 'property/farm',
    'Working Farm': 'property/farm',
    'Small Holding': 'property/farm',
    'Shared Ownership': 'property/shared',
    'Retirement Home': 'property/other',
    'New Build Home': 'property/newbuild',
    'Student Accommodation': 'property/other',
    'House': 'property/house',
    'House-share': 'property/shared',
  }

  return classification && iconMappings[classification] ? iconMappings[classification] : 'property/other'
}

/**
 * Map property type to icon
 */
const getPropertyTypeIcon = (propertyType: string | undefined) => {
  // Map of property types to icons
  const iconMappings: Record<string, string> = {
    'House': 'property/house',
    'Cottage': 'property/cottage',
    'Bungalow': 'property/bungalow',
    'Flat': 'property/flat',
    'Land': 'property/land',
    'Farms': 'property/farm',
    'Farm': 'property/farm',
    'Specialty': 'property/other',
    'Student Accommodation': 'property/shared',
    'Shared Ownership': 'property/shared',
    'New Build': 'property/newbuild',
    'Retirement': 'property/other',
    'Terraced': 'property/terraced',
    'Detached': 'property/detatched',
    'Semi-detached': 'property/terraced',
    'Mansion': 'property/mansion',
  }

  return propertyType && iconMappings[propertyType] ? iconMappings[propertyType] : 'property/other'
}

const iconOptions = computed(() => {
  const { propertyType, bedrooms, bathrooms, classification } = props

  return [
    { icon: getPropertyTypeIcon(propertyType), label: `${propertyType || 'Property'}` },
    { icon: getClassificationIcon(classification), label: `${classification || 'Classification'}` },
    { icon: 'cards/beds', label: `${bedrooms} beds` },
    { icon: 'cards/bathrooms', label: `${bathrooms} bathrooms` },
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
  height: fit-content;
  z-index: 1;
}

.m-listing-card-hover {
  z-index: 2;
}

/**
 *  Media hoverstate
 */
.m-listing-card-media {
  aspect-ratio: 4 / 3;
  overflow: visible;
  position: relative;
  z-index: 1;
}

.m-listing-card-tab {
  position: absolute;
  top: 0;
  left: 0;
  width: 30%;
  padding: var(--size-8);
  background: var(--secondary-400);
  color: var(--monochrome-900);
  border-radius: 0 0 8px 0;
  z-index: 3;
  pointer-events: none;
}

.m-listing-card-tab-premium {
  background: var(--primary-200);
}

.m-listing-card-hover .m-listing-card-tab {
  top: 12px;
  left: 12px;
  width: auto;
  min-width: 100px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 8px;
  transition: all var(--animation-veryslow) var(--ease-out);
}

.m-listing-card-media-carousel-wrapper {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  overflow: visible;
}

.m-listing-card-media-carousel {
  width: 100%;
  transition-property: width;
  transition-duration: var(--animation-veryslow);
  transition-timing-function: var(--ease-out);
}

.m-listing-card-hover .m-listing-card-media-carousel-wrapper {
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
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, auto);
  align-items: top;
  justify-content: center;
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
.m-listing-card-address,
.m-listing-card-price-type {
  max-width: 22ch;
  margin-inline: auto;
}

.m-listing-card-price {
  margin-bottom: var(--size-6);
}

.m-listing-card-price-type {
  margin-top: -5px;
  padding-bottom: var(--size-12);
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

.backdrop-leave-active {
  box-shadow: none;
}

.backdrop-leave-to,
.backdrop-enter-from {
  width: 100%;
}
</style>