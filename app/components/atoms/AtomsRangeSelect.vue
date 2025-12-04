<template>
  <fieldset class="a-range-select">
    <legend v-if="label" class="a-range-select__legend | body-sm font-bold">
      {{ label }}
    </legend>

    <div role="presentation" class="a-range-select__inputs | gradient-box">
      <button type="button" :disabled="firstSelected" class="a-range-select__button a-range-select__button--decrease"
        @click.prevent="selectPreviousOption">
        <AtomsIcon icon="remove" title="Decrease" />
      </button>

      <select name="min-bedrooms" v-model="selected" class="a-range-select__dropdown">
        <option v-for="{ key, value, selected } of optionsArray" :key :value="key" :selected>
          {{ value }}
        </option>
      </select>

      <button type="button" :disabled="lastSelected" class="a-range-select__button a-range-select__button--increase"
        @click.prevent="selectNextOption">
        <AtomsIcon icon="plus" title="Increase" />
      </button>
    </div>
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

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.a-range-select {
  padding: 0;
  margin: 0;

  &__legend {
    position: static;
    display: block;
    padding-left: var(--size-10);
    margin: 0 0 var(--size-4);
  }

  &__inputs {
    display: flex;
    padding: var(--size-10);
    gap: var(--size-6);
    flex-grow: 1;
  }

  &__dropdown {
    flex-grow: 1;
    text-align: center;
    appearance: none;
    height: var(--size-40);
    padding: 0;
    margin: 0;
    border-radius: var(--border-radius-lg);
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size-40);
    height: var(--size-40);
    padding: 0;
    margin: 0;
    border-radius: var(--border-radius-lg);
    background: transparent;
    color: var(--foreground-200);

    &:hover:not([disabled]) {
      background: var(--background-300);
    }

    .a-icon {
      width: var(--size-24);
      height: var(--size-24);
    }

    &[disabled] {
      color: #{fn.faded-color(40%)};
      cursor: default;
    }
  }
}
</style>