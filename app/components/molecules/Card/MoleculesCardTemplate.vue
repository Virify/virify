<template>
  <div class="m-card-template__container">
    <div class="m-card-template" :class="{
      'm-card-template--basic': isBasic,
      'm-card-template--featured': isFeatued,
      'm-card-template--premium': isPremium
    }">
      <div class="m-card-template__gallery">
        <slot name="carousel">
          <div class="m-card-template__gallery-img">
            Carousel (Base)
          </div>
        </slot>
      </div>

      <div class="m-card-template__content">
        <slot name="content" v-bind="{ price, priceGuide, fullAddress, propertyType, roomCounts, pills, propertyId }">
          <MoleculesCardSlotsViewLink :property-id>
            <MoleculesCardSlotsPrice :price :price-guide />
            <MoleculesCardSlotsOverview :property-type :full-address />
            <MoleculesCardSlotsIcons :room-counts />
          </MoleculesCardSlotsViewLink>
          <MoleculesCardSlotsPills v-if="pills.length" :pills />
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
const isFeatued = computed(() => props.variant === 'basic')
const isPremium = computed(() => props.variant === 'premium')
const isBasic = computed(() => !isFeatued.value && !isPremium.value)

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

</script>

<style lang="scss">
.m-card-template__container {
  container-type: inline-size;
  display: flex;
}

.m-card-template {
  --card-foreground: var(--foreground-200);
  --card-background: var(--background-200);
  --card-background-overlay: var(--background-300);
  --card-colour: var(--blue-400);
  --card-border-colour: var(--border-color-200);
  --card-button-background: var(--blue-400);
  --card-button-foreground: var(--monochrome-900);
  --card-button-background-hover: var(--blue-200);
  --card-button-foreground-hover: var(--monochrome-900);
  --card-button-border-colour: var(--blue-400);

  padding: var(--size-8);
  color: var(--card-foreground);
  background-color: var(--card-background);
  border: 1px solid var(--card-border-colour);
  border-radius: var(--border-radius-2xl);
  box-shadow: var(--elevate-200);
  box-sizing: border-box;
  display: grid;
  align-items: stretch;
  gap: var(--size-8);
  flex-grow: 1;

  @container (width > 600px) {
    grid-template-columns: 1.2fr minmax(20ch, 1fr);
  }

  &--featured {
    --card-colour: var(--secondary-500);
    --card-background: var(--secondary-800);
    --card-background-overlay: var(--secondary-700);
    --card-border-colour: var(--secondary-700);
    --card-button-background: var(--secondary-400);
    --card-button-foreground: var(--monochrome-100);
    --card-button-background-hover: var(--secondary-500);
    --card-button-foreground-hover: var(--monochrome-100);
    --card-button-border-colour: var(--secondary-400);

    box-shadow: none;
  }

  &--premium {
    --card-foreground: var(--monochrome-900);
    --card-colour: var(--primary-400);
    --card-background: var(--blue-400);
    --card-background-overlay: var(--blue-300);
    --card-border-colour: var(--blue-500);
    --card-button-background: var(--primary-400);
    --card-button-foreground: var(--monochrome-100);
    --card-button-background-hover: var(--primary-600);
    --card-button-foreground-hover: var(--monochrome-100);
    --card-button-border-colour: var(--primary-400);

    border: 4px solid var(--primary-500);
    box-shadow: none;
  }

  &__gallery {
    background: var(--monochrome-300);
    border-radius: var(--border-radius-xl);
    display: flex;
    align-items: center;
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
   *  DEBUG
   *  @TODO remove this when carousel goes in
   */
  &__gallery-img {
    background: var(--monochrome-300);
    border-radius: var(--border-radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--size-16);
    box-sizing: border-box;
    aspect-ratio: 4/3;
    color: var(--monochrome-900);
    flex-grow: 1;
  }
}
</style>