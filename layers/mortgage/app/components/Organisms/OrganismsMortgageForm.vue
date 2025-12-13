<template>
  <AtomsHeroCard class="o-mortgage-form">
    <!-- Title -->
    <h2 class="o-mortgage-form__title | title-md">Mortgage Calculator</h2>

    <!-- Step indicator -->
    <MoleculesStepIndicator
      :steps="steps"
      :current-step="currentStep"
      :all-completed="!!calculationResult"
    />

    <!-- Step Title -->
    <p class="| body-md">{{ steps[currentStep]?.title }}</p>

    <!-- Step Content -->
    <div class="o-mortgage-form__step-content">
      <!-- Step 1: Buyer Type -->
      <MoleculesBuyerTypeSelector
        v-if="currentStep === 0"
        :options="buyerTypeOptions"
        :model-value="formData.buyerType"
        @update:model-value="updateFormField('buyerType', $event as MortgageBuyerType)"
      />

      <!-- Step 2: Property Price -->
      <MoleculesPropertyPriceInput
        v-else-if="currentStep === 1"
        id="property-price"
        :model-value="formData.propertyPrice"
        @update:model-value="updateFormField('propertyPrice', $event)"
        @submit="$emit('next')"
      />

      <!-- Step 3: Deposit -->
      <MoleculesDepositInput
        v-else-if="currentStep === 2"
        id="deposit"
        :model-value="formData.deposit"
        :deposit-percentage="depositPercentage"
        :ltv-percentage="ltvPercentage"
        :error="depositError"
        @update:model-value="updateFormField('deposit', $event)"
        @submit="$emit('next')"
      />

      <!-- Step 4: Term -->
      <MoleculesTermSelector
        v-else-if="currentStep === 3"
        id="term-years"
        :model-value="formData.termYears"
        :options="termOptions"
        @update:model-value="updateFormField('termYears', $event)"
      />
    </div>

    <!-- Navigation buttons -->
    <MoleculesFormNavigation
      :show-back="currentStep > 0 && !calculationResult"
      :show-reset="!!calculationResult"
      :show-next="currentStep < steps.length - 1"
      :show-calculate="currentStep === steps.length - 1 && !calculationResult"
      :can-proceed="canProceed"
      :can-calculate="isFormValid"
      :is-calculating="isCalculating"
      @back="$emit('back')"
      @reset="$emit('reset')"
      @next="$emit('next')"
      @calculate="$emit('calculate')"
    />
  </AtomsHeroCard>
</template>

<script setup lang="ts">
import type { MortgageBuyerType, MortgageCalculationData, BuyerTypeOption } from '~~/shared/types/mortgage'
import { BUYER_TYPE_OPTIONS, TERM_OPTIONS } from '~~/shared/types/mortgage'
import {
  MORTGAGE_STEPS,
  calculateDepositPercentage,
  calculateLtvPercentage,
  validateDeposit,
  canProceedToNextStep,
  isFormValid as checkFormValid,
  type MortgageFormData,
} from '~~/layers/mortgage/app/utils/mortgage'

interface Props {
  formData: MortgageFormData
  currentStep: number
  calculationResult: MortgageCalculationData | null
  isCalculating?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isCalculating: false,
})

const emit = defineEmits<{
  'update:formData': [data: MortgageFormData]
  'back': []
  'next': []
  'reset': []
  'calculate': []
}>()

const steps = MORTGAGE_STEPS
const termOptions = TERM_OPTIONS

const buyerTypeOptions = BUYER_TYPE_OPTIONS.map((opt: BuyerTypeOption) => ({
  value: opt.value,
  key: opt.key,
  info: opt.info,
}))

// Computed values
const depositPercentage = computed(() =>
  calculateDepositPercentage(props.formData.deposit, props.formData.propertyPrice)
)

const ltvPercentage = computed(() =>
  calculateLtvPercentage(depositPercentage.value)
)

const depositError = computed(() =>
  validateDeposit(props.formData.deposit, props.formData.propertyPrice, props.formData.buyerType)
)

const canProceed = computed(() =>
  canProceedToNextStep(props.currentStep, props.formData)
)

const isFormValid = computed(() =>
  checkFormValid(props.formData)
)

// Methods
function updateFormField<K extends keyof MortgageFormData>(
  field: K,
  value: MortgageFormData[K]
) {
  emit('update:formData', {
    ...props.formData,
    [field]: value,
  })
}
</script>

<style lang="scss" scoped>
.o-mortgage-form {
  width: 100%;
  max-width: 600px;
  align-items: center;
  text-align: center;
  justify-self: end;

  @media (max-width: 900px) {
    justify-self: center;
  }

  &__title {
    margin-bottom: var(--size-8);
  }

  &__step-content {
    width: 100%;
    margin: var(--size-16) 0;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
}
</style>
