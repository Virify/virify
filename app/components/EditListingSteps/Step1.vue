<template>
  <EditListingStepsStepLayout
    :title="stepOneData.selectedType === 'sale' ? 'Listing Type - Sale' : stepOneData.selectedType === 'rent' ? 'Listing Type - Rental' : 'Listing Type'"
    info="Are you selling or renting out a property? Your selection tailors the rest of the form."
    :formKey="formKey"
    :hasChanges="hasChanges"
    :buttonDisabled="buttonDisabled"
    :buttonText="buttonText"
    :errorMessage="errorMessage"
    @cancel="resetForm"
    @submit="submitForm"
  >
    <!-- first parent select -->
    <MoleculesListingFormSection
      v-if="!draft.saleListing && !draft.rentalListing"
      title="Sale or Rental?"
      :required="true"
    > 
      <OrganismsListingFormRadioGroup 
        title="For Sale / For Rent" 
        :options="stepOneListingOptions" 
        v-model="stepOneData.selectedType"
        @update:modelValue="onSelectedTypeChange"
        name="listing-type" 
        :required="true" 
      />
    </MoleculesListingFormSection>

    <AtomsDivider v-if="stepOneData.selectedType && !draft.saleListing && !draft.rentalListing" />

    <!-- SALE -->
    <MoleculesListingFormSection
      v-if="isSale" 
      title="Property Tenure"
      :required="true"
    >
      <OrganismsListingFormRadioGroup 
        title="Select property tenure"
        :options="saleListingTenureOptions"
        v-model="stepOneData.saleListing.tenureType" 
        name="sale-tenure-type"
        :required="true"
      >
        <template #tooltip-content>
          <p><strong>Freehold</strong><br>You own the property and the land it sits on indefinitely.</p>
          <p><strong>Leasehold</strong><br>You have the right to live in the property for a period of time, but you do not own the land it stands on.</p>
          <p><strong>Commonhold</strong><br>You own your part of the property on a freehold basis, but an association (or other entity) owns and manages the common parts.</p>
          <p>For more info, head to our <NuxtLink to="/guides/property-information/what-is-tenure" target="_blank" rel="noopener" class="link">What is 'Tenure'?</NuxtLink> guide.</p>
        </template>
      </OrganismsListingFormRadioGroup>
    </MoleculesListingFormSection>

    <AtomsDivider v-if="isSale"/>

    <MoleculesListingFormSection
      v-if="isSale" 
      title="Chain Status"
    >
      <OrganismsListingFormRadioGroup 
        title="Are you part of a chain?"
        :options="saleListingChainOptions" 
        v-model="stepOneData.saleListing.chain" 
        name="sale-chain" 
      >
        <template #tooltip-content>
          <p><strong>No chain</strong><br>Your sale is not dependant on you buying and/or moving to another property.</p>
          <p><strong>Chain</strong><br>You need to buy and/or move to another property before this sale goes through.</p>
        </template>
      </OrganismsListingFormRadioGroup>
    </MoleculesListingFormSection>


    <!-- RENTAL -->
    <MoleculesListingFormSection
      v-if="isRent" 
      title="Bills Included"
      :required="true"
    >
      <OrganismsListingFormRadioGroup 
        title="Are bills included in the rent?"
        :options="rentalBillsIncludedOptions" 
        v-model="stepOneData.rentalListing.isBillsIncluded"
        name="rental-bills-included" 
        :required="true" 
      >
        <template #tooltip-content>
          <p>If bills such as gas, electric, water are included tick Yes. Be sure to list these in your property description.</p>
        </template>
      </OrganismsListingFormRadioGroup>
    </MoleculesListingFormSection>

    <AtomsDivider v-if="isRent"/>

    <MoleculesListingFormSection
      v-if="isRent" 
      title="Furnished Status"
      :required="true"
    >
      <OrganismsListingFormRadioGroup 
        title="Select furnished status"
        :options="rentalFurnishedStatusOptions"
        v-model="stepOneData.rentalListing.furnishedStatus"
        name="rental-furnished-status" 
        :required="true" 
      >
        <template #tooltip-content>
          <p><strong>Furnished</strong><br>Ready to move in with furniture provided.</p>
          <p><strong>Part furnished</strong><br>Some furniture or appliances included (varies).</p>
          <p><strong>Unfurnished</strong><br>No furniture or appliances included.</p>
        </template>
      </OrganismsListingFormRadioGroup>
    </MoleculesListingFormSection>
  </EditListingStepsStepLayout>
</template>

<script setup lang="ts">
import type { SaleListingCreateWithoutListingInput, RentalListingCreateWithoutListingInput } from '~~/layers/database/server/database/prisma/generated/models';

const props = defineProps<{
  draft: DraftListingWithFullPayload;
  errorMessage?: string;
}>()

const emit = defineEmits<{
  'updateStepData': [stepData: StepOne, step: number];
  'nextStep': [];
}>();

// Create step configuration for the composable
const stepConfig = computed(() => ({
  initialData: {
    selectedType: props.draft.saleListing ? 'sale' : props.draft.rentalListing ? 'rent' : null,
    saleListing: createInitialSaleValues(props.draft),
    rentalListing: createInitialRentalValues(props.draft)
  },
  isValid: stepOneValidation.isStepOneValid,
  hasExistingData: stepOneValidation.hasExistingStepOneData,
  stepNumber: 1,
}));

// Use the reusable step form composable
const {
  formData: stepOneData,
  formKey,
  isFormValid,
  hasChanges,
  buttonDisabled,
  buttonText,
  resetForm,
  submitForm: handleSubmit
} = useListingStepForm(stepConfig, props.draft);

// Computed properties for template conditions
const isSale = computed(() => stepOneData.value.selectedType === 'sale');
const isRent = computed(() => stepOneData.value.selectedType === 'rent');

// Handle type selection change
function onSelectedTypeChange(newType: string | null) {
  stepOneData.value.selectedType = newType;
  // reset the opposite listing
  if (newType === 'sale') stepOneData.value.rentalListing = createInitialRentalValues(props.draft);
  if (newType === 'rent') stepOneData.value.saleListing = createInitialSaleValues(props.draft);
}

// Handle form submission
function submitForm() {
  handleSubmit(
    (data) => {
      const stepData = data.selectedType === 'sale'
        ? setStepData('sale', data.saleListing as SaleListingCreateWithoutListingInput)
        : setStepData('rent', data.rentalListing as RentalListingCreateWithoutListingInput);
      
      emit('updateStepData', stepData, 1);
    },
        () => emit('nextStep')
  );
}
</script>
