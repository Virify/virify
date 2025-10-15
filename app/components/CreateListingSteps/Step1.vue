<template>
  <CreateListingStepsStepLayout
    title="Listing Type"
    info="Please provide the type of listing you want to create below. This will help us tailor the rest of the form to your specific needs."
    :formKey="formKey"
    :hasChanges="hasChanges"
    :buttonDisabled="buttonDisabled"
    :buttonText="buttonText"
    :errorMessage="errorMessage"
    @cancel="resetForm"
    @submit="submitForm"
  >
    <!-- first parent select -->
    <OrganismsDraftFormRadioGroup 
      v-if="!draft.saleListing && !draft.rentalListing"
      title="What type of listing do you want to create?" 
      :options="stepOneListingOptions" 
      v-model="stepOneData.selectedType"
      tooltip="Select the type of listing you want to create. This will help us tailor the rest of the form to your specific needs."
      @update:modelValue="onSelectedTypeChange"
      name="listing-type" 
      :required="true" 
    >
      <template #tooltip-content>
        <AtomsTooltipParagraphs :paragraphs="[
          'Select the type of listing you want to create. This will help us tailor the rest of the form to your specific needs.'
        ]" />
      </template>
    </OrganismsDraftFormRadioGroup>

    <!-- SALE -->
    <OrganismsDraftFormRadioGroup 
      v-if="isSale" 
      title="Please confirm property tenure"
      :options="saleListingTenureOptions"
      v-model="stepOneData.saleListing.tenureType" 
      name="sale-tenure-type"
      :required="true"
    >
      <template #tooltip-content>
        <AtomsTooltipParagraphs :paragraphs="[
          'Freehold: You own the property and the land it sits on indefinitely.',
          'Leasehold: You have the right to live in the property for a period of time, but you do not own the land it stands on.',
          'Commonhold: Typically used on multi-occupancy developments. You own your part of the property on a freehold basis, but an association (or other entity) owns and manages the common parts.'
        ]" />
      </template>
    </OrganismsDraftFormRadioGroup>

    <OrganismsDraftFormRadioGroup 
      v-if="isSale" 
      title="Are you part of a chain?"
      :options="saleListingChainOptions" 
      v-model="stepOneData.saleListing.chain" 
      name="sale-chain" 
    >
      <template #tooltip-content>
        <AtomsTooltipList
          title="Select whether the sale depends on another property transaction:"
          :items="[
            'Chain free: The sale is not dependant on you moving to another property.',
            'Chain: The sale is dependant on you moving out and to another property.'
          ]" 
        />
      </template>
    </OrganismsDraftFormRadioGroup>

    <!-- RENTAL -->
    <OrganismsDraftFormRadioGroup 
      v-if="isRent" 
      title="Are bills included in the rent?"
      :options="rentalBillsIncludedOptions" 
      v-model="stepOneData.rentalListing.isBillsIncluded"
      name="rental-bills-included" 
      :required="true" 
    >
      <template #tooltip-content>
        <AtomsTooltipParagraphs :paragraphs="[
          'Specify if any property bills (such as gas and electric) are included in the price.',
          'If so, it\'s best to list which bills are included within your Property Description.'
        ]" />
      </template>
    </OrganismsDraftFormRadioGroup>

    <OrganismsDraftFormRadioGroup 
      v-if="isRent" 
      title="What is the furnished status of the listing?"
      :options="rentalFurnishedStatusOptions" 
      v-model="stepOneData.rentalListing.furnishedStatus"
      name="rental-furnished-status" 
      :required="true" 
    >
      <template #tooltip-content>
        <AtomsTooltipList :items="[
          'Fully furnished: The property comes with everything you need to move in and live comfortably right away.',
          'Part furnished: The property includes certain appliances and some furniture, but what\'s included can vary a lot.',
          'Unfurnished: The property will generally not include appliances or furniture.'
        ]" />
      </template>
    </OrganismsDraftFormRadioGroup>
  </CreateListingStepsStepLayout>
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
} = useDraftStepForm(stepConfig, props.draft);

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
