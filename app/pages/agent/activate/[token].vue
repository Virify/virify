<script setup lang="ts">
// composable imports
const route = useRoute();
const { form, errors, notification, submitForm, clearNotification } = useAuthForm({ password: "", token: "", email: "" });

/**
 * Activate account function
 * Activates the account and redirects to the login page
 * Shows an error notification if activation fails
 * Shows a success notification if activation is successful
 */
async function activateAccount() {
  // Include token and email in the form data
  form.value.token = route.params.token as string;
  form.value.email = route.query.email as string;

  await submitForm("/auth/agent/activation/activate-account", "Account activated successfully! Redirecting to login page...");
}

/**
 * Clear notification handler
 */
function clearNotificationHandler() {
  clearNotification('/agent/login');
}

// Get the email from the query
const email = route.query.email as string;

/**
 * Check if the account is not activated
 * On page mount if the account is activated, show an error notification
 * If the account is not activated, do nothing and let the user activate the account
 */
onMounted(async () => {
  try {
    await $fetch("/auth/agent/activation/check-not-activated", {
      method: "GET",
      params: {
        email: email,
        token: route.params.token as string,
      },
    });
    console.log(route.params.token);
  } catch (error: any) {
    notification.value = error.data.statusMessage;
    console.log(route.params.token);
  }
});
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="flex justify-center items-center w-1/2 bg-white h-screen xs:w-full sm:w-1/2">
      <div class="w-3/4 p-8 xs:w-full sm:w-3/4">
        <h1 class="text-3xl font-bold mb-6 text-purple-500">Welcome {{ email }}</h1>
        <h3 class="text-xl mb-6 text-purple-500">Please enter a password to activate your account</h3>
        <form @submit.prevent="activateAccount">
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold mb-2" for="password">Password:</label>
            <input v-model="form.password" class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password" />
            <span v-if="errors.password" class="text-red-400 text-xs italic">{{ errors.password }}</span>
          </div>
          <div class="flex items-center justify-between">
            <button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Activate</button>
          </div>
        </form>
        <Modal v-if="notification" :message="notification" @clear="clearNotificationHandler" />
      </div>
    </div>
    <div class="flex flex-col justify-center items-center w-1/2 bg-purple-500 h-screen xs:hidden sm:flex">
      <h1 class="text-white font-bold text-8xl">Virify</h1>
      <h2 class="text-white text-4xl p-4 text-center">Your awesome property people!</h2>
    </div>
  </div>
</template>