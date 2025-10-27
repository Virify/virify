<template>
  <EditListingStepsStepLayout
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
    <MoleculesListingFormSection title="Property type and classification" :required="true">
      <OrganismsListingFormRadioGroup title="Select property type." :options="propertyTypeSelectOptions" v-model="stepTwoData.property.type" @update:modelValue="onPropertyTypeChange" name="listing-type" :required="true" />
      <OrganismsListingFormRadioGroup
        v-if="stepTwoData.property.type !== null"
        title="Select property classification."
        :options="getPropertyClassifications(stepTwoData.property.type)"
        v-model="stepTwoData.property.classification"
        name="property-classification"
        :required="true"
      />
    </MoleculesListingFormSection>

    <AtomsDivider />

    <MoleculesListingFormSection title="Property description" :required="true">
      <OrganismsListingFormTextGroup
        title="Add a short description of your property."
        info="You can edit this later, so if you don’t have your description ready yet, add some place holder wording so you can continue"
        v-model="stepTwoData.property.description"
        name="property-description"
        placeholder="e.g 'This charming 2-bedroom apartment offers stunning views etc...'"
        :required="true"
        :multiline="true"
      >
        <template #tooltip-content>
          <p><strong>Need inspiration?</strong></p>
          <p>Head to our <NuxtLink to="/guides/property-information/property-description" target="_blank" rel="noopener" class="link">Property Description guide</NuxtLink>.</p>
        </template>
      </OrganismsListingFormTextGroup>
    </MoleculesListingFormSection>

    <AtomsDivider />

    <MoleculesListingFormSection title="Property floors" :required="true">
      <OrganismsListingFormNumberGroup
        title="Select the property’s total floors. Do not count unconverted attics or cellars."
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
    </MoleculesListingFormSection>

    <AtomsDivider />

    <MoleculesListingFormSection title="Property construction type">
      <OrganismsListingFormRadioGroup title="Select construction type." :options="constructionOptions" v-model="stepTwoData.property.constructionType" name="property-construction">
        <template #tooltip-content>
          <p><strong>Standard</strong></p>
          <p>Brick or stone walls and with slate or tiled pitched roof.</p>
          <p><strong>Non-standard</strong></p>
          <p>Anything that isn’t considered ‘standard’. For more info, head to our <NuxtLink to="/guides/property-information/construction-type" target="_blank" rel="noopener" class="link"> Construction Type</NuxtLink> guide.</p>
        </template>
      </OrganismsListingFormRadioGroup>
    </MoleculesListingFormSection>

    <AtomsDivider />

    <MoleculesListingFormSection title="Property Size">
      <OrganismsListingFormSizeToggle title=" Insert your property’s total size." :options="sizeOptions" v-model:unit="sizeToConvert" v-model:size="stepTwoData.property.size" name="property-size">
        <template #tooltip-content>
          <p><strong>Not sure how to measure?</strong></p>
          <p>See our <NuxtLink to="/guides/property-information/total-property-size" target="_blank" rel="noopener" class="link">Total Property Size</NuxtLink> guide.</p>
        </template>
      </OrganismsListingFormSizeToggle>
    </MoleculesListingFormSection>

    <AtomsDivider />
    <MoleculesListingFormSection title="Property build year">
      <OrganismsListingFormSelectGroup title="What year was your property built?" :options="yearBuiltOptions" v-model="stepTwoData.property.yearBuilt" name="year-built"> </OrganismsListingFormSelectGroup>
    </MoleculesListingFormSection>
  </EditListingStepsStepLayout>
</template>
<script setup lang="ts">
const props = defineProps<{
  draft: DraftListingWithFullPayload;
  errorMessage?: string;
}>();

const emit = defineEmits<{
  updateStepData: [stepData: StepTwo, step: number];
  previousStep: [];
  nextStep: [];
}>();

// Size conversion state (outside of form data as it's UI-only)
const sizeToConvert = ref<string>("meter");

// Check if totalFloors should be disabled (when rooms already exist)
const isTotalFloorsDisabled = computed(() => {
  const hasBedroomFeatures = (props.draft.property?.bedroomFeatures?.length ?? 0) > 0;
  const hasBathroomFeatures = (props.draft.property?.bathroomFeatures?.length ?? 0) > 0;
  return hasBedroomFeatures || hasBathroomFeatures;
});

// Dynamic info text for totalFloors field
const totalFloorsInfo = computed(() => {
  return "Tip: If you need to change this later, remove any added bedrooms and bathrooms.";
});

// Create step configuration for the composable
const stepConfig = computed(() => ({
  initialData: createInitialStepTwoValues(props.draft),
  isValid: stepTwoValidation.isStepTwoValid,
  hasExistingData: stepTwoValidation.hasExistingStepTwoData,
  stepNumber: 2,
  beforeSubmit: (data: StepTwo) => {
    const processedData = { ...data };

    // Set year built to null if '0' (Not Specified) is selected to maintain type consistency
    if (processedData.property.yearBuilt === "0") {
      processedData.property.yearBuilt = null;
    }

    // Convert size to meters if the selected unit is feet
    if (sizeToConvert.value === "feet" && processedData.property.size) {
      processedData.property.size = convertFeetToMeters(processedData.property.size);
    }

    return processedData;
  },
}));

// Use the reusable step form composable
const { formData: stepTwoData, hasChanges, buttonDisabled, buttonText, resetForm, submitForm: handleSubmit } = useListingStepForm(stepConfig, props.draft);

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
      emit("updateStepData", data, 2);
    },
    () => emit("nextStep")
  );
}
</script>
