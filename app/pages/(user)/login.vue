<script setup lang="ts">

// composable imports
const { form, errors, notification, isLoading, submitForm, clearNotification } = useAuthForm({ email: "", password: "" }, 'user');

// check for errors from query
const error = useRoute().query.error;

// if there is an error, set the notification to the error message
if (error) {
  notification.value =  error as string;
}

/**
 * Login function
 */
async function login() {
  await submitForm("/auth/login", "Signup successful! Redirecting to account page...");
}

/**
 * Clear notification handler
 */
function clearNotificationHandler() {
  clearNotification("/account");
}
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="flex justify-center items-center w-1/2 bg-white h-screen xs:w-full sm:w-1/2">
      <div class="w-3/4 p-8 xs:w-full sm:w-3/4">
        <h1 class="text-3xl font-bold mb-6 text-green-500">Login</h1>
        <form @submit.prevent="login">
          <div class="mb-6">
            <label class="block text-green-500 text-sm font-bold mb-2" for="email">
              Email:
              <span v-if="errors.email" class="text-red-400 text-xs italic">{{ errors.email }}</span>
            </label>
            <input v-model="form.email" class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" />
          </div>
          <div class="mb-6">
            <label class="block text-green-500 text-sm font-bold mb-2" for="password">
              Password:
              <span v-if="errors.password" class="text-red-400 text-xs italic">{{ errors.password }}</span>
            </label>
            <input v-model="form.password" class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password" />
          </div>
          <div class="flex items-center justify-start gap-4">
            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" :disabled="isLoading">
              <span v-if="isLoading">Loading...</span>
              <span v-else>Login</span>
            </button>
            <NuxtLink to="/signup" class="bg-white text-green-500 font-bold py-3 px-4 rounded border border-green-500 focus:outline-none focus:shadow-outline" type="submit">Signup</NuxtLink>
          </div>
        </form>
      </div>
      <Modal v-if="notification" :message="notification" @clear="clearNotificationHandler" />
    </div>
    <div class="flex flex-col justify-center items-center w-1/2 bg-green-500 h-screen xs:hidden sm:flex">
      <h1 class="text-white font-bold text-8xl">Virify</h1>
      <h2 class="text-white text-4xl p-4 text-center">Your awesome property people!</h2>
    </div>
  </div>
</template>
