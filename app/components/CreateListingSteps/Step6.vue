<template>
  <CreateListingStepsStepLayout
    title="Kitchens, Receptions & Other Rooms"
    info="Share details about the property's living spaces including kitchens, receptions, and any additional rooms. You can add multiple rooms to fully represent the layout."
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
        title="Kitchens" 
        :required="true"
        variant="section"
        :hasTooltip="true"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Add all kitchens in your property including their size, appliances, and features.',
            'Include details about fitted units, worktop materials, and any modern appliances included.'
          ]" />
        </template>
      </MoleculesDraftFormHeading>
      <em class="body-xs">At least one kitchen required</em>
      <OrganismsDraftKitchenForm
        v-model="stepSixData.property.kitchenFeatures"
        :total-floors="stepSixData.property.totalFloors"
      />
    </div>

    <AtomsDivider />

    <div class="step__section">
      <MoleculesDraftFormHeading 
        title="Receptions" 
        :required="false"
        variant="section"
        :hasTooltip="true"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Add reception rooms such as living rooms, lounges, dining rooms, and family rooms.',
            'Include details about features like fireplaces, bay windows, or built-in storage.'
          ]" />
        </template>
      </MoleculesDraftFormHeading>
      <em class="body-xs">Optional, add the property's reception rooms</em>
      <OrganismsDraftReceptionForm
        v-model="stepSixData.property.reception"
        :total-floors="stepSixData.property.totalFloors"
      />
    </div>

    <AtomsDivider />

    <div class="step__section">
      <MoleculesDraftFormHeading 
        title="Other Rooms" 
        :required="false"
        variant="section"
        :hasTooltip="true"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Add any additional functional rooms such as offices, studies, gyms, or utility rooms.',
            'Include details about their purpose, size, and any special features or equipment included.'
          ]" />
        </template>
      </MoleculesDraftFormHeading>
      <em class="body-xs">Optional, add additional functional rooms (office, gym, etc.)</em>
      <OrganismsDraftOtherRoomForm
        v-model="stepSixData.property.otherRoom"
        :total-floors="stepSixData.property.totalFloors"
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
  'updateStepData': [stepData: StepSix, step: number];
  'previousStep': [];
  'nextStep': [];
}>();

const stepConfig = computed(() => ({
  initialData: createInitialStepSixValues(props.draft),
  isValid: stepSixValidation.isStepSixValid,
  hasExistingData: stepSixValidation.hasExistingStepSixData,
  beforeSubmit: (data: StepSix) => {
    const processedData: StepSix = {
      property: {
        ...data.property,
        kitchenFeatures: [...data.property.kitchenFeatures],
        reception: data.property.reception.map((room) => ({ ...room })),
        otherRoom: data.property.otherRoom.map((room) => ({ ...room })),
      },
    };

    processedData.property.numberKitchens = processedData.property.kitchenFeatures.length;
    processedData.property.numberReceptions = processedData.property.reception.length;
    processedData.property.numberOtherRooms = processedData.property.otherRoom.length;

    return processedData;
  }
}));

const {
  formData: stepSixData,
  hasChanges,
  buttonDisabled,
  buttonText,
  resetForm,
  submitForm: handleSubmit,
} = useDraftStepForm(stepConfig, props.draft);

function submitForm() {
  handleSubmit(
    (data) => {
      emit('updateStepData', data, 6);
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
