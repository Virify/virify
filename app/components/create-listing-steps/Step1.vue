<template>
  <section class="step">
    <h2 class="title-sm">Listing Type</h2>
    <p class="body-xs">
      <span class="step__required | body-md font-semibold">*</span>
      <em>represents a required field</em>
    </p>

  <form :key="formKey" class="step__form" @submit.prevent="submitForm">
      <!-- first parent select -->
      <OrganismsDraftFormRadioGroup 
        v-if="!draft.saleListing && !draft.rentalListing"
        title="What type of listing do you want to create?" 
        :options="stepOneListingOptions" 
        v-model="stepOneData.selectedType"
        @update:modelValue="onSelectedTypeChange"
        name="listing-type" 
        :required="true" 
      />

      <!-- SALE -->
      <OrganismsDraftFormRadioGroup 
        v-if="isSale" 
        title="What type of sale tenure do you want to set?"
        :options="saleListingTenureOptions"
        v-model="stepOneData.saleListing.tenureType" name="sale-tenure-type"
        :divider="true" 
        :required="true"
      />

      <OrganismsDraftFormRadioGroup 
        v-if="isSale" 
        title="What is the availability status of the listing?"
        :options="saleListingAvailabilityOptions" 
        v-model="stepOneData.saleListing.availabilityStatus"
        name="sale-availability" 
        :divider="true" 
        :required="true" 
      />

      <OrganismsDraftFormRadioGroup 
        v-if="isSale" 
        title="What is the chain of the listing?"
        :options="saleListingChainOptions" 
        v-model="stepOneData.saleListing.chain" 
        :divider="true"
        name="sale-chain" 
      />

      <OrganismsDraftFormRadioGroup 
        v-if="isSale" 
        title="What is the ownership status of the listing?"
        :options="saleSharedOwnershipOptions" 
        v-model="stepOneData.saleListing.sharedOwnership" 
        :divider="true"
        name="sale-shared-ownership" 
      />

      <!-- RENTAL -->
      <OrganismsDraftFormRadioGroup 
        v-if="isRent" 
        title="What is the availability status of the listing?"
        :options="rentalAvailabilityStatusOptions" 
        v-model="stepOneData.rentalListing.availabilityStatus"
        name="rental-availability-status" 
        :required="true" 
        :divider="true" 
      />

      <OrganismsDraftFormRadioGroup 
        v-if="isRent" 
        title="Are bills included in the rent?"
        :options="rentalBillsIncludedOptions" 
        v-model="stepOneData.rentalListing.isBillsIncluded"
        name="rental-bills-included" 
        :required="true" 
        :divider="true" 
        />

      <OrganismsDraftFormRadioGroup 
        v-if="isRent" 
        title="What is the furnished status of the listing?"
        :options="rentalFurnishedStatusOptions" 
        v-model="stepOneData.rentalListing.furnishedStatus"
        name="rental-furnished-status" 
        :required="true" 
        :divider="true" 
      />

      <MoleculesDraftFormActions
        :hasChanges="hasChanges"
        :buttonDisabled="buttonDisabled"
        :primaryText="buttonText"
        @cancel="resetForm"
        @submit="submitForm"
      />
    </form>
  </section>
</template>
<script setup lang="ts">
import type { SaleListingCreateWithoutListingInput, RentalListingCreateWithoutListingInput } from '~~/layers/database/server/database/prisma/generated/models';

const props = defineProps<{
  draft: DraftListingWithFullPayload;
}>();

const emit = defineEmits<{
  'updateStepData': [stepData: StepOne, step: number];
  'nextStep': [];
}>();

const stepOneData = ref({
  selectedType: props.draft.saleListing ? 'sale' : props.draft.rentalListing ? 'rent' : null,
  saleListing: createInitialSaleValues(props.draft),
  rentalListing: createInitialRentalValues(props.draft)
});

// deep snapshot for reset/change detection
const initialStepOneData = ref(JSON.parse(JSON.stringify(stepOneData.value)));
// key to force remount of form children when performing a full reset
const formKey = ref(0);

const isSale = computed(() => stepOneData.value.selectedType === 'sale');
const isRent = computed(() => stepOneData.value.selectedType === 'rent');

const saleComplete = computed(() => stepOneData.value.saleListing.tenureType !== null && stepOneData.value.saleListing.availabilityStatus !== null);

const rentalComplete = computed(() => {
  return stepOneData.value.rentalListing.furnishedStatus !== null &&
    stepOneData.value.rentalListing.availabilityStatus !== null &&
    stepOneData.value.rentalListing.isBillsIncluded !== null;
});

const isFormValid = computed(() => {
  if (stepOneData.value.selectedType === 'sale') return saleComplete.value;
  if (stepOneData.value.selectedType === 'rent') return rentalComplete.value;
  return false;
});

const draftHasStepOneData = computed(() => (props.draft.saleListing && saleComplete.value) || (props.draft.rentalListing && rentalComplete.value));

const hasChanges = computed(() => !objectsEqual(initialStepOneData.value, stepOneData.value));

const buttonText = computed(() => {
  if (!isFormValid.value) return 'Save and Continue';
  if (draftHasStepOneData.value && !hasChanges.value) return 'Next Step';
  return 'Save and Continue';
});

const buttonDisabled = computed(() => !isFormValid.value);

function onSelectedTypeChange(newType: string | null) {
  stepOneData.value.selectedType = newType;
  // reset the opposite listing
  if (newType === 'sale') stepOneData.value.rentalListing = createInitialRentalValues(props.draft);
  if (newType === 'rent') stepOneData.value.saleListing = createInitialSaleValues(props.draft);
}

function resetForm() {
  stepOneData.value = JSON.parse(JSON.stringify(initialStepOneData.value));
}

function submitForm() {
  if (!isFormValid.value) return;
  if (!hasChanges.value) {
    console.log('No changes detected, skipping API call');
    emit('nextStep');
    return;
  }

  const stepData = stepOneData.value.selectedType === 'sale'
    ? setStepData('sale', stepOneData.value.saleListing as SaleListingCreateWithoutListingInput)
    : setStepData('rent', stepOneData.value.rentalListing as RentalListingCreateWithoutListingInput);

  emit('updateStepData', stepData, 1);
}
</script>
<style lang="scss">
.step {

  &__required {
    color: var(--error);
  }

  &__form {
    display: flex;
    flex-direction: column;

    &-action {
      align-self: flex-end;
    }
  }
}
</style>