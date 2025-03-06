<script setup lang="ts">
const { fetch } = useUserSession();
const notification = ref<string | null>(null);

/**
 * Login function
 */
async function login(credentials: any) {
  const { email, password } = credentials;
  try {
    await $fetch("/auth/login", {
      method: "POST",
      body: {
        email: email,
        password: password,
      },
    });
    notification.value = "Login successful";
    fetch();
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
        <h1 class="text-3xl font-bold mb-6 text-green-500">Login</h1>
        <FormKit type="form" submit-label="Login" @submit="login" label-class="text-green-500">
          <FormKit label-class="text-green-500" type="email" name="email" label="Email" validation="required|email" validation-visibility="dirty" />
          <FormKit
            label-class="text-green-500"
            type="password"
            name="password"
            label="Password"
            validation="contains_uppercase|*contains_symbol|*length:8|*required"
            validation-visibility="dirty"
            :validation-messages="{ length: 'Password must be at least 8 characters' }"
          />
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

<style scoped></style>
