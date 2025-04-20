<template>
  <AtomsLabel :label>
    <input v-bind="$attrs" class="| text-input" @blur="checkValidity" />

    <span v-if="errorText" class="| text-input-error body-sm">
      {{ errorText }}
    </span>
  </AtomsLabel>
</template>

<script setup>
/**
 *  Apply the appropriate settings for password inputs
 */
const props = defineProps({
  validationTextOverrides: {
    type: Object
  },
  label: {
    type: String
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
