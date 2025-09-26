<template>
  <section class="step">
    <h2 class="step__title | title-lg">Bedrooms and Bathrooms</h2>

    <p class="body-xs">
      <span class="step__required | body-md font-semibold">*</span>
      <em>represents a required field</em>
    </p>

    <h3 class="step__info | title-xs">
      Please provide the bedroom and bathroom details for your property below.
    </h3>

    <form class="step__form" @submit.prevent="submitForm">
      <!-- Bedrooms Section -->
      <div class="step__section">
        <h3 class="step__title | title-sm">Bedrooms</h3>
        
        <OrganismsDraftBedroomForm
          v-model="stepFiveData.property.bedroomFeatures"
          :total-floors="stepFiveData.property.totalFloors || 1"
        />
      </div>

      <!-- Form Actions -->
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
import type { BedSizeType } from '~~/layers/database/server/database/prisma/generated/enums';

const props = defineProps<{
  draft: DraftListingWithFullPayload;
}>();

const emit = defineEmits<{
  'updateStepData': [stepData: StepFive, step: number];
  'previousStep': [];
  'nextStep': [];
}>();

const stepFiveData = ref<StepFive>(createInitialStepFiveValues(props.draft));
const initialStepData = ref<StepFive>(JSON.parse(JSON.stringify(stepFiveData.value)));

// Computed properties for validation
const isFormValid = computed(() => 
  stepFiveData.value.property.bedroomFeatures.length > 0 &&
  stepFiveData.value.property.bedroomFeatures.every(bedroom => 
    Boolean(bedroom.name && bedroom.roomNumber && bedroom.floor !== null && bedroom.bed?.length > 0)
  )
);

const buttonDisabled = computed(() => !isFormValid.value);
const hasChanges = computed(() => !objectsEqual(initialStepData.value, stepFiveData.value));

// Floor options based on totalFloors
const floorOptions = computed(() => {
  const totalFloors = props.draft.property?.totalFloors || 1;
  return getFloorOptions(totalFloors);
});

// Methods
function resetForm() {
  stepFiveData.value = JSON.parse(JSON.stringify(initialStepData.value));
}

function submitForm() {
  if (!isFormValid.value) return;

  if (objectsEqual(initialStepData.value, stepFiveData.value)) {
    console.log('No changes detected, skipping API call');
    emit('nextStep');
    return;
  }
  
  console.log('Changes detected, proceeding with API call');
  
  // Update the number of bedrooms
  stepFiveData.value.property.numberBedrooms = stepFiveData.value.property.bedroomFeatures.length;
  
  emit('updateStepData', stepFiveData.value, 5);
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