<template>
  <OrganismsDashboardCreateListingStepWrapper
    :step-number="2"
    alert-title="Step 2: Property Basics"
    alert-description="Provide the basic details about your property. This helps buyers/tenants understand what you're offering."
    :schema="step2Schema"
    :state="state"
    :is-valid="isFormValid"
    api-endpoint="/api/draft-listings/update/steps/two/"
    :get-submission-data="getSubmissionData"
    @completed="onStepCompleted"
    @saved="onStepSaved"
  >
    <!-- Description first (full width) -->
    <div class="mb-6">
      <UFormField label="Property Description" name="property.description" description="Add a compelling description of your property (min 10 characters)" required>
        <UTextarea 
          v-model="state.property.description" 
          placeholder="e.g. 'This charming 2-bedroom apartment offers stunning views...'"
          :rows="4"
          class="w-full"
        />
      </UFormField>
    </div>

    <!-- All other fields in a flex wrap row -->
    <div class="flex flex-wrap gap-6 items-start">
      <!-- Property Type -->
      <div class="basis-full sm:basis-0 sm:flex-1 sm:max-w-56 min-w-fit">
        <UFormField label="Property Type" name="property.type" description="Select the type of property" required>
          <USelect 
            v-model="state.property.type" 
            :items="propertyTypeItems" 
            placeholder="Select property type"
            @update:model-value="onPropertyTypeChange" 
            class="w-full" 
          />
        </UFormField>
      </div>

      <!-- Classification (disabled until type selected) -->
      <div class="basis-full sm:basis-0 sm:flex-1 sm:max-w-56 min-w-fit">
        <UFormField label="Classification" name="property.classification" description="Select the classification" required>
          <USelect 
            v-model="state.property.classification" 
            :items="classificationItems" 
            :disabled="!state.property.type"
            :placeholder="state.property.type ? 'Select classification' : 'Select type first'"
            class="w-full" 
          />
        </UFormField>
      </div>

      <!-- Total Floors -->
      <div class="basis-full sm:basis-0 sm:flex-1 sm:max-w-40 min-w-fit">
        <UFormField label="Total Floors" name="property.totalFloors" description="Number of floors in the property" required>
          <UInput 
            v-model.number="state.property.totalFloors" 
            type="number"
            :min="1"
            :max="100"
            placeholder="e.g. 2"
            class="w-full"
          />
        </UFormField>
      </div>

      <!-- Construction Type -->
      <div class="basis-full sm:basis-0 sm:flex-1 sm:max-w-44 min-w-fit">
        <UFormField label="Construction Type" name="property.constructionType" description="Standard or non-standard build">
          <USelect 
            v-model="state.property.constructionType" 
            :items="constructionTypeItems" 
            placeholder="Select type"
            class="w-full" 
          />
        </UFormField>
      </div>

      <!-- Property Size -->
      <div class="basis-full sm:basis-0 sm:flex-1 sm:max-w-56 min-w-fit">
        <UFormField label="Property Size" name="property.size" description="Total size in square meters (optional)">
          <div class="flex gap-2">
            <UInput 
              v-model.number="sizeInput" 
              type="number"
              :min="1"
              placeholder="e.g. 85"
              class="flex-1"
            />
            <USelect 
              v-model="sizeUnit" 
              :items="sizeUnitItems"
              class="w-20"
            />
          </div>
        </UFormField>
      </div>

      <!-- Year Built -->
      <div class="basis-full sm:basis-0 sm:flex-1 sm:max-w-40 min-w-fit">
        <UFormField label="Year Built" name="property.yearBuilt" description="When was the property built? (optional)">
          <UInput 
            v-model="state.property.yearBuilt" 
            type="number"
            :min="1500"
            :max="currentYear"
            placeholder="e.g. 1995"
            class="w-full" 
          />
        </UFormField>
      </div>
    </div>
  </OrganismsDashboardCreateListingStepWrapper>
</template>

<script setup lang="ts">
// step2Schema and Step2FormData are auto-imported from shared/utils/
const { getStepData, propertyTypes } = useCreateListingSteps()

// Form state - initialize with saved data if exists
const savedData = getStepData(2) as Step2FormData | undefined
const state = reactive<Step2FormData>(savedData && Object.keys(savedData).length > 0 ? { ...savedData } : {
  property: {
    type: null as unknown as number,
    classification: null as unknown as number,
    description: '',
    totalFloors: 1,
    constructionType: null,
    size: null,
    yearBuilt: null,
  },
})

// Size conversion (UI only - stored in meters)
const sizeUnit = ref<'sqm' | 'sqft'>('sqm')
const sizeInput = ref<number | null>(state.property.size ?? null)

// Watch size input and convert to meters for storage
watch([sizeInput, sizeUnit], ([size, unit]) => {
  if (size === null || size === undefined) {
    state.property.size = null
  } else if (unit === 'sqft') {
    // Convert square feet to square meters
    state.property.size = Math.round(size * 0.092903 * 100) / 100
  } else {
    state.property.size = size
  }
})

// Property type select items
const propertyTypeItems = computed(() => {
  if (!propertyTypes.value) return []
  return propertyTypes.value.map(type => ({
    value: type.id,
    label: type.name,
  }))
})

// Classification items based on selected property type
const classificationItems = computed(() => {
  if (!propertyTypes.value || !state.property.type) return []
  
  const selectedType = propertyTypes.value.find(t => t.id === state.property.type)
  if (!selectedType?.options) return []
  
  return selectedType.options.map(opt => ({
    value: opt.key,
    label: opt.value,
  }))
})

// Construction type items
const constructionTypeItems = [
  { value: null, label: 'Not specified' },
  { value: 'STANDARD', label: 'Standard' },
  { value: 'NON_STANDARD', label: 'Non-standard' },
]

// Size unit items
const sizeUnitItems = [
  { value: 'sqm', label: 'm²' },
  { value: 'sqft', label: 'ft²' },
]

// Year built bounds
const currentYear = new Date().getFullYear()

// Computed validation
const isFormValid = computed(() => {
  return !!(
    state.property.type &&
    state.property.classification &&
    state.property.description &&
    state.property.description.length >= 10 &&
    state.property.totalFloors >= 1
  )
})

// Handle property type change - reset classification
function onPropertyTypeChange() {
  state.property.classification = null as unknown as number
}

// Get submission data for the wrapper
function getSubmissionData() {
  return {
    property: {
      type: state.property.type,
      classification: state.property.classification,
      description: state.property.description,
      totalFloors: state.property.totalFloors,
      constructionType: state.property.constructionType,
      size: state.property.size,
      yearBuilt: state.property.yearBuilt,
    }
  }
}

// Handle step events
function onStepCompleted() {
  // Step-specific completion logic if needed
}

function onStepSaved() {
  // Step-specific save logic if needed
}
</script>
