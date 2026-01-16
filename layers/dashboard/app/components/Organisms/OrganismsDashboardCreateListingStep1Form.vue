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
    <div class="flex flex-wrap gap-6">
      <div class="basis-full sm:basis-0 flex-1">
        <UFormField label="Sale or Rental?" name="selectedType" description="Select your type of listing" required>
          <USelect v-model="state.selectedType" :items="listingTypeItems" @update:model-value="onListingTypeChange" class="w-full" />
        </UFormField>
      </div>

      <!-- SALE FIELDS - Nested Form -->
      <UForm v-if="state.selectedType === 'sale'" :state="state.saleListing!" class="contents">
        <div class="basis-full sm:basis-0 flex-1">
          <UFormField label="Property Tenure" name="tenureType" required description="Select the tenure type for this property">
            <USelect v-model="state.saleListing!.tenureType" :items="tenureItems" class="w-full" />
          </UFormField>
        </div>

        <div class="basis-full sm:basis-0 flex-1">
          <UFormField label="Chain Status" name="chain" description="Are you part of a property chain?" required>
            <USelect v-model="state.saleListing!.chain" :items="chainItems" class="w-full" />
          </UFormField>
        </div>

        <div class="basis-full sm:basis-0 flex-1">
          <UFormField label="Shared Ownership" name="sharedOwnership" description="Is this property shared ownership?" required>
            <USwitch v-model="state.saleListing!.sharedOwnership" color="secondary" size="xl" :ui="{
              base: 'data-[state=checked]:bg-secondary/80 data-[state=unchecked]:bg-primary/20 dark:data-[state=unchecked]:bg-(--foreground-100)/50 w-10 transition-colors',
              container: 'w-11! h-6 p-0.5',
              wrapper: 'w-20! h-6 p-0.5',
              thumb: 'border border-elevated'
            }" />
          </UFormField>
        </div>
      </UForm>

      <!-- RENTAL FIELDS - Nested Form -->
      <UForm v-if="state.selectedType === 'rent'" :state="state.rentalListing!" class="contents">
        <div class="basis-full sm:basis-0 flex-1">
          <UFormField label="Bills Included" name="isBillsIncluded" required description="Are bills such as gas, electric, water included in the rent?">
            <USelect v-model="state.rentalListing!.isBillsIncluded" :items="billsIncludedItems" class="w-full" />
          </UFormField>
        </div>

        <div class="basis-full sm:basis-0 flex-1">
          <UFormField label="Furnished Status" name="furnishedStatus" required description="Select the furnished status of the property">
            <USelect v-model="state.rentalListing!.furnishedStatus" :items="furnishedItems" class="w-full" />
          </UFormField>
        </div>
      </UForm>
    </div>
  </OrganismsDashboardCreateListingStepWrapper>
</template>

<script setup lang="ts">
// step1Schema and Step1FormData are auto-imported from shared/utils/
const { getStepData } = useCreateListingSteps()

// Form state - initialize with saved data if exists
const savedData = getStepData(1) as Step1FormData | undefined
const state = reactive<Step1FormData>(savedData && Object.keys(savedData).length > 0 ? savedData : {
  selectedType: "sale",
  saleListing: {
    tenureType: "FREEHOLD",
    chain: false,
    sharedOwnership: false,
  },
  rentalListing: null,
})

// Select items
const listingTypeItems = [
  { value: "sale", label: "For Sale" },
  { value: "rent", label: "For Rent" },
]

const tenureItems = [
  { value: "FREEHOLD", label: "Freehold" },
  { value: "LEASEHOLD", label: "Leasehold" },
  { value: "COMMONHOLD", label: "Commonhold" },
]

const chainItems = [
  { value: false, label: "No" },
  { value: true, label: "Yes" },
]

const billsIncludedItems = [
  { value: false, label: "No" },
  { value: true, label: "Yes" },
]

const furnishedItems = [
  { value: "UNFURNISHED", label: "Unfurnished" },
  { value: "PART_FURNISHED", label: "Part Furnished" },
  { value: "FURNISHED", label: "Furnished" },
]

// Computed validation
const isFormValid = computed(() => {
  if (state.selectedType === "sale") {
    return !!state.saleListing?.tenureType
  }
  if (state.selectedType === "rent") {
    return !!state.rentalListing?.furnishedStatus && state.rentalListing?.isBillsIncluded != null
  }
  return false
})

// Handle listing type change
function onListingTypeChange(newType: any) {
  const typeStr = String(newType)
  if (!typeStr || (typeStr !== "sale" && typeStr !== "rent")) return

  if (typeStr === "sale") {
    state.rentalListing = null
    state.saleListing = {
      tenureType: "FREEHOLD",
      chain: false,
      sharedOwnership: false,
    }
  } else {
    state.saleListing = null
    state.rentalListing = {
      furnishedStatus: "UNFURNISHED",
      isBillsIncluded: false,
    }
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
