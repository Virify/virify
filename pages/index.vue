<script setup lang="ts"></script>

<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <div class="bg-white shadow-md rounded-lg p-8 w-1/3 text-center">
      <h1 class="text-4xl font-bold mb-4">Welcome to Virify</h1>
      <p class="text-gray-700 mb-8">Your one-stop solution for property verification and management.</p>
      <div class="flex justify-center gap-4">
        <NuxtLink to="/login" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Login</NuxtLink>
        <NuxtLink to="/signup" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Signup</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>
