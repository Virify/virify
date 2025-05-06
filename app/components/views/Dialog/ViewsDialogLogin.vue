<template>
  <div class="| flow dialog-container dialog-container-xs">
    <h1 class="| title-xl">Welcome back</h1>
    <p v-if="successMessage" class="success | text-sm">{{ successMessage }}</p>
    
    <OrganismsFormsLogin @form-success="formSuccess" />

    <AtomsDivider text="or" />

    <div class="| center-text flow flow-sm">
      <p>
        <dialog-link to="/password/forgot" :component="ViewsDialogForgotPassword" class="| body-sm"> Forgot password? </dialog-link>
      </p>

      <p class="| body-sm">
        Don't have an account yet?
        <dialog-link to="/signup" :component="ViewsDialogSignup"> Create an account </dialog-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ViewsDialogForgotPassword, ViewsDialogSignup } from "#components";
defineProps({
  successMessage: {
    type: String,
    default: "",
  },
})
const { fetch } = useUserSession();
const { hideDialog } = useDialog();

/**
 *  Modal control
 */

/**
 *  Success
 */
async function formSuccess() {
  await fetch();
  hideDialog();
}
</script>
<style>
.success {
  color: var(--primary-500);
}
</style>
