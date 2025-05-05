<script setup lang="ts">
const route = useRoute();
const token = ref(route.query.passwordToken as string);

function formSuccess() {
  navigateTo("/login?success=true");
}
</script>
<template>
  <div class="| container container-2xs flow flow-lg">
    <h1 class="| title-xl">Reset your password</h1>

    <p class="| body-sm">Enter your password below to reset your password</p>

    <OrganismsFormsPasswordReset @form-success="formSuccess" :token="token" />
  </div>
</template>
