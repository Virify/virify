<template>
  <div class="m-rate-results">
    <div
      v-for="result in results"
      :key="result.rateType"
      class="m-rate-results__card"
    >
      <MoleculesStatCard
        :title="formatRateType(result.rateType)"
        :value="formatCurrency(result.monthlyPayment) + '/month'"
        :description="`${result.rate.toFixed(2)}% APR`"
        :info="getRateInfo(result)"
        :loading="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MortgageResult } from '~~/shared/types/mortgage'
import { formatRateType, formatCurrency } from '~~/shared/types/mortgage'
import { getRateInfoString } from '~~/layers/mortgage/app/utils/mortgage'

interface Props {
  results: MortgageResult[]
}

defineProps<Props>()

function getRateInfo(result: MortgageResult): string {
  return getRateInfoString(result)
}
</script>

<style lang="scss" scoped>
.m-rate-results {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);

  &__card {
    :deep(.stat-card) {
      background: var(--background-100);
      border: 1px solid var(--border-color-200);
    }
  }
}
</style>
