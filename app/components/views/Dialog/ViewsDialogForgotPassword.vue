<template>
  <div class="o-dialog-view-forgot-password | flow">
    <h1 class="| title-xl">Reset password</h1>

    <p class="| body-sm">Forgot your password? Don't worry - it happens to us all. Just enter your email address below
      and we will send you a one-time password to initiate a password reset</p>

    <OrganismsFormsForgotPassword @form-success="formSuccess" />

    <AtomsDivider text="or" />

    <div class="| center-text flow flow-sm">
      <p class="| body-sm">
        Already know your password?
        <dialog-link to="/login">Log in now</dialog-link>
      </p>

      <p class="| body-sm">
        Don't have an account yet?
        <dialog-link to="/signup">Create an account</dialog-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 *  Modal control
 */
const { hideDialog } = useDialog()

/**
 *  Success
 */
function formSuccess(passwordToken) {
  navigateTo("/signup/verify?passwordToken=" + passwordToken);
}
</script>

<style>
.o-dialog-view-forgot-password {
  width: 24em;
}
</style>
