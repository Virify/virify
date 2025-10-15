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
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Describe any special features, amenities, or unique selling points of the property that don\'t fit in other categories.'
          ]" />
        </template>
      </OrganismsDraftFormTextGroup>

      <OrganismsDraftFormCheckboxGroup
        title="Features"
        :options="additionalFeaturesOptions"
        :model-value="additionalFeatures.selected.value"
        @update:modelValue="additionalFeatures.update"
        name="additional-features"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Select amenities and features that add value to the property, such as pet-friendly policies, pool, gym, concierge services, etc.'
          ]" />
        </template>
      </OrganismsDraftFormCheckboxGroup>
    </div>

    <AtomsDivider />

    <!-- Parking -->
    <div class="step__section">
      <MoleculesDraftFormHeading 
        title="Parking" 
        variant="section"
      />
      <em class="body-xs">Optional, add parking details</em>
      
      <OrganismsDraftFormTextGroup
        title="Description"
        v-model="(stepEightData.property.parking as any).description"
        name="parking-description"
        placeholder="Describe parking arrangements..."
        :expanded="true"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Provide details about parking availability, number of spaces, restrictions, or costs associated with parking.'
          ]" />
        </template>
      </OrganismsDraftFormTextGroup>

      <OrganismsDraftFormCheckboxGroup
        title="Parking Options"
        :options="parkingOptions"
        :model-value="parkingFeatures.selected.value"
        @update:modelValue="parkingFeatures.update"
        name="parking"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Select the types of parking available, such as garage, driveway, permit parking, EV charging, etc.'
          ]" />
        </template>
      </OrganismsDraftFormCheckboxGroup>
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
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Detail the security measures in place, including systems, monitoring, and physical security features.'
          ]" />
        </template>
      </OrganismsDraftFormTextGroup>

      <OrganismsDraftFormCheckboxGroup
        title="Security Options"
        :options="securityOptions"
        :model-value="securityFeatures.selected.value"
        @update:modelValue="securityFeatures.update"
        name="security"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Select the security features available, such as CCTV, alarm systems, gated community, 24/7 security, etc.'
          ]" />
        </template>
      </OrganismsDraftFormCheckboxGroup>
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
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Describe accessibility adaptations and features that make the property suitable for people with mobility challenges or disabilities.'
          ]" />
        </template>
      </OrganismsDraftFormTextGroup>

      <OrganismsDraftFormCheckboxGroup
        title="Accessibility Options"
        :options="accessibilityOptions"
        :model-value="accessibilityFeatures.selected.value"
        @update:modelValue="accessibilityFeatures.update"
        name="accessibility"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Select accessibility features available, such as wheelchair access, step-free entry, wide doorways, elevator, wet room, etc.'
          ]" />
        </template>
      </OrganismsDraftFormCheckboxGroup>
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
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs
            :paragraphs="[
              'Detail the storage facilities available with the property, including built-in wardrobes, cupboards, loft storage, shed, or garage storage space.',
            ]"
          />
        </template>
      </OrganismsDraftFormTextGroup>

      <OrganismsDraftFormCheckboxGroup
        title="Storage Options"
        :options="storageOptions"
        :model-value="storageFeatures.selected.value"
        @update:modelValue="storageFeatures.update"
        name="storage"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs
            :paragraphs="[
              'Select the storage facilities available: built-in wardrobes, walk-in closet, loft/attic storage, cellar/basement, bike storage, shed, garage storage, etc.',
            ]"
          />
        </template>
      </OrganismsDraftFormCheckboxGroup>
    </div>

    <AtomsDivider />

    <!-- Utility Room -->
    <div class="step__section">
      <MoleculesDraftFormHeading 
        title="Utility Room" 
        :required="false"
        variant="section"
      />
      <em class="body-xs">Optional, add utility room details if applicable</em>
      
      <OrganismsDraftFormTextGroup
        title="Description"
        v-model="(stepEightData.property.utility as any).description"
        name="utility-description"
        placeholder="Describe the utility room..."
        :expanded="true"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Describe the utility room features, layout, and what appliances or storage it can accommodate.'
          ]" />
        </template>
      </OrganismsDraftFormTextGroup>

      <OrganismsDraftFormSizeToggle
        title="Utility Room Size"
        :options="sizeOptions"
        :unit="'meter'"
        :size="(stepEightData.property.utility as any).size"
        name="utility-size"
        @update:unit="() => {}"
        @update:size="(value: number | null) => (stepEightData.property.utility as any).size = value"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Enter the utility room\'s floor area (either in square meters, or square foot). If you\'re unsure how to measure the floor area, please visit our guides.'
          ]" />
        </template>
      </OrganismsDraftFormSizeToggle>

      <OrganismsDraftFormCheckboxGroup
        title="Utility Room Features"
        :options="utilityRoomOptions"
        :model-value="utilityRoomFeatures.selected.value"
        @update:modelValue="utilityRoomFeatures.update"
        name="utility-room-features"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Select the features available in the utility room, such as plumbing for appliances, sink, or storage space.'
          ]" />
        </template>
      </OrganismsDraftFormCheckboxGroup>
    </div>

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
  stepNumber: 8,
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
const utilityRoomFeatures = useUtilityRoomFeatures(stepEightData);

function submitForm() {
  handleSubmit(
    (data) => {
      emit('updateStepData', data, 8);
    },
    () => emit('nextStep')
  );
}
</script>

