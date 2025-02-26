<template>
  <div class="flex justify-center items-center h-screen bg-purple-500">
    <div class="flex justify-center items-center w-1/2 bg-white h-screen xs:w-full sm:w-1/2">
      <div class="w-3/4 p-8 xs:w-full sm:w-3/4 text-center gap-4">
        <h1 class="text-4xl font-bold mb-4 text-purple-500">Account Review</h1>
        <p class="text-gray-700 mt-10">
          Thank you for submitting your account information. Our team will review and verify the details you provided.
        </p>
        <p class="text-gray-700 mb-6">
          Once your account is verified and activated, you will receive an email notification.
        </p>
        <p class="text-gray-700 mb-12">
          If you have any questions, please feel free to contact our support team.
        </p>
        <NuxtLink to="/agent" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-8">Go to Homepage</NuxtLink>
      </div>
    </div>
    <div class="flex flex-col justify-center items-center w-1/2 bg-purple-500 h-screen xs:hidden sm:flex">
      <h1 class="text-white font-bold text-8xl">Virify</h1>
      <h2 class="text-white text-5xl italic p-4 text-center">For Agents</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* Add any additional styles here */
</style>