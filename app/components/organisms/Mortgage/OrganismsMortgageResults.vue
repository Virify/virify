<template>
  <div class="o-mortgage-results">
    <!-- Placeholder state (before calculation) -->
    <MoleculesMortgageResultsPlaceholder v-if="!result" />

    <!-- Results state (after calculation) -->
    <Transition name="fade-in" mode="out-in">
      <div v-if="result" class="o-mortgage-results__content" key="results">
        <h3 class="| title-sm">Your Mortgage Results</h3>
        
        <MoleculesMortgageResultsSummary
          :loan-amount="result.loanAmount"
          :ltv="result.ltv"
          :term-years="result.termYears"
        />

        <div v-if="result.usingCustomRate" class="o-mortgage-results__notice o-mortgage-results__notice--custom">
          <AtomsIcon icon="property/info" :size="14" />
          <span class="| body-xs">Using your custom interest rate of {{ result.results[0]?.rate?.toFixed(2) }}%</span>
        </div>

        <div v-else-if="result.usingDefaultRates" class="o-mortgage-results__notice">
          <AtomsIcon icon="property/info" :size="14" />
          <span class="| body-xs">Using estimated UK average rates. Actual rates may vary.</span>
        </div>

        <MoleculesMortgageRateResults :results="result.results" />

        <MoleculesMortgageResultsBreakdown
          v-if="selectedResult"
          :total-payment="selectedResult.totalPayment"
          :total-interest="selectedResult.totalInterest"
          :interest-percentage="interestPercentage"
        />

        <p class="o-mortgage-results__disclaimer | body-xs text-muted">
          These calculations are estimates only and do not constitute financial advice. Actual rates and terms will depend on your individual circumstances and lender criteria. Always consult with a qualified mortgage advisor.
        </p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">

interface Props {
  result: MortgageCalculationData | null
}

const props = defineProps<Props>()

const selectedResult = computed((): MortgageResult | null => {
  return props.result?.results[0] ?? null
})

const interestPercentage = computed(() =>
  calculateInterestPercentage(selectedResult.value)
)
</script>

<style lang="scss">
// Fade-in transition for results
.fade-in-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-in-leave-active {
  transition: opacity 0.2s ease;
}

.fade-in-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-in-leave-to {
  opacity: 0;
}
</style>

<style lang="scss" scoped>
.o-mortgage-results {
  width: 100%;
  min-height: 300px;
  background: var(--background-200);
  border-radius: var(--border-radius-2xl);
  padding: var(--size-24);

  &__content {
    h3 {
      margin: 0 0 var(--size-16) 0;
    }
  }

  &__notice {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    padding: var(--size-12);
    background: var(--background-100);
    border-radius: var(--border-radius-md);
    margin-bottom: var(--size-16);
  }

  &__disclaimer {
    margin-top: var(--size-24);
    padding: var(--size-12);
    background: var(--background-100);
    border-radius: var(--border-radius-md);
    font-style: italic;
  }
}
</style>
