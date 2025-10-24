<template>
  <EditListingStepsStepLayout
    title="Bedrooms & Bathrooms"
    info="Please add all the bedrooms and bathrooms for your property, and insert their features. The more detailed you can be, the more likely you are to find the right viewer!"
    :hasChanges="hasChanges"
    :buttonDisabled="buttonDisabled"
    :buttonText="buttonText"
    :errorMessage="errorMessage"
    showPrevious
    @cancel="resetForm"
    @previous="$emit('previousStep')"
    @submit="submitForm"
  >
  <AtomsDivider />
    <!-- Bedrooms Section -->
    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Bedrooms"
        variant="section"
      />
      <em class="body-xs">Optional, add bedroom details</em>
      <OrganismsListingBedroomForm
        v-model="stepFiveData.property.bedroomFeatures"
        :total-floors="stepFiveData.property.totalFloors"
      />
    </div>
    <AtomsDivider />
    <!-- Bathrooms Section -->
    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Bathrooms" 
        variant="section"
      />
      <em class="body-xs">Optional, add bathroom details</em>
      <OrganismsListingBathroomForm
        v-model="stepFiveData.property.bathroomFeatures"
        :total-floors="stepFiveData.property.totalFloors"
      />
    </div>
  </EditListingStepsStepLayout>
</template>

<script setup lang="ts">

const props = defineProps<{
  draft: DraftListingWithFullPayload;
  errorMessage?: string;
}>();

const emit = defineEmits<{
  'updateStepData': [stepData: StepFive, step: number];
  'previousStep': [];
  'nextStep': [];
}>();

// Create step configuration for the composable
const stepConfig = computed(() => ({
  initialData: createInitialStepFiveValues(props.draft),
  isValid: stepFiveValidation.isStepFiveValid,
  hasExistingData: stepFiveValidation.hasExistingStepFiveData,
  stepNumber: 5,
  beforeSubmit: (data: StepFive) => {
    // Update the number of bedrooms and bathrooms before submitting
    const processedData = { ...data };
    processedData.property.numberBedrooms = processedData.property.bedroomFeatures.length;
    processedData.property.numberBathrooms = processedData.property.bathroomFeatures.length;
    return processedData;
  }
}));

// Use the reusable step form composable
const {
  formData: stepFiveData,
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
      emit('updateStepData', data, 5);
    },
    () => emit('nextStep')
  );
}
</script>

