<script setup lang="ts">
const { showToast } = useToastNotification();
const { fetch } = useUserSession();

/**
 *  Form setup
 */
const $form = useTemplateRef('form')
const formPending = ref(false)

onMounted(() => {
  unref($form).setAttribute('novalidate', true)
})

/**
 *  Form errors
 */
const { query } = useRoute()

const formErrorTitle = ref(query.error && 'Unauthorised user')
const formErrorContent = ref(query.error && 'Please login to access your account')

function setFormError(str: string, errors?: string[]) {
  formErrorTitle.value = str || null
  formErrorContent.value = errors
}

/**
 *  For password inputs
 */
const { pattern, whenMismatched } = getValidPassword()

/**
 *  Validate form and submit
 */
async function loginUser({ target }) {
  if (formPending.value) return

  // Clear any existing form errors
  setFormError(null)

  // First check the validity of the form
  const { validity, errors } = useFormValidationMessage(target)

  // If errors exist, show them
  if (!validity) {
    setFormError("Your form contains errors - please ensure all fields are correctly filled out", errors)

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
    .catch(() => {
      formErrorTitle.value = 'An error occurred'
      formErrorContent.value = 'Sorry, we were unable to log you in - please check your details and try again'
    })
    .finally(() => {
      formPending.value = false
    })
}
</script>

<template>
  <div class="| container container-xs">
    <MoleculesErrorBox v-if="formErrorTitle" :error-title="formErrorTitle" :error-content="formErrorContent" />

    <h1 class="| title-lg">Login</h1>

    <form ref="form" method="POST" action="/auth/login" @submit.prevent="loginUser" class="p-login-form | stacked">
      <label>
        Email address:
        <AtomsInput type="email" name="email" required />
      </label>

      <label>
        Password:
        <AtomsInput type="password" name="password" required minlength="8" :pattern :when-mismatched />
      </label>

      <AtomsButton type="submit" :pending="formPending">
        Submit
      </AtomsButton>
    </form>

    <nuxt-link to="/password/forgot" class="| body-sm">
      Forgot Password?
    </nuxt-link>
  </div>
</template>

<style scoped>
.p-login-form {
  margin: var(--size-16) auto var(--size-32);
}
</style>
