<template>
  <label class="| font-bold body-sm">
    {{ label }}

    <AtomsSelect :options :name class="o-traditional-search-select-input | gradient-box-inline body-md"
      v-model="inputValue" />
  </label>
</template>

<script setup lang="ts">
type Option = {
  key: string | number
  value: string | number
}

interface InputAttributes {
  [key: string]: unknown
}

interface Props {
  label: string
  name: string
  options: Option[]
  inputAttributes?: InputAttributes
}

defineProps<Props>()

/**
 *  Model
 */
const inputValue = defineModel()

</script>

<style lang="scss">
.o-traditional-search-select-input {
  display: block;
  font-weight: var(--font-medium);
  width: 100%;
  box-sizing: border-box;
  padding: var(--size-12) var(--size-16);
}
</style>