<template>
  <section class="step">
    <h2 class="title-sm">Listing Type</h2>
    <p class="body-sm"></p>

    <form class="step__form" @submit.prevent="submitForm">
      <!-- first parent select -->
      <OrganismsDraftFormGroup v-if="!draft.saleListing || !draft.rentalListing" title="What type of listing do you want to create?" :options="stepOneListingOptions"
        v-model="selectedType" name="listing-type" :required="true" />

      <!-- SALE -->
      <OrganismsDraftFormGroup v-if="isSale" title="What type of sale tenure do you want to set?"
        :options="stepOneSaleOptions.saleListingTenureOptions" v-model="saleListing.tenureType" name="sale-tenure-type"
        :divider="true" :required="true" />
      <OrganismsDraftFormGroup v-if="isSale" title="What is the availability status of the listing?"
        :options="stepOneSaleOptions.saleListingAvailabilityOptions" v-model="saleListing.availabilityStatus"
        name="sale-availability" :divider="true" :required="true" />
      <OrganismsDraftFormGroup v-if="isSale" title="What is the chain of the listing?"
        :options="stepOneSaleOptions.saleListingChainOptions" v-model="saleListing.chain" :divider="true"
        name="sale-chain" />
      <OrganismsDraftFormGroup v-if="isSale" title="What is the ownership status of the listing?"
        :options="stepOneSaleOptions.saleSharedOwnershipOptions" v-model="saleListing.sharedOwnership" :divider="true"
        name="sale-shared-ownership" />
      <!-- RENTAL -->
      <OrganismsDraftFormGroup v-if="isRent" title="What type of rental price do you want to set?"
        :options="stepOneRentalOptions.rentalAvailabilityStatusOptions" v-model="rentalListing.availabilityStatus"
        name="rental-availability-status" :required="true" :divider="true" />

      <OrganismsDraftFormGroup v-if="isRent" title="What type of rental price do you want to set?"
        :options="stepOneRentalOptions.rentalBillsIncludedOptions" v-model="rentalListing.isBillsIncluded"
        name="rental-bills-included" :required="true" :divider="true" />

      <OrganismsDraftFormGroup v-if="isRent" title="What type of rental price do you want to set?"
        :options="stepOneRentalOptions.rentalFurnishedStatusOptions" v-model="rentalListing.furnishedStatus"
        name="rental-furnished-status" :required="true" :divider="true" />

      <button class="step__form-action | button button-sm button-secondary" :disabled="buttonDisabled" type="submit">
        Save and Continue
      </button>
    </form>
  </section>
</template>
<script setup lang="ts">
import type { SaleListingCreateWithoutListingInput, RentalListingCreateWithoutListingInput } from '~~/layers/database/server/database/prisma/generated/models';


const props = defineProps<{
  draft: DraftListingWithFullPayload;
}>();

const emit = defineEmits<{
  'updateStepData': [stepData: StepOne];
}>();

const selectedType = ref<string | null>(props.draft.saleListing ? 'sale' : props.draft.rentalListing ? 'rent' : null);
const buttonDisabled = ref(true);

const saleListing = ref<SaleListingCreateWithoutListingInput>({
  tenureType: props.draft.saleListing?.tenureType || null,
  chain: props.draft.saleListing?.chain || false,
  sharedOwnership: props.draft.saleListing?.sharedOwnership || false,
  availabilityStatus: props.draft.saleListing?.availabilityStatus || null as any,
  priceType: props.draft.saleListing?.priceType || null
});

const rentalListing = ref<RentalListingCreateWithoutListingInput>({
  deposit: props.draft.rentalListing?.deposit || null,
  holdingDeposit: props.draft.rentalListing?.holdingDeposit || null,
  rentFrequency: props.draft.rentalListing?.rentFrequency || null as any,
  isBillsIncluded: props.draft.rentalListing?.isBillsIncluded || null as any,
  rentalLength: props.draft.rentalListing?.rentalLength || null,
  furnishedStatus: props.draft.rentalListing?.furnishedStatus || null,
  availabilityStatus: props.draft.rentalListing?.availabilityStatus || null as any
});

const isSale = computed(() => selectedType.value === 'sale');
const isRent = computed(() => selectedType.value === 'rent');

const saleComplete = computed(() => {
  return saleListing.value.tenureType !== null && saleListing.value.availabilityStatus !== null;
});

const rentalComplete = computed(() => {
  return rentalListing.value.furnishedStatus !== null &&
    rentalListing.value.availabilityStatus !== null &&
    rentalListing.value.isBillsIncluded !== null;
});

const isFormValid = computed(() => {
  if (selectedType.value === 'sale') {
    return saleComplete.value;
  } else if (selectedType.value === 'rent') {
    return rentalComplete.value;
  }
  return false;
});

const resetSaleListing = () => {
  saleListing.value = {
    tenureType: props.draft.saleListing?.tenureType || null,
    chain: props.draft.saleListing?.chain || false,
    sharedOwnership: props.draft.saleListing?.sharedOwnership || false,
    availabilityStatus: props.draft.saleListing?.availabilityStatus || null as any,
    priceType: props.draft.saleListing?.priceType || null
  };
};

const resetRentalListing = () => {
  rentalListing.value = {
    deposit: props.draft.rentalListing?.deposit || null,
    holdingDeposit: props.draft.rentalListing?.holdingDeposit || null,
    rentFrequency: props.draft.rentalListing?.rentFrequency || null as any,
    isBillsIncluded: props.draft.rentalListing?.isBillsIncluded || null as any,
    rentalLength: props.draft.rentalListing?.rentalLength || null,
    furnishedStatus: props.draft.rentalListing?.furnishedStatus || null,
    availabilityStatus: props.draft.rentalListing?.availabilityStatus || null as any
  };
};

const submitForm = () => {
  if (!isFormValid.value) return;

  const stepData: StepOne = {};
  if (selectedType.value === 'sale') {
    // Only assign properties that match SaleListingCreateWithoutListingInput
    const { tenureType, chain, sharedOwnership, availabilityStatus } = saleListing.value;
    stepData.saleListing = { tenureType, chain, sharedOwnership, availabilityStatus };

    emit('updateStepData', stepData);
  } else if (selectedType.value === 'rent') {
    const { deposit, holdingDeposit, rentFrequency, isBillsIncluded, rentalLength, furnishedStatus, availabilityStatus } = rentalListing.value;
    stepData.rentalListing = { deposit, holdingDeposit, rentFrequency, isBillsIncluded, rentalLength, furnishedStatus, availabilityStatus };

    emit('updateStepData', stepData);
  }
};

watch(
  [
    selectedType,
    () => saleListing.value.availabilityStatus,
    () => saleListing.value.tenureType,
    () => rentalListing.value.furnishedStatus,
    () => rentalListing.value.availabilityStatus,
    () => rentalListing.value.isBillsIncluded
  ],
  () => {
    buttonDisabled.value = !isFormValid.value;

    // Reset other form when switching types
    if (selectedType.value === 'rent') {
      resetSaleListing();
    } else if (selectedType.value === 'sale') {
      resetRentalListing();
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