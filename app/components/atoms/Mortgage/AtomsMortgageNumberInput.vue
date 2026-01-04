<template>
  <input :id="id" type="number" :value="modelValue" :min="min" :max="max" :step="step" :placeholder="placeholder"
    :disabled="disabled" class="a-number-input | text-input focus-visible" @input="handleInput" />
</template>

<script setup lang="ts">
interface Props {
  id?: string
  modelValue?: number
  min?: number
  max?: number
  step?: number
  placeholder?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  id: undefined,
  modelValue: undefined,
  min: undefined,
  max: undefined,
  step: 1,
  placeholder: undefined,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number | undefined]
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.valueAsNumber

  if (!isNaN(value)) {
    emit('update:modelValue', value)
  } else if (target.value === '') {
    // Emit undefined when cleared to show placeholder
    emit('update:modelValue', undefined)
  }
}
</script>

<style lang="scss" scoped>
.a-number-input {
  width: 100%;

  // Hide number input spinners
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  -moz-appearance: textfield;
}
</style>
