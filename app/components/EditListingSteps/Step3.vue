<template>
  <EditListingStepsStepLayout
    title="Price"
    info="Please provide the pricing details for your listing below."
    :hasChanges="hasChanges"
    :buttonDisabled="buttonDisabled"
    :buttonText="buttonText"
    :errorMessage="errorMessage"
    showPrevious
    @cancel="resetForm"
    @previous="$emit('previousStep')"
    @submit="submitForm"
  >
    <!-- sale specific -->
    <OrganismsListingFormRadioGroup
      v-if="draft.saleListing && stepThreeData.saleListing"
      title="Price type:"
      :options="salePriceTypeOptions"
      v-model="stepThreeData.saleListing.priceType"
      name="sale-price-type"
      :required="true"
    >
      <template #tooltip-content>
        <AtomsTooltipList 
          title="Choose how your price is presented:"
          :items="[
            'Offers Over: You expect bids above the listed price.',
            'Asking Price: A fixed price you\'re aiming for.',
            'Offers in the Region Of: You\'re more open to negotiation, although you expect a final price close to the listed price.'
          ]" 
        />
      </template>
    </OrganismsListingFormRadioGroup>

    <!-- rental specific -->
    <!-- rent frequency -->
    <OrganismsListingFormRadioGroup
      v-if="draft.rentalListing && stepThreeData.rentalListing"
      title="What is the rent frequency for this listing?"
      :options="rentalPriceTypeOptions"
      v-model="stepThreeData.rentalListing.rentFrequency"
      name="rental-frequency"
      :required="true"
    >
      <template #tooltip-content>
        <AtomsTooltipList 
          title="Select the tenancy length:"
          :items="[
            'Short-term: Less than 6 months.',
            'Long-term: 6 months or more.'
          ]" 
        />
      </template>
    </OrganismsListingFormRadioGroup>

    <!-- price input for both sale and rental -->
    <OrganismsListingFormNumberGroup
      :title="draft.saleListing ? 'Price:' : 'Rent:'"
      v-model="stepThreeData.price"
      name="listing-price"
      placeholder="e.g '250000' or '1200'"
      :required="true"
      min="0"
      step="0.01"
    >
      <template #tooltip-content>
        <AtomsTooltipParagraphs :paragraphs="[
          'Sales: Enter the asking price for your property.',
          'Rentals: Enter the rent amount.'
        ]" />
      </template>
    </OrganismsListingFormNumberGroup>

    <!-- deposit -->
    <OrganismsListingFormNumberGroup
      v-if="draft.rentalListing && stepThreeData.rentalListing"
      title="What is the deposit amount for this rental listing?"
      v-model="stepThreeData.rentalListing.deposit"
      name="listing-deposit"
      placeholder="e.g '250000' or '1200'"
      :required="true"
      type="number"
      min="0"
      step="0.01"
    >
      <template #tooltip-content>
        <p class="body-xs">Enter the tenancy deposit amount.</p>
      </template>
    </OrganismsListingFormNumberGroup>

    <!-- holding deposit -->
    <OrganismsListingFormNumberGroup
      v-if="draft.rentalListing && stepThreeData.rentalListing"
      title="What is the holding deposit amount for this rental listing?"
      v-model="stepThreeData.rentalListing.holdingDeposit"
      name="listing-holding-deposit"
      placeholder="e.g '250000' or '1200'"
      type="number"
      min="0"
      step="0.01"
    >
      <template #tooltip-content>
        <AtomsTooltipParagraphs :paragraphs="[
          'Enter the amount to reserve the property while references and contracts are completed.',
          'This must be refundable (in certain circumstances) and is capped at 1 week\'s rent under the Tenants Fees Act 2019.',
          'Use the below link for further information.'
        ]" />
      </template>
    </OrganismsListingFormNumberGroup>

    <!-- Rental Length -->
    <OrganismsListingFormNumberGroup
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
      
  </EditListingStepsStepLayout>
</template>
<script setup lang="ts">

const props = defineProps<{
  draft: DraftListingWithFullPayload;
  errorMessage?: string;
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
  hasExistingData: stepThreeValidation.hasExistingStepThreeData,
  stepNumber: 3,
}));

// Use the reusable step form composable
const {
  formData: stepThreeData,
  hasChanges,
  buttonDisabled,
  buttonText,
  resetForm,
  submitForm: handleSubmit
} = useListingStepForm(stepConfig, props.draft);

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
