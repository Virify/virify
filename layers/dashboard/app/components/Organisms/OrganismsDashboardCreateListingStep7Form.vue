<template>
  <OrganismsDashboardCreateListingStepWrapper
    :step-number="7"
    :schema="step7Schema"
    :state="state"
    :is-valid="isFormValid"
    api-endpoint="/api/draft-listings/update/steps/seven/"
    :get-submission-data="getSubmissionData"
    @completed="onStepCompleted"
    @saved="onStepSaved"
  >
    <template #alert>
      <UAlert type="info" class="mb-6" color="secondary" variant="subtle" icon="i-lucide-info" close>
        <template #title>
          <h3>Step 7: Additional Features</h3>
        </template>
        <template #description>
          <p class="body-sm text-muted">
            Add details about parking, security, accessibility, storage, and other building features. All fields are optional but help buyers or renters find the right property.
          </p>
        </template>
      </UAlert>
    </template>

    <!-- Collapsible Sections -->
    <UAccordion 
      :items="accordionItems" 
      type="multiple"
      :default-value="['building']"
      :ui="{ 
        item: 'border border-default rounded-lg mb-3 last:border-b!',
        trigger: 'px-4 py-3 items-center',
        label: 'title-xs mb-0!',
        leadingIcon: 'text-secondary',
        content: 'px-0 pt-0 pb-0 border-b-0!'
      }"
    >
      <!-- Building Features Section -->
      <template #building>
        <div class="space-y-5 p-4 pt-2">
          <UFormField label="Description" name="property.additionalFeatures.description" description="Describe any special features or amenities" hint="optional" eager-validation>
            <UTextarea
              v-model="state.property.additionalFeatures!.description"
              placeholder="e.g. Recently renovated throughout, high ceilings, original period features..."
              :rows="3"
              color="secondary"
              class="w-full"
            />
          </UFormField>

          <div class="flex flex-col sm:flex-row gap-6">
            <div class="sm:w-48 shrink-0">
              <UFormField label="Pet Friendly" name="property.additionalFeatures.petFriendly" description="Suitable for pets?" hint="optional" eager-validation>
                <USelect
                  v-model="state.property.additionalFeatures!.petFriendly"
                  :items="petFriendlyOptions"
                  color="secondary"
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="flex-1">
              <UFormField label="Features" name="property.additionalFeatures.features" description="Select applicable features" hint="optional" eager-validation>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3 mt-2">
                  <UCheckbox
                    v-for="feature in buildingFeatureOptions"
                    :key="String(feature.value)"
                    :id="`building-feature-${feature.value}`"
                    :name="`building-feature-${feature.value}`"
                    :model-value="state.property.additionalFeatures!.features?.includes(feature.value)"
                    @update:model-value="(val: boolean | 'indeterminate') => toggleFeature('additionalFeatures', feature.value, val === true)"
                    :label="feature.label"
                    color="secondary"
                  />
                </div>
              </UFormField>
            </div>
          </div>
        </div>
      </template>

      <!-- Parking Section -->
      <template #parking>
        <div class="space-y-5 p-4 pt-2">
          <UFormField label="Description" name="property.parking.description" description="Describe parking arrangements" hint="optional" eager-validation>
            <UTextarea
              v-model="state.property.parking!.description"
              placeholder="e.g. Private driveway with space for 2 cars, EV charging point available..."
              :rows="3"
              color="secondary"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Parking Options" name="property.parking.features" description="Select available options" hint="optional" eager-validation>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3 mt-2">
              <UCheckbox
                v-for="feature in parkingFeatureOptions"
                :key="String(feature.value)"
                :id="`parking-feature-${feature.value}`"
                :name="`parking-feature-${feature.value}`"
                :model-value="state.property.parking!.features?.includes(feature.value)"
                @update:model-value="(val: boolean | 'indeterminate') => toggleFeature('parking', feature.value, val === true)"
                :label="feature.label"
                color="secondary"
              />
            </div>
          </UFormField>
        </div>
      </template>

      <!-- Security Section -->
      <template #security>
        <div class="space-y-5 p-4 pt-2">
          <UFormField label="Description" name="property.securityFeatures.description" description="Describe security measures" hint="optional" eager-validation>
            <UTextarea
              v-model="state.property.securityFeatures!.description"
              placeholder="e.g. Gated community with 24/7 security, CCTV coverage..."
              :rows="3"
              color="secondary"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Security Features" name="property.securityFeatures.features" description="Select available features" hint="optional" eager-validation>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3 mt-2">
              <UCheckbox
                v-for="feature in securityFeatureOptions"
                :key="String(feature.value)"
                :id="`security-feature-${feature.value}`"
                :name="`security-feature-${feature.value}`"
                :model-value="state.property.securityFeatures!.features?.includes(feature.value)"
                @update:model-value="(val: boolean | 'indeterminate') => toggleFeature('securityFeatures', feature.value, val === true)"
                :label="feature.label"
                color="secondary"
              />
            </div>
          </UFormField>
        </div>
      </template>

      <!-- Accessibility Section -->
      <template #accessibility>
        <div class="space-y-5 p-4 pt-2">
          <UFormField label="Description" name="property.accessibilityFeatures.description" description="Describe accessibility features" hint="optional" eager-validation>
            <UTextarea
              v-model="state.property.accessibilityFeatures!.description"
              placeholder="e.g. Ground floor living, wide doorways throughout, wet room bathroom..."
              :rows="3"
              color="secondary"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Accessibility Features" name="property.accessibilityFeatures.features" description="Select available features" hint="optional" eager-validation>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3 mt-2">
              <UCheckbox
                v-for="feature in accessibilityFeatureOptions"
                :key="String(feature.value)"
                :id="`accessibility-feature-${feature.value}`"
                :name="`accessibility-feature-${feature.value}`"
                :model-value="state.property.accessibilityFeatures!.features?.includes(feature.value)"
                @update:model-value="(val: boolean | 'indeterminate') => toggleFeature('accessibilityFeatures', feature.value, val === true)"
                :label="feature.label"
                color="secondary"
              />
            </div>
          </UFormField>
        </div>
      </template>

      <!-- Storage Section -->
      <template #storage>
        <div class="space-y-5 p-4 pt-2">
          <UFormField label="Description" name="property.storageFeatures.description" description="Describe storage facilities" hint="optional" eager-validation>
            <UTextarea
              v-model="state.property.storageFeatures!.description"
              placeholder="e.g. Large loft with pull-down ladder, garden shed, built-in wardrobes..."
              :rows="3"
              color="secondary"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Storage Features" name="property.storageFeatures.features" description="Select available options" hint="optional" eager-validation>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3 mt-2">
              <UCheckbox
                v-for="feature in storageFeatureOptions"
                :key="String(feature.value)"
                :id="`storage-feature-${feature.value}`"
                :name="`storage-feature-${feature.value}`"
                :model-value="state.property.storageFeatures!.features?.includes(feature.value)"
                @update:model-value="(val: boolean | 'indeterminate') => toggleFeature('storageFeatures', feature.value, val === true)"
                :label="feature.label"
                color="secondary"
              />
            </div>
          </UFormField>
        </div>
      </template>

      <!-- Utility Room Section -->
      <template #utility>
        <div class="space-y-5 p-4 pt-2">
          <UFormField label="Description" name="property.utility.description" description="Describe the utility room" hint="optional" eager-validation>
            <UTextarea
              v-model="state.property.utility!.description"
              placeholder="e.g. Spacious utility with plumbing for washer and dryer, extra storage..."
              :rows="3"
              color="secondary"
              class="w-full"
            />
          </UFormField>

          <div class="flex flex-col sm:flex-row gap-6">
            <div class="sm:w-64 shrink-0">
              <UFormField label="Room Size" name="property.utility.size" description="Size of the utility room" hint="optional">
                <div class="flex gap-2">
                  <UInput
                    :model-value="utilitySizeDisplay"
                    @update:model-value="updateUtilitySize"
                    type="number"
                    :min="0"
                    placeholder="e.g. 8"
                    color="secondary"
                    class="flex-1"
                  />
                  <USelect
                    v-model="utilitySizeUnit"
                    :items="sizeUnitItems"
                    class="w-24"
                    color="secondary"
                  />
                </div>
              </UFormField>
            </div>

            <div class="flex-1">
              <UFormField label="Utility Features" name="property.utility.features" description="Select available features" hint="optional">
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 mt-2">
                  <UCheckbox
                    v-for="feature in utilityFeatureOptions"
                    :key="String(feature.value)"
                    :model-value="state.property.utility!.features?.includes(feature.value)"
                    @update:model-value="(val: boolean | 'indeterminate') => toggleFeature('utility', feature.value, val === true)"
                    :label="feature.label"
                    color="secondary"
                  />
                </div>
              </UFormField>
            </div>
          </div>
        </div>
      </template>
    </UAccordion>
  </OrganismsDashboardCreateListingStepWrapper>
</template>

<script setup lang="ts">
const { getStepData } = useCreateListingSteps()

// Initialize state from saved data or empty
const savedData = getStepData(7) as (Step7FormData & { utilitySizeUnit?: 'sqm' | 'sqft' }) | undefined
const hasValidSavedData = savedData && savedData.property
const state = reactive<Step7FormData>(
  hasValidSavedData ? savedData : createInitialStep7Values()
)

// Accordion items configuration
const accordionItems = [
  { 
    label: 'Building Features',
    value: 'building',
    icon: 'i-lucide-building',
    slot: 'building',
  },
  { 
    label: 'Parking',
    value: 'parking',
    icon: 'i-lucide-car',
    slot: 'parking',
  },
  { 
    label: 'Security',
    value: 'security',
    icon: 'i-lucide-shield',
    slot: 'security',
  },
  { 
    label: 'Accessibility',
    value: 'accessibility',
    icon: 'i-lucide-accessibility',
    slot: 'accessibility',
  },
  { 
    label: 'Storage',
    value: 'storage',
    icon: 'i-lucide-archive',
    slot: 'storage',
  },
  { 
    label: 'Utility Room',
    value: 'utility',
    icon: 'i-lucide-washing-machine',
    slot: 'utility',
  },
]

// Size unit conversion for utility room (stored in m²)
const utilitySizeUnit = ref<'sqm' | 'sqft'>(savedData?.utilitySizeUnit ?? 'sqm')

// Initialize display value based on stored unit preference
const initUtilitySizeDisplay = (): number | null => {
  const storedSize = state.property.utility?.size
  if (storedSize === null || storedSize === undefined) return null
  if (savedData?.utilitySizeUnit === 'sqft') {
    return sqmToSqft(storedSize)
  }
  return storedSize
}
const utilitySizeDisplay = ref<number | null>(initUtilitySizeDisplay())

// Update size when input changes
function updateUtilitySize(val: string | number | null) {
  if (val === null || val === '') {
    utilitySizeDisplay.value = null
    return
  }
  const numVal = typeof val === 'string' ? parseFloat(val) : val
  if (isNaN(numVal) || numVal < 0) {
    utilitySizeDisplay.value = null
  } else {
    utilitySizeDisplay.value = numVal
  }
}

// Watch for size unit changes and convert
watch([utilitySizeDisplay, utilitySizeUnit], ([size, unit]) => {
  if (!state.property.utility) return
  if (size === null || size === undefined) {
    state.property.utility.size = null
  } else if (unit === 'sqft') {
    state.property.utility.size = sqftToSqm(size)
  } else {
    state.property.utility.size = size
  }
})

// Validation - step 7 is always valid since all fields are optional
const isFormValid = computed(() => step7Validation.isStep7Valid())

// Toggle feature in array for a given section
type FeatureSection = 'parking' | 'accessibilityFeatures' | 'securityFeatures' | 'storageFeatures' | 'utility' | 'additionalFeatures'

function toggleFeature(section: FeatureSection, featureValue: string, isChecked: boolean) {
  const sectionData = state.property[section]
  if (!sectionData) return
  
  const features = sectionData.features ?? []
  
  if (isChecked) {
    if (!features.includes(featureValue as any)) {
      sectionData.features = [...features, featureValue] as any
    }
  } else {
    sectionData.features = features.filter(f => f !== featureValue) as any
  }
}

// Get submission data formatted for API
function getSubmissionData() {
  return {
    property: {
      parking: state.property.parking,
      accessibilityFeatures: state.property.accessibilityFeatures,
      securityFeatures: state.property.securityFeatures,
      storageFeatures: state.property.storageFeatures,
      utility: state.property.utility,
      additionalFeatures: state.property.additionalFeatures,
    },
    // Include UI preference for size unit (not in schema, but useful for reload)
    utilitySizeUnit: utilitySizeUnit.value,
  }
}

// Handle step events
function onStepCompleted() {
  console.log('Step 7 completed, advancing to step 8')
}

function onStepSaved() {
  console.log('Step 7 saved (progress only)')
}
</script>
