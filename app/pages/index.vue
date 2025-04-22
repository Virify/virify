<template>
  <div class="w-full text-center">
    <h1 class="| title-2xl">Virify</h1>

    <button @click.prevent="open" class="| button">Show dialog</button>
  </div>
</template>

<script setup>
import { OrganismsDialogViewSignIn } from '#components'

const { showDialog } = useDialog()

function open() {
  showDialog({
    component: OrganismsDialogViewSignIn,
    onClose: ({ returnValue }) => {
      console.log('Closed with value', returnValue)
    }
  })
}
</script>