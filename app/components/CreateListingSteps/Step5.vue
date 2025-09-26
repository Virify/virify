<template>
  <CreateListingStepsStepLayout
    title="Bedrooms"
    info="Please provide the bedroom details for the property. You can add multiple bedrooms and specify their features. This information is crucial for potential buyers or renters to understand the layout and amenities of the property."
    :hasChanges="hasChanges"
    :buttonDisabled="buttonDisabled"
    :buttonText="buttonText"
    showPrevious
    @cancel="resetForm"
    @previous="$emit('previousStep')"
    @submit="submitForm"
  >
    <!-- Bedrooms Section -->
    <div class="step__section">
      <OrganismsDraftBedroomForm
        v-model="stepFiveData.property.bedroomFeatures"
        :total-floors="stepFiveData.property.totalFloors"
      />
    </div>
  </CreateListingStepsStepLayout>
</template>

<script setup lang="ts">

const props = defineProps<{
  draft: DraftListingWithFullPayload;
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
  beforeSubmit: (data: StepFive) => {
    // Update the number of bedrooms before submitting
    const processedData = { ...data };
    processedData.property.numberBedrooms = processedData.property.bedroomFeatures.length;
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
} = useDraftStepForm(stepConfig, props.draft);

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

<style lang="scss">
.step {
  &__section {
    border-bottom: 1px solid var(--border-200);
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  &__section-title {
    margin-bottom: var(--size-24);
    text-align: center;
  }
  
  &__items {
    padding-top: var(--size-24);
    display: flex;
    flex-direction: column;
    gap: var(--size-48);
  }
  
  &__item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--size-24);
    padding-bottom: var(--size-16);
  }
  
  &__remove-btn {
    color: var(--error);
    background: none;
    border: 1px solid var(--error);
    padding: var(--size-8) var(--size-16);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    
    &:hover {
      background: var(--error);
      color: var(--background-50);
    }
  }
  
  &__form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--size-24);
    margin-bottom: var(--size-24);
    justify-content: flex-start;
    align-items: flex-start;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
    
    .o-form-group {
      padding: 0;
    }
  }
  
  &__add-item {
    display: flex;
    justify-content: center;
    margin-top: var(--size-32);
  }
}
</style>