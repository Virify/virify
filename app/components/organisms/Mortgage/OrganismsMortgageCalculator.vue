<template>
  <section class="o-mortgage-calculator | container-xs">
    <div class="o-mortgage-calculator__layout">
      <!-- Form Column -->
      <OrganismsMortgageForm
        :form-data="formData"
        :calculation-result="calculationResult"
        :is-calculating="isCalculating"
        @update:form-data="formData = $event"
        @calculate="calculateMortgage"
      />

      <!-- Results Column -->
      <div class="o-mortgage-calculator__results-column">
        <OrganismsMortgageResults :result="calculationResult" :error="calculationError" />

        <!-- Disclaimer (hidden when results are shown) -->
        <div v-if="!calculationResult" class="o-mortgage-calculator__disclaimer">
          <AtomsIcon icon="property/info" :size="18" />
          <p class="body-xs">
            <strong>Important:</strong> This calculator provides estimates only and does not constitute financial advice. 
            Your actual mortgage rate will depend on your credit history, income, property type, and lender criteria. 
            We recommend speaking with a qualified mortgage advisor before making any financial decisions.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

const { trackMortgageCalculation } = useAnalytics()

interface Props {
  propertyPrice?: number
  listingId?: string
}

const props = withDefaults(defineProps<Props>(), {
  propertyPrice: undefined,
  listingId: undefined,
})

// State
const formData = ref<MortgageFormData>(getDefaultFormData(props.propertyPrice))
const isCalculating = ref(false)
const calculationResult = ref<MortgageCalculationData | null>(null)
const calculationError = ref<string | null>(null)

// Watch for property price prop changes
watch(() => props.propertyPrice, (newPrice) => {
  if (newPrice !== undefined && newPrice > 0) {
    formData.value.propertyPrice = newPrice
  }
})

async function calculateMortgage() {
  if (!isFormValid(formData.value)) return

  isCalculating.value = true
  calculationError.value = null

  try {
    const termYears = getTotalTermYears(formData.value)
    
    const response = await $fetch<{ success: boolean; data: MortgageCalculationData }>('/api/mortgage/calculate', {
      method: 'POST',
      body: {
        propertyPrice: formData.value.propertyPrice,
        deposit: formData.value.deposit,
        termYears,
        buyerType: formData.value.buyerType,
        customInterestRate: formData.value.customInterestRate,
      },
    })

    if (response.success) {
      calculationResult.value = response.data
      
      // Track the calculation for analytics (fire-and-forget)
      const firstResult = response.data.results[0]
      if (firstResult) {
        trackMortgageCalculation({
          listingId: props.listingId ?? null,
          propertyPrice: response.data.propertyPrice,
          deposit: response.data.deposit,
          termYears: response.data.termYears,
          buyerType: response.data.buyerType,
          customRate: formData.value.customInterestRate ?? null,
          loanAmount: response.data.loanAmount,
          ltv: response.data.ltv,
          ltvBracket: response.data.ltvBracket,
          monthlyPayment: firstResult.monthlyPayment,
          totalPayment: firstResult.totalPayment,
          totalInterest: firstResult.totalInterest,
          rateUsed: firstResult.rate,
          rateType: firstResult.rateType,
          usedDefaultRates: response.data.usingDefaultRates,
          usedCustomRate: response.data.usingCustomRate ?? false,
        })
      }
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
@use "#styles/_utils/media.scss" as mq;

.o-mortgage-calculator {
  &__layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-32);
    align-items: start;

    @include mq.desktop {
      grid-template-columns: 1fr 1fr;
      gap: var(--size-48);
    }
  }

  &__results-column {
    display: flex;
    flex-direction: column;
    gap: var(--size-24);
  }

  &__disclaimer {
    display: flex;
    align-items: flex-start;
    gap: var(--size-12);
    padding: var(--size-16);
    background: var(--background-200);
    border-radius: var(--border-radius-lg);
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
