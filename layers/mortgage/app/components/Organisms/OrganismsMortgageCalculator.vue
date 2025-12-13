<template>
  <section class="o-mortgage-calculator">
    <div class="o-mortgage-calculator__layout">
      <div class="o-mortgage-calculator__form-column">
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

        <!-- Disclaimer -->
        <div class="o-mortgage-calculator__disclaimer">
          <AtomsIcon icon="property/info" :size="18" />
          <p class="body-xs">
            <strong>Important:</strong> This calculator provides estimates only and does not constitute financial advice. 
            Your actual mortgage rate will depend on your credit history, income, property type, and lender criteria. 
            We recommend speaking with a qualified mortgage advisor before making any financial decisions.
          </p>
        </div>
      </div>

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

  &__form-column {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--size-24);

    @media (max-width: 900px) {
      align-items: center;
    }
  }

  &__disclaimer {
    display: flex;
    align-items: flex-start;
    gap: var(--size-12);
    padding: var(--size-16);
    background: var(--background-200);
    border-radius: var(--border-radius-lg);
    max-width: 600px;
    text-align: left;

    svg {
      flex-shrink: 0;
      margin-top: 2px;
      color: var(--blue-400);
    }

    p {
      margin: 0;
      color: var(--text-muted);
    }
  }
}
</style>
