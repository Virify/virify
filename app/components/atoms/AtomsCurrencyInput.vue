<template>
  <input type="text" v-model="currency" class="| text-input focus-visible" />
</template>

<script setup lang="ts">
interface Props {
  modelValue?: number
}

defineProps<Props>()

const currency = defineModel({
  get(value) {
    return isNumber(value) ? numberToCurrency(value) : value
  },
  set(value = 0) {
    return isString(value) ? currencyToNumber(value) : value
  }
})

</script>