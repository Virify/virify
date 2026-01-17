<template>
  <OrganismsDashboardCreateListingStepWrapper
    :step-number="1"
    alert-title="Step 1: Listing Type"
    alert-description="This information helps us categorize your listing correctly. You can always update these details later."
    :schema="step1Schema"
    :state="state"
    :is-valid="isFormValid"
    api-endpoint="/api/draft-listings/update/steps/one/"
    :get-submission-data="getSubmissionData"
    @completed="onStepCompleted"
    @saved="onStepSaved"
  >
    <!-- Main field row -->
    <div class="flex flex-wrap justify-between gap-6">
      <div class="basis-full sm:basis-0 sm:flex-1 sm:min-w-40 sm:max-w-48">
        <UFormField label="Sale or Rental?" name="selectedType" description="Type of listing" required eagerValidation>
          <USelect v-model="state.selectedType" :items="listingTypeItems" @update:model-value="onListingTypeChange" class="w-full" />
        </UFormField>
      </div>

      <!-- SALE FIELDS - Nested Form -->
      <UForm v-if="state.selectedType === 'sale'" :state="state.saleListing!" class="contents">
        <div class="basis-full sm:basis-0 sm:flex-1 sm:min-w-40 sm:max-w-48">
          <UFormField label="Property Tenure" name="tenureType" required description="Tenure type" eagerValidation>
            <USelect v-model="state.saleListing!.tenureType" :items="tenureItems" class="w-full" />
          </UFormField>
        </div>

        <div class="basis-full sm:basis-0 sm:flex-1 sm:min-w-44 sm:max-w-52">
          <UFormField label="Chain Status" name="chain" description="Part of a chain?" required eagerValidation>
            <USelect v-model="state.saleListing!.chain" :items="chainItems" class="w-full" />
          </UFormField>
        </div>

        <div class="basis-full sm:basis-0 sm:flex-1 sm:min-w-40 sm:max-w-48">
          <UFormField label="Shared Ownership" name="sharedOwnership" description="Shared ownership?" required eagerValidation>
            <USwitch v-model="state.saleListing!.sharedOwnership" color="secondary" size="xl" :ui="{
              base: 'data-[state=checked]:bg-secondary/80 data-[state=unchecked]:bg-primary/20 dark:data-[state=unchecked]:bg-(--foreground-100)/50 w-10 transition-colors',
              container: 'w-11! h-6 p-0.5',
              wrapper: 'w-20! h-6 p-0.5',
              thumb: 'border border-elevated'
            }" />
          </UFormField>
        </div>

        <div class="basis-full sm:basis-0 sm:flex-1 sm:min-w-40 sm:max-w-48">
          <UFormField label="Availability" name="availabilityStatus" description="Current availability" required eagerValidation>
            <USelect v-model="state.saleListing!.availabilityStatus" :items="saleAvailabilityItems" class="w-full" />
          </UFormField>
        </div>
      </UForm>

      <!-- RENTAL FIELDS - Nested Form -->
      <UForm v-if="state.selectedType === 'rent'" :state="state.rentalListing!" class="contents">
        <div class="basis-full sm:basis-0 sm:flex-1 sm:min-w-48 sm:max-w-56">
          <UFormField label="Bills Included" name="isBillsIncluded" required description="Are bills included in rent?" eagerValidation>
            <USelect v-model="state.rentalListing!.isBillsIncluded" :items="billsIncludedItems" class="w-full" />
          </UFormField>
        </div>

        <div class="basis-full sm:basis-0 sm:flex-1 sm:min-w-44 sm:max-w-52">
          <UFormField label="Furnished Status" name="furnishedStatus" required description="Furnished or unfurnished?" eagerValidation>
            <USelect v-model="state.rentalListing!.furnishedStatus" :items="furnishedItems" class="w-full" />
          </UFormField>
        </div>

        <div class="basis-full sm:basis-0 sm:flex-1 sm:min-w-40 sm:max-w-48">
          <UFormField label="Rental Length" name="rentalLength" required description="Short or long-term?" eagerValidation>
            <USelect v-model="state.rentalListing!.rentalLength" :items="rentalLengthItems" class="w-full" />
          </UFormField>
        </div>

        <div class="basis-full sm:basis-0 sm:flex-1 sm:min-w-40 sm:max-w-48">
          <UFormField label="Availability" name="availabilityStatus" description="Current availability" required eagerValidation>
            <USelect v-model="state.rentalListing!.availabilityStatus" :items="rentalAvailabilityItems" class="w-full" />
          </UFormField>
        </div>
      </UForm>
    </div>
  </OrganismsDashboardCreateListingStepWrapper>
</template>

<script setup lang="ts">

const { getStepData } = useCreateListingSteps()

// Form state - initialize with saved data if exists
const savedData = getStepData(1) as Step1FormData | undefined
const state = reactive<Step1FormData>(savedData && Object.keys(savedData).length > 0 ? savedData : createInitialStep1Values())

// Computed validation using utility
const isFormValid = computed(() => isStep1Valid(state))

// Handle listing type change
function onListingTypeChange(newType: any) {
  const typeStr = String(newType)
  if (!typeStr || (typeStr !== "sale" && typeStr !== "rent")) return

  if (typeStr === "sale") {
    state.rentalListing = null
    state.saleListing = createDefaultSaleListing()
  } else {
    state.saleListing = null
    state.rentalListing = createDefaultRentalListing()
  }
}

// Get submission data for the wrapper
function getSubmissionData() {
  return {
    selectedType: state.selectedType,
    saleListing: state.selectedType === 'sale' ? state.saleListing : null,
    rentalListing: state.selectedType === 'rent' ? state.rentalListing : null,
  }
}

// Handle step events (wrapper manages draftId internally)
function onStepCompleted() {
  // Could add any step-specific completion logic here
}

function onStepSaved() {
  // Could add any step-specific save logic here
}
</script>
