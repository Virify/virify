<template>
  <div class="m-results-summary">
    <div class="m-results-summary__item">
      <span class="| body-sm text-muted">Loan Amount</span>
      <span class="| title-sm">{{ formattedLoanAmount }}</span>
    </div>
    <div class="m-results-summary__item">
      <span class="| body-sm text-muted">LTV</span>
      <span class="| title-sm">{{ ltv }}%</span>
    </div>
    <div class="m-results-summary__item">
      <span class="| body-sm text-muted">Term</span>
      <span class="| title-sm">{{ formattedTerm }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">

interface Props {
  loanAmount: number
  ltv: number
  termYears: number
}

const props = defineProps<Props>()

const formattedLoanAmount = computed(() => formatCurrency(props.loanAmount))

const formattedTerm = computed(() => {
  const years = Math.floor(props.termYears)
  const months = Math.round((props.termYears - years) * 12)

  if (months === 0) {
    return `${years} years`
  }

  return `${years} years, ${months} months`
})
</script>

<style lang="scss" scoped>
.m-results-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--size-16);
  margin-bottom: var(--size-24);
  padding-bottom: var(--size-16);
  border-bottom: 1px solid var(--border-color-200);

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    gap: var(--size-12);
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: var(--size-4);
  }
}
</style>
