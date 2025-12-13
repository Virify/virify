<template>
  <section class="o-mortgage-calculator">
    <div class="o-mortgage-calculator__layout">
      <OrganismsMortgageForm
        :form-data="formData"
        :current-step="currentStep"
        :calculation-result="calculationResult"
        :is-calculating="isCalculating"
        @update:form-data="formData = $event"
        @back="prevStep"
        @next="nextStep"
        @reset="resetCalculator"
        @calculate="calculateMortgage"
      />

      <OrganismsMortgageResults :result="calculationResult" />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { MortgageBuyerType, MortgageCalculationData } from '~~/shared/types/mortgage'
import {
  MORTGAGE_STEPS,
  canProceedToNextStep,
  isFormValid,
  getDefaultFormData,
  type MortgageFormData,
} from '~~/layers/mortgage/app/utils/mortgage'

// State
const currentStep = ref(0)
const formData = ref<MortgageFormData>(getDefaultFormData())
const isCalculating = ref(false)
const calculationResult = ref<MortgageCalculationData | null>(null)
const calculationError = ref<string | null>(null)

// Methods
function nextStep() {
  if (canProceedToNextStep(currentStep.value, formData.value) && currentStep.value < MORTGAGE_STEPS.length - 1) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function resetCalculator() {
  currentStep.value = 0
  formData.value = getDefaultFormData()
  calculationResult.value = null
  calculationError.value = null
}

async function calculateMortgage() {
  if (!isFormValid(formData.value)) return

  isCalculating.value = true
  calculationError.value = null

  try {
    const response = await $fetch<{ success: boolean; data: MortgageCalculationData }>('/api/mortgage/calculate', {
      method: 'POST',
      body: {
        propertyPrice: formData.value.propertyPrice,
        deposit: formData.value.deposit,
        termYears: formData.value.termYears,
        buyerType: formData.value.buyerType,
      },
    })

    if (response.success) {
      calculationResult.value = response.data
    } else {
      calculationError.value = 'Failed to calculate mortgage'
    }
  } catch (error: any) {
    calculationError.value = error?.data?.statusMessage || 'An error occurred'
    console.error('Mortgage calculation error:', error)
  } finally {
    isCalculating.value = false
  }
}
</script>

<style lang="scss" scoped>
.o-mortgage-calculator {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  &__layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--size-32);
    align-items: start;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      gap: var(--size-24);
    }
  }
}
</style>
