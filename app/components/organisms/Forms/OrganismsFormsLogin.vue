<template>
  <MoleculesForm method="POST" action="/auth/login" @submit.prevent="loginUser" class="p-login-form | stacked">
    <AtomsInput label="Email address" type="email" name="email" required />

    <AtomsPassword label="Password" type="password" name="password" required minlength="8" :pattern
      :validation-text-overrides="validityText" />

    <AtomsButton class="p-login-form-submit | button-full button-monochrome" type="submit" :pending="isPending">
      Log in
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
async function loginUser({ target }) {
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
    await $fetch("/auth/login", {
      method: "POST",
      body: {
        email: formData.get('email'),
        password: formData.get('password')
      }
    })
      .then(() => {
        emits('form-success')
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