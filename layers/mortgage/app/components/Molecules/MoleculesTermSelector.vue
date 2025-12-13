<template>
  <div class="m-term-selector">
    <div class="m-term-selector__wrapper">
      <AtomsSelect
        :id="id"
        :model-value="modelValue"
        :options="options"
        @update:model-value="$emit('update:modelValue', $event)"
      />
    </div>
    <p class="m-term-selector__help | body-xs">
      Longer terms mean lower monthly payments but more interest paid overall. Most UK mortgages are 25-30 years.
    </p>
  </div>
</template>

<script setup lang="ts">
interface TermOption {
  value: number
  key: string
}

interface Props {
  id: string
  modelValue: number
  options: TermOption[]
}

defineProps<Props>()
defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<style lang="scss" scoped>
.m-term-selector {
  width: 100%;

  &__wrapper {
    width: 100%;
    
    :deep(.a-select) {
      width: 100%;
      background-color: #fff;
      border-radius: var(--border-radius-ui);
      padding: var(--size-12) var(--size-40) var(--size-12) var(--size-16);
      color: var(--foreground-100);
      border: none;
      
      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
      }
    }
  }

  &__help {
    margin-top: var(--size-12);
    opacity: 0.8;
    text-align: center;
  }
}
</style>
