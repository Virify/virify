<template>
  <input :id="inputId" v-bind="$attrs" :aria-describedby="errorText && errorId" class="| text-input"
    @input="checkValidity" />

  <span v-if="errorText" :id="errorId" class="| text-input-error body-sm">
    {{ errorText }}
  </span>
</template>

<script setup>
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
  }
})

/**
 *  Validate inputs - this can probably be made into a composable
 */
const errorText = ref(null)

function checkValidity({ target }) {
  const { validationTextOverrides: overrides } = props

  errorText.value = useInputValidationMessage(target, overrides)
}
</script>
