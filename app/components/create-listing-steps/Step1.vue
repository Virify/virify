<template>
  <section class="step">
    <h2 class="title-sm">Listing Type</h2>

    <form class="step__form" @submit.prevent="submitForm">
      <!-- first parent select -->
      <OrganismsDraftFormRadioGroup 
        v-if="!draft.saleListing && !draft.rentalListing"
        title="What type of listing do you want to create?" 
        :options="stepOneListingOptions" 
        v-model="selectedType"
        name="listing-type" 
        :required="true" 
      />

      <!-- SALE -->
      <OrganismsDraftFormRadioGroup 
        v-if="isSale" 
        title="What type of sale tenure do you want to set?"
        :options="saleListingTenureOptions"
        v-model="saleListing.tenureType" name="sale-tenure-type"
        :divider="true" 
        :required="true"
      />

      <OrganismsDraftFormRadioGroup 
        v-if="isSale" 
        title="What is the availability status of the listing?"
        :options="saleListingAvailabilityOptions" 
        v-model="saleListing.availabilityStatus"
        name="sale-availability" 
        :divider="true" 
        :required="true" 
      />

      <OrganismsDraftFormRadioGroup 
        v-if="isSale" 
        title="What is the chain of the listing?"
        :options="saleListingChainOptions" 
        v-model="saleListing.chain" 
        :divider="true"
        name="sale-chain" 
      />

      <OrganismsDraftFormRadioGroup 
        v-if="isSale" 
        title="What is the ownership status of the listing?"
        :options="saleSharedOwnershipOptions" 
        v-model="saleListing.sharedOwnership" 
        :divider="true"
        name="sale-shared-ownership" 
      />

      <!-- RENTAL -->
      <OrganismsDraftFormRadioGroup 
        v-if="isRent" 
        title="What type of rental price do you want to set?"
        :options="rentalAvailabilityStatusOptions" 
        v-model="rentalListing.availabilityStatus"
        name="rental-availability-status" 
        :required="true" 
        :divider="true" 
      />

      <OrganismsDraftFormRadioGroup 
        v-if="isRent" 
        title="What type of rental price do you want to set?"
        :options="rentalBillsIncludedOptions" 
        v-model="rentalListing.isBillsIncluded"
        name="rental-bills-included" 
        :required="true" 
        :divider="true" 
        />

      <OrganismsDraftFormRadioGroup 
        v-if="isRent" 
        title="What type of rental price do you want to set?"
        :options="rentalFurnishedStatusOptions" 
        v-model="rentalListing.furnishedStatus"
        name="rental-furnished-status" 
        :required="true" 
        :divider="true" 
      />

      <button class="step__form-action | button button-sm button-secondary" :disabled="buttonDisabled" type="submit">
        {{ buttonText }}
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
  'nextStep': [];
}>();

const selectedType = ref<string | null>(props.draft.saleListing ? 'sale' : props.draft.rentalListing ? 'rent' : null);
const buttonDisabled = ref(true);

const saleListing = ref<SaleListingCreateWithoutListingInput>(createInitialSaleValues(props.draft));
const rentalListing = ref<RentalListingCreateWithoutListingInput>(createInitialRentalValues(props.draft));

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

// Check if draft already has complete step one data
const draftHasStepOneData = computed(() => {
  return (props.draft.saleListing && saleComplete.value) || 
         (props.draft.rentalListing && rentalComplete.value);
});

const objectsEqual = (obj1: any, obj2: any): boolean => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  return keys1.every(key => obj1[key] === obj2[key]);
};

// Track if any changes have been made from original draft data
const hasChanges = computed(() => {
  if (selectedType.value === 'sale' && props.draft.saleListing) {
    const originalSale = createInitialSaleValues(props.draft);
    return !objectsEqual(saleListing.value, originalSale);
  } else if (selectedType.value === 'rent' && props.draft.rentalListing) {
    const originalRental = createInitialRentalValues(props.draft);
    return !objectsEqual(rentalListing.value, originalRental);
  }
  // If no draft data exists, any valid form data counts as changes
  return isFormValid.value;
});

// Button text based on conditions
const buttonText = computed(() => {
  if (!isFormValid.value) {
    return 'Save and Continue';
  }
  if (draftHasStepOneData.value && !hasChanges.value) {
    return 'Next Step';
  }
  return 'Save and Continue';
});

const resetSaleListing = () => {
  saleListing.value = createInitialSaleValues(props.draft);
};

const resetRentalListing = () => {
  rentalListing.value = createInitialRentalValues(props.draft);
};

const submitForm = () => {
  if (!isFormValid.value) return;
  if(hasChanges.value === false && isFormValid.value) {
    emit('nextStep');
    return;
  }
  
  // Type assertion since we've validated the form is valid
  const stepData = selectedType.value === 'sale' 
    ? setStepData("sale", saleListing.value as SaleListingCreateWithoutListingInput) 
    : setStepData("rent", rentalListing.value as RentalListingCreateWithoutListingInput);
  emit('updateStepData', stepData);
};

// Helper to get all form values for watching
const getAllFormValues = () => [
  selectedType,
  () => saleListing.value.tenureType,
  () => saleListing.value.chain,
  () => saleListing.value.sharedOwnership,
  () => saleListing.value.availabilityStatus,
  () => rentalListing.value.deposit,
  () => rentalListing.value.holdingDeposit,
  () => rentalListing.value.rentFrequency,
  () => rentalListing.value.isBillsIncluded,
  () => rentalListing.value.rentalLength,
  () => rentalListing.value.furnishedStatus,
  () => rentalListing.value.availabilityStatus
];

watch(
  getAllFormValues(),
  () => {
    buttonDisabled.value = !isFormValid.value;

    // Reset other form when switching types
    if (selectedType.value === 'rent') {
      resetSaleListing();
    } else if (selectedType.value === 'sale') {
      resetRentalListing();
    }
  },
  { immediate: true }
);
</script>
<style lang="scss">
.step {

  &__form {
    display: flex;
    flex-direction: column;

    &-action {
      align-self: flex-end;
    }
  }
}
</style>