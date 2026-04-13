<template>
  <label class="| font-bold body-sm">
    {{ label }}

    <input :type :name class="o-traditional-search-text-input | gradient-box-inline body-md" v-bind="inputAttributes"
      v-model="inputValue" />
  </label>
</template>

<script setup lang="ts">
type HTMLInputType = 'text' | 'number' | string

interface InputAttributes {
  [key: string]: unknown
}

interface Props {
  label: string
  name: string
  type?: HTMLInputType
  inputAttributes?: InputAttributes
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text'
})

/**
 *  Model
 */
const model = defineModel<number | string | null>()

const inputValue = computed({
  get: () => model.value ?? '',
  set: (val) => {
    if (props.type === 'number') {
      model.value = (val === '' || val === null) ? null : Number(val)
    } else {
      model.value = val
    }
  }
})

</script>

<style lang="scss">
.o-traditional-search-text-input {
  display: block;
  font-weight: var(--font-medium);
  width: 100%;
  box-sizing: border-box;
  padding: var(--size-12) var(--size-16);

  &--select {
    white-space: nowrap;
  }
}
</style>