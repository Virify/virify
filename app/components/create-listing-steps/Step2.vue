<template>
  <section class="step">
    <h2 class="title-sm">Property Basics</h2>
    <p class="body-xs">
      <span class="step__required | body-md font-semibold">*</span>
      <em>represents a required field</em>
    </p>

    <form class="step__form">
      <OrganismsDraftFormRadioGroup 
        title="What type of property are you listing?" 
        :options="propertyTypeSelectOptions" 
        v-model="stepTwoData.property.type"
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

      <OrganismsDraftFormRadioGroup
        title="What is the construction type of the property?" 
        :options="constructionOptions" 
        v-model="stepTwoData.property.constructionType"
        name="property-construction-type" 
        :divider="true"      
      />

      <OrganismsDraftFormTextGroup
        title="Please provide a short description of the property - your property features speaks for itself!"
        v-model="stepTwoData.property.description"
        name="property-description"
        placeholder="e.g., A charming 3-bedroom house with a spacious garden..."
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
    
      <div class="step__form-actions">
        <button class="step__form-action | button button-sm button-secondary" @click="$emit('previousStep')" type="button">
          Previous Step
        </button>

        <button class="step__form-action | button button-sm button-secondary" :disabled="buttonDisabled" type="submit">
          Save and Continue
        </button>
      </div>
    </form>
  </section>
</template>
<script setup lang="ts">

const props = defineProps<{
  draft: DraftListingWithFullPayload;
}>();

const emit = defineEmits<{
  'updateStepData': [stepData: StepOne];
  'previousStep': [];
  'nextStep': [];
}>();

const stepTwoData = ref<StepTwo>(createInitialStepTwoValues(props.draft));
const sizeToConvert = ref<string>(props.draft.property ? 'meter' : 'meter')

const isFormValid = computed(() => Boolean(stepTwoData.value.property.type && stepTwoData.value.property.classification))

const buttonDisabled = computed(() => !isFormValid.value)

function submitForm() {
  console.log('Form submitted');
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
  }
}
</style>