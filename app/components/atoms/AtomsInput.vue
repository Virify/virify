<template>
  <div :class="wrapperClass" class="a-input" role="presentation">
    <slot name="prefix" />

    <input :id="inputId" v-bind="$attrs" :aria-describedby="errorText && errorId" class="| text-input"
      @input="checkValidity" />

    <slot name="suffix" />
  </div>

  <AtomsInlineError v-if="validityText" :id="errorId">
    {{ validityText }}
  </AtomsInlineError>
</template>

<script setup lang="ts">
/**
 *  a11y
 */
const inputId = inject('for', '')
const errorId = useId()

/**
 *  Apply the appropriate settings for password inputs
 */
const { customValidation } = defineProps({
  customValidation: {
    type: Object
  },
  wrapperClass: {
    type: String
  }
})

/**
 *  Validate inputs - this can probably be made into a composable
 */
const { validityText, checkValidity } = useCheckValidity(customValidation)
</script>
