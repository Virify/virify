<script setup lang="ts">
definePageMeta({
  middleware: ["check-password-token"],
});

const { form, errors, notification, isLoading, submitForm, clearNotification } = useAuthForm({ password: "", token: "" }, "user");

/**
 * Submit function
 * Submits the password reset form
 */
async function submit() {
  // Include token in the form data
  form.value.token = useRoute().params.token as string;
  await submitForm("/auth/password-reset", "Password reset successfully! Redirecting to login page...");
}

/**
 * Clear notification handler
 * Clears the notification
 */
function clearNotificationHandler() {
  clearNotification("/login");
}
</script>
<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="flex justify-center items-center w-1/2 bg-white h-screen xs:w-full sm:w-1/2">
      <div class="w-3/4 p-8 xs:w-full sm:w-3/4">
        <h1 class="text-3xl font-bold mb-3 text-green-500">Password Reset</h1>
        <h3 class="text-xl mb-6 text-green-500">Please enter a password to reset your password</h3>
        <form @submit.prevent="submit">
          <div class="mb-6">
            <label class="block text-green-500 text-sm font-bold mb-2" for="password">Password:</label>
            <input v-model="form.password" class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password" />
            <span v-if="errors.password" class="text-red-400 text-xs italic">{{ errors.paassword }}</span>
          </div>
          <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" :disabled="isLoading">
            <span v-if="isLoading">Loading...</span>
            <span v-else>Update</span>
          </button>
        </form>
        <Modal v-if="notification" :message="notification" @clear="clearNotificationHandler" />
      </div>
    </div>
    <div class="flex flex-col justify-center items-center w-1/2 bg-green-500 h-screen xs:hidden sm:flex">
      <h1 class="text-white font-bold text-8xl">Virify</h1>
      <h2 class="text-white text-4xl p-4 text-center">Your awesome property people!</h2>
    </div>
  </div>
</template>
