<template>
  <input :pattern v-bind="$attrs" class="| text-input" @blur="checkValidity" />
  <span v-if="errorText" class="| text-input-error body-sm">{{ errorText }}</span>
</template>

<script setup>
/**
 *  Apply the appropriate settings for password inputs
 */
const props = defineProps({
  checkPassword: {
    type: Boolean
  }
})

const PASSWORD_VALID_SYMBOLS = '!@£$%\^&*_+'

const pattern = computed(() => {
  const { checkPassword } = props

  if (checkPassword) {
    return `.*(?=.*[0-9])(?=.*[${PASSWORD_VALID_SYMBOLS}]).*`
  }
})

/**
 *  Validate inputs - this can probably be made into a composable
 */
const errorText = ref(null)

function checkValidity({ target }) {
  const isValid = target.checkValidity()

  if (isValid) {
    errorText.value = null
  }

  // If pattern ismatch, because those errors are unhelpful
  if (target.validity.patternMismatch) {
    errorText.value = `Your password should contain at least 1 number and at least one of the following symbols: ${PASSWORD_VALID_SYMBOLS}`
  }
  // Otherwise just show the user the error
  else {
    errorText.value = target.validationMessage
  }
}
</script>
