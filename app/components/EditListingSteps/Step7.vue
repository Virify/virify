<template>
  <EditListingStepsStepLayout
    title="Outdoor Spaces & Utilities"
    info="Please add details about your outdoor space. Your property is more likely to stand out if you create a detailed listing! If you have specific outdoor features, gardens, yards, or additional land, be sure to include them below."
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

    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Outdoor Space Description" 
        :required="false"
        variant="section"
      />
      
      <OrganismsListingFormTextGroup
        title="Describe your general outdoor space"
        v-model="stepSevenData.property.outdoorSpace.description"
        name="outdoor-space-description"
        placeholder="Describe the outdoor space..."
        :expanded="true"
      >
        <template #tooltip-content>
          <p>Add any additional details about the outdoor space that potential buyers should know. For example: landscaping, privacy, outdoor lighting, irrigation system, etc.</p>
        </template>
      </OrganismsListingFormTextGroup>
    </div>

    <AtomsDivider />

    <!-- General Outdoor Features -->
    <div class="step__section">
      <MoleculesListingFormHeading 
        title="General Outdoor Features" 
        :required="false"
        variant="section"
      />
      
      <OrganismsListingFormCheckboxGroup
        title="Select your outdoor features"
        :options="outdoorSpaceFeaturesOptions"
        :model-value="getSelectedOutdoorSpaceFeatures()"
        name="outdoor-space-features"
        @update:modelValue="updateOutdoorSpaceFeatures"
      >
        <template #tooltip-content>
          <p>Select any features that apply to the entire outdoor space (not specific to individual gardens, yards, or land). These are general features that describe the overall outdoor area.</p>
        </template>
      </OrganismsListingFormCheckboxGroup>
    </div>

    <AtomsDivider />

    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Total Outdoor Area" 
        :required="false"
        variant="section"
      />
      
      <OrganismsListingFormSizeToggle
        title="Total Outdoor Area"
        :options="sizeOptions"
        :unit="'meter'"
        :size="stepSevenData.property.outdoorSpace.totalArea"
        name="total-outdoor-area"
        @update:unit="() => {}"
        @update:size="(value: number | null) => stepSevenData.property.outdoorSpace.totalArea = value"
      >
        <template #tooltip-content>
          <p>Not sure how to measure? See our <NuxtLink to="/guides/property-information/guide-to-measuring-land-size" target="_blank" rel="noopener" class="link">Total Land Size (Acres) guide.</NuxtLink></p>
        </template>
      </OrganismsListingFormSizeToggle>
    </div>

    <AtomsDivider />

    <!-- Garden Section -->
    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Gardens" 
        :required="false"
        variant="section"
      />
      
      <OrganismsListingGardenForm
        v-model="stepSevenData.property.outdoorSpace.garden"
      />
    </div>

    <AtomsDivider />

    <!-- Yard Section -->
    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Yards" 
        :required="false"
        variant="section"
      />
      
      <OrganismsListingYardForm
        v-model="stepSevenData.property.outdoorSpace.yard"
      />
    </div>

    <AtomsDivider />

    <!-- Land Section -->
    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Additional Land" 
        :required="false"
        variant="section"
      />
      
      <OrganismsListingLandForm
        v-model="stepSevenData.property.outdoorSpace.land"
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
  'updateStepData': [stepData: StepSeven, step: number];
  'previousStep': [];
  'nextStep': [];
}>();

const stepConfig = computed(() => ({
  initialData: createInitialStepSevenValues(props.draft),
  isValid: stepSevenValidation.isStepSevenValid,
  hasExistingData: stepSevenValidation.hasExistingStepSevenData,
  stepNumber: 7,
  beforeSubmit: (data: StepSeven) => {
    // Update the has* flags based on array lengths before submitting
    const processedData = { ...data };
    processedData.property.outdoorSpace.hasGarden = processedData.property.outdoorSpace.garden.length > 0;
    processedData.property.outdoorSpace.hasYard = processedData.property.outdoorSpace.yard.length > 0;
    processedData.property.outdoorSpace.hasLand = processedData.property.outdoorSpace.land.length > 0;
    return processedData;
  }
}));

const {
  formData: stepSevenData,
  hasChanges,
  buttonDisabled,
  buttonText,
  resetForm,
  submitForm: handleSubmit,
} = useListingStepForm(stepConfig, props.draft);

// OutdoorSpace features checkbox management
const getSelectedOutdoorSpaceFeatures = () => {
  return stepSevenData.value.property.outdoorSpace.features || [];
};

const updateOutdoorSpaceFeatures = (selectedFeatures: string[]) => {
  stepSevenData.value.property.outdoorSpace.features = selectedFeatures;
};

function submitForm() {
  handleSubmit(
    (data) => {
      emit('updateStepData', data, 7);
    },
    () => emit('nextStep')
  );
}
</script>


