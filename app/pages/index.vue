<script setup lang="ts"></script>

<template>
  <div class="flex justify-center items-center h-screen">
    <div class="flex justify-center items-center w-1/2 bg-white h-screen flex-col">
      <h1 class="text-green-500 font-bold text-8xl">Virify</h1>
      <h2 class="text-green-500 text-4xl p-4 text-center">Your awesome property people!</h2>
      <div class="flex justify-between gap-20 py-5 text-center">
        <NuxtLink to="/login" class="w-24 bg-white text-green-500 border border-green-500 font-bold py-3 px-3 rounded focus:outline-none focus:shadow-outline">Login</NuxtLink>
        <NuxtLink to="/signup" class="w-24 bg-white text-green-500 border border-green-500 font-bold py-3 px-3 rounded focus:outline-none focus:shadow-outline">Signup</NuxtLink>
      </div>
    </div>
  </div>
</template>
