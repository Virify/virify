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
  isAllSelected.value = newValue.length === getKeys().length
})
</script>