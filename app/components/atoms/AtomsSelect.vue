<template>
  <select v-show="!disabled" class="a-select" v-model="selected">
    <slot v-bind="{ options: validOptions }">
      <option v-for="({ key, value }) of validOptions" :key="value" :value="value">
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
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' width='40' height='40' fill='%232b2c35'><path d='M20 23.4L14 17.4L15.4 16L20 20.6L24.6 16L26 17.4L20 23.4Z'/></svg>");

  /* iOS Safari specific fixes */
  @supports (-webkit-touch-callout: none) {
    -webkit-appearance: none;
    background-position: right var(--size-8) center;
    background-size: var(--size-16) var(--size-16);
    border-radius: var(--border-radius-ui);
  }

  html.dark & {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' width='40' height='40' fill='%23ffffff'><path d='M20 23.4L14 17.4L15.4 16L20 20.6L24.6 16L26 17.4L20 23.4Z'/></svg>");
  }

  option {
    font-weight: var(--font-medium);
  }

  @supports (appearance: base-select) {
    cursor: pointer;

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
      gap: var(--size-4);
      background: var(--background-100);
      border-radius: var(--border-radius-2xl);
      top: var(--size-8);
      bottom: var(--size-8);
      box-shadow: var(--elevate-200);
      padding: var(--size-10);
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
      padding: var(--size-10) var(--size-16);
      border-radius: var(--border-radius-xl);
      flex-shrink: 0;
      cursor: pointer;

      &::checkmark {
        display: none;
      }

      &:checked {
        background: var(--secondary-400);
        color: var(--monochrome-900);
      }

      &:focus:not(:checked),
      &:hover:not(:checked) {
        background: var(--background-300);
      }
    }
  }
}
</style>