<template>
  <CreateListingStepsStepLayout
    title="Price"
    info="Please provide the pricing details for your listing below."
    :hasChanges="hasChanges"
    :buttonDisabled="buttonDisabled"
    :buttonText="buttonText"
    showPrevious
    @cancel="resetForm"
    @previous="$emit('previousStep')"
    @submit="submitForm"
  >
    <!-- sale specific -->
    <OrganismsDraftFormRadioGroup
      v-if="draft.saleListing && stepThreeData.saleListing"
      title="What is the sale price type for this listing?"
      :options="salePriceTypeOptions"
      v-model="stepThreeData.saleListing.priceType"
      name="sale-price-type"
      :required="true"
    />

    <!-- rental specific -->
    <!-- rent frequency -->
    <OrganismsDraftFormRadioGroup
      v-if="draft.rentalListing && stepThreeData.rentalListing"
      title="What is the rent frequency for this listing?"
      :options="rentalPriceTypeOptions"
      v-model="stepThreeData.rentalListing.rentFrequency"
      name="rental-frequency"
      :required="true"
    />

    <!-- price input for both sale and rental -->
    <OrganismsDraftFormNumberGroup
      :title="draft.saleListing ? 'What is the sale price for this property?' : 'What is the rental price for this property?'"
      v-model="stepThreeData.price"
      name="listing-price"
      placeholder="e.g '250000' or '1200'"
      :required="true"
      min="0"
      step="0.01"
    />

    <!-- deposit -->
    <OrganismsDraftFormNumberGroup
      v-if="draft.rentalListing && stepThreeData.rentalListing"
      title="What is the deposit amount for this rental listing?"
      v-model="stepThreeData.rentalListing.deposit"
      name="listing-deposit"
      placeholder="e.g '250000' or '1200'"
      :required="true"
      type="number"
      min="0"
      step="0.01"
    />

    <!-- holding deposit -->
    <OrganismsDraftFormNumberGroup
      v-if="draft.rentalListing && stepThreeData.rentalListing"
      title="What is the holding deposit amount for this rental listing?"
      v-model="stepThreeData.rentalListing.holdingDeposit"
      name="listing-holding-deposit"
      placeholder="e.g '250000' or '1200'"
      type="number"
      min="0"
      step="0.01"
    />

    <!-- Rental Length -->
    <OrganismsDraftFormNumberGroup
      v-if="draft.rentalListing && stepThreeData.rentalListing"
      title="How long is the rental period in months?"
      v-model="stepThreeData.rentalListing.rentalLength"
      name="listing-rental-length"
      placeholder="e.g '12'or '6 months'"
      :required="true"
      type="number"
      min="0"
      step="0.01"
    />
      
  </CreateListingStepsStepLayout>
</template>
<script setup lang="ts">

const props = defineProps<{
  draft: DraftListingWithFullPayload
}>()

const emit = defineEmits<{
  'updateStepData': [stepData: StepThree, step: number];
  'previousStep': [];
  'nextStep': [];
}>();

// Create step configuration for the composable
const stepConfig = computed(() => ({
  initialData: createInitialStepThreeValues(props.draft),
  isValid: (data: StepThree) => stepThreeValidation.isStepThreeValid(data, props.draft),
  hasExistingData: stepThreeValidation.hasExistingStepThreeData
}));

// Use the reusable step form composable
const {
  formData: stepThreeData,
  hasChanges,
  buttonDisabled,
  buttonText,
  resetForm,
  submitForm: handleSubmit
} = useDraftStepForm(stepConfig, props.draft);

/**
 * Handle form submission
 */
function submitForm() {
  handleSubmit(
    (data) => {
      emit('updateStepData', data, 3);
    },
    () => emit('nextStep')
  );
}

</script>
<style lang="scss">
.step {
  &__form {
    &-price-input {
      input {
        margin: 0 auto;
        max-width: 200px;
      }
    }
  }
}
</style>