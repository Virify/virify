<template>
  <div class="o-dialog-view-signin | flow">
    <h1 class="| title-xl">Welcome back</h1>

    <OrganismsFormsLogin @form-success="formSuccess" />

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
 *  Success
 */
function formSuccess() {
  fetch();
  hideDialog("/account");
}
</script>

<style>
.o-dialog-view-signin {
  width: 24em;
}
</style>
