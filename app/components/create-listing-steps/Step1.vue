<template>
  <section class="step">
    <h2 class="title-sm">Listing Type</h2>
    <p class="body-sm"></p>

    <form class="step__form">
      <!-- first parent select -->
      <div class="step__form-group">
        <p class="step__form-group--title | body-sm">What type of listing do you want to create?</p>
        <ul class="step__form-list">
          <li v-for="option in listingOptions" :key="option.value">
            <label class="| body-sm">
              <AtomsAriaTooltip :content="option.info">
                <AtomsPill class="step__form-radio"
                  :class="{ 'step__form-radio--selected': selectedType === option.value }">
                  <input type="radio" :name="'listing-type'" :value="option.value"
                    :checked="selectedType === option.value" class="| visually-hidden"
                    @change="selectedType = option.value" />
                  {{ option.key }}
                </AtomsPill>
              </AtomsAriaTooltip>
            </label>
          </li>
        </ul>
      </div>
      <AtomsDivider />
      <!-- second conditional select -->
      <!-- SALE -->
      <div v-if="selectedType === 'sale'" class="step__form-group">
        <p class="step__form-group--title | body-sm">What type of sale offers do you want to set?</p>
        <ul class="step__form-list">
          <li v-for="option in saleOptions" :key="option.value">
            <label class="| body-sm">
              <AtomsAriaTooltip :content="option.info">
                <AtomsPill class="step__form-radio"
                  :class="{ 'step__form-radio--selected': saleOfferType === option.value }">
                  <input type="radio" :name="'sale-offer-type'" :value="option.value"
                    :checked="saleOfferType === option.value" class="| visually-hidden"
                    @change="saleOfferType = option.value" />
                  {{ option.key }}
                </AtomsPill>
              </AtomsAriaTooltip>
            </label>
          </li>
        </ul>
      </div>
      <!-- RENT -->
      <div v-if="selectedType === 'rent'" class="step__form-group">
        <p class="step__form-group--title | body-sm">What type of rental price do you want to set?</p>
        <ul class="step__form-list">
          <li v-for="option in rentalOptions" :key="option.value">
            <label class="| body-sm">
              <AtomsAriaTooltip :content="option.info">
                <AtomsPill class="step__form-radio"
                  :class="{ 'step__form-radio--selected': rentalPriceType === option.value }">
                  <input type="radio" :name="'rental-price-type'" :value="option.value"
                    :checked="rentalPriceType === option.value" class="| visually-hidden"
                    @change="rentalPriceType = option.value" />
                  {{ option.key }}
                </AtomsPill>
              </AtomsAriaTooltip>
            </label>
          </li>
        </ul>
      </div>

      <button class="step__form-action | button button-sm button-secondary" :disabled="buttonDisabled">Save and
        Continue</button>
    </form>
  </section>
</template>
<script setup lang="ts">
import type { DraftListing } from '~~/layers/database/server/database/prisma/generated/client';

defineProps<{
  draft: DraftListing;
}>();

const selectedType = ref<string | null>(null);
const saleOfferType = ref<string | null>(null);
const rentalPriceType = ref<string | null>(null);
const buttonDisabled = ref(true);


const listingOptions = [
  { value: 'sale', key: 'For Sale', info: 'Further listing details will be specific to Sales' },
  { value: 'rent', key: 'For Rent', info: 'Further listing details will be specific to Rentals' },
];

const saleOptions = [
  { value: 'OFFERS_OVER', key: 'Offers Over', info: 'I want to receive offers from buyers.' },
  { value: 'FIXED', key: 'Fixed Price', info: 'I want to set a fixed price for my property.' },
  { value: 'GUIDE_PRICE', key: 'Guide Price', info: 'I want to set a guide price for my property.' },
];

const rentalOptions = [
  { value: 'WEEKLY', key: 'Weekly Price', info: 'I want to set a weekly rental price for my property.' },
  { value: 'MONTHLY', key: 'Monthly Price', info: 'I want to set a monthly rental price for my property.' },
];

watch(
  [selectedType, saleOfferType, rentalPriceType],
  ([newSelectedType]) => {
    if (newSelectedType === 'sale') {
      rentalPriceType.value = null;
    } else if (newSelectedType === 'rent') {
      saleOfferType.value = null;
    } else {
      buttonDisabled.value = true;
    }
  }
);
</script>
<style lang="scss">
.step {
  width: 100%;

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--size-16);

    ul,
    li {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    &-group {
      padding: var(--size-16) 0;

      &--title {
        padding-bottom: var(--size-16);
      }
    }

    &-list {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      justify-items: center;
      gap: var(--size-16);
    }

    &-radio {
      background: var(--background-200);
      border: 1px solid var(--secondary-400);
      cursor: pointer;

      &--selected {
        background: var(--secondary-400);
        color: var(--monochrome-900);
      }
    }

    &-action {
      align-self: flex-end;
    }
  }
}
</style>