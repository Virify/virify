<template>
  <div class="o-dialog-view-signin">
    <h1 class="| title-md">Sign in</h1>

    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit</p>

    <button @click.prevent="closeWithMessage" class="| button">
      Close with message
    </button>
  </div>
</template>

<script setup>


/**
 *  Add new rule
 */
const { hideDialog } = useDialog()

function closeWithMessage() {
  hideDialog({ returnValue: 'Hello, World!' })
}
</script>

<style>
.o-dialog-view-signin {
  width: 28em;
}
</style>
