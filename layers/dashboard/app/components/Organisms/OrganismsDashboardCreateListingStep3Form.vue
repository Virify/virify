<template>
  <OrganismsDashboardCreateListingStepWrapper
    :step-number="3"
    :schema="activeSchema"
    :state="state"
    :is-valid="isFormValid"
    api-endpoint="/api/draft-listings/update/steps/three/"
    :get-submission-data="getSubmissionData"
    @completed="onStepCompleted"
    @saved="onStepSaved"
  >
    <template #alert>
      <UAlert type="info" class="mb-6" color="secondary" variant="subtle" icon="i-lucide-info" close>
        <template #title>
          <h3>Step 3: Price</h3>
        </template>
        <template #description>
          <p class="body-sm text-muted">
            {{ alertDescription }}
          </p>
        </template>
      </UAlert>
    </template>

    <!-- Sale Price Fields -->
    <div v-if="listingType === 'sale'" class="flex flex-wrap gap-6 items-start">
      <div class="basis-full sm:basis-0 sm:flex-1 sm:max-w-64 min-w-fit">
        <UFormField label="Asking Price" name="price" description="The price you're asking for the property" required eagerValidation>
          <UInput
            v-model.number="state.price"
            type="number"
            :min="1"
            step="1"
            placeholder="e.g. 350000"
            color="secondary"
            class="w-full"
            @keydown="(e: KeyboardEvent) => (e.key === '.' || e.key === ',') && e.preventDefault()"
          >
            <template #leading>
              <span class="text-muted">£</span>
            </template>
          </UInput>
        </UFormField>
      </div>

      <div class="basis-full sm:basis-0 sm:flex-1 sm:max-w-56 min-w-fit">
        <UFormField label="Price Type" name="saleListing.priceType" description="How the price should be displayed" required eagerValidation>
          <USelect
            v-model="state.saleListing!.priceType"
            :items="priceTypeItems"
            color="secondary"
            class="w-full"
          />
        </UFormField>
      </div>

      <!-- Price preview -->
      <div class="basis-full">
        <p v-if="isEditingLive && originalPrice" class="text-sm text-muted mb-1">
          Current price: <strong class="text-foreground">{{ formatPrice(originalPrice) }}</strong>
        </p>
        <p v-if="state.price" class="text-sm text-muted">
          Your listing will show: <strong class="text-foreground">{{ formattedSalePrice }}</strong>
        </p>
        <p v-if="isEditingLive && originalPrice && maxReducedPrice" class="text-sm text-muted mt-1 flex items-center gap-1">
          <UIcon name="i-lucide-info" class="w-4 h-4 shrink-0" />
          Increases are unlimited. To reduce, you must reduce by at least 2%
          (£{{ maxReducedPrice.toLocaleString() }} or lower).
        </p>
      </div>
    </div>

    <!-- Rental Price Fields -->
    <div v-else-if="listingType === 'rent'" class="flex flex-wrap gap-6 items-start">
      <div class="basis-full sm:basis-0 sm:flex-1 sm:max-w-64 min-w-fit">
        <UFormField label="Rent Amount" name="price" description="The rent amount" required eagerValidation>
          <UInput
            v-model.number="state.price"
            type="number"
            :min="1"
            step="1"
            placeholder="e.g. 1500"
            color="secondary"
            class="w-full"
            @keydown="(e: KeyboardEvent) => (e.key === '.' || e.key === ',') && e.preventDefault()"
          >
            <template #leading>
              <span class="text-muted">£</span>
            </template>
          </UInput>
        </UFormField>
      </div>

      <div class="basis-full sm:basis-0 sm:flex-1 sm:max-w-48 min-w-fit">
        <UFormField label="Rent Frequency" name="rentalListing.rentFrequency" description="How often rent is paid" required eagerValidation>
          <USelect
            v-model="state.rentalListing!.rentFrequency"
            :items="rentFrequencyItems"
            color="secondary"
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
            step="1"
            placeholder="e.g. 1500"
            color="secondary"
            class="w-full"
            @keydown="(e: KeyboardEvent) => (e.key === '.' || e.key === ',') && e.preventDefault()"
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
            step="1"
            color="secondary"
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
        <p v-if="isEditingLive && originalPrice" class="text-sm text-muted mb-1">
          Current price: <strong class="text-foreground">{{ formatPrice(originalPrice) }}</strong>
        </p>
        <p v-if="state.price" class="text-sm text-muted">
          Your listing will show: <strong class="text-foreground">{{ formattedRentalPrice }}</strong>
        </p>
        <p v-if="isEditingLive && originalPrice && maxReducedPrice" class="text-sm text-muted mt-1 flex items-center gap-1">
          <UIcon name="i-lucide-info" class="w-4 h-4 shrink-0" />
          Increases are unlimited. To reduce, you must reduce by at least 5%
          (£{{ maxReducedPrice.toLocaleString() }} or lower).
        </p>
      </div>
    </div>

    <!-- PPD: recent sold prices — sale listings only -->
    <div v-if="listingType === 'sale' && ppdSummary" class="basis-full mt-2">
      <div class="flex items-center gap-2 mb-3">
        <UIcon name="i-lucide-landmark" class="w-4 h-4 text-muted shrink-0" />
        <p class="text-sm font-medium text-foreground">
          Sold prices near {{ postcode }}
        </p>
        <UBadge color="secondary" variant="subtle" size="md">{{ ppdSummary.recentCount }} sales &mdash; {{ ppdSummary.period }}</UBadge>
      </div>

      <div class="grid grid-cols-3 gap-3 mb-4">
        <div class="rounded-lg border border-default bg-elevated/50 p-3 text-center">
          <p class="text-xs text-muted mb-0.5">Average</p>
          <p class="text-sm font-bold text-foreground">{{ formatPrice(ppdSummary.avg) }}</p>
        </div>
        <div class="rounded-lg border border-default bg-elevated/50 p-3 text-center">
          <p class="text-xs text-muted mb-0.5">Lowest</p>
          <p class="text-sm font-bold text-foreground">{{ formatPrice(ppdSummary.min) }}</p>
        </div>
        <div class="rounded-lg border border-default bg-elevated/50 p-3 text-center">
          <p class="text-xs text-muted mb-0.5">Highest</p>
          <p class="text-sm font-bold text-foreground">{{ formatPrice(ppdSummary.max) }}</p>
        </div>
      </div>

      <UTable
        :data="ppdSummary.lastSales"
        :columns="ppdColumns"
        size="sm"
        class="w-full"
      />
    </div>
  </OrganismsDashboardCreateListingStepWrapper>
</template>

<script setup lang="ts">
// step3Schema is auto-imported from shared/utils/
const { getStepData, editingListingId } = useCreateListingSteps()

// Get listing type from Step 1 data — read inside computed so it stays reactive
const listingType = computed(() => (getStepData(1) as Step1FormData | undefined)?.selectedType ?? 'sale')

// Price change limits when editing a published listing
const isEditingLive = computed(() => editingListingId.value !== null)
const savedData = getStepData(3) as { price?: number | null } | undefined
const originalPrice = computed(() => isEditingLive.value ? (savedData?.price ?? null) : null)
const minReductionPct = computed(() => listingType.value === 'rent' ? 0.05 : 0.02)
const maxReducedPrice = computed(() =>
  originalPrice.value ? Math.floor(originalPrice.value * (1 - minReductionPct.value)) : null
)

// PPD: street context via composable
const postcode = computed(() =>
  (getStepData(2) as { property?: { address?: { postcode?: string | null } } } | undefined)?.property?.address?.postcode ?? null
)
const street = computed(() =>
  (getStepData(2) as { property?: { address?: { street?: string | null } } } | undefined)?.property?.address?.street ?? null
)
console.log('[Step3Form] step2 data:', getStepData(2), '— postcode:', postcode.value, '— street:', street.value)
const { summary: ppdSummary, loading: ppdLoading } = usePpdStreetData(postcode, street)

// Use constrained schema when editing a live listing to show inline Zod errors before submit
const activeSchema = computed(() =>
  isEditingLive.value && originalPrice.value
    ? createStep3SchemaWithLimit(originalPrice.value, listingType.value === 'rent')
    : step3Schema
)

// Alert description based on listing type
const alertDescription = computed(() => {
  return listingType.value === 'sale'
    ? 'Set your asking price and how you\'d like it displayed to potential buyers. If you reduce or increase the price of a published listing, this will be visible to users via listing price history.'
    : 'Set your rental price, frequency, and any deposit requirements. If you reduce or increase the price of a published listing, this will be visible to users via listing price history.'
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
const savedStep3 = getStepData(3) as Step3State | undefined
const state = reactive<Step3State>(
  savedStep3 && Object.keys(savedStep3).length > 0 
    ? { ...savedStep3 }
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

// PPD table columns
const ppdColumns = [
  { accessorKey: 'formattedDate', header: 'Date' },
  { accessorKey: 'full_address', header: 'Address' },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }: { row: { original: { price: number } } }) => formatPrice(row.original.price),
  },
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
