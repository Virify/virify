<template>
  <button @click.prevent="showSignupForm" class="| button button button-header button-header--cta">
    Join waiting list
  </button>
</template>

<script setup lang="ts">
import { ViewsDialogWaitingList } from '#components'

const { showDialog } = useDialog()

function showSignupForm() {
  showDialog({
    component: ViewsDialogWaitingList
  })
}
</script>