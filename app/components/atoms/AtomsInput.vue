<template>
  <div :class="wrapperClass" class="a-input" role="presentation">
    <slot name="prefix" />

    <input :id="inputId" v-bind="$attrs" :aria-describedby="errorText && errorId" class="| text-input"
      @input="checkValidity" />

    <slot name="suffix" />
  </div>

  <AtomsInlineError v-if="errorText" :id="errorId">
    {{ errorText }}
  </AtomsInlineError>
</template>

<script setup>
import { useDebounceFn } from '@vueuse/core'

/**
 *  a11y
 */
const inputId = inject('for', '')
const errorId = useId()

/**
 *  Apply the appropriate settings for password inputs
 */
const props = defineProps({
  validationTextOverrides: {
    type: Object
  },
  wrapperClass: {
    type: String
  }
})

/**
 *  Validate inputs - this can probably be made into a composable
 */
const errorText = ref(null)

const checkValidity = useDebounceFn(({ target }) => {
  const { validationTextOverrides: overrides } = props

  errorText.value = useInputValidationMessage(target, overrides)
}, 500)
</script>
