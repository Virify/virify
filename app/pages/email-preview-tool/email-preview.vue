<script setup lang="ts">
definePageMeta({
  middleware: ["email-test"],
});
// change your email component path for the email you want to preview
// @ts-ignore
// import SignupActivationEmail from "./server/routes/email/templates/signup-activation.vue";
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
      <h1 class="text-2xl font-bold mb-4">Email Preview</h1>
      <!-- <SignupActivationEmail /> -->
    </div>
  </div>
</template>
