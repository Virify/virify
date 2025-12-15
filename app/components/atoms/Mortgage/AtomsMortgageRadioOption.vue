<template>
  <label :class="optionClasses">
    <input type="radio" :value="value" :checked="modelValue === value" :name="name" class="a-radio-option__input"
      @change="$emit('update:modelValue', value)" />
    <span class="a-radio-option__label">
      <span class="| body-md text-medium">{{ label }}</span>
      <span v-if="description" class="| body-xs">{{ description }}</span>
    </span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  value: string
  modelValue: string | null
  label: string
  description?: string
  name: string
}

const props = defineProps<Props>()
defineEmits<{
  'update:modelValue': [value: string]
}>()

const optionClasses = computed(() => [
  'a-radio-option',
  {
    'a-radio-option--selected': props.modelValue === props.value,
  },
])
</script>

<style lang="scss" scoped>
.a-radio-option {
  display: flex;
  align-items: flex-start;
  gap: var(--size-12);
  padding: var(--size-12) var(--size-16);
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid transparent;
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  height: 100%; // Fill grid cell for equal heights
  box-sizing: border-box;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &--selected {
    background: rgba(255, 255, 255, 0.25);
    border-color: var(--monochrome-900);
  }

  &__input {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    flex-shrink: 0;
    position: relative;
    margin-top: 2px; // Align with first line of text

    &:checked {
      border-color: var(--monochrome-900);
      background: var(--monochrome-900);

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 8px;
        height: 8px;
        background: var(--blue-400);
        border-radius: 50%;
      }
    }
  }

  &__label {
    display: flex;
    flex-direction: column;
    gap: var(--size-2);
    flex: 1;
  }
}
</style>
