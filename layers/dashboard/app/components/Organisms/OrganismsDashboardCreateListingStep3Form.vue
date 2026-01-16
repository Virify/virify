<template>
  <OrganismsDashboardCreateListingStepWrapper
    :step-number="3"
    alert-title="Step 3: Price"
    :alert-description="alertDescription"
    :schema="step3Schema"
    :state="state"
    :is-valid="isFormValid"
    api-endpoint="/api/draft-listings/update/steps/three/"
    :get-submission-data="getSubmissionData"
    @completed="onStepCompleted"
    @saved="onStepSaved"
  >
    <!-- Sale Price Fields -->
    <div v-if="listingType === 'sale'" class="flex flex-wrap gap-6 items-start">
      <div class="basis-full sm:basis-0 sm:flex-1 sm:max-w-64 min-w-fit">
        <UFormField label="Asking Price" name="price" description="The price you're asking for the property" required>
          <UInput
            v-model.number="state.price"
            type="number"
            :min="1"
            placeholder="e.g. 350000"
            class="w-full"
          >
            <template #leading>
              <span class="text-muted">£</span>
            </template>
          </UInput>
        </UFormField>
      </div>

      <div class="basis-full sm:basis-0 sm:flex-1 sm:max-w-56 min-w-fit">
        <UFormField label="Price Type" name="saleListing.priceType" description="How the price should be displayed" required>
          <USelect
            v-model="state.saleListing!.priceType"
            :items="priceTypeItems"
            class="w-full"
          />
        </UFormField>
      </div>

      <!-- Price preview -->
      <div class="basis-full">
        <p class="text-sm text-muted">
          Your listing will show: <strong class="text-foreground">{{ formattedSalePrice }}</strong>
        </p>
      </div>
    </div>

    <!-- Rental Price Fields -->
    <div v-else-if="listingType === 'rent'" class="flex flex-wrap gap-6 items-start">
      <div class="basis-full sm:basis-0 sm:flex-1 sm:max-w-64 min-w-fit">
        <UFormField label="Rent Amount" name="price" description="The rent amount" required>
          <UInput
            v-model.number="state.price"
            type="number"
            :min="1"
            placeholder="e.g. 1500"
            class="w-full"
          >
            <template #leading>
              <span class="text-muted">£</span>
            </template>
          </UInput>
        </UFormField>
      </div>

      <div class="basis-full sm:basis-0 sm:flex-1 sm:max-w-48 min-w-fit">
        <UFormField label="Rent Frequency" name="rentalListing.rentFrequency" description="How often rent is paid" required>
          <USelect
            v-model="state.rentalListing!.rentFrequency"
            :items="rentFrequencyItems"
            class="w-full"
          />
        </UFormField>
      </div>

      <div class="basis-full sm:basis-0 sm:flex-1 sm:max-w-52 min-w-fit">
        <UFormField label="Security Deposit" name="rentalListing.deposit" description="Deposit amount (optional)">
          <UInput
            v-model.number="state.rentalListing!.deposit"
            type="number"
            :min="0"
            placeholder="e.g. 1500"
            class="w-full"
          >
            <template #leading>
              <span class="text-muted">£</span>
            </template>
          </UInput>
        </UFormField>
      </div>

      <div class="basis-full sm:basis-0 sm:flex-1 sm:max-w-52 min-w-fit">
        <UFormField label="Holding Deposit" name="rentalListing.holdingDeposit" description="Holding deposit (optional)">
          <UInput
            v-model.number="state.rentalListing!.holdingDeposit"
            type="number"
            :min="0"
            placeholder="e.g. 300"
            class="w-full"
          >
            <template #leading>
              <span class="text-muted">£</span>
            </template>
          </UInput>
        </UFormField>
      </div>

      <!-- Price preview -->
      <div class="basis-full">
        <p class="text-sm text-muted">
          Your listing will show: <strong class="text-foreground">{{ formattedRentalPrice }}</strong>
        </p>
      </div>
    </div>
  </OrganismsDashboardCreateListingStepWrapper>
</template>

<script setup lang="ts">
// step3Schema is auto-imported from shared/utils/
const { getStepData } = useCreateListingSteps()

// Get listing type from Step 1 data
const step1Data = getStepData(1) as Step1FormData | undefined
const listingType = computed(() => step1Data?.selectedType ?? 'sale')

// Alert description based on listing type
const alertDescription = computed(() => {
  return listingType.value === 'sale'
    ? 'Set your asking price and how you\'d like it displayed to potential buyers.'
    : 'Set your rental price, frequency, and any deposit requirements.'
})

// State type matching API schema
interface Step3State {
  price: number | null
  saleListing: {
    priceType: string | undefined
  } | null
  rentalListing: {
    rentFrequency: string | undefined
    deposit: number | null
    holdingDeposit: number | null
  } | null
}

// Form state - initialize based on listing type
const savedData = getStepData(3) as Step3State | undefined
const state = reactive<Step3State>(
  savedData && Object.keys(savedData).length > 0 
    ? { ...savedData }
    : listingType.value === 'sale'
      ? {
          price: null,
          saleListing: {
            priceType: 'FIXED',
          },
          rentalListing: null,
        }
      : {
          price: null,
          saleListing: null,
          rentalListing: {
            rentFrequency: 'MONTHLY',
            deposit: null,
            holdingDeposit: null,
          },
        }
)

// Ensure state stays in sync with listing type from Step 1
watch(listingType, (newType) => {
  if (newType === 'sale' && !state.saleListing) {
    state.saleListing = { priceType: 'FIXED' }
    state.rentalListing = null
  } else if (newType === 'rent' && !state.rentalListing) {
    state.rentalListing = {
      rentFrequency: 'MONTHLY',
      deposit: null,
      holdingDeposit: null,
    }
    state.saleListing = null
  }
}, { immediate: true })

// Select items
const priceTypeItems = [
  { value: 'FIXED', label: 'Fixed Price' },
  { value: 'OFFERS_OVER', label: 'Offers Over' },
  { value: 'GUIDE_PRICE', label: 'Guide Price' },
]

const rentFrequencyItems = [
  { value: 'MONTHLY', label: 'Per Month' },
  { value: 'WEEKLY', label: 'Per Week' },
]

// Price formatting
const formatPrice = (price: number | null | undefined): string => {
  if (!price) return '£0'
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const formattedSalePrice = computed(() => {
  const price = formatPrice(state.price)
  const priceType = state.saleListing?.priceType
  
  switch (priceType) {
    case 'OFFERS_OVER':
      return `Offers Over ${price}`
    case 'GUIDE_PRICE':
      return `Guide Price ${price}`
    default:
      return price
  }
})

const formattedRentalPrice = computed(() => {
  const price = formatPrice(state.price)
  const frequency = state.rentalListing?.rentFrequency === 'WEEKLY' ? 'pw' : 'pcm'
  return `${price} ${frequency}`
})

// Computed validation
const isFormValid = computed(() => {
  if (!state.price || state.price <= 0) return false
  
  if (listingType.value === 'sale') {
    return !!state.saleListing?.priceType
  }
  if (listingType.value === 'rent') {
    return !!state.rentalListing?.rentFrequency
  }
  return false
})

// Get submission data for the wrapper - matches API schema
function getSubmissionData() {
  return {
    price: state.price,
    saleListing: listingType.value === 'sale' ? state.saleListing : undefined,
    rentalListing: listingType.value === 'rent' ? state.rentalListing : undefined,
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
