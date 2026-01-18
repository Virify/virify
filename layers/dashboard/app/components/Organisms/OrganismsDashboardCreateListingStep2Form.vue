<template>
  <OrganismsDashboardCreateListingStepWrapper
    :step-number="2"
    alert-title="Step 2: Property Basics"
    alert-description="Start by finding your property address, then provide basic details about your property."
    :schema="step2Schema"
    :state="state"
    :is-valid="isFormValid"
    api-endpoint="/api/draft-listings/update/steps/two/"
    :get-submission-data="getSubmissionData"
    @completed="onStepCompleted"
    @saved="onStepSaved"
  >
    <!-- Row 1: Address, Type, Classification -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
      <OrganismsDashboardProfileAddressLookup
        v-model="state.property.address"
        :pending="false"
        variant="listing"
      />

      <UFormField label="Property Type" name="property.type" description="Select the type of property" required eagerValidation>
        <USelect 
          v-model="state.property.type" 
          :items="propertyTypeItems" 
          placeholder="Select type"
          color="secondary"
          size="lg"
          @update:model-value="onPropertyTypeChange"
          class="w-full" 
        />
      </UFormField>

      <UFormField label="Classification" name="property.classification" description="Select the classification" required eagerValidation>
        <USelect 
          v-model="state.property.classification" 
          :items="classificationItems" 
          :disabled="!state.property.type"
          color="secondary"
          size="lg"
          :placeholder="state.property.type ? 'Select' : 'Select type first'"
          class="w-full"
        />
      </UFormField>
    </div>

    <!-- Row 2: Floors, Construction, Size, Year Built -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
      <UFormField label="Total Floors" name="property.totalFloors" description="Number of floors" required eagerValidation>
        <UInput 
          v-model.number="state.property.totalFloors" 
          type="number"
          :min="1"
          :max="100"
          color="secondary"
          size="lg"
          placeholder="e.g. 2"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Construction" name="property.constructionType" description="Build type" hint="optional">
        <USelect 
          v-model="state.property.constructionType" 
          :items="constructionTypeItems" 
          placeholder="Select"
          color="secondary"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Property Size" name="property.size" description="Total size of the property" hint="optional">
        <div class="flex gap-2">
          <UInput 
            v-model.number="sizeInput" 
            type="number"
            :min="1"
            size="lg"
            color="secondary"
            placeholder="e.g. 85"
            class="flex-1"
          />
          <USelect 
            v-model="sizeUnit" 
            :items="sizeUnitItems"
            color="secondary"
            class="w-20"
          />
        </div>
      </UFormField>

      <UFormField label="Year Built" name="property.yearBuilt" description="Year the property was built" hint="optional">
        <UInput 
          v-model="state.property.yearBuilt" 
          type="number"
          :min="1500"
          size="lg"
          :max="currentYear"
          color="secondary"
          placeholder="e.g. 1995"
          class="w-full"
        />
      </UFormField>
    </div>

    <!-- Row 3: Description (full width) -->
    <UFormField label="Property Description" name="property.description" description="Add a compelling description of your property (min 10 characters)" required eagerValidation>
      <UTextarea 
        v-model="state.property.description" 
        placeholder="e.g. 'This charming 2-bedroom apartment offers stunning views...'"
        :rows="4"
        color="secondary"
        class="w-full"
      />
    </UFormField>
  </OrganismsDashboardCreateListingStepWrapper>
</template>

<script setup lang="ts">
const { getStepData, propertyTypes } = useCreateListingSteps()

// Default empty address state (matches AddressParsed interface)
const emptyAddress: AddressParsed = {
  number: null,
  flat: null,
  name: null,
  street: null,
  city: null,
  postcode: null,
  country: null,
  locality: null,
  county: null,
  district: null,
  fullAddress: null,
  lat: null,
  lon: null,
}

// Form state - initialize with saved data if exists
// savedData may include extra UI fields like sizeUnit that aren't in the schema
const savedData = getStepData(2) as (Step2FormData & { sizeUnit?: 'sqm' | 'sqft' }) | undefined

// Default property state
const defaultProperty = {
  address: { ...emptyAddress },
  type: null as unknown as number,
  classification: null as unknown as number,
  description: '',
  totalFloors: 1,
  constructionType: null,
  size: null,
  yearBuilt: null,
}

const state = reactive<Step2FormData>({
  property: savedData?.property 
    ? { ...defaultProperty, ...savedData.property, address: { ...emptyAddress, ...savedData.property.address } }
    : defaultProperty,
})

// Size conversion (UI only - stored in meters)
// Restore user's preferred unit from saved data, default to sqm
const sizeUnit = ref<'sqm' | 'sqft'>(savedData?.sizeUnit ?? 'sqm')

// Initialize sizeInput based on the stored unit preference
// If user had selected sqft, convert the stored m² back to sqft for display
const initSizeInput = (): number | null => {
  const storedSize = state.property.size
  if (storedSize === null || storedSize === undefined) return null
  // If user's preferred unit was sqft, convert back for display
  if (savedData?.sizeUnit === 'sqft') {
    return sqmToSqft(storedSize)
  }
  return storedSize
}
const sizeInput = ref<number | null>(initSizeInput())

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

// Check if address is valid (has required fields)
const hasValidAddress = computed(() => {
  const addr = state.property.address
  return !!(addr?.street && addr?.city && addr?.postcode)
})

// Computed validation
const isFormValid = computed(() => {
  return !!(
    hasValidAddress.value &&
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
    // Store user's preferred size unit so we can restore it when editing
    sizeUnit: sizeUnit.value,
    property: {
      address: state.property.address,
      type: state.property.type,
      classification: state.property.classification,
      description: state.property.description,
      totalFloors: state.property.totalFloors,
      constructionType: state.property.constructionType,
      size: state.property.size, // Always stored in m²
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
