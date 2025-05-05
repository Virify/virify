<template>
  <div class="| flow dialog-container dialog-container-xs">
    <h1 class="| title-xl">Reset your password</h1>

    <p class="| body-sm">Enter your password below to reset your password</p>

    <OrganismsFormsPasswordReset @form-success="formSuccess" :token="passwordToken" />
  </div>
</template>

<script setup lang="ts">
import { ViewsDialogLogin } from "#components";

const { showDialog } = useDialog();

defineProps({
  passwordToken: {
    type: String,
    required: true,
  },
});

/**
 *  Success
 */
function formSuccess() {
  useViewTransition(() => {
    showDialog({
      component: ViewsDialogLogin,
      props: {
        successMessage: "Password reset successfully. You can now log in.",
      },
    });
  });
}
</script>
