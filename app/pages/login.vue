<script setup lang="ts">
const { showToast } = useToastNotification();
const { fetch } = useUserSession();

/**
 *  Errors
 */
const formErrorTitle = ref()
const formErrorContent = ref()

function formClearError() {
  formErrorTitle.value = ''
  formErrorContent.value = ''
}

function formError(error) {
  // If is string, just save error as title
  if (isString(error)) {
    formErrorTitle.value = error
  }

  // Else destructure to title, message
  const { title, message } = asObject(error)

  // And then save
  formErrorTitle.value = title
  formErrorContent.value = message
}

/**
 *  Success
 */
function formSuccess() {
  showToast({
    title: "Login successful",
    icon: "ri:check-line",
  });
  // we have set the userSession in the backend, we need the client to fetch the user session
  fetch();
  // redirect to account page
  navigateTo("/account");
}
</script>

<template>
  <div class="| container container-2xs flow flow-lg">
    <h1 class="| title-xl">Welcome back</h1>

    <MoleculesErrorBox v-if="formErrorTitle" :error-title="formErrorTitle" :error-content="formErrorContent" />

    <OrganismsFormsLogin @form-success="formSuccess" @form-error="formError" @form-clear-error="formClearError" />

    <AtomsDivider text="or" />

    <div class="| center-text flow flow-sm">
      <p>
        <nuxt-link to="/password/forgot" class="| body-sm">
          Forgot password?
        </nuxt-link>
      </p>

      <p class="| body-sm">
        Don't have an account yet?
        <nuxt-link to="/signup">Create an account</nuxt-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.p-login-form-submit {
  margin-top: var(--size-24);
}
</style>
