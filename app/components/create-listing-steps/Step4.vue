<template>
  <section class="step">
    <h2 class="title-sm">Address</h2>
    <p class="body-xs">
      <span class="step__required | body-md font-semibold">*</span>
      <em>represents a required field</em>
    </p>

    <h3 class="step__info | title-xs">We use the latest address and location data provided by various sources. This
      ensures accurate and validated address information so you can just search for your address or postcode below.</h3>

    <form class="step__form" @submit.prevent="submitForm">
      <!-- Show search if no existing address -->
      <div v-if="!hasExistingAddress" class="step__form-search">
        <OrganismsDraftFormAddressSearch      
          @address-selected="handleAddressSelected" 
        />
      </div>

      <!-- Show manual inputs if address exists or after search -->
      <div class="step__form-manual">
        <div v-if="hasExistingAddress" class="step__form-instruction">
          <p class="body-sm">
            Your currently selected address has been auto-filled below. If this is not your address or want to pick a different address: 
          </p>
          <button 
            type="button" 
            @click="clearAddress" 
            class="button button-xs button-tertiary | body-xs"
          >
            Change address
          </button>
        </div>

        <div class="step__form-address-grid">
          <!-- Number (required) -->
          <OrganismsDraftFormTextGroup 
            title="Property Number" 
            v-model="stepFourData.property.address!.number"
            name="property-number"
            placeholder="e.g. 123" 
            :grid="true"
            :expanded="true" 
            :disabled="true" 
            :required="true"
            />

          <!-- Street (required) -->
          <OrganismsDraftFormTextGroup 
            title="Street Name" 
            v-model="stepFourData.property.address!.street"
            name="property-street" 
            placeholder="e.g. High Street" 
            :grid="true"
            :expanded="true" 
            :disabled="true" 
            :required="true"
          />

          <!-- City (required) -->
          <OrganismsDraftFormTextGroup 
            title="City" 
            v-model="stepFourData.property.address!.city" 
            name="property-city"
            placeholder="e.g. London" 
            :grid="true"
            :expanded="true" 
            :disabled="true"
            :required="true"
          />

          <!-- Postcode (required) -->
          <OrganismsDraftFormTextGroup 
            title="Postcode" 
            v-model="stepFourData.property.address!.postcode"
            name="property-postcode" 
            placeholder="e.g. SW1A 1AA" 
            :grid="true"
            :expanded="true" 
            :disabled="true"
            :required="true"
          />

          <!-- County -->
          <OrganismsDraftFormTextGroup 
            title="County" 
            v-model="stepFourData.property.address!.county"
            name="property-county" 
            placeholder="e.g. Greater London" 
            :grid="true"
            :disabled="true" 
          />

          <!-- Country -->
          <OrganismsDraftFormTextGroup 
            title="Country" 
            v-model="stepFourData.property.address!.country"
            name="property-country" 
            placeholder="e.g. United Kingdom" 
            :grid="true"
            :disabled="true" 
          />
        </div>
      </div>

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
  'updateStepData': [stepData: StepFour, step: number];
  'previousStep': [];
  'nextStep': [];
}>();

const stepFourData = ref<StepFour>(createInitialStepFourValues(props.draft));
console.log("Initial Step Four Data:", stepFourData.value);
// take a deep snapshot so initial state is not the same reference as the live form state
const initialStepFourData = ref<StepFour>(JSON.parse(JSON.stringify(stepFourData.value)));

// Check if user has existing address data
const hasExistingAddress = computed(() => {
  const address = stepFourData.value.property.address;
  return Boolean(
    address?.number &&
    address?.street &&
    address?.city &&
    address?.postcode &&
    address?.lat &&
    address?.lon
  );
});

const isFormValid = computed(() => {
  return Boolean(
    stepFourData.value.property.address?.number &&
    stepFourData.value.property.address?.street &&
    stepFourData.value.property.address?.city &&
    stepFourData.value.property.address?.postcode &&
    stepFourData.value.property.address?.lat &&
    stepFourData.value.property.address?.lon
  );
})

const buttonDisabled = computed(() => !isFormValid.value)
const hasChanges = computed(() => !objectsEqual(initialStepFourData.value, stepFourData.value));

// Handle address selection from search
const handleAddressSelected = (selectedAddress: any) => {
  console.log('Address selected in Step 4:', selectedAddress);
  console.log('Current Step Four Data before update:', stepFourData.value);
  // Populate the form with selected address
  stepFourData.value.property.address = {
    number: selectedAddress.number,
    flat: selectedAddress.flat,
    street: selectedAddress.street,
    city: selectedAddress.city,
    county: selectedAddress.county,
    country: selectedAddress.country,
    postcode: selectedAddress.postcode,
    fullAddress: selectedAddress.fullAddress,
    lat: selectedAddress.lat,
    lon: selectedAddress.lon,
  };
};

// Clear address to show search again
const clearAddress = () => {
  stepFourData.value.property.address = {
    number: null,
    flat: null,
    street: null,
    city: null,
    county: null,
    country: null,
    postcode: null,
    fullAddress: null,
    lat: null,
    lon: null,
  };
};

function resetForm() {
  stepFourData.value = JSON.parse(JSON.stringify(initialStepFourData.value));
}

async function submitForm() {
  if (!isFormValid.value) return;
  if (objectsEqual(initialStepFourData.value, stepFourData.value)) {
    console.log('No changes detected, skipping API call');
    // No changes to save, just proceed to next step
    emit('nextStep');
    return;
  }
  console.log('Changes detected, proceeding with API call');

  emit('updateStepData', stepFourData.value, 4);
}

</script>
<style lang="scss">
@use '#styles/_utils/media' as mq;

.step {
  &__info {
    margin: var(--size-32) 0;
  }

  &__form {

    &-instruction {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: var(--size-16);
      margin-bottom: var(--size-24);
      padding: var(--size-16) 0;
      background: var(--background-200);
      border-radius: var(--border-radius-md);
    }

    &-change-link {
      background: none;
      border: none;
      color: var(--primary-500);
      cursor: pointer;
      text-decoration: underline;
      padding: 0;

      &:hover {
        color: var(--primary-600);
      }
    }

    &-address-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--size-16);

      @include mq.tablet {
        grid-template-columns: 1fr 1fr;
      }
    }

    &-price-input {
      input {
        margin: 0 auto;
        max-width: 200px;
      }
    }
  }
}
</style>