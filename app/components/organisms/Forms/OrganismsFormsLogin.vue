<template>
  <MoleculesForm method="POST" action="/auth/login" @submit.prevent="loginUser" class="| stacked" :error="formErrors">
    <MoleculesFormField label="Email address">
      <AtomsInput type="email" name="email" required />
    </MoleculesFormField>

    <MoleculesFormPassword label="Password" type="password" name="password" required minlength="8" :pattern
      :validation-text-overrides="validityText" />

    <AtomsButton class="| button-full button-monochrome" type="submit" :pending="isPending">
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
 *  Composables
 */
const { pattern, validityText } = getValidPassword()
const { isPending, setPendingWhile } = usePending()

/**
 *  Handle errors
 */
const formErrors = ref(null)

/**
 *  Validate form and submit
 */
async function loginUser({ target }) {
  if (isPending.value) return

  setPendingWhile(async () => {
    // Clear any existing form errors
    formErrors.value = null

    // First check the validity of the form
    const { formData, errors } = useFormData(target)

    // If errors exist, show them
    if (errors) {
      formErrors.value = errors

      return
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
        formErrors.value = {
          title: 'Login failed',
          message: error.data.message
        }
      })
  })
}
</script>