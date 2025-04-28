<script setup lang="ts">
const { fetch } = useUserSession();

/**
 *  Success
 */
function formSuccess(user) {
  console.log('DEBUG', user);

  // redirect to OTP Verification for activation
  navigateTo("/signup/verify?token=" + user.token);
}
</script>

<template>
  <div class="| container container-2xs flow flow-lg">
    <h1 class="| title-xl">Create account</h1>

    <p class="| body-sm">You can do more when you have an account - it only takes a minute to set up</p>

    <OrganismsFormsSignup @form-success="formSuccess" />

    <AtomsDivider text="or" />

    <div class="| center-text flow flow-sm">
      <p class="| body-sm">
        Already have an account?
        <nuxt-link to="/login">Log in</nuxt-link>
      </p>
    </div>
  </div>
</template>