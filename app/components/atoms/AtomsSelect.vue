<template>
  <select v-show="!disabled" class="a-select" v-model="selected">
    <slot v-bind="{ options: validOptions }">
      <option v-for="({ key, value }) of validOptions" :key="value" :value>
        {{ key }}
      </option>
    </slot>
  </select>
</template>

<script setup lang="ts">
type Option = {
  key: string | number
  value: string | number
}

interface Props {
  options?: (string | number)[] | Option[]
  modelValue?: any
  disabled?: boolean
}

const props = defineProps<Props>()

const validOptions = computed(() => {
  const { options } = props

  return asArrayOfOptions(options)
})

const selected = defineModel({
  default: (props: Props) => {
    const [firstOption] = asArrayOfOptions(props.options)

    return props.modelValue || firstOption?.value
  }
})
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.a-select {
  appearance: none;
  padding-right: var(--size-32);
  background-position: right;
  background-repeat: no-repeat;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' width='40' height='40' fill='black'><path d='M20 23.4L14 17.4L15.4 16L20 20.6L24.6 16L26 17.4L20 23.4Z'/></svg>");

  @media (prefers-color-scheme: dark) {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' width='40' height='40' fill='white'><path d='M20 23.4L14 17.4L15.4 16L20 20.6L24.6 16L26 17.4L20 23.4Z'/></svg>");
  }

  @supports (appearance: base-select) {

    &,
    &::picker(select) {
      appearance: base-select
    }

    &::picker-icon {
      display: none;
    }

    /* Reset picker style */
    &::picker(select) {
      flex-direction: column;
      gap: var(--size-6);
      background: var(--background-200);
      border-radius: var(--border-radius-lg);
      top: var(--size-4);
      bottom: var(--size-4);
      padding: var(--size-6);
      margin: 0;
      scrollbar-width: thin;
      scrollbar-color: fn.faded-color(25%) transparent;

      @media (forced-colors: none) {
        border: 1px solid var(--border-color-200);
      }
    }

    &:open::picker(select) {
      display: flex;
    }

    /* Option styling */
    & option {
      padding: var(--size-6) var(--size-16);
      border-radius: var(--border-radius-md);
      flex-shrink: 0;
      cursor: pointer;

      &::checkmark {
        display: none;
      }

      &:checked {
        background: var(--secondary-500);
        color: var(--monochrome-100);
      }

      &:focus:not(:checked),
      &:hover:not(:checked) {
        background: var(--background-300);
      }
    }
  }
}
</style>