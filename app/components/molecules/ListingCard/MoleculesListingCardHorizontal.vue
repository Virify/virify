<template>
  <div ref="$root" :id="controlsId" class="m-listing-card-horizontal | relative" :class="{
    'm-listing-card-hover': isHover
  }" @mouseleave="removeHover">
    
    <div role="presentation" class="m-listing-card-media-horizontal | relative">
      <!-- Tier Banner -->
      <div v-if="tierTab && !isHover" :class="`${tierTab.class} | body-md font-semibold`">{{ tierTab.label }}</div>
      <div class="m-listing-card-media-carousel-wrapper | relative">
        <LazyMoleculesCarousel :slides="carouselImages" hydrate-on-interaction="mouseover"
          class="m-listing-card-media-carousel m-listing-card-outline" v-slot="{ slide: { src, alt } }">
          <nuxt-link :to="propertyUrl" class="relative">
            <img :src="src" :alt="alt" class="m-listing-card-carousel-image" width="400" height="300" loading="lazy" />
          </nuxt-link>
        </LazyMoleculesCarousel>
      </div>
    </div>

    <div class="m-listing-card-content-horizontal | flow flow-md">
      <div class="m-listing-card-header-horizontal">
        <nuxt-link :to="propertyUrl" class="m-listing-card-link">
          <h3 class="m-listing-card-price | title-lg">{{ priceFormatted }}</h3>
          <p class="m-listing-card-price-type | body-xs">
            {{ convertEnumToString(priceType) }}
          </p>
          <p class="m-listing-card-address | body-md font-bold">
            {{ addressString }}
          </p>
        </nuxt-link>

        <div class="m-listing-card-buttons-horizontal">
          <MoleculesListingCardButtons :controls-id="controlsId" :is-expanded="isHover" :property-id @toggle-content="toggleHover" />
        </div>
      </div>

      <ul class="m-listing-card-icons-horizontal">
        <li class="| font-semibold body-xs" v-for="{ icon, label } of iconOptions">
          <AtomsIcon :icon="icon" aria-hidden="true" class="m-listing-card-icon" />
          {{ label === 'Student Accommodation' ? 'Student' : label }}
        </li>
      </ul>

    </div>

    <Transition name="backdrop">
      <div v-if="isHover" class="m-listing-card-backdrop"></div>
    </Transition>
    
    <!-- Expanding Content - Below Card for Horizontal Layout -->
    <Transition name="content">
      <div v-if="isHover" class="m-list-card-expanding-horizontal | flow flow-lg" role="presentation">
        <LazyMoleculesListingCardTabs :description="description" />
        <MoleculesListingCardAgent agent-id="001" />
      </div>
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

.m-listing-card-horizontal {
  --listing-card-background: var(--background-100);
  --listing-card-boxshadow: #{ fn.faded-color(18%) };
  --listing-card-outline: var(--size-14);
  --listing-card-padding: var(--size-40);
  --listing-card-width: calc(100% + (2 * var(--listing-card-padding)));

  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--size-16);
  position: relative;
  background: var(--listing-card-background);
  height: fit-content;
  z-index: 1;
  width: 100%;
  text-align: left;
  border-radius: var(--border-radius-md);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: var(--size-16);
}

.m-listing-card-hover {
  z-index: 2;
}

/**
 *  Media styling for horizontal layout
 */
.m-listing-card-media-horizontal {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  position: relative;
  z-index: 1;
  max-width: 300px;
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

.m-listing-card-content-horizontal {
  display: flex;
  flex-direction: column;
  padding: var(--size-16);
  justify-content: space-between;
}

.m-listing-card-header-horizontal {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.m-listing-card-buttons-horizontal {
  display: flex;
  align-items: center;
  gap: var(--size-8);
}

/**
 *  Icons horizontal layout
 */
.m-listing-card-icons-horizontal {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-16);
  list-style: none;
  padding: 0;
  margin: var(--size-12) 0;
}

.m-listing-card-icons-horizontal li {
  display: flex;
  align-items: center;
  gap: var(--size-6);
}

.m-listing-card-icon {
  width: var(--size-20);
  height: var(--size-20);
  color: fn.faded-color(33%);
}

/**
 *  Title and price
 */
.m-listing-card-price,
.m-listing-card-address,
.m-listing-card-price-type {
  margin-bottom: var(--size-4);
}

.m-listing-card-price {
  margin-bottom: var(--size-2);
}

.m-listing-card-price-type {
  margin-top: -5px;
}

.m-listing-card-address {
  margin-top: var(--size-6);
}

.m-listing-card-link {
  display: block;
  text-decoration: none;
}

/**
 *  Expanding content
 */
.m-list-card-expanding {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: var(--listing-card-background);
  z-index: 10;
}

/* Horizontal card expanded content */
.m-list-card-expanding-horizontal {
  position: relative;
  width: 100%;
  background: var(--listing-card-background);
  margin-top: var(--size-12);
  padding: var(--size-20);
  border-radius: var(--border-radius-md);
  box-shadow: 0 6px 16px var(--shadow-subtle);
  z-index: 10;
}

.m-listing-card-carousel-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--border-radius-lg);
  transition: transform 0.3s ease;
}

.m-listing-card-media-carousel-wrapper:hover .m-listing-card-carousel-image {
  transform: scale(1.05);
}

/**
 *  Responsive adjustments
 */
@media (max-width: 800px) {
  .m-listing-card-horizontal {
    grid-template-columns: 1fr;
    gap: var(--size-8);
  }
  
  .m-listing-card-media-horizontal {
    max-width: 100%;
    min-height: 250px;
  }
  
  .m-listing-card-carousel-image {
    height: 100%;
    width: 100%;
  }
}

/**
 *  Backdrop
 */
.m-listing-card-backdrop {
  background: var(--listing-card-background);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  box-shadow: 0 0 20px var(--listing-card-boxshadow);
  border-radius: var(--border-radius-md);
}

/* Transitions for hover effects */
.content-enter-active,
.content-leave-active {
  transition: all 0.3s ease;
}

.content-enter-from,
.content-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.backdrop-enter-active,
.backdrop-leave-active {
  transition: all 0.2s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}
</style>
