<template>
  <CreateListingStepsStepLayout
    title="Property Features"
    info="Add details about additional features, parking, security, accessibility, and storage options for your property."
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

    <!-- Additional Features -->
    <div class="step__section">
      <MoleculesDraftFormHeading 
        title="Additional Features" 
        variant="section"
      />
      <em class="body-xs">Optional, describe additional features and amenities</em>
      
      <OrganismsDraftFormTextGroup
        title="Description"
        v-model="(stepEightData.property.additionalFeatures as any).description"
        name="additional-features-description"
        placeholder="Describe additional features..."
        :expanded="true"
      />

      <OrganismsDraftFormCheckboxGroup
        title="Features"
        :options="additionalFeaturesOptions"
        :model-value="additionalFeatures.selected.value"
        @update:modelValue="additionalFeatures.update"
        name="additional-features"
      />
    </div>

    <AtomsDivider />

    <!-- Parking -->
    <div class="step__section">
      <MoleculesDraftFormHeading 
        title="Parking" 
        :required="false"
        variant="section"
      />
      <em class="body-xs">Optional, add parking details</em>
      
      <OrganismsDraftFormTextGroup
        title="Description"
        v-model="(stepEightData.property.parking as any).description"
        name="parking-description"
        placeholder="Describe parking arrangements..."
        :expanded="true"
      />

      <OrganismsDraftFormCheckboxGroup
        title="Parking Options"
        :options="parkingOptions"
        :model-value="parkingFeatures.selected.value"
        @update:modelValue="parkingFeatures.update"
        name="parking"
      />
    </div>

    <AtomsDivider />

    <!-- Security Features -->
    <div class="step__section">
      <MoleculesDraftFormHeading 
        title="Security Features" 
        :required="false"
        variant="section"
      />
      <em class="body-xs">Optional, add security features</em>
      
      <OrganismsDraftFormTextGroup
        title="Description"
        v-model="(stepEightData.property.securityFeatures as any).description"
        name="security-description"
        placeholder="Describe security features..."
        :expanded="true"
      />

      <OrganismsDraftFormCheckboxGroup
        title="Security Options"
        :options="securityOptions"
        :model-value="securityFeatures.selected.value"
        @update:modelValue="securityFeatures.update"
        name="security"
      />
    </div>

    <AtomsDivider />

    <!-- Accessibility Features -->
    <div class="step__section">
      <MoleculesDraftFormHeading 
        title="Accessibility Features" 
        :required="false"
        variant="section"
      />
      <em class="body-xs">Optional, add accessibility features</em>
      
      <OrganismsDraftFormTextGroup
        title="Description"
        v-model="(stepEightData.property.accessibilityFeatures as any).description"
        name="accessibility-description"
        placeholder="Describe accessibility features..."
        :expanded="true"
      />

      <OrganismsDraftFormCheckboxGroup
        title="Accessibility Options"
        :options="accessibilityOptions"
        :model-value="accessibilityFeatures.selected.value"
        @update:modelValue="accessibilityFeatures.update"
        name="accessibility"
      />
    </div>

    <AtomsDivider />

    <!-- Storage Features -->
    <div class="step__section">
      <MoleculesDraftFormHeading 
        title="Storage Features" 
        :required="false"
        variant="section"
      />
      <em class="body-xs">Optional, add storage features</em>
      
      <OrganismsDraftFormTextGroup
        title="Description"
        v-model="(stepEightData.property.storageFeatures as any).description"
        name="storage-description"
        placeholder="Describe storage features..."
        :expanded="true"
      />

      <OrganismsDraftFormCheckboxGroup
        title="Storage Options"
        :options="storageOptions"
        :model-value="storageFeatures.selected.value"
        @update:modelValue="storageFeatures.update"
        name="storage"
      />
    </div>

    <AtomsDivider />

  </CreateListingStepsStepLayout>
</template>

<script setup lang="ts">

const props = defineProps<{
  draft: DraftListingWithFullPayload;
  errorMessage?: string;
}>();

const emit = defineEmits<{
  'updateStepData': [stepData: StepEight, step: number];
  'previousStep': [];
  'nextStep': [];
}>();

const stepConfig = computed(() => ({
  initialData: createInitialStepEightValues(props.draft),
  isValid: (data: StepEight) => stepEightValidation.isStepEightValid(data, props.draft),
  hasExistingData: stepEightValidation.hasExistingStepEightData,
}));

const {
  formData: stepEightData,
  hasChanges,
  buttonDisabled,
  buttonText,
  resetForm,
  submitForm: handleSubmit,
} = useDraftStepForm(stepConfig, props.draft);

// Use composables for each feature section
const additionalFeatures = useAdditionalFeatures(stepEightData);
const parkingFeatures = useParking(stepEightData);
const securityFeatures = useSecurity(stepEightData);
const accessibilityFeatures = useAccessibility(stepEightData);
const storageFeatures = useStorageFeatures(stepEightData);

function submitForm() {
  handleSubmit(
    (data) => {
      emit('updateStepData', data, 8);
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
    display: flex;
    justify-content: flex-start;
    color: var(--secondary-400);
    margin-bottom: 0;

    &--require {
      color: var(--error);
    }
  }
}
</style>
