<template>
  <fieldset>
    <legend v-if="label">{{ label }}</legend>

    <button type="button" :disabled="firstSelected" @click.prevent="selectPreviousOption">
      Decrease
    </button>

    <select name="min-bedrooms" v-model="selected">
      <option v-for="{ key, value, selected } of optionsArray" :key :value="key" :selected>
        {{ value }}
      </option>
    </select>

    <button type="button" :disabled="lastSelected" @click.prevent="selectNextOption">
      Increase
    </button>
  </fieldset>
</template>

<script setup lang="ts">
interface Option {
  key: string | number
  value: string | number
  selected?: boolean
}

interface Props {
  label?: string
  options: Option[]
}

const props = defineProps<Props>()

/**
 *  Ensure options is always an array
 */
const optionsArray = computed(() => {
  const { options } = props

  return asArray(options)
})

/**
 *  Track selection
 */
const selected = defineModel({
  default: (props) => {
    const options = asArray(props.options) as Option[]

    return options[0]?.key
  }
})

/**
 *  Check if first/last option is selected
 */
const firstSelected = computed(() => {
  const firstOption = optionsArray.value.at(0)

  return selected.value === firstOption?.key
})

const lastSelected = computed(() => {
  const lastOption = optionsArray.value.at(-1)

  return selected.value === lastOption?.key
})

/**
 *  Quick-select next, previous options
 */
const selectedIndex = computed(() => {
  return optionsArray.value.findIndex(({ key }) => selected.value === key)
})

function selectPreviousOption() {
  const prevIndex = selectedIndex.value - 1
  const { key } = asObject(optionsArray.value[prevIndex])

  selected.value = key as never as string
}

function selectNextOption() {
  const nextIndex = selectedIndex.value + 1
  const { key } = asObject(optionsArray.value[nextIndex])


  selected.value = key as never as string
}

</script>

<style scoped>
button[disabled] {
  opacity: 0.4;
}
</style>