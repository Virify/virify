<template>
  <section class="step">
    <h2 class="title-sm">Property Basics</h2>

    <form class="step__form">
      <OrganismsDraftFormRadioGroup 
        title="What type of property are you listing?" 
        :options="propertyTypeSelectOptions" 
        v-model="selectedPropertyType"
        name="listing-type" 
        :required="true" 
      />

      <OrganismsDraftFormRadioGroup 
        v-if="selectedPropertyType !== null"
        title="What is the classification of the property?" 
        :options="getPropertyClassifications(selectedPropertyType)" 
        v-model="selectedPropertyClassification"
        name="property-classification" 
        :required="true"
        :divider="true"
      />

      <OrganismsDraftFormRadioGroup
        title="What is the construction type of the property?" 
        :options="constructionOptions" 
        v-model="selectedPropertyConstruction"
        name="property-construction-type" 
        :required="true"
        :divider="true"      
      />

      <OrganismsDraftFormTextGroup
        title="Please provide a short description of the property - your property features speaks for itself!"
        v-model="propertyDescription"
        name="property-description"
        placeholder="e.g., A charming 3-bedroom house with a spacious garden..."
        :required="true"
        :divider="true"
      />

      <OrganismsDraftFormSelectGroup
        title="What year was the property built?"
        :options="yearBuiltOptions"
        v-model="yearBuilt"
        name="year-built"
        :required="true"
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

const buttonDisabled = ref<boolean>(true);
const listingType = ref(props.draft.saleListing ? 'sale' : 'rental');
const selectedPropertyType = ref<number | null>(props.draft.property?.type.id || null);
const selectedPropertyClassification = ref<number | null>(props.draft.property?.classification.categoryId || null);
const selectedPropertyConstruction = ref<string | null>(props.draft.property?.constructionType || null);
const propertyDescription = ref<string>(props.draft.property?.description || '');
const yearBuilt = ref<string>(props.draft.property?.yearBuilt || '0');

watch([selectedPropertyType], ([newPropertyType]) => {
  if (newPropertyType) {
    selectedPropertyClassification.value = null;
  }
});

function submitForm() {
  console.log('Form submitted');
}
</script>
<style lang="scss">
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