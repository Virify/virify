<script setup lang="ts">
// composable imports
const route = useRoute();
// Get the email from the query
const email = route.query.email as string;
const approve = route.query.approve as string;

// State for notification
const notification = ref<string | null>(null);
const error = ref<string | null>(null);

/**
 * Check if the account is not activated
 * On page mount if the account is activated, show an error notification
 * If the account is not activated, do nothing and let the user activate the account
 */
onMounted(async () => {
  try {
    await $fetch("/auth/agent/review/review-account", {
      method: 'POST',
      body: {
        email: email,
        token: route.params.token as string,
        approve: approve,
      }
    });
    notification.value = approve === 'true' ? 'Thank you for approving the agent!' : 'Thank you for denying the agent!';
  } catch (err: any) {
    error.value = err.data.statusMessage;
    notification.value = err.data.statusMessage;
  }
});

function clearNotificationHandler() {
  notification.value = null;
}
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="flex justify-center items-center w-1/2 bg-white h-screen xs:w-full sm:w-1/2">
      <div class="w-3/4 p-8 xs:w-full sm:w-3/4">
        <h1 v-if="approve === 'true' && !error" class="text-3xl font-bold mb-6 text-green-500">Thank You!</h1>
        <h1 v-else-if="approve === 'false' && !error" class="text-3xl font-bold mb-6 text-red-500">Thank You!</h1>
        <h1 v-if="error" class="text-3xl font-bold mb-6 text-red-500">Error</h1>
        <h3 v-if="approve === 'true' && !error" class="text-xl mb-6 text-green-500">The agent is now active.</h3>
        <h3 v-else-if="approve === 'false' && !error" class="text-xl mb-6 text-red-500">The agent has been denied.</h3>
        <h3 v-if="error" class="text-xl mb-6 text-red-500">An error occurred.</h3>
        <p v-if="approve === 'true' && !error" class="text-lg mb-6 text-gray-700">The agent is now active and can start using the platform. You can now close this page.</p>
        <p v-else-if="approve === 'false' && !error" class="text-lg mb-6 text-gray-700">The agent has been denied and cannot use the platform. You can now close this page.</p>
        <p v-if="error" class="text-lg mb-6 text-gray-700">{{ error }}.</p>
        <Modal v-if="notification" :message="notification" @clear="clearNotificationHandler" />
      </div>
    </div>
    <div class="flex flex-col justify-center items-center w-1/2 bg-green-500 h-screen xs:hidden sm:flex">
      <h1 class="text-white font-bold text-8xl">Virify</h1>
      <h2 class="text-white text-4xl p-4 text-center">Your awesome property people!</h2>
    </div>
  </div>
</template>