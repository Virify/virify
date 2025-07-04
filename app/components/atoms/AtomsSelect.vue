<template>
  <select class="a-select" v-model="selected">
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
.a-select {
  appearance: none;
  min-width: fit-content;
  padding-right: var(--size-32);
  background-position: right;
  background-repeat: no-repeat;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' width='40' height='40' fill='black'><path d='M20 23.4L14 17.4L15.4 16L20 20.6L24.6 16L26 17.4L20 23.4Z'/></svg>");

  @media (prefers-color-scheme: dark) {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' width='40' height='40' fill='white'><path d='M20 23.4L14 17.4L15.4 16L20 20.6L24.6 16L26 17.4L20 23.4Z'/></svg>");
  }
}
</style>