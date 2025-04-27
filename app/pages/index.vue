<template>
  <div class="w-full text-center">
    <h1 class="| title-2xl">Virify</h1>

    <div class="| stacked container container-2xs">
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
</script>