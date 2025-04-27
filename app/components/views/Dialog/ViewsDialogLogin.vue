<template>
  <div class="o-dialog-view-signin | flow">
    <h1 class="| title-xl">Welcome back</h1>

    <OrganismsFormsLogin @form-success="formSuccess" />

    <AtomsDivider text="or" />

    <div class="| center-text flow flow-sm">
      <p>
        <dialog-link to="/password/forgot" :component="LazyViewsDialogForgotPassword" class="| body-sm">
          Forgot password?
        </dialog-link>
      </p>

      <p class="| body-sm">
        Don't have an account yet?
        <dialog-link to="/signup" :component="LazyViewsDialogSignup">
          Create an account
        </dialog-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LazyViewsDialogForgotPassword, LazyViewsDialogSignup } from '#components'

const { fetch } = useUserSession();

/**
 *  Modal control
 */
const { hideDialog } = useDialog()

/**
 *  Success
 */
function formSuccess() {
  fetch();
  hideDialog("/account");
}
</script>

<style>
.o-dialog-view-signin {
  width: 24em;
}
</style>
