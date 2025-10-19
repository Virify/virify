<template>
  <EditListingStepsStepLayout
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
      <MoleculesListingFormHeading 
        title="Kitchens" 
        variant="section"
      />
      <em class="body-xs">Optional, add kitchen details</em>
      <OrganismsListingKitchenForm
        v-model="stepSixData.property.kitchenFeatures"
        :total-floors="stepSixData.property.totalFloors"
      />
    </div>

    <AtomsDivider />

    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Receptions" 
        :required="false"
        variant="section"
      />
      <em class="body-xs">Optional, add the property's reception rooms</em>
      <OrganismsListingReceptionForm
        v-model="stepSixData.property.reception"
        :total-floors="stepSixData.property.totalFloors"
      />
    </div>

    <AtomsDivider />

    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Other Rooms" 
        :required="false"
        variant="section"
      />
      <em class="body-xs">Optional, add additional functional rooms (office, gym, etc.)</em>
      <OrganismsListingOtherRoomForm
        v-model="stepSixData.property.otherRoom"
        :total-floors="stepSixData.property.totalFloors"
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
  'updateStepData': [stepData: StepSix, step: number];
  'previousStep': [];
  'nextStep': [];
}>();

const stepConfig = computed(() => ({
  initialData: createInitialStepSixValues(props.draft),
  isValid: stepSixValidation.isStepSixValid,
  hasExistingData: stepSixValidation.hasExistingStepSixData,
  stepNumber: 6,
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
} = useListingStepForm(stepConfig, props.draft);

function submitForm() {
  handleSubmit(
    (data) => {
      emit('updateStepData', data, 6);
    },
    () => emit('nextStep')
  );
}
</script>

