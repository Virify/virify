<template>
  <section class="step">
    <h2 class="title-sm">Property Basics</h2>
    <p class="body-xs">
      <span class="step__required | body-md font-semibold">*</span>
      <em>represents a required field</em>
    </p>

    <form class="step__form" @submit.prevent="submitForm">
      <OrganismsDraftFormRadioGroup 
        title="What type of property are you listing?" 
        :options="propertyTypeSelectOptions" 
        v-model="stepTwoData.property.type"
        @update:modelValue="onPropertyTypeChange"
        name="listing-type" 
        :required="true" 
        :divider="true"
      />

      <OrganismsDraftFormRadioGroup 
        v-if="stepTwoData.property.type !== null"
        title="What is the classification of the property?" 
        :options="getPropertyClassifications(stepTwoData.property.type)" 
        v-model="stepTwoData.property.classification"
        name="property-classification" 
        :required="true"
        :divider="true"
      />

      <OrganismsDraftFormTextGroup
        title="Please provide a short description of the property - your property features speak for itself!"
        v-model="stepTwoData.property.description"
        name="property-description"
        placeholder="e.g 'This charming 2-bedroom apartment offers stunning views etc...'"
        :divider="true"
        :required="true"
      />

      <OrganismsDraftFormNumberGroup
        title="How many total floors does the property have?"
        v-model="stepTwoData.property.totalFloors"
        name="property-floors"
        placeholder="e.g '2'"
        :divider="true"
        :required="true"
      />

        <OrganismsDraftFormRadioGroup
        title="What is the construction type of the property?" 
        :options="constructionOptions" 
        v-model="stepTwoData.property.constructionType"
        name="property-construction-type" 
        :divider="true"      
      />

      <OrganismsDraftFormSizeToggle
        title="What is your property's total size?"
        :options="sizeOptions"
        v-model:unit="sizeToConvert"
        v-model:size="stepTwoData.property.size"
        name="property-size"
        :divider="true"
      />

      <OrganismsDraftFormSelectGroup
        title="What year was the property built?"
        :options="yearBuiltOptions"
        v-model="stepTwoData.property.yearBuilt"
        name="year-built"
        :divider="true"
      />
    
      <MoleculesDraftFormActions
        :hasChanges="hasChanges"
        :buttonDisabled="buttonDisabled"
        primaryText="Save and Continue"
        showPrevious
        @cancel="resetForm"
        @previous="$emit('previousStep')"
        @submit="submitForm"
      />
    </form>
  </section>
</template>
<script setup lang="ts">
import { objectsEqual } from '~/utils/objects/objects-equal';
import MoleculesDraftFormActions from '~/components/molecules/Draft/MoleculesDraftFormActions.vue';

const props = defineProps<{
  draft: DraftListingWithFullPayload;
}>();

const emit = defineEmits<{
  'updateStepData': [stepData: StepTwo, step: number];
  'previousStep': [];
  'nextStep': [];
}>();

const stepTwoData = ref<StepTwo>(createInitialStepTwoValues(props.draft));
// take a deep snapshot so initial state is not the same reference as the live form state
const initialStepTwoData = ref<StepTwo>(JSON.parse(JSON.stringify(stepTwoData.value)));
const sizeToConvert = ref<string>(props.draft.property ? 'meter' : 'meter')

const isFormValid = computed(() => 
  Boolean(
    stepTwoData.value.property.type && 
    stepTwoData.value.property.classification && 
    stepTwoData.value.property.description &&
    stepTwoData.value.property.totalFloors
))

const buttonDisabled = computed(() => !isFormValid.value)
const hasChanges = computed(() => !objectsEqual(initialStepTwoData.value, stepTwoData.value))

/**
 * Handler for user-driven property type changes.
 * We attach this to the radio group's `update:modelValue` event so
 * programmatic resets (which directly assign the object) won't trigger it.
 */
function onPropertyTypeChange(newType: string | null) {
  stepTwoData.value.property.classification = null;
}

/**
 * Reset form to initial values
 */
function resetForm() {
  // restore a deep copy of the initial snapshot
  stepTwoData.value = JSON.parse(JSON.stringify(initialStepTwoData.value));
}

/**
 * Submit form data
 */
function submitForm() {
  if (!isFormValid.value) return

  // If the current form state equals the initial snapshot, skip API call
  if (objectsEqual(initialStepTwoData.value, stepTwoData.value)) {
    console.log('No changes detected, skipping API call');
    emit('nextStep');
    return;
  }
  console.log('Changes detected, proceeding with API call');
  
  
  /**
   * Set year built to null if '0' (Not Specified) is selected to maintain type consistency
   */
  if(stepTwoData.value.property.yearBuilt === '0') {
    stepTwoData.value.property.yearBuilt = null
  }

  /**
   * Convert size to meters if the selected unit is feet
   */
  if(sizeToConvert.value === 'feet' && stepTwoData.value.property.size) {
    stepTwoData.value.property.size = convertFeetToMeters(stepTwoData.value.property.size)
  }

  emit('updateStepData', stepTwoData.value, 2);
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