<script setup lang="ts">
definePageMeta({
  middleware: "auth-redirect",
});
const { user, loggedIn, session, clear, fetch } = useUserSession();

const notification = ref<string | null>(null);

async function logout() {
  await clear();
  navigateTo("/login");
}

async function deleteAccount() {
  const response: { status: number; body?: any } = await $fetch("/auth/owner/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === 200) {
    console.log("Account deleted successfully! Redirecting to home page...");
    await clear();
    navigateTo("/");
  } else {
    notification.value = response.body.message;
  }
}
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div v-if="loggedIn" class="bg-white shadow-md rounded-lg p-8 w-1/3">
      <h1 class="text-2xl font-bold mb-4">Welcome {{ user?.email }}!</h1>
      <p class="text-gray-600 mb-4">Logged in since {{ session.loggedInAt }}</p>
      <div class="flex justify-between">
        <button @click="logout" class="bg-green-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Logout</button>
        <button @click="deleteAccount" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Delete</button>
      </div>

      <div v-if="notification" class="text-green-600 pt-6">{{ notification }}</div>
    </div>
  </div>
</template>
