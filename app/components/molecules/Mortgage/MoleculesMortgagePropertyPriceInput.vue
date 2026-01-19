<template>
  <div class="m-property-price-input">
    <div class="m-property-price-input__wrapper">
      <AtomsCurrencyInput :id="id" :model-value="modelValue" :placeholder="placeholder"
        class="m-property-price-input__input" @update:model-value="$emit('update:modelValue', $event)"
        @keyup.enter="$emit('submit')" />
    </div>
    <p class="m-property-price-input__help | body-xs">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string
  modelValue: number
  placeholder?: string
  helpText?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: 'e.g., 250000',
  helpText: 'Enter the full asking price or agreed purchase price of the property.',
})

defineEmits<{
  'update:modelValue': [value: number]
  'submit': []
}>()
</script>

<style lang="scss" scoped>
.m-property-price-input {
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

  &__help {
    margin-top: var(--size-12);
    opacity: 0.8;
    text-align: center;
  }
}
</style>
