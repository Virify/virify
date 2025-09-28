<template>
  <CreateListingStepsStepLayout
    title="Property Basics"
    info="Please provide the basic details about the property you are listing below."
    :hasChanges="hasChanges"
    :buttonDisabled="buttonDisabled"
    :buttonText="buttonText"
    :errorMessage="errorMessage"
    showPrevious
    @cancel="resetForm"
    @previous="$emit('previousStep')"
    @submit="submitForm"
  >
      <OrganismsDraftFormRadioGroup 
        title="What type of property are you listing?" 
        :options="propertyTypeSelectOptions" 
        v-model="stepTwoData.property.type"
        @update:modelValue="onPropertyTypeChange"
        name="listing-type" 
        :required="true" 
      />

      <OrganismsDraftFormRadioGroup 
        v-if="stepTwoData.property.type !== null"
        title="What is the classification of the property?" 
        :options="getPropertyClassifications(stepTwoData.property.type)" 
        v-model="stepTwoData.property.classification"
        name="property-classification" 
        :required="true"
      />

      <OrganismsDraftFormTextGroup
        title="Please provide a short description of the property - your property features speak for itself!"
        v-model="stepTwoData.property.description"
        name="property-description"
        placeholder="e.g 'This charming 2-bedroom apartment offers stunning views etc...'"
        :required="true"
      />

      <OrganismsDraftFormNumberGroup
        title="How many total floors does the property have (including the ground floor)?"
        :info="totalFloorsInfo"
        v-model="stepTwoData.property.totalFloors"
        name="property-floors"
        placeholder="e.g '2'"
        :required="true"
        :disabled="isTotalFloorsDisabled"
        min="1"
        step="1"
        max="100"
      />

      <OrganismsDraftFormRadioGroup
        title="What is the construction type of the property?" 
        :options="constructionOptions" 
        v-model="stepTwoData.property.constructionType"
        name="property-construction-type"       
      />

      <OrganismsDraftFormSizeToggle
        title="What is your property's total size?"
        :options="sizeOptions"
        v-model:unit="sizeToConvert"
        v-model:size="stepTwoData.property.size"
        name="property-size"
      />

      <OrganismsDraftFormSelectGroup
        title="What year was the property built?"
        :options="yearBuiltOptions"
        v-model="stepTwoData.property.yearBuilt"
        name="year-built"
      />
    
  </CreateListingStepsStepLayout>
</template>
<script setup lang="ts">

const props = defineProps<{
  draft: DraftListingWithFullPayload;
  errorMessage?: string;
}>();

const emit = defineEmits<{
  'updateStepData': [stepData: StepTwo, step: number];
  'previousStep': [];
  'nextStep': [];
}>();

// Size conversion state (outside of form data as it's UI-only)
const sizeToConvert = ref<string>('meter');

// Check if totalFloors should be disabled (when rooms already exist)
const isTotalFloorsDisabled = computed(() => {
  const hasBedroomFeatures = (props.draft.property?.bedroomFeatures?.length ?? 0) > 0;
  const hasBathroomFeatures = (props.draft.property?.bathroomFeatures?.length ?? 0) > 0;
  return hasBedroomFeatures || hasBathroomFeatures;
});

// Dynamic info text for totalFloors field
const totalFloorsInfo = computed(() => {
    return "Total floors cannot be changed after adding bedrooms or bathrooms. To change this, remove all rooms first.";
});

// Create step configuration for the composable
const stepConfig = computed(() => ({
  initialData: createInitialStepTwoValues(props.draft),
  isValid: stepTwoValidation.isStepTwoValid,
  hasExistingData: stepTwoValidation.hasExistingStepTwoData,
  beforeSubmit: (data: StepTwo) => {
    const processedData = { ...data };
    
    // Set year built to null if '0' (Not Specified) is selected to maintain type consistency
    if (processedData.property.yearBuilt === '0') {
      processedData.property.yearBuilt = null;
    }

    // Convert size to meters if the selected unit is feet
    if (sizeToConvert.value === 'feet' && processedData.property.size) {
      processedData.property.size = convertFeetToMeters(processedData.property.size);
    }

    return processedData;
  }
}));

// Use the reusable step form composable
const {
  formData: stepTwoData,
  hasChanges,
  buttonDisabled,
  buttonText,
  resetForm,
  submitForm: handleSubmit
} = useDraftStepForm(stepConfig, props.draft);

/**
 * Handler for user-driven property type changes.
 * We attach this to the radio group's `update:modelValue` event so
 * programmatic resets (which directly assign the object) won't trigger it.
 */
function onPropertyTypeChange(newType: string | null) {
  stepTwoData.value.property.classification = null;
}

/**
 * Handle form submission
 */
function submitForm() {
  handleSubmit(
    (data) => {
      emit('updateStepData', data, 2);
    },
    () => emit('nextStep')
  );
}
</script>
<style lang="scss">
// inherited from step 1
.step {
  &__form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: var(--size-32);
    flex-wrap: wrap;
    gap: var(--size-16);

    &--right {
      display: flex;
      gap: var(--size-16);
    }
  }
}
</style>