<template>
  <div class="| flow dialog-container dialog-container-xs">
    <h1 class="| title-xl">Verify your email</h1>
    <p class="| body-sm">Please enter your one time pin that you have recived in your email below.</p>
    <p v-if="errors" class="| body-sm">{{ errors }}</p>
    <MoleculesOtp v-model="otpCode" @complete="registerCompletion" />
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  token: {
    type: String,
    required: true,
  },
});

const { fetch } = useUserSession();
const route = useRoute();
const otpCode = ref([]);


/**
 *  Modal control
 */
const { hideDialog } = useDialog()

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
        token: props.token,
      },
    });
  } catch (error: any) {
      errors.value = error.data.message;
  }
}
</script>
