<template>
  <div class="m-card-template__container">
    <div class="m-card-template" :class="{
      'm-card-template--basic': isBasic,
      'm-card-template--featured': isFeatured,
      'm-card-template--premium': isPremium
    }">
      <span class="m-card-template__corner-badge | body-xs font-semibold" v-if="isFeatured">
        Featured
      </span>

      <div class="m-card-template__gallery">
        <slot name="carousel">
          <MoleculesCardSlotsCarousel />
        </slot>
      </div>

      <div class="m-card-template__content">
        <slot name="content"
          v-bind="{ price, priceGuide, fullAddress, propertyType, roomCounts, pills, propertyId, description, premiumFeatures }">
          <div class="m-card-template__content-grid">
            <MoleculesCardSlotsViewLink :property-id class="m-card-template__content-subgrid">
              <MoleculesCardSlotsPrice :price :price-guide />
              <MoleculesCardSlotsOverview :property-type :full-address />
              <MoleculesCardSlotsIcons :room-counts />
            </MoleculesCardSlotsViewLink>

            <MoleculesCardSlotsPills v-if="pills.length" :pills />
          </div>
        </slot>

        <div role="presentation" class="m-card-template__footer">
          <slot name="footer" v-bind="{ user, propertyId }">
            <MoleculesCardSlotsProfile :user />
            <MoleculesCardSlotsButtons :property-id />
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPremiumFeatures } from '~/utils/results/premium-features';

interface Props {
  result: ListingCardData
  variant?: 'basic' | 'featured' | 'premium'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'basic'
})

/**
 *  Check variants
 */
const isFeatured = computed(() => props.variant === 'basic')
const isPremium = computed(() => props.variant === 'premium')
const isBasic = computed(() => !isFeatured.value && !isPremium.value)

/**
 *  Break down listing card data
 */
const { property } = toRefs(props.result)

const user = computed(() => {
  const { user } = asObject(props.result)

  return user
})

const propertyId = computed(() => {
  const { id } = asObject(props.result)

  return id
})

const price = computed(() => {
  const { price } = asObject(props.result)

  return numberToCurrency(Math.floor(price))
})

const priceGuide = computed(() => {
  const { priceType } = asObject(props.result?.saleListing)

  if (priceType === 'OFFERS_OVER') return 'Offers over'
  if (priceType === 'GUIDE_PRICE') return 'Guide price'

  return 'Fixed'
})

const fullAddress = computed(() => {
  const { fullAddress } = asObject(property.value?.address)

  return fullAddress
})

const propertyType = computed(() => {
  const { numberBedrooms, type, classification } = asObject(property.value)
  const { name: propertyType } = asObject(type)
  const { name: propertyClassification } = asObject(classification)

  const propertyDescription = `${propertyClassification} ${propertyType}`

  if (!!numberBedrooms) {
    return `${numberBedrooms} Bed ${propertyDescription}`
  }

  return propertyDescription
})

const roomCounts = computed(() => {
  const { numberBedrooms, numberBathrooms, numberReceptions } = asObject(property.value)

  return {
    beds: numberBedrooms,
    baths: numberBathrooms,
    receptions: numberReceptions
  }
});

const pills = computed(() => {
  const { chain, tenureType } = asObject(props.result?.saleListing)

  // Create empty pills object
  const pills: string[] = []

  // Extract info from saleListing
  const tenureString = getTenureType(tenureType)

  // Add relevant info to pills
  if (tenureString) pills.push(tenureString)
  if (chain) pills.push('Chain free')

  // Return
  return pills
})

const description = computed(() => {
  const { description = '--' } = asObject(props.result)

  return description
})

const premiumFeatures = computed(() => {
  const { result } = props

  return asArray(getPremiumFeatures(result, 16))
})

</script>

<style lang="scss">
.m-card-template__container {
  container-type: inline-size;
  display: flex;
}

.m-card-template {
  --card-foreground: var(--foreground-100);
  --card-background: var(--background-200);
  --card-background-overlay: light-dark(var(--background-300), var(--background-200));
  --card-background-pill: light-dark(var(--background-300), var(--background-200));
  --card-colour: var(--blue-400);
  --card-border-colour: light-dark(var(--border-color-200), var(--border-color-300));
  --card-button-background: light-dark(var(--blue-400), var(--monochrome-900));
  --card-button-foreground: light-dark(var(--monochrome-900), var(--monochrome-100));
  --card-button-background-hover: light-dark(var(--blue-200), var(--blue-800));
  --card-button-foreground-hover: light-dark(var(--monochrome-900), var(--monochrome-100));
  --card-button-border-colour: light-dark(var(--blue-400), var(--monochrome-900));

  position: relative;
  padding: var(--size-8);
  color: var(--card-foreground);
  background-color: var(--card-background);
  border: 2px solid var(--card-border-colour);
  border-radius: var(--border-radius-3xl);
  box-sizing: border-box;
  display: grid;
  align-items: stretch;
  gap: var(--size-8);
  flex-grow: 1;
  overflow: hidden;

  &--basic {
    box-shadow: var(--elevate-200);
  }

  &--featured {
    --card-colour: var(--secondary-500);
    --card-background: var(--background-200);
    --card-background-overlay: light-dark(var(--secondary-800), var(--background-200));
    --card-background-pill: light-dark(var(--secondary-800), var(--background-200));
    --card-border-colour: var(--secondary-600);
    --card-button-background: var(--secondary-400);
    --card-button-foreground: var(--monochrome-100);
    --card-button-background-hover: var(--secondary-500);
    --card-button-foreground-hover: var(--monochrome-100);
    --card-button-border-colour: var(--secondary-400);
  }

  @container (width > 750px) {

    &--basic,
    &--featured {
      grid-template-columns: 1.2fr minmax(20ch, 1fr);
    }

    &--basic &__gallery,
    &--featured &__gallery {
      align-items: center;
    }
  }

  &--premium {
    --card-foreground: var(--monochrome-900);
    --card-colour: var(--primary-400);
    --card-background: var(--blue-400);
    --card-background-overlay: var(--blue-300);
    --card-background-pill: var(--blue-400);
    --card-border-colour: var(--blue-600);
    --card-button-background: var(--primary-400);
    --card-button-foreground: var(--monochrome-100);
    --card-button-background-hover: var(--primary-600);
    --card-button-foreground-hover: var(--monochrome-100);
    --card-button-border-colour: var(--primary-400);

    border: 4px solid var(--primary-500);

    @container (width > 900px) {
      grid-template-columns: 1.2fr minmax(20ch, 1fr);
    }
  }

  &__corner-badge {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--card-button-background);
    color: var(--card-button-foreground);
    z-index: 2;
    text-transform: uppercase;
    width: 15em;
    height: var(--size-32);
    text-align: center;
    transform: translate(-4.5em, 2em) rotate(-45deg);
    pointer-events: none;
  }

  &__gallery {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: var(--size-12);
  }

  &__footer {
    margin-top: auto;
  }

  /**
   *  Support container queries for each slot
   */
  &__gallery,
  &__content,
  &__footer {
    container-type: inline-size;
  }

  /**
   *  Default layout
   */
  @container (width <=420px) {
    &__content-grid {
      margin: 0 0 var(--size-10);
    }
  }

  @container (width > 420px) {
    &__content-grid {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: flex-start;
      justify-content: flex-start;
      column-gap: var(--size-24);
      margin: 0;

      >.m-card-lots-view-link {
        display: contents;
      }

      .m-cards-slots-price {
        flex-direction: column-reverse;
        justify-content: flex-start;
        align-items: flex-start;
      }

      .m-card-lots-pills,
      .m-cards-slots-icons {
        margin: 0;
      }
    }
  }
}
</style>