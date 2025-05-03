<template>
  <div class="| flow dialog-container dialog-container-xs">
    <h1 class="| title-xl">Create account</h1>

    <p class="| body-sm">You can do more when you have an account - it only takes a minute to set up</p>

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
import { ViewsDialogLogin, ViewsDialogVerifyOtp } from '#components'

/**
 *  Modal control
 */
const { hideDialog, showDialog } = useDialog()

/**
 *  Success
 */
function formSuccess(user: { token: string; }) {
  console.log('DEBUG', user);

  // Hide the current dialog
  hideDialog()

  // Show the OTP verification dialog with props
  showDialog({
    component: ViewsDialogVerifyOtp,
    props: {
      token: user.token
    }
  })
}
</script>
