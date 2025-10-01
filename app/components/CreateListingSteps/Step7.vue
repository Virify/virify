<template>
  <CreateListingStepsStepLayout
    title="Outdoor Spaces & Utilities"
    info="Add details about gardens, land, and outdoor features of your property. The more information you provide, the better potential viewers can understand the property."
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
      <MoleculesDraftFormHeading 
        title="General Outdoor Space Description" 
        :required="false"
        variant="section"
        :hasTooltip="true"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Provide a general description of the outdoor space.',
            'You can add specific garden and land details below.'
          ]" />
        </template>
      </MoleculesDraftFormHeading>
      <em class="body-xs">Optional general description</em>
      
      <OrganismsDraftFormTextGroup
        title="Description"
        v-model="stepSevenData.property.outdoorSpace.description"
        name="outdoor-space-description"
        placeholder="Describe the outdoor space..."
        :expanded="true"
      />
    </div>

    <AtomsDivider />

    <div class="step__section">
      <MoleculesDraftFormHeading 
        title="Gardens" 
        :required="false"
        variant="section"
        :hasTooltip="true"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Add details about all gardens including front, rear, and side gardens.',
            'Include information about features, position, and facing direction.'
          ]" />
        </template>
      </MoleculesDraftFormHeading>
      <em class="body-xs">Optional, add garden details</em>
      
      <OrganismsDraftGardenForm
        v-model="stepSevenData.property.outdoorSpace.garden"
      />

      <OrganismsDraftFormNumberGroup
        title="Total Garden Size (m²)"
        v-model="stepSevenData.property.outdoorSpace.totalGardenSize"
        name="total-garden-size"
        placeholder="0"
        :min="0"
        :step="0.01"
      />
    </div>

    <AtomsDivider />

    <div class="step__section">
      <MoleculesDraftFormHeading 
        title="Land" 
        :required="false"
        variant="section"
        :hasTooltip="true"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Add details about any additional land parcels including paddocks, woodland, or other features.',
            'Include information about separate parcels and land features.'
          ]" />
        </template>
      </MoleculesDraftFormHeading>
      <em class="body-xs">Optional, add land parcel details</em>
      
      <OrganismsDraftLandForm
        v-model="stepSevenData.property.outdoorSpace.land"
      />

      <OrganismsDraftFormNumberGroup
        title="Total Land Size (m²)"
        v-model="stepSevenData.property.outdoorSpace.totalLandSize"
        name="total-land-size"
        placeholder="0"
        :min="0"
        :step="0.01"
      />
    </div>
  </CreateListingStepsStepLayout>
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
  beforeSubmit: (data: StepSeven) => {
    // Process data before submission
    const processedData: StepSeven = {
      property: {
        outdoorSpace: {
          description: data.property.outdoorSpace.description,
          totalGardenSize: data.property.outdoorSpace.totalGardenSize,
          totalLandSize: data.property.outdoorSpace.totalLandSize,
          garden: stepSevenData.value.property.outdoorSpace.garden.map((garden) => ({ ...garden })),
          land: stepSevenData.value.property.outdoorSpace.land.map((land) => ({ ...land })),
        },
      },
    };

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
} = useDraftStepForm(stepConfig, props.draft);

function submitForm() {
  handleSubmit(
    (data) => {
      emit('updateStepData', data, 7);
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
}
</style>
