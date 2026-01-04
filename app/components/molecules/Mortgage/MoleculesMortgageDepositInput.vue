<template>
  <div class="m-deposit-input">
    <div class="m-deposit-input__wrapper">
      <AtomsCurrencyInput :id="id" :model-value="modelValue" :placeholder="placeholder" class="m-deposit-input__input"
        @update:model-value="$emit('update:modelValue', $event)" @keyup.enter="$emit('submit')" />
      <div class="m-deposit-input__info">
        <span class="| body-sm">
          {{ depositPercentage }}% deposit ({{ ltvPercentage }}% LTV)
        </span>
        <span v-if="error" class="| body-xs text-error">
          {{ error }}
        </span>
      </div>
    </div>
    <AtomsStepHelpBox title="What is LTV?">
      <strong>Loan-to-Value (LTV)</strong> is the percentage of the property price you're borrowing.
      A lower LTV (higher deposit) typically means better interest rates. For example, a 10% deposit = 90% LTV.
    </AtomsStepHelpBox>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string
  modelValue: number
  depositPercentage: number
  ltvPercentage: number
  error: string | null
  placeholder?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: 'e.g., 25000',
})

defineEmits<{
  'update:modelValue': [value: number]
  'submit': []
}>()
</script>

<style lang="scss" scoped>
.m-deposit-input {
  width: 100%;

  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
    width: 100%;
  }

  &__input {
    width: 100%;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: var(--size-4);
    text-align: left;
  }
}
</style>
