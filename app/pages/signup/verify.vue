<template>
  <div class="| container container-2xs flow flow-lg">
    <h1 class="| title-xl">Verify your email</h1>

    <p class="| body-sm">Please enter your one time pin below.</p>
    <p v-if="errors" class="| body-sm">{{ errors }}</p>

    <MoleculesOtp v-model="otpCode" @complete="registerCompletion" />

  </div>
</template>
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
    navigateTo("/password/reset?passwordToken=" + route.query.passwordToken);
  } else {
    navigateTo("/account");
  }
}

const errors = ref("");

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
  } catch (error: any) {
      errors.value = error.data.message;
  }
}
</script>