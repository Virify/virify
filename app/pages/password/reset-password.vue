<script setup lang="ts">

// composable imports
const { form, errors, notification, isLoading, submitForm, clearNotification } = useAuthForm({ email: "" }, 'user');

/**
 * Submit function
 * Submits the password reset form
 */
async function submit() {
  await submitForm("/auth/email-password-reset", "Check your inbox for the password reset link");
}

/**
 * Clear notification handler
 */
function clearNotificationHandler() {
  clearNotification();
}
</script>
<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="flex justify-center items-center w-1/2 bg-white h-screen xs:w-full sm:w-1/2">
      <div class="w-3/4 p-8 xs:w-full sm:w-3/4">
        <h1 class="text-3xl font-bold mb-3 text-green-500">Password Reset</h1>
        <h3 class="text-xl mb-6 text-green-500">Please enter your Email address to reset your password</h3>
        <form @submit.prevent="submit">
          <div class="mb-6">
            <label class="block text-green-500 text-sm font-bold mb-2" for="password">Email:</label>
            <input v-model="form.email" class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" required />
            <span v-if="errors.email" class="text-red-400 text-xs italic">{{ errors.email }}</span>
          </div>
          <div class="flex items-center justify-between">
            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" :disabled="isLoading">
              <span v-if="isLoading">Loading...</span>
              <span v-else>Reset</span>
            </button>
          </div>
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
