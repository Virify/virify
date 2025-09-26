<template>
  <section class="step">
    <h2 class="step__title | title-lg">Price</h2>

    <p class="body-xs">
      <span class="step__required | body-md font-semibold">*</span>
      <em>represents a required field</em>
    </p>

    <h3 class="step__info | title-xs">Please provide the pricing details for your listing below.
    </h3>

    <form class="step__form" @submit.prevent="submitForm">

      <!-- sale specific -->
      <OrganismsDraftFormRadioGroup
        v-if="draft.saleListing && stepThreeData.saleListing"
        title="What is the sale price type for this listing?"
        :options="salePriceTypeOptions"
        v-model="stepThreeData.saleListing.priceType"
        name="sale-price-type"
        :required="true"
      />

      <!-- rental specific -->
      <!-- rent frequency -->
      <OrganismsDraftFormRadioGroup
        v-if="draft.rentalListing && stepThreeData.rentalListing"
        title="What is the rent frequency for this listing?"
        :options="rentalPriceTypeOptions"
        v-model="stepThreeData.rentalListing.rentFrequency"
        name="rental-frequency"
        :required="true"
      />

      <!-- price input for both sale and rental -->
      <OrganismsDraftFormNumberGroup
        :title="draft.saleListing ? 'What is the sale price for this property?' : 'What is the rental price for this property?'"
        v-model="stepThreeData.price"
        name="listing-price"
        placeholder="e.g '250000' or '1200'"
        :required="true"
        min="0"
        step="0.01"
      />

      <!-- deposit -->
      <OrganismsDraftFormNumberGroup
        v-if="draft.rentalListing && stepThreeData.rentalListing"
        title="What is the deposit amount for this rental listing?"
        v-model="stepThreeData.rentalListing.deposit"
        name="listing-deposit"
        placeholder="e.g '250000' or '1200'"
        :required="true"
        type="number"
        min="0"
        step="0.01"
      />

      <!-- holding deposit -->
      <OrganismsDraftFormNumberGroup
        v-if="draft.rentalListing && stepThreeData.rentalListing"
        title="What is the holding deposit amount for this rental listing?"
        v-model="stepThreeData.rentalListing.holdingDeposit"
        name="listing-holding-deposit"
        placeholder="e.g '250000' or '1200'"
        type="number"
        min="0"
        step="0.01"
      />

      <!-- Rental Length -->
      <OrganismsDraftFormNumberGroup
        v-if="draft.rentalListing && stepThreeData.rentalListing"
        title="How long is the rental period in months?"
        v-model="stepThreeData.rentalListing.rentalLength"
        name="listing-rental-length"
        placeholder="e.g '12'or '6 months'"
        :required="true"
        type="number"
        min="0"
        step="0.01"
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

const props = defineProps<{
  draft: DraftListingWithFullPayload
}>()

const emit = defineEmits<{
  'updateStepData': [stepData: StepThree, step: number];
  'previousStep': [];
  'nextStep': [];
}>();

const stepThreeData = ref<StepThree>(createInitialStepThreeValues(props.draft));
console.log("Initial Step Three Data:", stepThreeData.value);
// take a deep snapshot so initial state is not the same reference as the live form state
const initialStepThreeData = ref<StepThree>(JSON.parse(JSON.stringify(stepThreeData.value)));

const isFormValid = computed(() => {
  return Boolean(
    stepThreeData.value.price &&
    (props.draft.rentalListing ? (
      stepThreeData.value.rentalListing?.deposit &&
      stepThreeData.value.rentalListing?.holdingDeposit &&
      stepThreeData.value.rentalListing?.rentFrequency &&
      stepThreeData.value.rentalListing?.rentalLength
    ) : true) &&
    (props.draft.saleListing ? (
      stepThreeData.value.saleListing?.priceType
    ) : true)
  );
})

const buttonDisabled = computed(() => !isFormValid.value)
const hasChanges = computed(() => !objectsEqual(initialStepThreeData.value, stepThreeData.value));

function resetForm() {
  stepThreeData.value = JSON.parse(JSON.stringify(initialStepThreeData.value));
}

async function submitForm() {
  if (!isFormValid.value) return;
  if (objectsEqual(initialStepThreeData.value, stepThreeData.value)) {
    console.log('No changes detected, skipping API call');
    // No changes to save, just proceed to next step
    emit('nextStep');
    return;
  }
  console.log('Changes detected, proceeding with API call');

  emit('updateStepData', stepThreeData.value, 3);
}

</script>
<style lang="scss">
.step {
  &__form {
    &-price-input {
      input {
        margin: 0 auto;
        max-width: 200px;
      }
    }
  }
}
</style>