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
  errorText.value = useInputValidationMessage(target)
}
</script>
