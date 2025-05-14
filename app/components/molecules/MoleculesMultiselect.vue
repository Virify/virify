<template>
  <ul class="m-multiselect">
    <li>
      <label>
        <input type="checkbox" @change="selectAll" v-model="isAllSelected" />

        Toggle all
      </label>
    </li>
    <li v-for="{ key, value } of options">
      <label>
        <input type="checkbox" :value="key" v-model="selected" />

        {{ value }}
      </label>
    </li>
  </ul>
</template>

<script setup lang="ts">
interface Props {
  options: { key: string, value: string }[]
}

const props = defineProps<Props>()

/**
 *  Model
 */
const selected = defineModel<string[]>({ default: [] })
const isAllSelected = ref<boolean>(false)

/**
 *  Get all keys - as function as this doesn't need to be reactive
 */
function getKeys() {
  const { options } = props

  return options.map(({ key }) => key)
}

/**
 *  Select all
 */
function selectAll({ target }: Event) {
  const isChecked = (target as HTMLInputElement).checked

  if (isChecked) {
    return selected.value = getKeys()
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