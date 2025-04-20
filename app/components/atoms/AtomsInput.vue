<template>
  <input v-bind="$attrs" class="| text-input" @blur="checkValidity" />
  <span v-if="errorText" class="| text-input-error body-sm">{{ errorText }}</span>
</template>

<script setup>
/**
 *  Apply the appropriate settings for password inputs
 */
const props = defineProps({
  whenMismatched: {
    type: String
  }
})

/**
 *  Validate inputs - this can probably be made into a composable
 */
const errorText = ref(null)

function checkValidity({ target }) {
  const { whenMismatched } = props

  errorText.value = useInputValidationMessage(target, {
    patternMismatch: asString(whenMismatched)
  })
}
</script>
