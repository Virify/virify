<script setup lang="ts">
const { showToast } = useToastNotification();
const { fetch } = useUserSession();

/**
 *  Form state
 */
const formPending = ref(false)

/**
 *  Form errors
 */
const { query } = useRoute()

const formErrorTitle = ref(query.error && 'Unauthorised user')
const formErrorContent = ref(query.error && 'Please log in to access your account')

/**
 *  For password inputs
 */
const { pattern, validityText } = getValidPassword()

/**
 *  Validate form and submit
 */
async function loginUser({ target }) {
  if (formPending.value) return

  // Clear any existing form errors
  formErrorTitle.value = null
  formErrorContent.value = null

  // First check the validity of the form
  const { validity, errors } = useFormValidationMessage(target)

  // If errors exist, show them
  if (!validity) {
    formErrorTitle.value = "Your form contains errors - please ensure all fields are correctly filled out"
    formErrorContent.value = errors

    return
  }

  // Set pending state
  formPending.value = true

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
      // Else show successful login
      showToast({
        title: "Login successful",
        icon: "ri:check-line",
      });
      // we have set the userSession in the backend, we need the client to fetch the user session
      fetch();
      // redirect to account page
      navigateTo("/account");
    })
    .catch((error) => {
      formErrorTitle.value = 'Login failed'
      formErrorContent.value = error.data.message
    })
    .finally(() => {
      formPending.value = false
    })
}
</script>

<template>
  <div class="| container container-2xs flow flow-lg">
    <h1 class="| title-xl">Welcome back</h1>

    <MoleculesErrorBox v-if="formErrorTitle" :error-title="formErrorTitle" :error-content="formErrorContent" />

    <MoleculesForm method="POST" action="/auth/login" @submit.prevent="loginUser" class="p-login-form | stacked">
      <AtomsInput label="Email address" type="email" name="email" required />

      <AtomsPassword label="Password" type="password" name="password" required minlength="8" :pattern
        :validation-text-overrides="validityText" />

      <AtomsButton class="p-login-form-submit | button-full button-monochrome" type="submit" :pending="formPending">
        Log in
      </AtomsButton>
    </MoleculesForm>

    <AtomsDivider text="or" />

    <div class="| center-text flow flow-sm">
      <p class="| body-sm">Don't have an account yet? <nuxt-link to="/signup">Create an account</nuxt-link></p>

      <p>
        <nuxt-link to="/password/forgot" class="| body-sm">
          Forgot password?
        </nuxt-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.p-login-form-submit {
  margin-top: var(--size-24);
}
</style>
