<script setup lang="ts"></script>

<template>
  <div class="flex justify-center items-center h-screen bg-purple-500 w-full">
    <div class="flex justify-center items-center w-1/2 h-screen flex-col">
      <h1 class="text-white font-bold text-8xl">Virify</h1>
      <h2 class="text-white text-4xl p-4 text-center">Estate Agents Section</h2>
      <div class="flex justify-between gap-20 py-5 text-center">
        <NuxtLink to="/agent/login" class="w-24 bg-white text-purple-500 border border-purple-500 font-bold py-3 px-3 rounded focus:outline-none focus:shadow-outline">Login</NuxtLink>
        <NuxtLink to="/agent/signup" class="w-24 bg-white text-purple-500 border border-purple-500 font-bold py-3 px-3 rounded focus:outline-none focus:shadow-outline">Signup</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>
