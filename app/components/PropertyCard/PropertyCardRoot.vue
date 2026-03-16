<template>
  <section class="property-card-root">
    <div class="property-card-root__images">
      <img v-if="propertyImage" class="property-card-root__image" :src="propertyImage" :alt="propertyImageAlt"
        width="491" height="368" loading="lazy" />

      <PropertyCardInteractions :disabled="disabledInteractions" class="property-card-root__interactions" />
    </div>

    <div class="property-card-root__content | flow flow-sm" role="presentation">
      <h2 class="property-card-root__price | title-md">
        {{ price }}

        <PropertyCardPill v-if="priceLabel" :content="priceLabel" variant="orange" />
      </h2>

      <p class="property-card-root__overview">
        <strong class="property-card-root__overview-address">
          {{ overview }}
        </strong>
        {{ overviewAddress }}
      </p>

      <MoleculesScrollBox v-if="labels?.length">
        <ul class="property-card-root__labels">
          <li v-for="label of labels" :key="label">
            <PropertyCardPill :content="label" />
          </li>
        </ul>
      </MoleculesScrollBox>

      <MoleculesScrollBox v-if="icons?.length">
        <ul class="property-card-root__icons">
          <li v-for="{ icon, count, label } of validIcons" :key="label" class="property-card-root__icon | body-2xs">
            <span class="property-card-root__icon-count | body-sm">
              <AtomsIcon :icon aria-hidden />
              {{ count }}
            </span>

            {{ label }}
          </li>
        </ul>
      </MoleculesScrollBox>

      <div class="property-card-root__buttons" aria-role="presentation">
        <component :is="viewComponent" :href="viewURL"
          class="property-card-root__button property-card-root__button--view | body-sm">
          View
        </component>

        <component :is="enquiryComponent" :href="enquiryURL"
          class="property-card-root__button property-card-root__button--enquire | body-sm">
          Enquire
        </component>
      </div>

      <div v-if="sellerName" class="property-card-root__profile | body-xs" aria-role="presentation">
        <img v-if="sellerImage" :src="sellerImage" :alt="`Profile image for ${sellerName}`"
          class="property-card-root__profile-image" />
        <span v-else aria-hidden class="property-card-root__profile-image property-card-root__profile-image--empty">
          <AtomsIcon icon="profile" />
        </span>

        {{ profileText }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface FacilitiesIcon {
  icon: string
  label: string
  count?: number
}

interface Props {
  saleOrRent?: 'sale' | 'rent'
  propertyImage?: string
  propertyImageAlt?: string
  disabledInteractions?: boolean
  price?: string
  priceLabel?: string
  overview?: string
  overviewAddress?: string
  labels?: string[]
  icons?: FacilitiesIcon[]
  sellerImage?: string
  sellerName?: string
  viewURL?: string
  enquiryURL?: string
}

const props = defineProps<Props>()

/**
 *  Conditionally show as links
 */
function getLinkComponent(url?: string): 'a' | 'span' {
  return isString(url) ? 'a' : 'span'
}

const viewComponent = computed(() => getLinkComponent(props.viewURL))
const enquiryComponent = computed(() => getLinkComponent(props.enquiryURL))

/**
 *  Format profile text
 */
const profileText = computed(() => {
  const { saleOrRent, sellerName } = props

  switch (saleOrRent) {
    case 'sale':
      return `Sold by ${sellerName}`
    case 'rent':
      return `Let by ${sellerName}`
    default:
      return `By ${sellerName}`
  }
})

/**
 *  Ensure icons are valid
 */
const validIcons = computed(() => {
  const { icons } = props

  return asArray(icons).filter((icon: FacilitiesIcon) => {
    return isObject(icon) && isString(icon.label) && isString(icon.icon)
  })
})

</script>

<style lang="scss">
.property-card-root {
  position: relative;

  &__images,
  &__image {
    width: 100%;
    aspect-ratio: 4/3;
  }

  &__images {
    position: relative;
    background: var(--monochrome-300);
    border-radius: var(--border-radius-2xl);
    overflow: hidden;
  }

  &__image {
    display: block;
    object-fit: cover;
  }

  &__interactions {
    position: absolute;
    top: var(--size-12);
    right: var(--size-12);
  }

  &__content {
    padding: var(--size-18);
  }

  &__price {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 var(--size-4);
  }

  &__overview {
    font-size: var(--font-xs);
    line-height: var(--lineheight-sm);
    font-weight: var(--font-semisemibold);
  }

  &__overview-address {
    display: block;
    font-weight: var(--font-bold);
    font-size: var(--font-sm);
    line-height: var(--lineheight-sm);
  }

  &__labels,
  &__icons {
    display: flex;
    justify-content: flex-start;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__labels {
    gap: var(--size-6);
    align-items: center;
  }

  &__icons {
    gap: var(--size-20);
    padding: var(--size-4) 0;
    align-items: flex-start;
  }

  &__icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    font-weight: var(--font-semibold);
    gap: var(--size-4);
    flex: 1 0 fit-content;
    max-width: 10ch;
    text-align: center;
  }

  &__icon-count {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-4);
    line-height: var(--size-24);

    .a-icon {
      width: var(--size-24);
      height: var(--size-24);
    }
  }

  &__buttons {
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    gap: var(--size-8);
    margin: var(--size-16) 0 0;
  }

  &__button {
    border: 0;
    padding: var(--size-8) var(--size-16);
    border-radius: var(--border-radius-lg);
    box-sizing: border-box;
    width: 100%;
    text-align: center;
    font-weight: var(--font-bold);
    transition: background-color var(--animation-fast);
    color: light-dark(var(--monochrome-500), var(--monochrome-500));
    background-color: light-dark(var(--monochrome-800), var(--monochrome-400));

    &[href] {
      color: currentColor;
      background-color: light-dark(var(--monochrome-800), var(--monochrome-200));

      &:hover {
        color: currentColor;
        background-color: light-dark(var(--monochrome-700), var(--monochrome-100));
      }
    }

    &--enquire[href] {
      background: var(--primary-400);
      color: var(--monochrome-900);

      &:hover {
        background: var(--primary-300);
        color: var(--monochrome-900);
      }
    }
  }

  &__profile {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--size-10);
    margin-top: var(--size-8);
    padding: var(--size-8);
    background-color: light-dark(var(--monochrome-800), var(--monochrome-300));
    border-radius: var(--border-radius-lg);
    font-weight: var(--font-semisemibold);
  }

  &__profile-image {
    display: block;
    width: var(--size-28);
    height: var(--size-28);
    border-radius: var(--border-radius-md);
    overflow: hidden;
    object-fit: contain;

    &--empty {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--monochrome-400);

      .a-icon {
        color: var(--monochrome-900);
        width: var(--size-24);
        height: var(--size-24);
      }
    }
  }
}
</style>