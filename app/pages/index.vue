<template>
  <div class="w-full text-center">
    <h1 class="| title-2xl">Virify</h1>

    <div class="| stacked container container-2xs flow flow-xs">
      <MoleculesOtp v-model="otpTest" @complete="registerCompletion" />

      <div>
        <p>OTP inputs: {{ otpTest }}</p>
        <p>Check in dev console for logs when OTP is completed</p>
      </div>

      <button @click.prevent="openLogin" class="| button button-full">
        Log in
      </button>
      <button @click.prevent="openForgotPassword" class="| button button-full">
        Forgot password
      </button>
    </div>
  </div>
</template>

<script setup>
import { ViewsDialogLogin, ViewsDialogForgotPassword } from '#components'

const { showDialog } = useDialog()

function openLogin() {
  showDialog({
    component: ViewsDialogLogin
  })
}

function openForgotPassword() {
  showDialog({
    component: ViewsDialogForgotPassword
  })
}

/**
 *  OTP test
 */
const otpTest = ref([])

function registerCompletion(code) {
  console.log('Submitted', code)
}
</script>