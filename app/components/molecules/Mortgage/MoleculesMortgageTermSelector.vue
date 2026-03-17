<template>
  <div class="m-term-selector">
    <div class="m-term-selector__wrapper">
      <AtomsSelect :id="id" v-model="internalValue" :options="options" />
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
  modelValue: number
  id: string
  options: TermOption[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const internalValue = computed({
  get: () => props.modelValue,
  set: (value: number) => emit('update:modelValue', value)
})
</script>

<style lang="scss" scoped>
.m-term-selector {
  width: 100%;

  &__wrapper {
    width: 100%;

    :deep(.a-select) {
      width: 100%;
      background-color: var(--monochrome-900);
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
