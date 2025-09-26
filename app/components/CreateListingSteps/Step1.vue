<template>
  <CreateListingStepsStepLayout
    title="Listing Type"
    info="Please provide the type of listing you want to create below. This will help us tailor the rest of the form to your specific needs."
    :formKey="formKey"
    :hasChanges="hasChanges"
    :buttonDisabled="buttonDisabled"
    :buttonText="buttonText"
    @cancel="resetForm"
    @submit="submitForm"
  >
    <!-- first parent select -->
    <OrganismsDraftFormRadioGroup 
      v-if="!draft.saleListing && !draft.rentalListing"
      title="What type of listing do you want to create?" 
      :options="stepOneListingOptions" 
      v-model="stepOneData.selectedType"
      @update:modelValue="onSelectedTypeChange"
      name="listing-type" 
      :required="true" 
    />

    <!-- SALE -->
    <OrganismsDraftFormRadioGroup 
      v-if="isSale" 
      title="What type of sale tenure do you want to set?"
      :options="saleListingTenureOptions"
      v-model="stepOneData.saleListing.tenureType" name="sale-tenure-type"
      :required="true"
    />

    <OrganismsDraftFormRadioGroup 
      v-if="isSale" 
      title="What is the availability status of the listing?"
      :options="saleListingAvailabilityOptions" 
      v-model="stepOneData.saleListing.availabilityStatus"
      name="sale-availability" 
      :required="true" 
    />

    <OrganismsDraftFormRadioGroup 
      v-if="isSale" 
      title="What is the chain of the listing?"
      :options="saleListingChainOptions" 
      v-model="stepOneData.saleListing.chain" 
      name="sale-chain" 
    />

    <OrganismsDraftFormRadioGroup 
      v-if="isSale" 
      title="What is the ownership status of the listing?"
      :options="saleSharedOwnershipOptions" 
      v-model="stepOneData.saleListing.sharedOwnership" 
      name="sale-shared-ownership" 
    />

    <!-- RENTAL -->
    <OrganismsDraftFormRadioGroup 
      v-if="isRent" 
      title="What is the availability status of the listing?"
      :options="rentalAvailabilityStatusOptions" 
      v-model="stepOneData.rentalListing.availabilityStatus"
      name="rental-availability-status" 
      :required="true" 
    />

    <OrganismsDraftFormRadioGroup 
      v-if="isRent" 
      title="Are bills included in the rent?"
      :options="rentalBillsIncludedOptions" 
      v-model="stepOneData.rentalListing.isBillsIncluded"
      name="rental-bills-included" 
      :required="true" 
      />

    <OrganismsDraftFormRadioGroup 
      v-if="isRent" 
      title="What is the furnished status of the listing?"
      :options="rentalFurnishedStatusOptions" 
      v-model="stepOneData.rentalListing.furnishedStatus"
      name="rental-furnished-status" 
      :required="true" 
    />
  </CreateListingStepsStepLayout>
</template>

<script setup lang="ts">
import type { SaleListingCreateWithoutListingInput, RentalListingCreateWithoutListingInput } from '~~/layers/database/server/database/prisma/generated/models';

const props = defineProps<{
  draft: DraftListingWithFullPayload;
}>();

const emit = defineEmits<{
  'updateStepData': [stepData: StepOne, step: number];
  'nextStep': [];
}>();

// Create step configuration for the composable
const stepConfig = computed(() => ({
  initialData: {
    selectedType: props.draft.saleListing ? 'sale' : props.draft.rentalListing ? 'rent' : null,
    saleListing: createInitialSaleValues(props.draft),
    rentalListing: createInitialRentalValues(props.draft)
  },
  isValid: stepOneValidation.isStepOneValid,
  hasExistingData: stepOneValidation.hasExistingStepOneData
}));

// Use the reusable step form composable
const {
  formData: stepOneData,
  formKey,
  isFormValid,
  hasChanges,
  buttonDisabled,
  buttonText,
  resetForm,
  submitForm: handleSubmit
} = useDraftStepForm(stepConfig, props.draft);

// Computed properties for template conditions
const isSale = computed(() => stepOneData.value.selectedType === 'sale');
const isRent = computed(() => stepOneData.value.selectedType === 'rent');

// Handle type selection change
function onSelectedTypeChange(newType: string | null) {
  stepOneData.value.selectedType = newType;
  // reset the opposite listing
  if (newType === 'sale') stepOneData.value.rentalListing = createInitialRentalValues(props.draft);
  if (newType === 'rent') stepOneData.value.saleListing = createInitialSaleValues(props.draft);
}

// Handle form submission
function submitForm() {
  handleSubmit(
    (data) => {
      const stepData = data.selectedType === 'sale'
        ? setStepData('sale', data.saleListing as SaleListingCreateWithoutListingInput)
        : setStepData('rent', data.rentalListing as RentalListingCreateWithoutListingInput);
      
      emit('updateStepData', stepData, 1);
    },
    () => emit('nextStep')
  );
}
</script>
<!-- all step components will inherit these styles - they are NOT scoped -->
<style lang="scss">
.step {
  &__title {
    color: var(--secondary-400);
    margin-bottom: var(--size-4);
  }

  &__info {
    margin: var(--size-16) 0;
  }

  &__required {
    color: var(--error);
  }

  &__form {
    display: flex;
    flex-direction: column;

    &-action {
      align-self: flex-end;
    }
  }
}
</style>