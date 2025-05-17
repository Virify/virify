<template>
  <ul class="m-multiselect">
    <li>
      <AtomsCheckbox v-model="isAllSelected" label="Toggle all" @update:modelValue="selectAll" />
    </li>
    <li v-for="{ key, value } of validatedOptions">
      <AtomsCheckbox :value="key" v-model="selected" :label="value" />
    </li>
  </ul>
</template>

<script setup lang="ts">
interface Props {
  options: { key: string, value: string }[] | string[]
}

const props = defineProps<Props>()

/**
 *  Model
 */
const selected = defineModel<any>()
const isAllSelected = ref<any>(false)

/**
 *  Validate options
 */
const validatedOptions = computed(() => {
  return asArrayOfOptions(props.options)
})

/**
 *  Get all keys - as function as this doesn't need to be reactive
 */
function getKeys() {
  return unref(validatedOptions).map(({ key }) => key)
}

/**
 *  Select all
 */
function selectAll(isChecked: any): void {
  if (!!isChecked) {
    selected.value = getKeys()

    return
  }

  selected.value = []
}

watch(selected, (newValue) => {
  const selectedLength = newValue.length
  const maxSelectedLength = getKeys().length

  // Update isAllSelected...
  isAllSelected.value = selectedLength === maxSelectedLength

  // ...and emit events, in case they are useful
  if (selectedLength === 0) {
    emits('all-unselected')
  }
  if (selectedLength === maxSelectedLength) {
    emits('all-selected')
  }
})

/**
 *  Useful events
 */
const emits = defineEmits(['all-selected', 'all-unselected'])
</script>