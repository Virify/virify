<script setup lang="ts">
const { fetch } = useUserSession();
const route = useRoute();
const otpCode = ref([]);

/**
 * We need need to send the token OR passwordToken to the server
 * Any other routes or tokens required for OtP verification should be added here
 */
async function registerCompletion() {
  await verifyOtp();
  await fetch();
  if (route.query.passwordToken) {
    return navigateTo("/password/reset?passwordToken=" + route.query.passwordToken);
  } else {
    navigateTo("/account");
  }
}

async function verifyOtp() {
  try {
    await $fetch("/auth/verify-otp", {
      method: "POST",
      body: {
        otpCode: otpCode.value,
        token: route.query.token,
        passwordToken: route.query.passwordToken,
      },
    });
  } catch (error) {
    // TODO: Handle Error
    console.error("Error verifying OTP:", error);
  }
}
</script>
<template>
  <div class="| container container-2xs flow flow-lg">
    <h1 class="| title-xl">Verify your email</h1>

    <p class="| body-sm">Please enter your one time pin below.</p>

    <MoleculesOtp v-model="otpCode" @complete="registerCompletion" />

    <AtomsDivider text="or" />

    <div class="| center-text flow flow-sm">
      <p class="| body-sm">
        Already have an account?
        <nuxt-link to="/login">Log in</nuxt-link>
      </p>
    </div>
  </div>
</template>
