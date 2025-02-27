<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const notification = ref<string | null>(null);
const password = ref('');
const email = route.query.email as string;
const errors = ref({
  password: null as string | null,
});

// send the token and email to the server
const activate = async () => {
  const response: { status: number; body?: any } = await $fetch(`/auth/user/activate-account`, {
    method: 'POST',
    body: { 
      password: password.value,
      token: route.params.token,
      email: route.query.email
     },
  });
  // if there is an error, display the error message
  if (response.status === 200) {
   notification.value = 'Successfully activated your account! Redirecting to login page...';
    setTimeout(() => {
     navigateTo('/login');
    }, 2000);
  } else {
   notification.value = response.body.error;
    setTimeout(() => {
    notification.value = null;
    }, 2000);
  }
};
// validate the form
const validateForm = () => {
  let isValid = true;
  if (!password.value) {
    errors.value.password = 'Password is required';
    isValid = false;
  } else {
    errors.value.password = null;
  }
  return isValid;
};
//
const handleSubmit = () => {
  if (validateForm()) {
    activate();
  }
};
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="flex justify-center items-center w-1/2 bg-white h-screen xs:w-full sm:w-1/2">
      <div class="w-3/4 p-8 xs:w-full sm:w-3/4">
        <h1 class="text-3xl font-bold mb-6 text-green-500">Welcome {{ email }}</h1>
        <h3 class="text-xl mb-6 text-green-500">Please enter a password to activate your account</h3>
        <form @submit.prevent="handleSubmit">
          <div class="mb-6">
            <label class="block text-green-500 text-sm font-bold mb-2" for="password">Password:</label>
            <input v-model="password" class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password" />
            <span v-if="errors.password" class="text-red-400 text-xs italic">{{ errors.password }}</span>
          </div>
          <div class="flex items-center justify-between">
            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Activate</button>
          </div>
        </form>
        <div v-if="notification" class="fixed bottom-0 left-0 m-4 p-6 bg-green-500 text-white rounded font-bold" :class="{ 'bg-red-500': notification.includes('Failed') }">
        {{ notification }}
      </div>
      </div>
    </div>
    <div class="flex flex-col justify-center items-center w-1/2 bg-green-500 h-screen xs:hidden sm:flex">
      <h1 class="text-white font-bold text-8xl">Virify</h1>
      <h2 class="text-white text-4xl p-4 text-center">Your awesome property people!</h2>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>