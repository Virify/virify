<template>
  <section class="property-card-root">
    <div class="property-card-root__image"></div>

    <div class="property-card-root__content | flow flow-sm" role="presentation">
      <h2 class="property-card-root__price | title-md">
        {{ propertyDetails.price }}

        <PropertyCardPill :content="propertyDetails.priceLabel" variant="orange" />
      </h2>

      <p class="property-card-root__overview">
        <strong class="property-card-root__overview-address">
          {{ propertyDetails.overview }}
        </strong>
        {{ propertyDetails.overviewAddress }}
      </p>

      <MoleculesScrollBox v-if="propertyDetails.labels?.length">
        <ul class="property-card-root__labels">
          <li v-for="label of propertyDetails.labels" :key="label">
            <PropertyCardPill :content="label" />
          </li>
        </ul>
      </MoleculesScrollBox>

      <MoleculesScrollBox v-if="propertyDetails.icons?.length">
        <ul class="property-card-root__icons">
          <li v-for="{ icon, count, label } of propertyDetails.icons" :key="label"
            class="property-card-root__icon | body-2xs">
            <span class="property-card-root__icon-count | body-sm">
              <AtomsIcon :icon aria-hidden />
              {{ count }}
            </span>

            {{ label }}
          </li>
        </ul>
      </MoleculesScrollBox>

      <div class="property-card-root__buttons" aria-role="presentation">
        <a href="#" class="property-card-root__button property-card-root__button--view | body-sm">
          View
        </a>

        <a href="#" class="property-card-root__button property-card-root__button--enquire | body-sm">
          Enquire
        </a>
      </div>

    </div>
  </section>
</template>

<script setup>
const propertyDetails = {
  price: '£2,200,000',
  priceLabel: 'In excess of',
  overview: '4 bed detached house',
  overviewAddress: '123 Somewhere St., Cardiff, CF3',
  labels: [
    'Freehold',
    'Chain-free'
  ],
  icons: [
    { icon: 'property/bedrooms', count: 3, label: 'Bedrooms' },
    { icon: 'property/bathrooms', count: 1, label: 'Bathrooms' },
    { icon: 'property/receptions', count: 2, label: 'Receptions' },
    { icon: 'property/land', label: 'Garden' },
    { icon: 'property/utility', label: 'Renewables' },
  ]
}


</script>

<style lang="scss">
.property-card-root {
  max-width: 35ch;

  &__content {
    padding: var(--size-18);
  }

  &__image {
    width: 100%;
    aspect-ratio: 16/9;
    background: var(--monochrome-300);
    border-radius: var(--border-radius-2xl);
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
    color: currentColor;
    background-color: var(--monochrome-800);
    border-radius: var(--border-radius-lg);
    box-sizing: border-box;
    width: 100%;
    text-align: center;
    font-weight: var(--font-bold);
    transition: background-color var(--animation-fast);

    &:hover {
      color: currentColor;
      background-color: var(--monochrome-700);
    }

    &--enquire {
      background: var(--secondary-400);
      color: var(--monochrome-900);

      &:hover {
        background: var(--secondary-300);
        color: var(--monochrome-900);
      }
    }
  }
}
</style>