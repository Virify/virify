<template>
  <div class="m-buyer-type-selector">
    <div class="m-buyer-type-selector__options">
      <AtomsRadioOption
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :model-value="modelValue"
        :label="option.key"
        :description="option.info"
        name="buyer-type"
        @update:model-value="$emit('update:modelValue', $event)"
      />
    </div>
    <p class="m-buyer-type-selector__help | body-xs">
      Your buyer type affects the minimum deposit required and the rates available to you.
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

defineProps<Props>()
defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style lang="scss" scoped>
.m-buyer-type-selector {
  width: 100%;

  &__options {
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
    width: 100%;
  }

  &__help {
    margin-top: var(--size-12);
    opacity: 0.8;
    text-align: center;
  }
}
</style>
