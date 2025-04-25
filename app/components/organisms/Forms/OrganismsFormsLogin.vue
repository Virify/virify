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
 *  Form state
 */
const { isPending, setPendingWhile } = usePending()

/**
 *  For password inputs
 */
const { pattern, validityText } = getValidPassword()

/**
 *  Validate form and submit
 */
async function loginUser({ target }) {
  if (isPending.value) return

  setPendingWhile(async () => {
    // Clear any existing form errors
    emits('form-clear-error')

    // First check the validity of the form
    const { validity, errors } = useFormValidationMessage(target)

    // If errors exist, show them
    if (!validity) {
      emits('form-error', {
        title: "Your form contains errors - please ensure all fields are correctly filled out",
        message: errors
      })

      return
    }

    // Construct a form object
    const formData = new FormData(target)

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
          message: error.data.message
        })
      })
  })
}
</script>