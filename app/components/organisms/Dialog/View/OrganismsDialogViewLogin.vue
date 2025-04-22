<template>
  <div class="o-dialog-view-signin | flow">
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

<script setup lang="ts">
const { fetch } = useUserSession();

/**
 *  Modal control
 */
const { hideDialog } = useDialog()

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
  const { title, content } = asObject(error)

  // And then save
  formErrorTitle.value = title
  formErrorContent.value = content
}

/**
 *  Success
 */
function formSuccess() {
  fetch();
  hideDialog("/account");
}
</script>

<style lang="scss">
.o-dialog-view-signin {
  width: 22em;
}
</style>
