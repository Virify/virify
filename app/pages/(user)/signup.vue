<script setup lang="ts">
const notification = ref<string | null>(null);

/**
 * Signup function
 */
async function signup(signup: any) {
  try {
    await $fetch("/auth/signup", {
      method: "POST",
      body: {
        signup,
        role: "user",
      },
    });
    notification.value = "Signup successful! Please check your inbox for an activation email.";
  } catch (error: any) {
    notification.value = error.data.statusMessage;
  }
}

/**
 * Clear notification handler
 */
function clearNotificationHandler() {
  notification.value = null;
}
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="flex justify-center items-center w-1/2 bg-white h-screen xs:w-full sm:w-1/2">
      <div class="w-3/4 p-8 xs:w-full sm:w-3/4">
        <h1 class="text-3xl font-bold mb-6 text-green-500">Signup</h1>
        <FormKit type="form" submit-label="Signup" @submit="signup">
          <FormKit type="email" prefix-icon="email" name="email" label="Email" validation="required|email" help="Email Address" validation-visibility="dirty" />
        </FormKit>
      </div>
      <Modal v-if="notification" :message="notification" @clear="clearNotificationHandler" />
    </div>
    <div class="flex flex-col justify-center items-center w-1/2 bg-green-500 h-screen xs:hidden sm:flex">
      <h1 class="text-white font-bold text-8xl">Virify</h1>
      <h2 class="text-white text-4xl p-4 text-center">Your awesome property people!</h2>
    </div>
  </div>
</template>
