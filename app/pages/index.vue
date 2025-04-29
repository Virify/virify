<template>
  <div>
    <OrganismsHeroHome />

    <div class="p-index-buttons | stacked container container-2xs">
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

<style>
.p-index-buttons {
  margin-top: 100vh;
  margin-bottom: 100vh;
}
</style>