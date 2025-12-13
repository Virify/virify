<template>
  <div class="m-step-indicator">
    <AtomsStepDot 
      v-for="(step, index) in steps" 
      :key="step.id"
      :active="currentStep === index"
      :completed="currentStep > index || allCompleted"
    />
  </div>
</template>

<script setup lang="ts">
import type { MortgageStep } from '~~/layers/mortgage/app/utils/mortgage'

interface Props {
  steps: MortgageStep[]
  currentStep: number
  allCompleted?: boolean
}

withDefaults(defineProps<Props>(), {
  allCompleted: false,
})
</script>

<style lang="scss" scoped>
.m-step-indicator {
  display: flex;
  gap: var(--size-8);
  margin-bottom: var(--size-8);
}
</style>
