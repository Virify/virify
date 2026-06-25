<template>
  <div class="| flow dialog-container dialog-container-xs">
    <h1 class="| title-xl">Verify your email</h1>
    <p class="| body-sm">Please enter your one time pin that you have recived in your email below.</p>
    <p v-if="errors" class="| py-2 body-sm text-error text-center">{{ errors }}</p>
    <MoleculesOtp v-model="otpCode" @complete="registerCompletion" />
    <AtomsDivider text="Warning" />
    <p class="body-sm">If you close this dialog, you will need activate using the link sent to your email.</p>
  </div>
</template>

<script setup lang="ts">
import { ViewsDialogPasswordReset, ViewsDialogPasswordSet } from '#components';

const props = defineProps({
  token: {
    type: String,
    required: false,
  },
  passwordToken: {
    type: String,
    required: false,
  },
});

const { fetch } = useUserSession();
const otpCode = ref([]);

/**
 *  Modal control
 */
const { hideDialog, showDialog } = useDialog();
const { trackFunnelEvent } = useEnquiryGaFunnel();

/**
 * We need need to send the token OR passwordToken to the server
 * Any other routes or tokens required for OtP verification should be added here
 */
async function registerCompletion() {
  const success = await verifyOtp();
  if (!success) return;

  await fetch();
  if (props.passwordToken) {
    useViewTransition(() => {
      showDialog({
        component: ViewsDialogPasswordReset,
        props: {
          passwordToken: props.passwordToken,
        },
      });
    });
  } else {
    trackFunnelEvent("signup_verified");
    // useViewTransition(() => {
    //   showDialog({
    //     component: ViewsDialogPasswordSet,
    //   });
    // })
    // On successful OTP verification, navigate to dashboard for password setting
    navigateTo('/dashboard/profile/setup-profile');
  }
}

const errors = ref("");

async function verifyOtp(): Promise<boolean> {
  errors.value = "";
  try {
    await $fetch("/auth/verify-otp", {
      method: "POST",
      body: {
        otpCode: otpCode.value.map(String),
        token: props.token,
        passwordToken: props.passwordToken,
      },
    });
    return true;
  } catch (error: any) {
    errors.value = error?.data?.message || "Incorrect code. Please try again.";
    otpCode.value = [];
    return false;
  }
}
</script>
