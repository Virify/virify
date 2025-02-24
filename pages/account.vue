<script setup lang="ts">
const { user, loggedIn, session, clear } = useUserSession();
definePageMeta({
  middleware: ["auth-redirect"],
});

async function logout() {
  await clear();
  navigateTo("/login");
}
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div v-if="loggedIn" class="bg-white shadow-md rounded-lg p-8 w-1/3">
      <h1 class="text-2xl font-bold mb-4">Welcome {{ user?.email }}!</h1>
      <h2 class="text-xl mb-2">Username: {{ user?.username }}</h2>
      <p class="text-gray-600 mb-4">Logged in since {{ session.loggedInAt }}</p>
      <button @click="logout" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Logout</button>
    </div>
    <div v-else class="bg-white shadow-md rounded-lg p-8 w-1/3">
      <h1 class="text-2xl font-bold mb-4">Not logged in</h1>
      <NuxtLink to="/login" external class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">Login with Google</NuxtLink>
    </div>
  </div>
</template>
