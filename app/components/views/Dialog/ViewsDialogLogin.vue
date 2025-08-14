<template>
  <div class="| flow dialog-container dialog-container-xs">
    <h1 class="| title-xl">Welcome back</h1>
    <p v-if="successMessage" class="success | body-md">{{ successMessage }}</p>
    <p v-if="fromProtectedPage" class="protected-page-message | body-md">
      Login is required to view this page - please login below
    </p>
    
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
  fromProtectedPage: {
    type: Boolean,
    default: false,
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
  
  // Wait for the session to properly update and verify it's actually logged in
  let attempts = 0;
  const { loggedIn } = useUserSession();
  
  while (!loggedIn.value && attempts < 10) {
    await nextTick();
    await fetch();
    attempts++;
  }
  
  if (!loggedIn.value) {
    return;
  }
  
  // Check if there's a redirect destination from the middleware
  const redirectCookie = useCookie('redirect');
  const destination = redirectCookie.value;
  
  hideDialog({ loginSuccess: true });
  
  // Wait for dialog to close
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Navigate to the intended destination if there's a redirect cookie
  if (destination) {
    redirectCookie.value = null;
    await navigateTo(destination, { replace: true });
  }
}
</script>
<style>
.success {
  color: var(--primary-500);
}

.protected-page-message {
  margin-bottom: var(--size-16);
  word-wrap: break-word;
}
</style>
