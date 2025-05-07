<template>
  <div class="| flow dialog-container dialog-container-xs">
    <h1 class="| title-xl">Set your account password</h1>

    <p class="| body-sm">Enter your password below to set your account password</p>

    <OrganismsFormsPasswordReset @form-success="formSuccess" />
  </div>
</template>

<script setup lang="ts">
const { hideDialog } = useDialog();
/**
 *  Success
 */
function formSuccess() {
  hideDialog();
}
</script>
