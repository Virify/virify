<template>
  <div class="w-full text-center">
    <h1 class="| title-2xl">Virify</h1>

    <button @click.prevent="open" class="| button">Log in</button>
  </div>
</template>

<script setup>
import { OrganismsDialogViewLogin } from '#components'

const { showDialog } = useDialog()

function open() {
  showDialog({
    component: OrganismsDialogViewLogin,
    onClose: ({ returnValue }) => {
      console.log('Closed with value', returnValue)
    }
  })
}
</script>