<script setup lang="ts">
import { ref } from 'vue';
import Modal from '~/components/modal.vue';

definePageMeta({
  middleware: "auth-redirect",
});

const form = ref({
  email: "",
});

const errors = ref({
  email: null as string | null,
});

const notification = ref<string | null>(null);
const isLoading = ref(false);
const isSuccess = ref(false);

function validateForm() {
  let isValid = true;
  if (!form.value.email) {
    errors.value.email = "Email is required";
    isValid = false;
  } else if (!validateEmail(form.value.email)) {
    errors.value.email = "Invalid email format";
    isValid = false;
  } else {
    errors.value.email = null;
  }
  return isValid;
}

async function signup() {
  if (validateForm()) {
    isLoading.value = true;
    try {
      await $fetch("/auth/owner/signup", {
        method: "POST",
        body: {
          email: form.value.email,
        },
      });
      notification.value = "Signup successful! Please check your email to verify your account.";
      isSuccess.value = true;
    } catch (error: any) {
      console.log(error);
      notification.value = "Woops! " + error.statusMessage;
    } finally {
      isLoading.value = false;
    }
  }
}

function clearNotification() {
  notification.value = null;
  if (isSuccess.value) {
    navigateTo("/login");
  }
}
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="flex justify-center items-center w-1/2 bg-white h-screen xs:w-full sm:w-1/2">
      <div class="w-3/4 p-8 xs:w-full sm:w-3/4">
        <h1 class="text-3xl font-bold mb-6 text-green-500">Signup</h1>
        <form @submit.prevent="signup">
          <div class="mb-6">
            <label class="block text-green-500 text-sm font-bold mb-2" for="email">
              Email:
              <span v-if="errors.email" class="text-red-400 text-xs italic">{{ errors.email }}</span>
            </label>
            <input v-model="form.email" class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" />
          </div>
          <div class="flex items-center justify-start gap-4">
            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" :disabled="isLoading">
              <span v-if="isLoading">Loading...</span>
              <span v-else>Signup</span>
            </button>
            <NuxtLink to="/login" class="bg-white text-green-500 font-bold py-3 px-4 rounded border border-green-500 focus:outline-none focus:shadow-outline" type="submit">Login</NuxtLink>
            <div class="flex justify-end w-full">
              <NuxtLink to="/agent/signup" class="text-green-500 underline p-4" type="submit">Estate Agent? Sign up here!</NuxtLink>
            </div>
          </div>
        </form>
      </div>
      <Modal v-if="notification" :message="notification" @clear="clearNotification" />
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