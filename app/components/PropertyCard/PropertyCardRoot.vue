<template>
  <section class="property-card-root">
    <div class="property-card-root__images | v-skeleton">
      <PropertyCardImage :provider="imageProvider" :src="propertyImage" :alt="propertyImageAlt" variant="card"
        class="property-card-root__image" width="491" height="368" loading="lazy" />
    </div>

    <div class="property-card-root__content | flow flow-sm" role="presentation">
      <h2 class="property-card-root__price | title-md">
        <PropertyCardPill v-if="priceLabel" :content="priceLabel" variant="orange" />

        {{ price }}
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
        <component :is="viewLinkComponent.is" :href="viewLinkComponent.href"
          class="property-card-root__button property-card-root__button--view | body-sm">
          View
        </component>

        <button :disabled="disabledInteractions"
          class="property-card-root__button property-card-root__button--enquire | body-sm">
          Enquire
        </button>
      </div>

      <div v-if="!disabledInteractions" class="property-card-root__footer" aria-role="presentation">
        <PropertyCardSeller :name="sellerName" />

        <div role="presentation" class="property-card-root__footer-text">
          <span role="presentation" class="property-card-root__footer-name | body-xs">
            {{ profileText }}
          </span>
          <time :datetime="dateChanged" class="property-card-root__footer-date | body-2xs">
            {{ timeAgo }}
          </time>
        </div>

        <PropertyCardInteractions class="property-card-root__interactions" />
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
  saleOrRent?: 'buy' | 'rent' | string
  propertyImage?: string
  propertyImageAlt?: string
  disabledInteractions?: boolean
  imageProvider?: 'cloudflare' | 'local'
  price?: string
  priceLabel?: string
  overview?: string
  overviewAddress?: string
  dateChanged?: string
  dateChangedType?: 'Added' | 'Updated' | string
  labels?: string[]
  icons?: FacilitiesIcon[]
  sellerImage?: string
  sellerName?: string
  viewUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  imageProvider: 'cloudflare'
})

/**
 *  Conditionally show as links
 */
const viewLinkComponent = computed(() => {
  const { viewUrl, disabledInteractions } = props

  if (!disabledInteractions && viewUrl) {
    return {
      is: 'a',
      href: viewUrl
    }
  }

  return {
    is: 'span'
  }
})

/**
 *  Format profile text
 */
const profileText = computed(() => {
  const { saleOrRent, sellerName = 'Virify' } = props

  switch (saleOrRent) {
    case 'buy':
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

/**
 *  Get date as 'time ago'
 */
const timeAgo = computed(() => {
  const { dateChanged, dateChangedType } = props

  return [dateChangedType, getTimeAgo(dateChanged)].filter(Boolean).join(' ')
})

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.property-card-root {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__images,
  &__image {
    width: 100%;
    aspect-ratio: 4/3;
  }

  &__images {
    position: relative;
    border-radius: var(--border-radius-2xl);
    overflow: hidden;
  }

  &__image {
    display: block;
    object-fit: cover;
  }

  &__content {
    display: flex;
    flex-direction: column;
    padding: var(--size-18);
    flex-grow: 1;
  }

  &__price {
    display: flex;
    flex-direction: column;
    margin: 0 0 var(--size-4);
    gap: var(--size-2);
  }

  &__overview {
    font-size: var(--font-xs);
    line-height: var(--lineheight-sm);
    font-weight: var(--font-semisemibold);
    margin-bottom: auto;
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
    width: fit-content;
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
    color: var(--blue-500);
    background-color: light-dark(var(--blue-800), var(--blue-400));

    &--view[href] {
      color: currentColor;
      background-color: light-dark(var(--blue-700), var(--blue-400));

      &:hover {
        color: currentColor;
        background-color: light-dark(var(--blue-600), var(--blue-100));
      }
    }

    &--enquire:not([disabled]) {
      cursor: pointer;
      background: var(--primary-400);
      color: var(--monochrome-900);

      &:hover {
        background: var(--primary-500);
        color: var(--monochrome-900);
      }
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--size-10);
    margin-top: var(--size-8);
    padding: var(--size-8);
    background-color: light-dark(var(--blue-800), var(--blue-300));
    border: 1px solid light-dark(var(--blue-600), var(--blue-400));
    border-radius: var(--border-radius-lg);
    font-weight: var(--font-semisemibold);
  }

  &__footer-text {
    overflow: hidden;
  }

  &__footer-name,
  &__footer-date {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__footer-name {
    font-weight: var(--font-semibold);
  }

  &__footer-date {
    color: var(--blue-500);
  }

  &__interactions {
    margin-left: auto;
  }
}
</style>