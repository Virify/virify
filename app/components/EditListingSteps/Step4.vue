<template>
  <EditListingStepsStepLayout title="Address" :hasChanges="hasChanges" :buttonDisabled="buttonDisabled"
    :buttonText="buttonText" :errorMessage="errorMessage" showPrevious @cancel="resetForm"
    @previous="$emit('previousStep')" @submit="submitForm">
    <!-- Show search if no existing address -->
    <div v-if="!hasExistingAddress" class="step__form-search">
      <OrganismsListingFormAddressSearch @address-selected="handleAddressSelected" />
    </div>

    <!-- Show manual inputs if address exists or after search -->
    <div class="step__form-manual">
      <div v-if="hasExistingAddress" class="step__form-instruction">
        <p class="body-sm">
          Your address has been auto-filled below. If this is incorrect:
        </p>
        <button type="button" @click="clearAddress" class="button button-xs button-tertiary | body-xs">
          Change address
        </button>
      </div>

      <div class="step__form-address-grid">
        <!-- Number (required) -->
        <OrganismsListingFormTextGroup title="Property Number" v-model="stepFourData.property.address!.number"
          name="property-number" placeholder="e.g. 123" :grid="true" :disabled="true" :required="true" />

        <!-- Street (required) -->
        <OrganismsListingFormTextGroup title="Street Name" v-model="stepFourData.property.address!.street"
          name="property-street" placeholder="e.g. High Street" :grid="true" :disabled="true" :required="true" />

        <!-- City (required) -->
        <OrganismsListingFormTextGroup title="City" v-model="stepFourData.property.address!.city" name="property-city"
          placeholder="e.g. London" :grid="true" :disabled="true" :required="true" />

        <!-- County -->
        <OrganismsListingFormTextGroup v-if="stepFourData.property.address!.county" title="County/District"
          v-model="stepFourData.property.address!.county" name="property-county" placeholder="e.g. Greater London"
          :grid="true" :disabled="true" />

        <!-- Postcode (required) -->
        <OrganismsListingFormTextGroup title="Postcode" v-model="stepFourData.property.address!.postcode"
          name="property-postcode" placeholder="e.g. SW1A 1AA" :grid="true" :disabled="true" :required="true" />

        <!-- Locality -->
        <OrganismsListingFormTextGroup v-if="stepFourData.property.address!.locality" title="Locality"
          v-model="stepFourData.property.address!.locality" name="property-locality" placeholder="e.g. Westminster"
          :grid="true" :disabled="true" />

        <!-- Country -->
        <OrganismsListingFormTextGroup title="District" v-model="stepFourData.property.address!.district"
          name="property-country" placeholder="e.g. United Kingdom" :grid="true" :disabled="true" />
      </div>
    </div>

  </EditListingStepsStepLayout>
</template>
<script setup lang="ts">

const props = defineProps<{
  draft: EditableListing;
  errorMessage?: string;
}>()

const emit = defineEmits<{
  'updateStepData': [stepData: StepFour, step: number];
  'previousStep': [];
  'nextStep': [];
}>();

// Create step configuration for the composable
const stepConfig = computed(() => ({
  initialData: createInitialStepFourValues(props.draft),
  isValid: stepFourValidation.isStepFourValid,
  hasExistingData: stepFourValidation.hasExistingStepFourData,
  stepNumber: 4,
}));

// Use the reusable step form composable
const {
  formData: stepFourData,
  hasChanges,
  buttonDisabled,
  buttonText,
  resetForm,
  submitForm: handleSubmit
} = useListingStepForm(stepConfig, props.draft);

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

// Handle address selection from search
const handleAddressSelected = (selectedAddress: AddressParsed) => {
  console.log('Address selected in Step 4:', selectedAddress);
  console.log('Current Step Four Data before update:', stepFourData.value);
  // Populate the form with selected address
  stepFourData.value.property.address = {
    number: selectedAddress.number,
    flat: selectedAddress.flat,
    name: selectedAddress.name,
    street: selectedAddress.street,
    city: selectedAddress.city,
    locality: selectedAddress.locality,
    district: selectedAddress.district,
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
    name: null,
    street: null,
    city: null,
    locality: null,
    district: null,
    county: null,
    country: null,
    postcode: null,
    fullAddress: null,
    lat: null,
    lon: null,
  };
};

/**
 * Handle form submission
 */
function submitForm() {
  handleSubmit(
    (data) => {
      emit('updateStepData', data, 4);
    },
    () => emit('nextStep')
  );
}

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

// Step 4 specific - address form styles
.step {
  &__form {
    &-search {
      margin-bottom: var(--size-24);
    }

    &-instruction {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      justify-content: flex-start;
      gap: var(--size-16);
      margin-bottom: var(--size-24);
      background: var(--background-100);
      border-radius: var(--radius-md);

      @include mq.desktop {
        flex-direction: row;
        align-items: center;
      }
    }

    &-manual {
      margin-top: var(--size-24);
    }

    &-address-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--size-16);

      @include mq.tablet {
        grid-template-columns: 1fr 1fr;
      }
    }
  }
}
</style>
