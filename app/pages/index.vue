<template>
  <div class="w-full text-center">
    <h1 class="| title-2xl">Virify</h1>

    <button @click.prevent="openLogin" class="| button">Log in</button>
  </div>
</template>

<script setup>
import { OrganismsDialogViewLogin } from '#components'

const { showDialog } = useDialog()

function openLogin() {
  showDialog({
    component: OrganismsDialogViewLogin
  })
}
</script>