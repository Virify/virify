<template>
  <OrganismsDashboardCreateListingStepWrapper
    :step-number="8"
    alert-title="Step 8: Energy & Costs"
    alert-description="Add details about energy efficiency, heating systems, utilities, council tax, and running costs of your property."
    :schema="step8Schema"
    :state="state"
    :is-valid="isFormValid"
    api-endpoint="/api/draft-listings/update/steps/eight/"
    :get-submission-data="getSubmissionData"
    @completed="onStepCompleted"
    @saved="onStepSaved"
  >
    <!-- Collapsible Sections -->
    <UAccordion 
      :items="accordionItems" 
      type="multiple"
      :default-value="['energy']"
      :ui="{ 
        item: 'border border-default rounded-lg mb-3 last:border-b!',
        trigger: 'px-4 py-3 items-center',
        label: 'title-xs mb-0!',
        leadingIcon: 'text-secondary',
        content: 'px-0 pt-0 pb-0 border-b-0!'
      }"
    >
      <!-- Energy Performance & Utilities Section -->
      <template #energy>
        <div class="space-y-5 p-4 pt-2">
          <UFormField label="Description" name="property.energyAndUtilities.description" description="Describe energy and utility features" hint="optional" eager-validation>
            <UTextarea
              v-model="state.property.energyAndUtilities.description"
              placeholder="e.g. Energy efficient boiler installed 2023, double glazing throughout, cavity wall insulation..."
              :rows="3"
              color="secondary"
              class="w-full"
            />
          </UFormField>

          <div class="flex flex-col md:flex-row gap-6">
            <UFormField label="EPC Rating" name="property.energyAndUtilities.epcRating" description="Energy Performance Certificate rating" required eager-validation class="w-full md:flex-1">
              <USelect
                v-model="(state.property.energyAndUtilities.epcRating as any)"
                :items="epcRatingOptions"
                color="secondary"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Boiler Type" name="property.energyAndUtilities.boilerType" description="Type of boiler installed" hint="optional" eager-validation class="w-full md:flex-1">
              <USelect
                v-model="(state.property.energyAndUtilities.boilerType as any)"
                :items="boilerTypeOptions"
                color="secondary"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Hot Water Source" name="property.energyAndUtilities.hotWaterSource" description="Primary source of hot water" hint="optional" eager-validation class="w-full md:flex-1">
              <USelect
                v-model="(state.property.energyAndUtilities.hotWaterSource as any)"
                :items="hotWaterSourceOptions"
                color="secondary"
                class="w-full"
              />
            </UFormField>
          </div>

          <UFormField label="Primary Heating" name="property.energyAndUtilities.primaryHeatingType" description="Select primary heating systems" hint="optional" eager-validation>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3 mt-2">
              <UCheckbox
                v-for="option in heatingTypeOptions"
                :key="String(option.value)"
                :id="`primary-heating-${option.value}`"
                :name="`primary-heating-${option.value}`"
                :model-value="state.property.energyAndUtilities.primaryHeatingType?.includes(option.value)"
                @update:model-value="(val: boolean | 'indeterminate') => toggleHeating('primaryHeatingType', option.value, val === true)"
                :label="option.label"
                color="secondary"
              />
            </div>
          </UFormField>

          <UFormField label="Secondary Heating" name="property.energyAndUtilities.secondaryHeatingType" description="Select any additional heating systems" hint="optional" eager-validation>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3 mt-2">
              <UCheckbox
                v-for="option in heatingTypeOptions"
                :key="String(option.value)"
                :id="`secondary-heating-${option.value}`"
                :name="`secondary-heating-${option.value}`"
                :model-value="state.property.energyAndUtilities.secondaryHeatingType?.includes(option.value)"
                @update:model-value="(val: boolean | 'indeterminate') => toggleHeating('secondaryHeatingType', option.value, val === true)"
                :label="option.label"
                color="secondary"
              />
            </div>
          </UFormField>

          <UFormField label="Renewable Energy" name="property.energyAndUtilities.renewables" description="Select installed renewable energy sources" hint="optional" eager-validation>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3 mt-2">
              <UCheckbox
                v-for="option in renewableEnergyOptions"
                :key="String(option.value)"
                :id="`renewable-${option.value}`"
                :name="`renewable-${option.value}`"
                :model-value="state.property.energyAndUtilities.renewables?.includes(option.value)"
                @update:model-value="(val: boolean | 'indeterminate') => toggleRenewable(option.value, val === true)"
                :label="option.label"
                color="secondary"
              />
            </div>
          </UFormField>

          <UFormField label="Connected Utilities" name="property.energyAndUtilities.connectedUtilities" description="Select connected utility services" hint="optional" eager-validation>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3 mt-2">
              <UCheckbox
                v-for="option in connectedUtilitiesOptions"
                :key="String(option.value)"
                :id="`utility-${option.value}`"
                :name="`utility-${option.value}`"
                :model-value="state.property.energyAndUtilities.connectedUtilities?.includes(option.value)"
                @update:model-value="(val: boolean | 'indeterminate') => toggleUtility(option.value, val === true)"
                :label="option.label"
                color="secondary"
              />
            </div>
          </UFormField>
        </div>
      </template>

      <!-- Running Costs Section -->
      <template #costs>
        <div class="space-y-5 p-4 pt-2">
          <UFormField label="Description" name="property.runningCosts.description" description="Additional information about running costs" hint="optional" eager-validation>
            <UTextarea
              v-model="state.property.runningCosts.description"
              placeholder="e.g. Utilities included, charges for parking, maintenance fees..."
              :rows="3"
              color="secondary"
              class="w-full"
            />
          </UFormField>

          <div class="flex flex-col md:flex-row gap-6">
            <UFormField label="Council Tax Band" name="property.runningCosts.councilTaxBand" description="Property council tax band" required eager-validation class="w-full md:flex-1">
              <USelect
                v-model="state.property.runningCosts.councilTaxBand"
                :items="councilTaxBandOptions"
                color="secondary"
                class="w-full"
              />
            </UFormField>

            <UFormField v-if="showServiceCharges" label="Service Charges (p.a.)" name="property.runningCosts.serviceCharges" description="Annual service charge" hint="optional" eager-validation class="w-full md:flex-1">
              <UInput
                v-model="state.property.runningCosts.serviceCharges"
                type="number"
                placeholder="e.g. 1200"
                :min="0"
                color="secondary"
                class="w-full"
              >
                <template #leading>
                  <span class="text-muted">£</span>
                </template>
              </UInput>
            </UFormField>

            <UFormField v-if="showServiceCharges" label="Ground Rent (p.a.)" name="property.runningCosts.groundRent" description="Annual ground rent" hint="optional" eager-validation class="w-full md:flex-1">
              <UInput
                v-model="state.property.runningCosts.groundRent"
                type="number"
                placeholder="e.g. 250"
                :min="0"
                color="secondary"
                class="w-full"
              >
                <template #leading>
                  <span class="text-muted">£</span>
                </template>
              </UInput>
            </UFormField>
          </div>
        </div>
      </template>
    </UAccordion>
  </OrganismsDashboardCreateListingStepWrapper>
</template>

<script setup lang="ts">

// Get draft data from composable
const { getStepData } = useCreateListingSteps()
const draftData = getStepData(8)

// Initialize form state
const state = reactive<Step8FormState>(createInitialStep8Values(draftData))

// Get listing type from Step 1 data and tenure from Step 3 (if sale)
const step1Data = getStepData(1) as Step1FormData | undefined
const step3Data = getStepData(3) as { saleListing?: { tenureType?: string } } | undefined
const listingType = computed(() => step1Data?.selectedType ?? 'sale')
const tenureType = computed(() => step3Data?.saleListing?.tenureType)

// Check if service charges should be shown (rental or leasehold)
const showServiceCharges = computed(() => {
  return listingType.value === 'rent' || tenureType.value === 'LEASEHOLD'
})

// Accordion items
const accordionItems = [
  {
    label: 'Energy Performance & Utilities',
    value: 'energy',
    slot: 'energy',
    icon: 'i-lucide-zap',
  },
  {
    label: 'Running Costs',
    value: 'costs',
    slot: 'costs',
    icon: 'i-lucide-pound-sterling',
  },
]

// Form validation
const isFormValid = computed(() => step8Validation.isStep8Valid(state))

// Toggle heating type
function toggleHeating(field: 'primaryHeatingType' | 'secondaryHeatingType', value: string, checked: boolean) {
  const current = state.property.energyAndUtilities[field] ?? []
  if (checked) {
    state.property.energyAndUtilities[field] = [...current, value]
  } else {
    state.property.energyAndUtilities[field] = current.filter((v) => v !== value)
  }
}

// Toggle renewable energy
function toggleRenewable(value: string, checked: boolean) {
  const current = state.property.energyAndUtilities.renewables ?? []
  if (checked) {
    state.property.energyAndUtilities.renewables = [...current, value]
  } else {
    state.property.energyAndUtilities.renewables = current.filter((v) => v !== value)
  }
}

// Toggle connected utility
function toggleUtility(value: string, checked: boolean) {
  const current = state.property.energyAndUtilities.connectedUtilities ?? []
  if (checked) {
    state.property.energyAndUtilities.connectedUtilities = [...current, value]
  } else {
    state.property.energyAndUtilities.connectedUtilities = current.filter((v) => v !== value)
  }
}

// Get submission data
function getSubmissionData() {
  return {
    property: {
      energyAndUtilities: {
        description: state.property.energyAndUtilities.description || null,
        epcRating: state.property.energyAndUtilities.epcRating,
        epcCertificateUrl: state.property.energyAndUtilities.epcCertificateUrl || null,
        primaryHeatingType: state.property.energyAndUtilities.primaryHeatingType ?? [],
        secondaryHeatingType: state.property.energyAndUtilities.secondaryHeatingType ?? [],
        boilerType: state.property.energyAndUtilities.boilerType || null,
        hotWaterSource: state.property.energyAndUtilities.hotWaterSource || null,
        renewables: state.property.energyAndUtilities.renewables ?? [],
        connectedUtilities: state.property.energyAndUtilities.connectedUtilities ?? [],
      },
      runningCosts: {
        description: state.property.runningCosts.description || null,
        councilTaxBand: state.property.runningCosts.councilTaxBand,
        serviceCharges: state.property.runningCosts.serviceCharges ?? null,
        groundRent: state.property.runningCosts.groundRent ?? null,
      },
    },
  }
}

// Handle step completion
function onStepCompleted() {
  console.log('Step 8 completed, advancing to step 9')
}

// Handle save progress
function onStepSaved() {
  console.log('Step 8 saved (progress only)')
}
</script>
