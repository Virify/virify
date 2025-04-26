<template>
  <MoleculesForm method="POST" action="/auth/password-reset" @submit.prevent="resetPassword" class="| stacked">
    <MoleculesFormField label="Email address">
      <AtomsInput type="email" name="email" required />
    </MoleculesFormField>

    <AtomsButton class="| button-full button-monochrome" type="submit" :pending="isPending">
      Submit
    </AtomsButton>
  </MoleculesForm>
</template>

<script setup>
/**
 *  Emits
 */
const emits = defineEmits(['form-success', 'form-error', 'form-clear-error'])

/**
 *  For password inputs
 */
const { pattern, validityText } = getValidPassword()

/**
 *  Form state
 */
const { isPending, setPendingWhile } = usePending()

/**
 *  Validate form and submit
 */
async function resetPassword({ target }) {
  if (isPending.value) return

  setPendingWhile(async () => {
    // Clear any existing form errors
    emits('form-clear-error')

    // First check the validity of the form
    const { formData, errors } = useFormData(target)

    // If errors exist, show them
    if (errors) {
      return emits('form-error', errors)
    }

    // Post data
    await $fetch("/auth/password-reset", {
      method: "POST",
      body: {
        email: formData.get('email'),
      },
    })
      .then(({ passwordToken }) => {
        emits('form-success', passwordToken)
      })
      .catch((error) => {
        emits('form-error', {
          title: 'Login failed',
          content: error.data.message
        })
      })
  })
}
</script>