<template>
  <div class="browse-simple-header | gradient-box">
    <form class="browse-simple-header__form">
      <label class="browse-simple-header__label browse-simple-header__label--buy-or-rent | body-sm faded-text">
        Buy or rent?

        <MoleculesSwitcher :options="buyOrRent" init-selected="buy"
          class="browse-simple-header__input browse-simple-header__input--switcher" />
      </label>

      <BrowseRangePopover legend="Price" min-label="Min price" max-label="Max price" name="price"
        :options="priceOptions" v-model="initialPrice" />

      <BrowseRangePopover legend="Bedrooms" min-label="Min bedrooms" max-label="Max bedrooms" name="bedrooms"
        :options="bedroomOptions" />

      <BrowseRangePopover legend="Bathrooms" min-label="Min bathrooms" max-label="Max bathrooms" name="bathrooms"
        :options="bathroomOptions" />

      <label class="browse-simple-header__label | body-sm faded-text">
        Property type

        <AtomsSelect name="propertyType" class="browse-simple-header__input browse-simple-header__input--select"
          :options="propertyType" />
      </label>

      <label class="browse-simple-header__label | body-sm faded-text">
        Sort by

        <AtomsSelect name="sortBy" class="browse-simple-header__input browse-simple-header__input--select"
          :options="sortBy" />
      </label>
    </form>
  </div>
</template>

<script setup lang="ts">
const buyOrRent = [
  { key: 'buy', value: 'Buy' },
  { key: 'rent', value: 'Rent' },
]

const initialPrice = ref([0, 5000])

const priceOptions = [
  { value: 0, key: '£0' },
  { value: 5000, key: '£5000' }
]

const bedroomOptions = [
  { value: 0, key: 'Any' },
  { value: 0.5, key: 'Studio' },
  { value: 1, key: '1 bedroom' },
  { value: 2, key: '2 bedrooms' },
  { value: 3, key: '3 bedrooms' },
  { value: 4, key: '4 bedrooms' },
  { value: 5, key: '5 bedrooms' },
  { value: 6, key: '6 bedrooms' },
  { value: 7, key: '7 bedrooms' },
  { value: 8, key: '8+ bedrooms' },
]

const bathroomOptions = [
  { value: 0, key: 'Any' },
  { value: 1, key: '1 bathrooms' },
  { value: 2, key: '2 bathrooms' },
  { value: 3, key: '3 bathrooms' },
  { value: 4, key: '4 bathrooms' },
  { value: 5, key: '5+ bathrooms' },
]

const propertyType = [
  { value: 'detatched-house', key: 'Detatched House' },
  { value: 'semi-detatched', key: 'Semi-detached House' },
  { value: 'flat', key: 'Flat' },
]

const sortBy = [
  { value: 'price-asc', key: 'Price (lowest first)' }
]

</script>

<style lang="scss">
@use "#styles/_utils/functions" as fn;

.browse-simple-header {
  position: sticky;
  top: calc(var(--size-8) + var(--header-height));
  margin: 0 auto var(--size-16);
  padding: var(--size-12) var(--size-20) var(--size-16);
  background: var(--background-100);

  &__form {
    display: flex;
    align-items: stretch;
    gap: var(--size-16);
  }

  &__label {
    display: flex;
    flex-direction: column;
    gap: var(--size-6);
    white-space: nowrap;

    &--buy-or-rent {
      white-space: nowrap;
      width: min-content;
    }
  }

  &__switcher {
    margin: auto 0;
  }

  &__button,
  &__input {
    width: 100%;
    border: 1px solid var(--border-color-200);
    border-radius: var(--border-radius-xl);
    white-space: nowrap;

    .m-switcher-text-label {
      display: flex;
      border-radius: var(--border-radius-md);
      align-items: center;
    }

    &--switcher {
      height: 100%;
    }

    &--select {
      padding: var(--size-12) var(--size-16);
      padding-right: var(--size-48);
    }
  }
}
</style>