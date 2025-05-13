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
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='black'><path d='M16 19L11 14H21L16 19Z'/></svg>");

  @media (prefers-color-scheme: dark) {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='white'><path d='M16 19L11 14H21L16 19Z'/></svg>")
  }
}
</style>