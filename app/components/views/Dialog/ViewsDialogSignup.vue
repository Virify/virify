<template>
  <div class="o-dialog-view-signup | flow">
    <h1 class="| title-xl">Create account</h1>

    <p class="| body-sm">You can do more when you have an account - and it only takes a jiffy to set up</p>

    <OrganismsFormsSignup @form-success="formSuccess" />

    <AtomsDivider text="or" />

    <div class="| center-text flow flow-sm">
      <p class="| body-sm">
        Already have an account?
        <dialog-link to="/login" :component="ViewsDialogLogin">
          Log in
        </dialog-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ViewsDialogLogin } from '#components'

/**
 *  Modal control
 */
const { hideDialog } = useDialog()

/**
 *  Success
 */
function formSuccess(user) {
  console.log('DEBUG', user);

  // redirect to OTP Verification for activation
  navigateTo("/signup/verify?token=" + user.token);
}
</script>

<style>
.o-dialog-view-signup {
  width: 24em;
}
</style>
