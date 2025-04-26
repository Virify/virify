<template>
  <MoleculesForm method="POST" action="/auth/signup" @submit.prevent="createAccount" class="| stacked">
    <MoleculesFormField label="Email address">
      <AtomsInput type="email" name="email" required />
    </MoleculesFormField>

    <AtomsButton class="| button-full button-monochrome" type="submit" :pending="isPending">
      Create account
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
async function createAccount({ target }) {
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
    await $fetch("/auth/signup", {
      method: "POST",
      body: {
        email: formData.get('email'),
      },
    })
      .then((response) => {
        emits('form-success', response)
      })
      .catch((error) => {
        emits('form-error', {
          title: 'Sign-up failed',
          content: error.data.message
        })
      })
  })
}
</script>