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
    <MoleculesListingFormSection v-if="draft.saleListing && stepThreeData.saleListing" title="Sale Price Type" required>
      <OrganismsListingFormRadioGroup
        title="Price type:"
        :options="salePriceTypeOptions"
        v-model="stepThreeData.saleListing.priceType"
        name="sale-price-type"
        :required="true"
      >
        <template #tooltip-content>
          <p><strong>Offers Over:</strong> You expect bids above the listed price.</p>
          <p><strong>Asking Price:</strong> A fixed price you're aiming for.</p>
          <p><strong>Offers in the Region Of:</strong> You're more open to negotiation, although you expect a final price close to the listed price.</p>
          <p>For more information see our <NuxtLink to="/guides/buying/offer-types" target="_blank" rel="noopener" class="link">Offer Types</NuxtLink> guide.</p>
        </template>
      </OrganismsListingFormRadioGroup>
    </MoleculesListingFormSection>
    
    <AtomsDivider v-if="draft.saleListing && stepThreeData.saleListing" />

    <MoleculesListingFormSection v-if="draft.rentalListing && stepThreeData.rentalListing" title="Rental Frequency">
      <OrganismsListingFormRadioGroup
        title="What is the rent frequency for this listing?"
        :options="rentalPriceTypeOptions"
        v-model="stepThreeData.rentalListing.rentFrequency"
        name="rental-frequency"
        :required="true"
      >
        <template #tooltip-content>
          <p><strong>Monthly:</strong> Rent is paid every month.</p>
          <p><strong>Weekly:</strong> Rent is paid every week.</p>
        </template>
      </OrganismsListingFormRadioGroup>
    </MoleculesListingFormSection>

    <AtomsDivider v-if="draft.rentalListing && stepThreeData.rentalListing" />

    <MoleculesListingFormSection :title="draft.saleListing ? 'Sale Price' : 'Rental Amount'" :required="true">
      <OrganismsListingFormNumberGroup
        :title="draft.saleListing ? 'Insert sale price.' : 'Insert rental amount.'"
        v-model="stepThreeData.price"
        name="listing-price"
        placeholder="e.g '250000' or '1200'"
        :required="true"
        min="0"
        step="0.01"
      >
      </OrganismsListingFormNumberGroup>
    </MoleculesListingFormSection>

    <AtomsDivider v-if="draft.rentalListing && stepThreeData.rentalListing" />

    <MoleculesListingFormSection v-if="draft.rentalListing && stepThreeData.rentalListing" title="Tenancy/Rental Deposit" required>
      <OrganismsListingFormNumberGroup
        title="Insert the tenancy/rental deposit amount."
        v-model="stepThreeData.rentalListing.deposit"
        name="listing-deposit"
        placeholder="e.g '1200' or '0'"
        :required="true"
        type="number"
        min="0"
        step="0.01"
      >
        <template #tooltip-content>
          <p>For more information see our <NuxtLink to="/guides/rentals/tenancy-and-holding-deposits" target="_blank" rel="noopener" class="link">Tenancy and Holding Deposits</NuxtLink> guide.</p>
        </template>
      </OrganismsListingFormNumberGroup>
    </MoleculesListingFormSection>

    <AtomsDivider v-if="draft.rentalListing && stepThreeData.rentalListing" />

    <MoleculesListingFormSection v-if="draft.rentalListing && stepThreeData.rentalListing" title="Holding Deposit" required>
      <OrganismsListingFormNumberGroup
        title="Insert holding deposit amount."
        v-model="stepThreeData.rentalListing.holdingDeposit"
        name="listing-holding-deposit"
        placeholder="e.g '300' or '0'"
        type="number"
        min="0"
        step="0.01"
        :required="true"
      >
        <template #tooltip-content>
          <p>This must be refundable (in certain circumstances) and is capped at 1 week's rent under the Tenants Fees Act 2019.</p>
          <p>For more information see our <NuxtLink to="/guides/rentals/tenancy-and-holding-deposits" target="_blank" rel="noopener" class="link">Tenancy and Holding Deposits</NuxtLink> guide.</p>
        </template>
      </OrganismsListingFormNumberGroup>
    </MoleculesListingFormSection>
    
    <AtomsDivider v-if="draft.rentalListing && stepThreeData.rentalListing" />

    <MoleculesListingFormSection v-if="draft.rentalListing && stepThreeData.rentalListing" title="Tenancy Duration" required>
      <OrganismsListingFormRadioGroup
        title="Tenancy duration."
        :options="[
          { value: 'SHORT_TERM', key: 'Short term', info: 'A tenancy of less than 6 months.' },
          { value: 'LONG_TERM', key: 'Long term', info: 'A tenancy of 6 months or more.' }
        ]"
        v-model="stepThreeData.rentalListing.rentalLength"
        name="listing-rental-length"
        :required="true"
      >
        <template #tooltip-content>
          <p><strong>Short-term:</strong> Less than 6 months.</p>
          <p><strong>Long-term:</strong> 6 months or more.</p>
        </template>
      </OrganismsListingFormRadioGroup>
    </MoleculesListingFormSection>

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
