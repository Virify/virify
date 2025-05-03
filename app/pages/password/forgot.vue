<script setup lang="ts">
const { fetch } = useUserSession();

/**
 *  Success
 */
async function formSuccess(passwordToken: string) {
  await fetch();
  navigateTo("/signup/verify?passwordToken=" + passwordToken);
}
</script>
<template>
  <div class="| container container-2xs flow flow-lg">
    <h1 class="| title-xl">Reset password</h1>

    <p class="| body-sm">Forgot your password? Don't worry - it happens to us all. Just enter your email address below
      and we will send you a one-time password to initiate a password reset</p>

    <OrganismsFormsForgotPassword @form-success="formSuccess" />

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
