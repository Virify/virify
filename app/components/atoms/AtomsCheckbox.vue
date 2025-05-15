<template>
  <label>
    <input type="checkbox" :value :checked v-model="isChecked" />
    {{ label }}
  </label>
</template>

<script setup lang="ts">
interface Props {
  label: string
  value?: string | number
  checked?: boolean
}

defineProps<Props>()

const isChecked = defineModel({
  default: (props) => !!props.checked
})
</script>