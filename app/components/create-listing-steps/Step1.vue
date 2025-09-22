<template>
  <section class="step">
    <h2 class="title-sm">Listing Type</h2>
    <p class="body-sm"></p>

    <form class="step__form" @submit.prevent="submitForm">
      <!-- first parent select -->
      <OrganismsDraftFormGroup
        title="What type of listing do you want to create?"
        :options="stepOneListingOptions"
        v-model="selectedType"
        name="listing-type"
        :required="true"
      />
      
      <!-- second conditional select -->
      <!-- SALE -->
      <OrganismsDraftFormGroup 
        v-if="isSale"
        title="What type of sale tenure do you want to set?"
        :options="stepOneSaleOptions.saleListingTenureOptions"
        v-model="saleListing.tenureType"
        name="sale-tenure-type"
        :divider="true"
        :required="true"
      />
      <OrganismsDraftFormGroup 
        v-if="isSale"
        title="What is the availability status of the listing?"
        :options="stepOneSaleOptions.saleListingAvailabilityOptions"
        v-model="saleListing.availabilityStatus"
        name="sale-availability"
        :divider="true"
        :required="true"
      />
      <OrganismsDraftFormGroup 
        v-if="isSale"
        title="What is the chain of the listing?"
        :options="stepOneSaleOptions.saleListingChainOptions"
        v-model="saleListing.chain"
        :divider="true"
        name="sale-chain"
      />
      <OrganismsDraftFormGroup 
        v-if="isSale"
        title="What is the ownership status of the listing?"
        :options="stepOneSaleOptions.saleSharedOwnershipOptions"
        v-model="saleListing.sharedOwnership"
        :divider="true"
        name="sale-shared-ownership"
      />
      <OrganismsDraftFormGroup 
        v-if="selectedType === 'rent'"
        title="What type of rental price do you want to set?"
        :options="rentalOptions"
        v-model="rentalPriceType"
        name="rental-price-type"
        :required="true"
      />

      <button class="step__form-action | button button-sm button-secondary" :disabled="buttonDisabled" type="submit">
        Save and Continue
      </button>
    </form>
  </section>
</template>
<script setup lang="ts">
import type { DraftListing, SaleListing } from '~~/layers/database/server/database/prisma/generated/client';


defineProps<{
  draft: DraftListing;
}>();

const emit = defineEmits<{
  'updateStepData': [stepData: StepOne];
}>();

const selectedType = ref<string | null>(null);
const rentalPriceType = ref<string | null>(null);
const buttonDisabled = ref(true);

const saleListing = ref<Omit<SaleListing, 'id' | 'listing' | 'DraftListing'>>({
  tenureType: null,
  chain: false,
  sharedOwnership: false,
  availabilityStatus: null as any,
  priceType: null
});

const isSale = computed(() => selectedType.value === 'sale');

const rentalOptions = [
  { value: 'WEEKLY', key: 'Weekly Price', info: 'I want to set a weekly rental price for my property.' },
  { value: 'MONTHLY', key: 'Monthly Price', info: 'I want to set a monthly rental price for my property.' },
];

const saleComplete = computed(() => {
  return saleListing.value.availabilityStatus !== null;
});

const isFormValid = computed(() => {
  if (selectedType.value === 'sale') {
    return saleComplete.value;
  } else if (selectedType.value === 'rent') {
    return rentalPriceType.value !== null;
  }
  return false;
});

const submitForm = () => {
  if (!isFormValid.value) return;

  const stepData: StepOne = {};
  if (selectedType.value === 'sale') {
    stepData.saleListing = { ...saleListing.value };
    emit('updateStepData', stepData);
  }
};

watch(
  [selectedType, () => saleListing.value.availabilityStatus, rentalPriceType],
  () => {
    buttonDisabled.value = !isFormValid.value;
    
    // Reset other form when switching types
    if (selectedType.value === 'rent') {
      // Reset sale listing when switching to rent
      saleListing.value = {
        tenureType: null,
        chain: false,
        sharedOwnership: false,
        availabilityStatus: null as any,
        priceType: null as any
      };
    } else if (selectedType.value === 'sale') {
      rentalPriceType.value = null;
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
    overflow: auto;

    &-action {
      align-self: flex-end;
    }
  }
}
</style>