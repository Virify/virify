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
function formSuccess(user) {
  console.log('DEBUG', user);

  // redirect to OTP Verification for activation
  navigateTo("/verify?token=" + user.token);
}
</script>

<template>
  <div class="| container container-2xs flow flow-lg">
    <h1 class="| title-xl">Create account</h1>

    <p class="| body-sm">You can do more when you have an account - and it only takes a jiffy to set up</p>

    <MoleculesErrorBox v-if="formErrorTitle" :error-title="formErrorTitle" :error-content="formErrorContent" />

    <OrganismsFormsSignup @form-success="formSuccess" @form-error="formError" @form-clear-error="formClearError" />

    <AtomsDivider text="or" />

    <div class="| center-text flow flow-sm">
      <p class="| body-sm">
        Already have an account?
        <nuxt-link to="/login">Log in</nuxt-link>
      </p>
    </div>
  </div>
</template>