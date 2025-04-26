<script setup lang="ts">

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

  // Else destructure to title, content
  const { title, content } = asObject(error)

  // And then save
  formErrorTitle.value = title
  formErrorContent.value = content
}

/**
 *  Success
 */
function formSuccess(passwordToken) {
  navigateTo("/verify?passwordToken=" + passwordToken);
}
</script>
<template>
  <div class="| container container-2xs flow flow-lg">
    <h1 class="| title-xl">Reset password</h1>

    <p class="| body-sm">Forgot your password? Don't worry - it happens to us all. Just enter your email address below
      and we will send you a one-time password to initiate a password reset</p>

    <MoleculesErrorBox v-if="formErrorTitle" :error-title="formErrorTitle" :error-content="formErrorContent" />


    <OrganismsFormsForgotPassword @form-success="formSuccess" @form-error="formError"
      @form-clear-error="formClearError" />

    <AtomsDivider text="or" />

    <div class="| center-text flow flow-sm">
      <p class="| body-sm">
        Already know your password?
        <nuxt-link to="/login">Log in now</nuxt-link>
      </p>

      <p class="| body-sm">
        Don't have an account yet?
        <nuxt-link to="/signup">Create an account</nuxt-link>
      </p>
    </div>
  </div>
</template>
