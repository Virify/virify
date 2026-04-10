<template>
  <div class="m-buyer-type-selector">
    <div class="m-buyer-type-selector__options">
      <AtomsMortgageRadioOption v-for="option in options" :key="option.value" :value="option.value" :model-value="modelValue"
        :label="option.key" :description="option.info" name="buyer-type"
        @update:model-value="$emit('update:modelValue', $event)" />
    </div>
    <p class="m-buyer-type-selector__help | body-xs">
      Your buyer type affects the rates and deposit requirements typically available to you. Eligibility criteria vary by lender.
    </p>
  </div>
</template>

<script setup lang="ts">
interface BuyerOption {
  value: string
  key: string
  info: string
}

interface Props {
  options: BuyerOption[]
  modelValue: string | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style lang="scss" scoped>
.m-buyer-type-selector {
  width: 100%;

  &__options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--size-8);
    width: 100%;
    align-items: stretch;

    @media (max-width: 500px) {
      grid-template-columns: 1fr;
    }
  }

  &__help {
    margin-top: var(--size-12);
    opacity: 0.8;
    text-align: center;
  }
}
</style>
