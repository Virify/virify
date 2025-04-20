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
 *  Validate form and submit
 */
async function loginUser({ target }) {
  if (formPending.value) return

  // First check the validity of the form
  const isValid = target.checkValidity()

  // If not valid, report that validity
  if (!isValid) {
    showToast({ title: "Your form contains errors - please ensure all fields are correctly filled out", icon: "ri:error-warning-line" });

    return
  }

  // Set pending state
  formPending.value = true

  // Construct a form object
  const formData = new FormData(target)

  // Post data
  await useFetch("/auth/login", {
    method: "POST",
    body: {
      email: formData.get('email'),
      password: formData.get('password')
    }
  })
    .then(() => {
      showToast({
        title: "Login successful",
        icon: "ri:check-line",
      });

      // we have set the userSession in the backend, we need the client to fetch the user session
      fetch();
      // redirect to account page
      navigateTo("/account");
    })
    .catch((error: any) => {
      /**
       * Strangely enough, on the client you can only access statusMessage via
       * data.message. This is ONLY in production deployed - might be a Netlify
       * issue. In development, you can access statusMessage directly
       * 
       * @TODO
       * Probably show this error inline
       */
      showToast({ title: error.data.message, icon: "ri:error-warning-line" });
    })
    .finally(() => {
      formPending.value = false
    })
}
</script>

<template>
  <div class="| container container-xs">
    <p v-if="$route.query.error" class="| box box-lg box-error">
      Please login to access your account.
    </p>

    <h1 class="| title-lg">Login</h1>

    <form ref="form" method="POST" action="/auth/login" @submit.prevent="loginUser" class="p-login-form | stacked">
      <label>
        Email address:
        <AtomsInput type="email" name="email" required />
      </label>

      <label>
        Password:
        <AtomsInput type="password" name="password" required minlength="8" check-password />
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
