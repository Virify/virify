<script setup lang="ts">
const { fetch } = useUserSession();

/**
 *  Success
 */
function formSuccess() {
  fetch();
  navigateTo("/account");
}
</script>

<template>
  <div class="| container container-2xs flow flow-lg">
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