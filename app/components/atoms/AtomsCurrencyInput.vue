<template>
  <input type="text" v-model="currency" :disabled="disabled" class="| text-input focus-visible" />
</template>

<script setup lang="ts">
interface Props {
  modelValue?: number
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false,
})

const currency = defineModel({
  get(value) {
    return isNumber(value) ? numberToCurrency(value) : value
  },
  set(value = 0) {
    return isString(value) ? currencyToNumber(value) : value

    /**
     *  @TODO
     *  When formatting the currency, the user caret is moved to the
     *  end of the input. We should check the caret position before
     *  formatting and try and insert the caret back into the same
     *  position 
     */
  }
})

</script>