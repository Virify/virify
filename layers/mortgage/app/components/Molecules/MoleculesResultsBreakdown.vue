<template>
  <div class="m-results-breakdown">
    <h4 class="| title-xs">Cost Breakdown</h4>
    <div class="m-results-breakdown__grid">
      <div class="m-results-breakdown__item">
        <span class="| body-sm text-muted">Total Repayment</span>
        <span class="| body-md text-medium">{{ formattedTotalPayment }}</span>
      </div>
      <div class="m-results-breakdown__item">
        <span class="| body-sm text-muted">Total Interest</span>
        <span class="| body-md text-medium">{{ formattedTotalInterest }}</span>
      </div>
      <div class="m-results-breakdown__item">
        <span class="| body-sm text-muted">Interest % of Total</span>
        <span class="| body-md text-medium">{{ interestPercentage }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '~~/shared/types/mortgage'

interface Props {
  totalPayment: number
  totalInterest: number
  interestPercentage: number
}

const props = defineProps<Props>()

const formattedTotalPayment = computed(() => formatCurrency(props.totalPayment))
const formattedTotalInterest = computed(() => formatCurrency(props.totalInterest))
</script>

<style lang="scss" scoped>
.m-results-breakdown {
  margin-top: var(--size-24);
  padding-top: var(--size-16);
  border-top: 1px solid var(--border-color-200);

  h4 {
    margin-bottom: var(--size-16);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--size-16);

    @media (max-width: 500px) {
      grid-template-columns: 1fr;
      gap: var(--size-12);
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: var(--size-4);
  }
}
</style>
