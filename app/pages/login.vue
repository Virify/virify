<script setup lang="ts">
const { loggedIn } = useUserSession();

// Redirect logged in users to account page
// Redirect non-logged in users to home page (they should use the dialog)
onMounted(() => {
  if (loggedIn.value) {
    navigateTo("/account");
  } else {
    navigateTo("/");
  }
});

/**
 *  Success (should not be needed since we redirect, but keeping for safety)
 */
function formSuccess() {
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